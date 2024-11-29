---
sidebar_position: 3
title: 'Make a transaction'
---

Making a transaction in Ark to send Bitcoin offchain instantly to somebody is trivial.

The user has to craft a transaction that spends his VTXO and creates an output for the receiver, plus eventual change.  
The user signs this transaction using the [forfeit path](./concepts#forfeit-path) of the VTXO and requests the Ark Server to co-sign it. As soon as the server signs, the transaction is completed.  
The process, like in Bitcoin, doesn't require receivers to be online.
The receiver can spend the incoming VTXOs to either make another offchain transaction or to settle the funds, ie. join a a round to forfeit the VTXO and ask for a new one backed by a tree that he signs.

## Timeline

1. **Alice wants to send bitcoin to Bob:** Alice asks the Server to spend from her [VTXO](./concepts.md#vtxo).
2. **Creating the transaction:** This transaction spends from the [forfeit path](./concepts.md#forfeit) of the VTXO, and creates an actual [VTXO](./concepts.md#vtxo) output that can be spent by Bob alone or Bob and Server.
3. **Bob can spend the VTXO:** Bob can spend the received VTXO by doing a similar transaction, or can settle it and make it backed by a VTXO tree signed by him.

![Ark Transaction OOR](/img/OOR.png)
