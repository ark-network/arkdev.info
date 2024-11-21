---
sidebar_position: 2
title: 'Round'
---

An Ark round transaction commits to a [Shared Output](/docs/developers/protocol/shared-output) containing the VTXO(s) tree. This tree is composed of several PSBTs that must be signed by the round participants.

This process is repeated every round interval, which is set by the Server. The interval is splitted into three phases:
1. **Registration phase** gives time for the participants to register their VTXO(s) to spend (the inputs) and their VTXO(s) to create (the outputs).
2. **Signing phase** allows the participants to sign the PSBTs that compose the tree and commit forfeits transactions spending the input VTXO(s).
3. **Finalization phase** lets the server to finalize and broadcast the round transaction.

The communication between the participants and the server is done through different Round events messages sent by the server to the participants. After registration using [RegisterInputsForNextRound](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L22) and [RegisterOutputsForNextRound](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L28) RPCs, the client subscribes to server-side stream using [GetEventStream](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L52) RPC. Until the first event is received, the client MUST continuously call the [Ping](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L57) RPC to signal that it is online and ready to handle signing events.


| Event | Expected Client Response |
|------------|-----------------|
| RoundFailedEvent | something went wrong, retry in the next round |
| RoundSigningEvent | generate and send nonces via [SubmitTreeNonces](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L34) RPC |
| RoundSigningNoncesGeneratedEvent | sign and send the VTXO tree signatures via [SubmitTreeSignatures](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L40) RPC |
| RoundFinalizationEvent | create and sign forfeits transactions via [SubmitSignedForfeitTxs](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L46) RPC |
| RoundFinalizedEvent | success, round transaction is broadcasted |

:::tip
See [service.proto](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L20-L62) for more details.
:::
