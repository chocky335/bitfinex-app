import styled from 'styled-components/native'
import { FC } from 'react';

interface ConnectStateProps {
  isConnected: boolean
  connect: () => void
  disconnect: () => void
}

export const ConnectState: FC<ConnectStateProps> = ({
    isConnected,
    connect,
    disconnect,
}) => {
    if (isConnected) {
        return (
          <Container>
              <TitleText isConnected>Is Connected</TitleText>
      
              <Touchable onPress={disconnect}><TitleText>Disconnect</TitleText></Touchable>
          </Container>
        );
    }
  return (
    <Container>
        <TitleText >Is not Connected</TitleText>

        <Touchable onPress={connect}><TitleText isConnected>Connect</TitleText></Touchable>
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

const TitleText = styled.Text<Partial<ConnectStateProps>>(({isConnected}) => ({
  color: isConnected ? 'rgb(66, 186, 150)' : '#FA113D',
  fontSize: 12.6,
  fontWeight: 400,
  textTransform: 'uppercase'
}))

const Touchable = styled.TouchableOpacity({
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
})

