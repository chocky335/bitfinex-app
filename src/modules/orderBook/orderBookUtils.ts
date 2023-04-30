import { OrderBookStatus } from './orderBookTypes';

export const filterBids = ([_, __, amount]: OrderBookStatus) => amount > 0
export const filterAsks = ([_, __, amount]: OrderBookStatus) => amount < 0
export const sortBids = (a: OrderBookStatus, b: OrderBookStatus) => b[0] - a[0]
export const sortAsks = (a: OrderBookStatus, b: OrderBookStatus) => a[0] - b[0]

export const addOrUpdateOrderBook = ([price, count, amount]: OrderBookStatus, orderBook: OrderBookStatus[]) => {
  let isUpdated = false

  const orderBookCopy: OrderBookStatus[] = orderBook.map(bid => {
    if (bid[0] === price) {
      isUpdated = true
      return [price, count, amount]
    }
    return bid
  })

  if (!isUpdated) {
    const updatedBids: OrderBookStatus[] = [[price, count, amount], ...orderBookCopy]
    return updatedBids.sort(sortBids)
  }

  return orderBookCopy
}
export const removeFromOrderBook = ([price]: OrderBookStatus, orderBook: OrderBookStatus[]): OrderBookStatus[] =>
  orderBook.filter(order => order[0] !== price)


export const PAIR_SEPARATOR = '/'
export const pairToSymbol = (pair: string) => {
  const [ticker1, ticker2] = pair.split(PAIR_SEPARATOR)

  return `t${ticker1}${ticker2}`
}

export const prepare2ColumnList = (bids: OrderBookStatus[], asks: OrderBookStatus[]): OrderBookStatus[] =>
  bids.reduce((acc, _, i)=> {
    const bid = bids[i]
    const ask = asks[i]
    if (bid) acc.push(bid)
    if (ask) acc.push(ask)

    return acc
  }, [] as OrderBookStatus[])

export const prepareTotal = (total: number) => Math.floor(Math.abs(total)*10000)/10000
export const preparePrice = (price: number) => price.toLocaleString()