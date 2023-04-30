
export type OrderBookPrecision = 'P0' | 'P1' | 'P2' | 'P3' | 'P4'
export type OrderBookFrequency = 'F0' | 'F1'
export type OrderBookLength = '1' | '25' | '100' | '250'
export type OrderBookDepthScale = 'S0' | 'S1'

export interface OrderBookRequestMessage {
  event: 'subscribe',
  channel: 'book',
  // Trading pair or funding currency
  symbol: string,
  // Level of price aggregation (P0, P1, P2, P3, P4).
  // The default is P0
  prec: OrderBookPrecision, 
  // Frequency of updates (F0, F1).
  // F0=realtime / F1=2sec.
  // The default is F0.
  freq: OrderBookFrequency,
  // Number of price points ("1", "25", "100", "250") [default="25"]
  len: OrderBookLength,
  // Optional user-defined ID for the subscription
  subId?: string
}

export type OrderBookConfig = Omit<OrderBookRequestMessage, 'event' | 'channel'>


export interface OrderBookState {
  asks: OrderBookStatus[],
  bids: OrderBookStatus[],
}

export type OrderBookStatus = [
  number, // PRICE
  number, // COUNT
  number, // AMOUNT
]

export type OrderBookSnapshotMessage = [    
    number, // CHANNEL_ID
    OrderBookStatus[]
]

export type OrderBookUpdateMessage = [    
    number, // CHANNEL_ID
    OrderBookStatus
]

export interface OrderBookSubscribedMessage {
  event: 'subscribed',
  channel: 'book',
  chanId: number,
  symbol: string,
  prec: string,
  freq: string,
  len: string,
  subId: number,
  pair: string 
}