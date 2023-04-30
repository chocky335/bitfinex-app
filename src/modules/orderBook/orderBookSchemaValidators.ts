import { OrderBookSnapshotMessage, OrderBookStatus, OrderBookSubscribedMessage, OrderBookUpdateMessage } from "./orderBookTypes"

export const isOrderBookStatus = (message: OrderBookStatus | unknown): boolean => {
    if (message instanceof Array && message.length === 3) {
        return message.every(data => typeof data === 'number')
    }

    return false 
}

export const isOrderBookUpdateMessage = (message: OrderBookUpdateMessage | unknown): boolean => {
    if (
        message instanceof Array
        && message.length === 2
        && message[1] instanceof Array
    ) {
        return isOrderBookStatus(message[1])
    }

    return false 
}

export const isOrderBookSnapshotMessage = (message: OrderBookSnapshotMessage | unknown): boolean => {
    if (
        message instanceof Array 
        && message.length === 2
        && message[1] instanceof Array 
    ) {
        return message[1].every(isOrderBookStatus)
    }

    return false 
}

export const isOrderBookSubscribedMessage = (message: OrderBookSubscribedMessage | unknown): boolean => {
    if (
        message
        && typeof message === 'object' 
        && 'event' in message
        && message.event === 'subscribed'
    ) {
        return true
    }

    return false 
}

export const isOrderBookUnsubscribedMessage = (message: OrderBookSubscribedMessage | unknown): boolean => {
    if (
        message
        && typeof message === 'object' 
        && 'event' in message
        && message.event === 'unsubscribed'
    ) {
        return true
    }

    return false 
}

export const isErrorMessage = (message: OrderBookSubscribedMessage | unknown): boolean => {
    if (
        message
        && typeof message === 'object' 
        && 'event' in message
        && message.event === 'error'
    ) {
        return true
    }

    return false 
}


export const isMessage = <T>(message: T) => true