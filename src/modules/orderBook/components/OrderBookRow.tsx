import styled from 'styled-components/native'
import { FC } from 'react';
import { CSSObject } from 'styled-components';
import { StyleSheet, View } from 'react-native';
import { preparePrice, prepareTotal } from '../orderBookUtils';

interface OrderBookRowProps {
  total: number
  price: number
  // Progress is in the range [0, 1]
  progress: number
  isReversed: boolean
}

export const ORDER_BOOK_ROW_HEIGHT = 17

export const OrderBookRow: FC<OrderBookRowProps> = ({ total, price, isReversed, progress }) => {
  return (
      <Row isReversed={isReversed}>
        <View style={StyleSheet.absoluteFill}>
          <Progress isReversed={isReversed} progress={progress} />
        </View>
        <TotalText>{prepareTotal(total)}</TotalText>
        <PriceText>{preparePrice(price)}</PriceText>
      </Row>
  );
}

const Row = styled.View<Pick<OrderBookRowProps, 'isReversed'>>(({ isReversed }) => {
  const styles: CSSObject = ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    paddingLeft: 20,
    paddingRight: 10,
    height: ORDER_BOOK_ROW_HEIGHT
  })

  if (isReversed) {
    Object.assign(styles, {
      flexDirection: 'row-reverse',
    })
  }

  return styles
})

const TotalText = styled.Text({
  color: '#fff'
})

const PriceText = styled.Text({
  color: '#fff'
})

const Progress = styled.View<Pick<OrderBookRowProps, 'isReversed' | 'progress'>>(({ isReversed, progress }) =>(
  {
    height: '100%',
    width: `${Math.min(progress*100, 100)}%`,
    backgroundColor: isReversed ? '#433541':'#18464c',
    alignSelf: isReversed ? 'flex-start':'flex-end'
  })
)
