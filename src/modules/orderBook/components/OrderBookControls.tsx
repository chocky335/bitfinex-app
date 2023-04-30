import styled from 'styled-components/native'
import { FC } from 'react';

interface OrderBookControlsProps {
  title: string
  pair: string
  zoomIn: () => void
  zoomOut: () => void
  precisionPlus: () => void
  precisionMinus: () => void
}

export const OrderBookControls: FC<OrderBookControlsProps> = ({
  title,
  pair,
  zoomIn,
  zoomOut,
  precisionPlus,
  precisionMinus,
}) => {
  return (
    <Container>
      <Row>
        <TitleText>{title}</TitleText>
        <PairText>{pair}</PairText>
      </Row>
      <Row>
        <TouchablePresicion onPress={precisionPlus}><PresicionText>{'.0<'}</PresicionText></TouchablePresicion>
        <TouchablePresicion onPress={precisionMinus}><PresicionText>{'>.00'}</PresicionText></TouchablePresicion>
        <Touchable onPress={zoomOut}><ZoomText>-</ZoomText></Touchable>
        <Touchable onPress={zoomIn}><ZoomText>+</ZoomText></Touchable>
      </Row>
    </Container>
  );
}

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 31,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(100, 100, 100, 0.3)'
})

const Row = styled.View(({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
}))

const TitleText = styled.Text({
  color: '#fff',
  fontSize: 12.6,
  fontWeight: 400,
  textTransform: 'uppercase'
})

const PairText = styled(TitleText)({
  opacity: 0.7,
  marginLeft: 4
})

const Touchable = styled.TouchableOpacity({
  width: 30,
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
})

const TouchablePresicion = styled(Touchable)({
  width: 40,
})

const ZoomText = styled(TitleText)({
  fontSize: 20,
})

const PresicionText = styled(TitleText)({
  fontSize: 14,
})
