import {
  InstrRead as InstrReadEvent,
  InstrSent as InstrSentEvent,
  NodeStatus as NodeStatusEvent
} from "../generated/M/M"
import { InstrRead, InstrSent, NodeStatus } from "../generated/schema"

export function handleInstrRead(event: InstrReadEvent): void {
  let entity = new InstrRead(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.destination = event.params.destination
  entity.indx = event.params.indx
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInstrSent(event: InstrSentEvent): void {
  let entity = new InstrSent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.destination = event.params.destination
  entity.content = event.params.content
  entity.indsx = event.params.indsx
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNodeStatus(event: NodeStatusEvent): void {
  let entity = new NodeStatus(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.source = event.params.source
  entity.destination = event.params.destination
  entity.res = event.params.res

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
