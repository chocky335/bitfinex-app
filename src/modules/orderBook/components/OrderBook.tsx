import { FlatList, ListRenderItem } from 'react-native';

import { ORDER_BOOK_ROW_HEIGHT, OrderBookRow } from './OrderBookRow';
import { OrderBookHeader } from './OrderBookHeader';
import { OrderBookDepthScale, OrderBookStatus } from '../orderBookTypes';
import { OrderBookControls } from './OrderBookControls';
import { FC, useCallback, useMemo } from 'react';
import styled from 'styled-components/native';
import { prepare2ColumnList } from '../orderBookUtils';

interface OrderBookProps {
  pair: string
  asks: OrderBookStatus[]
  bids: OrderBookStatus[]
  depthScale: OrderBookDepthScale
  zoomIn: () => void
  zoomOut: () => void
  precisionPlus: () => void
  precisionMinus: () => void
}

const getItemLayout = (_: unknown, index: number) => {
  return {
    length: ORDER_BOOK_ROW_HEIGHT,
    offset: ORDER_BOOK_ROW_HEIGHT * index,
    index,
  };
}

const keyExtractor = (item: OrderBookStatus) => `${item}`

export const OrderBook: FC<OrderBookProps> = ({
  pair,
  asks,
  bids,
  depthScale,
  zoomIn,
  zoomOut,
  precisionPlus,
  precisionMinus,
}) => {
  const dataToRender = useMemo(() => prepare2ColumnList(bids, asks), [bids, asks])

  const total = [
    ...bids,
    ...asks,
  ]
    .reduce(
      (acc, [_, __, amount]) => acc + Math.abs(amount),
      0,
    ) ?? 0

  const renderItem: ListRenderItem<OrderBookStatus> = useCallback(({ item: [price, count, amount], index }) => {
    const progress = depthScale === 'S0'
      ? count / total
      : (count / total) * 2
    return (
      <OrderBookRow
        price={price}
        total={amount}
        isReversed={index % 2 !== 0}
        progress={progress}
      />
    )
  }, [depthScale, total])

  return (
    <Container>
      <OrderBookControls
        title={'Order Book'}
        pair={pair}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        precisionPlus={precisionPlus}
        precisionMinus={precisionMinus}
      />
      <FlatList
        data={dataToRender}
        renderItem={renderItem}
        numColumns={2}
        ListHeaderComponent={<OrderBookHeader column1={'Total'} column2={'Price'} />}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
      /> 
    </Container>
  );
}

const Container = styled.View({
  flex: 1,
  width: '100%'
})
