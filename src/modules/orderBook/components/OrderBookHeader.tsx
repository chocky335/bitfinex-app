import styled from 'styled-components/native'
import { FC } from 'react';
import { CSSObject } from 'styled-components';

interface OrderBookHeaderProps {
  column1: string
  column2: string
}

export const OrderBookHeader: FC<OrderBookHeaderProps> = ({ column1, column2 }) => {
  return (
    <Container>
      <Row>
        <ColumnText>{column1}</ColumnText>
        <ColumnText>{column2}</ColumnText>
      </Row>
      <Row isReversed>
        <ColumnText>{column1}</ColumnText>
        <ColumnText>{column2}</ColumnText>
      </Row>
    </Container>
  );
}

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
})
const Row = styled.View<{isReversed?: boolean}>(({ isReversed }) => {
  const styles: CSSObject = ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    paddingLeft: 20,
    paddingRight: 10,
  })

  if (isReversed) {
    Object.assign(styles, {
      flexDirection: 'row-reverse',
    })
  }

  return styles
})
const ColumnText = styled.Text({
  color: '#fff',
  opacity: 0.8,
  fontSize: 11,
  fontWeight: 400,
  textTransform: 'uppercase'
})
