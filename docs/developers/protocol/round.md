---
sidebar_position: 2
title: 'Round'
---

Here you can learn more about the creation of a round transaction, that is an interactive session between the server and the users involving the exchange of signed transactions.

Before taking a closer look at this process, it's worth to mention that users must register inputs - VTXOs to forfeit - and outputs - VTXO to create in the new tree by the server - to join a round, and they can do so at any time. After registering a request, the user must start pinging the Server to signal he's online and willing to join the next round. The server stores all requests in a queue and periodically pops some of them based on criterias like online activity - last ping timestamp - or priority - how much the user is willing to pay for his offchain transaction.

## Round transaction creation

The creation of a round transaction in Ark involves a sequence of steps between the server and users. The process begins with the server initiating the round by selecting pending requests from the queue. It then constructs a VTXO tree, shared output, connectors, and an unsigned round transaction, all of which are sent to the participating users.

As soon as the users receive and validate the data, they interact with the server to sign the VTXO tree following the [Musig2 scheme](https://medium.com/blockstream/musig2-simple-two-round-schnorr-multisignatures-bf9582e99295). 

Once the server has collected all signatures and sent to the users a copy of the fully VTXO tree, they create and sign the forfeit transactions to give their VTXOs back to the server. Once the server has collected all users' signed forfeit transactions, it proceeds to sign and broadcast the round transaction. The process is complete and the server can now repeat it from the beginning for another batch of requests.

## Server and clients communication 

Clients comminucate with the server by calling the following API endpoints:

* [RegisterInputsForNextRound](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L22) and [RegisterOutputsForNextRound](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L28) to register inputs and outputs. Clients can register inputs and outputs at any time
* [Ping]() a client signals it's online and willing to join the next round by polling this endpoint
* [GetEventStream](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L52) to receive event messages from the server on the next actions to take to complete the round process:
  | Event message | Description |
  |------------|-----------------|
  | [RoundFailedEvent]() | something went wrong, retry joining the next round |
  | [RoundSigningEvent]() | server built the VTXO tree and waits for users to share their nonces (musig2) |
  | [RoundSigningNoncesGeneratedEvent]() | server aggregated the nonces and waits for users to share their signatures (musig2) |
  | [RoundFinalizationEvent]() | the VTXO tree is fully signed and server waits for users to share their signed forfeit transactions |
  | [RoundFinalizedEvent]() | server collected all signed forfeit transactions broadcasted the round transaction. The process is complete, clients can close connection with `GetEventStream` |
* [SubmitTreeNonces](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L34) when a client receives `RoundSigningEvent`, it checks it's been selected for the next round, creates a nonce for each transaction of the VTXO tree and shares them by calling this endpoint
* [SubmitTreeSignatures](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L40) when a client receives `RoundSigningNoncesGeneratedEvent`, it signs all required transactions of the VTXO tree and shares them by calling this endpoint
* [SubmitSignedForfeitTxs](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L46) when a client receives `RoundFinalizationEvent`, it creates and signs all required forfeit transactions and shares them by calling this endpoint