
import { useGetOrderBookQuery } from '../orderBookApi';
import { OrderBook } from '../components/OrderBook';
import { pairToSymbol } from '../orderBookUtils';
import { useAppDispatch, useAppSelector } from '../../../store';
import { orderBookActions, selectDataSize, selectDepthScale, selectFrequency, selectPair, selectPresicion } from '../orderBookSlice';
import { useCallback } from 'react';

export const OrderBookWidget = () => {
  const pair = useAppSelector(selectPair)
  const presicion = useAppSelector(selectPresicion)
  const frequency = useAppSelector(selectFrequency)
  const dataSize = useAppSelector(selectDataSize)
  const depthScale = useAppSelector(selectDepthScale)

  const dispatch = useAppDispatch()
  const incrementPresicion = useCallback(() => {
    dispatch(orderBookActions.incrementPresicion())
  }, [dispatch])
  const decrementPresicion = useCallback(() => {
    dispatch(orderBookActions.decrementPresicion())
  }, [dispatch])
  const zoomIn = useCallback(() => {
    dispatch(orderBookActions.zoomIn())
  }, [dispatch])
  const zoomOut = useCallback(() => {
    dispatch(orderBookActions.zoomOut())
  }, [dispatch])

  const { data } = useGetOrderBookQuery({
    symbol: pairToSymbol(pair),
    prec: presicion,
    freq: frequency,
    len: dataSize
  })

  return (
    <OrderBook
      pair={pair}
      bids={data?.bids ?? []}
      asks={data?.asks ?? []}
      depthScale={depthScale}
      zoomIn={zoomIn}
      zoomOut={zoomOut}
      precisionPlus={incrementPresicion}
      precisionMinus={decrementPresicion}
    />
  );
}
