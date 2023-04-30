import { useCallback, useEffect, useState } from "react";
import { WS, getSocket } from "../ws";

interface UseWS {
  isConnected: boolean
  reconnect: () => void
  disconnect: () => void
  ws: WS
}

enum GenericListerId {
  disconnect = 'wsDisconnect',
  connect = 'wsConnect',
}

export const useWS = (): UseWS => {
  const [isConnected, setIsConnected] = useState(getSocket().instance.readyState === WebSocket.OPEN)
  const reconnect = useCallback(() => {
    getSocket().reconnect(true)
  }, [])

  useEffect(() => {
    const connect = () => setIsConnected(true)
    const disconnect = () => setIsConnected(false)

    getSocket().addListener('close', disconnect, GenericListerId.disconnect)
    getSocket().addListener('error', disconnect, GenericListerId.disconnect)
    getSocket().addListener('open', connect, GenericListerId.connect)
    
    return () => {
      getSocket().removeListener('close', GenericListerId.disconnect)
      getSocket().removeListener('error', GenericListerId.disconnect)
      getSocket().removeListener('open', GenericListerId.connect)
    }
  }, [])

  return {
    isConnected,
    reconnect,
    disconnect: getSocket().close,
    ws: getSocket(),
  };
}