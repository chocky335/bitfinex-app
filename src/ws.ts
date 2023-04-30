import { WS_URL } from "./constants";

type MessageListener = (event: MessageEvent) => void
type Listener = () => void
type ListenerType = 'message'| 'open' | 'close' | 'error'
type ListenerId = number | string

const initListeners = () => ({
  message: new Map(),
  open: new Map(),
  close: new Map(),
  error: new Map(),
})

export class WS {
  instance: WebSocket
  listeners: Record<ListenerType, Map<ListenerId, Listener | MessageListener>> = initListeners()
  reconnectInterval?: NodeJS.Timer
  isReconnectIgnored: boolean = false

  close = (isReconnectIgnored: boolean = true) => {
    this.instance.close()
    this.isReconnectIgnored = isReconnectIgnored
    clearInterval(this.reconnectInterval)
  }
  send = (msg: string) => {
    if (this.instance.readyState === WebSocket.OPEN) {
      this.instance.send(msg)
    } else {
      const listenerId = this.addListener('open', () => {
        this.removeListener('open', listenerId)
        this.instance.send(msg)
      })
    }
  }

  constructor() {
    this.instance = this.connect()
  }

  connect = (): WebSocket => {
    const ws = new WebSocket(WS_URL)

    ws.onmessage = this.onmessage
    ws.onopen = this.onopen
    ws.onerror = this.onerror
    ws.onclose = this.onclose

    this.isReconnectIgnored = false

    return ws
  }

  addListener = (listenerType: ListenerType, listener: Listener | MessageListener, listenerId: string | number = Date.now()): ListenerId => {
    this.listeners[listenerType].set(listenerId, listener)

    return listenerId
  }

  removeListener = (listenerType: ListenerType, listenerId: ListenerId) =>
    this.listeners[listenerType].delete(listenerId)

  clear = () => {
    this.listeners = initListeners()
  }

  reconnect = (isImmediate?: boolean) => {
    if (isImmediate) {
      this.instance = this.connect();
    } else {
      this.reconnectInterval = setInterval(()=>{
        this.instance = this.connect();
      }, 3000);
    }
  }

  onlisten = (listenerType: ListenerType, event?: MessageEvent) => {
    const iterator = this.listeners[listenerType].values()
    for (let index = 0; index < this.listeners[listenerType].size; index++) {
      iterator.next().value(event)
    }
  }

  onmessage: MessageListener = (event) =>
    this.onlisten('message', event)

  onopen: Listener = () => {
    this.onlisten('open')
    clearInterval(this.reconnectInterval)
  }

  onclose: Listener = () => {
    this.onlisten('close')

    if (!this.isReconnectIgnored) this.reconnect()
  }

  onerror: Listener = () =>
    this.onlisten('error')
}

const ws = new WS();

export const getSocket = () => {
  return ws;
}
