import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { Blacklisted, InstrRead, InstrSent, NodeStatus } from "../generated/M/M"

export function createBlacklistedEvent(
  sender: Address,
  destination: Address,
  timestamp: BigInt
): Blacklisted {
  let blacklistedEvent = changetype<Blacklisted>(newMockEvent())

  blacklistedEvent.parameters = new Array()

  blacklistedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  blacklistedEvent.parameters.push(
    new ethereum.EventParam(
      "destination",
      ethereum.Value.fromAddress(destination)
    )
  )
  blacklistedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return blacklistedEvent
}

export function createInstrReadEvent(
  sender: Address,
  destination: Address,
  indx: BigInt,
  timestamp: BigInt
): InstrRead {
  let instrReadEvent = changetype<InstrRead>(newMockEvent())

  instrReadEvent.parameters = new Array()

  instrReadEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  instrReadEvent.parameters.push(
    new ethereum.EventParam(
      "destination",
      ethereum.Value.fromAddress(destination)
    )
  )
  instrReadEvent.parameters.push(
    new ethereum.EventParam("indx", ethereum.Value.fromUnsignedBigInt(indx))
  )
  instrReadEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return instrReadEvent
}

export function createInstrSentEvent(
  sender: Address,
  destination: Address,
  content: string,
  indsx: BigInt,
  timestamp: BigInt
): InstrSent {
  let instrSentEvent = changetype<InstrSent>(newMockEvent())

  instrSentEvent.parameters = new Array()

  instrSentEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  instrSentEvent.parameters.push(
    new ethereum.EventParam(
      "destination",
      ethereum.Value.fromAddress(destination)
    )
  )
  instrSentEvent.parameters.push(
    new ethereum.EventParam("content", ethereum.Value.fromString(content))
  )
  instrSentEvent.parameters.push(
    new ethereum.EventParam("indsx", ethereum.Value.fromUnsignedBigInt(indsx))
  )
  instrSentEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return instrSentEvent
}

export function createNodeStatusEvent(
  source: Address,
  destination: Address,
  res: string,
  timestamp: BigInt
): NodeStatus {
  let nodeStatusEvent = changetype<NodeStatus>(newMockEvent())

  nodeStatusEvent.parameters = new Array()

  nodeStatusEvent.parameters.push(
    new ethereum.EventParam("source", ethereum.Value.fromAddress(source))
  )
  nodeStatusEvent.parameters.push(
    new ethereum.EventParam(
      "destination",
      ethereum.Value.fromAddress(destination)
    )
  )
  nodeStatusEvent.parameters.push(
    new ethereum.EventParam("res", ethereum.Value.fromString(res))
  )
  nodeStatusEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return nodeStatusEvent
}
