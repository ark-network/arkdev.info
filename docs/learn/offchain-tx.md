---
sidebar_position: 3
title: 'Make a transaction'
---

Making a transaction in Ark to send Bitcoin offchain instantly to somebody is trivial.

The user crafts the [redeem transaction](concepts.md#redeem-transaction) that spends his [VTXO](concepts.md#vtxo) and creates an output for the receiver, plus eventual change.  
The user signs this transaction using the [collaborative path](concepts.md#collaborative-path) and requests the Server to co-sign it. As soon as the server signs, the transaction is completed.  
The process, like in Bitcoin, doesn't require receivers to be online.
The receiver can spend the incoming VTXO to either spend it in another redeem transaction or to settle it, ie. join a a round to forfeit the VTXO and ask for a new one backed by a tree that he signs.

![Ark Transaction OOR](/img/offchain-tx.png)

Spending a VTXO can be seen as extending a branch of a VTXO tree with a new leaf.  
The receiver must be aware that a received VTXO is not backed by a tree that he signed, therefore he must be ready to react to a double-spend attack made by the sender at any time, that means broadcasting the redeem transaction in case the VTXO used as its input hit the blockchain.

## Timeline

1. **Alice wants to send bitcoin to Bob:** Alice asks the Server to spend  her VTXO.
2. **Creating the transaction:** Alice creates a redeem transaction with her VTXO as input, an output for Bob and an eventual change. She signs the input using the collaborative path and asks the Server to co-sign it.
3. **Bob can spend the VTXO:** when Bob comes online, he can either spend the received VTXO by doing a similar transaction, or can settle it and make it backed by a VTXO tree signed by him.
