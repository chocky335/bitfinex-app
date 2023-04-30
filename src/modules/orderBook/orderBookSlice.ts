import { createSlice } from "@reduxjs/toolkit"
import { OrderBookDepthScale, OrderBookFrequency, OrderBookLength, OrderBookPrecision } from "./orderBookTypes"
import { RootState } from "../../store"

export interface orderBookSliceState {
  pair: string,
  presicion: OrderBookPrecision,
  frequency: OrderBookFrequency,
  dataSize: OrderBookLength,
  depthScale: OrderBookDepthScale
}


const initialState: orderBookSliceState = {
  pair: 'BTC/USD',
  // Level of price aggregation (P0, P1, P2, P3, P4).
  presicion: 'P0', 
  // Frequency of updates (F0, F1).
  frequency: 'F0',
  dataSize: '25',
  depthScale: 'S0'
}

const presicions: OrderBookPrecision[] = ['P0', 'P1', 'P2', 'P3', 'P4']


export const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    incrementPresicion: (state) => {
      const presicionIndex = presicions.indexOf(state.presicion)
      const presicion: OrderBookPrecision = (presicionIndex + 2) > presicions.length
        ? presicions[0]
        : presicions[presicionIndex + 1]

      return {...state, presicion}
    },
    decrementPresicion: (state) => {
      const presicionIndex = presicions.indexOf(state.presicion)
      const presicion: OrderBookPrecision = (presicionIndex - 1) < 0
        ? presicions[0]
        : presicions[presicionIndex - 1]

      return {...state, presicion}
    },
    zoomOut: (state) => ({...state, depthScale: 'S0'}),
    zoomIn: (state) => ({...state, depthScale: 'S1'})
  },
})

export const orderBookActions = orderBookSlice.actions


export const selectPair = (state: RootState) => state.orderBook.pair
export const selectPresicion = (state: RootState) => state.orderBook.presicion
export const selectFrequency = (state: RootState) => state.orderBook.frequency
export const selectDataSize = (state: RootState) => state.orderBook.dataSize
export const selectDepthScale = (state: RootState) => state.orderBook.depthScale