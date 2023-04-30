import { Screen } from '../components/Screen';
import { useWS } from '../hooks/useWS';
import { ConnectState } from '../components/ConnectState';

export const MainScreen = () => {
  const {isConnected, reconnect, disconnect} = useWS()
  return (
    <Screen backgroundColor='#162d3e' statusBarStyle='light'>
      <ConnectState isConnected={isConnected} connect={reconnect} disconnect={disconnect} />
    </Screen>
)};