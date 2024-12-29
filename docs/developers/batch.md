---
sidebar_position: 2
title: 'Batch Transaction'
---

Here you can learn more about the creation of an Ark contract, a batch of pre-signed transactions structured as a "tree" that assigns a set of **virtual UTXOs** (aka VTXOs) on his leaves. This technique allows to batch multiple UTXOs into a single transaction. Any owner of a VTXO can exit at any time by broadcasting the corresponding branch of transaction on-chain and paying needed Bitcoin network fees.

The creation of this transaction is an interactive session between the server and the users, involving the exchange of signed data. The most simple approach is to have *periodic rounds* of signing sessions.

Before taking a closer look at this process, it's worth to mention that users must register inputs - VTXOs to forfeit - and outputs - VTXO to create in the new tree by the server - to settle a VTXO, and they can do so at any time. After registering a request, users must start pinging the Server to signal they're online and willing to complete the signing session. The server stores all requests in a queue and periodically pops some of them based on criterias like online activity - last ping timestamp - or priority - how much a user is willing to pay for his offchain transaction.

## Signing session

The creation of a batch transaction in Ark involves a sequence of actions done by both the server and the users. The process begins with the server initiating the siging session by selecting pending requests from the queue. It then constructs a VTXO tree, shared output, connectors, and an unsigned batch transaction, and shares these data with the participating users.

As soon as the users receive and validate the data, they interact with the server to sign the VTXO tree.

Once the server has collected all signatures and sent to the users a copy of the fully-signed VTXO tree, they create and sign the forfeit transactions to give their VTXOs back to the server. Once the server has collected all users' signed forfeit transactions, it proceeds to sign and broadcast the batch transaction. The process is complete and the server can now repeat it from the beginning for another batch of requests.

## Server and clients communication

Clients comminucate with the server by calling the following API endpoints:

* [RegisterInputsForNextRound](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L24-L29) and [RegisterOutputsForNextRound](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L30-L35) - clients call these endpoints to register inputs (_VTXOs to forfeit_) and outputs (_VTXOs to be created by the server in the next tree_) at any time
* [Ping](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L59-L63) - clients signal they're online and willing to join the next round by polling this endpoint
* [GetEventStream](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L54-L58) - clients call this endpoint to receive event messages from the server on the actions to take to complete the next round:
  | Event message | Description |
  |------------|-----------------|
  | [RoundFailedEvent](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L242-L245) | something went wrong, retry joining the next round |
  | [RoundSigningEvent](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L247-L252) | server built the VTXO tree and waits for users to share their nonces (musig2) |
  | [RoundSigningNoncesGeneratedEvent](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L254-L257) | server aggregated the nonces and waits for users to share their signatures, ie. sign the tree (musig2) |
  | [RoundFinalizationEvent](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L229-L235) | the VTXO tree is fully signed and server waits for users to share their signed forfeit transactions |
  | [RoundFinalizedEvent](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L237-L240) | server collected all signed forfeit txs and broadcasted the round tx. The process is complete, clients can close connection with `GetEventStream` |
* [SubmitTreeNonces](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L36-L41) - when clients receive `RoundSigningEvent`, they check they've been selected for the next round by inspecting the leaves of the tree. If so, they generate a nonce for each transaction of the VTXO tree and share them with the server by calling this endpoint
* [SubmitTreeSignatures](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L42-L47) - when clients receive `RoundSigningNoncesGeneratedEvent`, they sign all required transactions of the VTXO tree and share them with the server by calling this endpoint
* [SubmitSignedForfeitTxs](https://github.com/ark-network/ark/blob/master/api-spec/protobuf/ark/v1/service.proto#L48-L53) when clients receive `RoundFinalizationEvent`, they create and sign all required forfeit transactions and share them with the server by calling this endpoint
