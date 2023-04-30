
import { isErrorMessage, isOrderBookSnapshotMessage, isOrderBookSubscribedMessage, isOrderBookUnsubscribedMessage, isOrderBookUpdateMessage } from './orderBookSchemaValidators'
import { OrderBookConfig, OrderBookRequestMessage, OrderBookStatus, OrderBookSubscribedMessage } from './orderBookTypes'
import { getSocket } from '../../ws'
import { filterAsks, filterBids, sortAsks, sortBids } from './orderBookUtils'

interface SubscribeOrderBookParams {
  initilizePromise: Promise<unknown>
  finishingPromise: Promise<unknown>
  requestConfig: OrderBookConfig
  onSnapshot: (bids: OrderBookStatus[], asks: OrderBookStatus[]) => void
  onBatchUpdate: (orders: OrderBookStatus[]) => void
  updateInterval?: number // miliseconds
}

let channelId: {value: number | null} = {value: null}

enum OrderBookListenerIds {
  subscribe = 'subscribe',
  unsubscribe = 'unsubscribe',
}

export const subscribeOrderBook = async ({
  initilizePromise,
  finishingPromise,
  requestConfig,
  onSnapshot,
  onBatchUpdate,
  updateInterval = 1000
}: SubscribeOrderBookParams) => {
  if (channelId.value) {
    await unsubscribeOrderBook(channelId.value)
    channelId.value = null
  }
  const ws = getSocket()
  try {
    await initilizePromise

    let updateBatch: OrderBookStatus[] = []
    let updatedAt = Date.now()
    const listener = (event: MessageEvent) => {
      const data = JSON.parse(event.data)

      if (isOrderBookSubscribedMessage(data)) {
        const subscribedMessage = data as OrderBookSubscribedMessage
        channelId.value = subscribedMessage.chanId
      } else if (isOrderBookSnapshotMessage(data) && channelId.value === data[0]) {
        const orderBook = data[1] as OrderBookStatus[]
        onSnapshot(
          orderBook.filter(filterBids).sort(sortBids),
          orderBook.filter(filterAsks).sort(sortAsks)
        )
      } else if (isOrderBookUpdateMessage(data) && channelId.value === data[0]) {
        if (Date.now() - updatedAt > updateInterval) {
          onBatchUpdate(updateBatch)
          updatedAt = Date.now()
          updateBatch = []
        } else {
          const orderbookStatus = data[1] as OrderBookStatus
          updateBatch.push(orderbookStatus)
        }
      }
    }

    ws.addListener('message', listener, OrderBookListenerIds.subscribe)

    const orderBookRequest: OrderBookRequestMessage = { 
      event: 'subscribe', 
      channel: 'book', 
      subId: `book/${requestConfig.symbol}/${requestConfig.prec}`,
      ...requestConfig
    }
    const sendSubscribeMessage = () => ws.send(JSON.stringify(orderBookRequest))

    sendSubscribeMessage()
    ws.addListener('open', sendSubscribeMessage, OrderBookListenerIds.subscribe)
  } catch {}

  await finishingPromise

  ws.removeListener('message', OrderBookListenerIds.subscribe)
  ws.close()
}

export const unsubscribeOrderBook = (channelId: number) => new Promise<boolean>((resolve, reject) => {
  const timeoutId = setTimeout(() => {
    reject()
  }, 3000)
  const ws = getSocket()

  const listener = (event: MessageEvent) => {
    const data = JSON.parse(event.data)
    const isUnsubscribed = isOrderBookUnsubscribedMessage(data)
    const isError = isErrorMessage(data)

    if (isUnsubscribed || isError) {
      ws.removeListener('message', OrderBookListenerIds.subscribe)
      ws.removeListener('message', OrderBookListenerIds.unsubscribe)
      ws.removeListener('open', OrderBookListenerIds.subscribe)
      clearTimeout(timeoutId)
    }
    if (isUnsubscribed) {
      resolve(true)
    }
    if (isError) {
      reject()
    }
  }

  ws.addListener('message', listener, OrderBookListenerIds.unsubscribe)
  
  ws.send(JSON.stringify({ 
    event: 'unsubscribe', 
    chanId: channelId, 
  }))
})


