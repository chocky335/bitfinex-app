import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { OrderBookConfig, OrderBookState, OrderBookStatus } from './orderBookTypes'
import { addOrUpdateOrderBook, removeFromOrderBook } from './orderBookUtils'
import { subscribeOrderBook } from './orderBookWS'

export const orderBookApi = createApi({
  reducerPath: 'orderBookApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (build) => ({
    getOrderBook: build.query<OrderBookState, OrderBookConfig>({
        queryFn: () => ({
            data: {
                bids: [],
                asks: [],
            }
        }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const onSnapshot = (bids: OrderBookStatus[], asks: OrderBookStatus[]) => {
          updateCachedData((draft) => ({
            bids,
            asks
          }))
        }

        const onBatchUpdate = (orders: OrderBookStatus[]) => {
          updateCachedData((draft) => {
            let bids: OrderBookStatus[] = [...draft.bids]
            let asks: OrderBookStatus[] = [...draft.asks]

            orders.forEach((order) => {
              const [price, count, amount] = order
              if (count > 0 && amount > 0 ) {
                bids = addOrUpdateOrderBook(order, draft.bids)
              }
              if (count > 0 && amount < 0 ) {
                asks = addOrUpdateOrderBook(order, draft.asks)
              }
              if (count === 0 && amount > 0 ) {
                bids = removeFromOrderBook(order, draft.bids)
              }
              if (count === 0 && amount < 0 ) {
                asks = removeFromOrderBook(order, draft.asks)
              }
            })

            return {
              bids,
              asks
            }
          })
        }

        await subscribeOrderBook({
          initilizePromise: cacheDataLoaded,
          finishingPromise: cacheEntryRemoved,
          requestConfig: arg,
          onSnapshot,
          onBatchUpdate
        })
      },
    }),
  }),
})

export const { useGetOrderBookQuery } = orderBookApi