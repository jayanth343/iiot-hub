import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { InstrRead } from "../generated/schema"
import { InstrRead as InstrReadEvent } from "../generated/M/M"
import { handleInstrRead } from "../src/m"
import { createInstrReadEvent } from "./m-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let destination = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let indx = BigInt.fromI32(234)
    let timestamp = BigInt.fromI32(234)
    let newInstrReadEvent = createInstrReadEvent(
      sender,
      destination,
      indx,
      timestamp
    )
    handleInstrRead(newInstrReadEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("InstrRead created and stored", () => {
    assert.entityCount("InstrRead", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "InstrRead",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "InstrRead",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "destination",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "InstrRead",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "indx",
      "234"
    )
    assert.fieldEquals(
      "InstrRead",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
