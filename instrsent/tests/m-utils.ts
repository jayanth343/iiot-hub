import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { InstrRead, InstrSent, NodeStatus } from "../generated/M/M"

export function createInstrReadEvent(
  sender: Address,
  destination: Address,
  indx: BigInt
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

  return instrReadEvent
}

export function createInstrSentEvent(
  sender: Address,
  destination: Address,
  content: string,
  indsx: BigInt
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

  return instrSentEvent
}

export function createNodeStatusEvent(
  source: Address,
  destination: Address,
  res: string
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

  return nodeStatusEvent
}
