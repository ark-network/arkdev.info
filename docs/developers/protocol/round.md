---
sidebar_position: 2
title: 'Round'
---

An Ark round transaction contains a Shared Output that commits to a VTXO tree. This tree is composed of transactions pre-signed by the server and all the round participants - the owner of the VTXOs at leaf-level.

The process of creating a round transaction is an interactive session between server and users that is divided in 3 phases:
1. **Tree signing phase** 
2. **Forfeit signing phase** 
3. **Finalization phase**

Before taking a closer look at these 3 phases, it's worth to mention that users must register inputs (VTXOs to spend) and outputs (VTXO to create in the new tree) to join a round, and they can do so at any time. The server attempts to create a new round periodically by popping all possible requests stacked in its queue in order to create the biggest VTXO tree.

### Tree signing phase

This is the very first phase in the process of creating a round transaction. The server pops all possible inputs and outputs registered by the users and creates the VTXO tree - which implies creating everything else: unsigned round tx and connectors. The tree is shared with all round participants 

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
