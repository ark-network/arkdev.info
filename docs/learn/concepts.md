---
sidebar_position: 2
title: 'Key Concepts'
toc_max_heading_level: 5
---

- [🕴️ Actors](#️-actors)
  - [Server](#server)
  - [Users](#users)
- [📝 Contracts and Primitives](#-contracts-and-primitives)
  - [VTXO](#vtxo)
  - [VTXO Tree](#vtxo-tree)
  - [Shared Output](#shared-output)
  - [Rounds](#rounds)
  - [Connectors](#connectors)
- [⛓️‍💥 Transactions](#️-transactions)
  - [Boarding transaction](#boarding-transaction)
  - [Forfeit transaction](#forfeit-transaction)
  - [Round transaction](#round-transaction)

<details>
<summary>Legend</summary>
- **Alice**: Alice signature is required
- **Bob**: Bob signature is required
- **Server**: Server signature is required
- **and(Alice,Bob)**: both conditions needed to unlock
- **or(Alice,Bob)**: only one condition needed to unlock
</details>

## 🕴️ Actors

### Server

Ark **Servers** are always-on servers that provide liquidity to the network, similar to how Lightning service providers work. The Server is responsible for creating new [VTXOs](#vtxo) and broadcasting periodically the [Round transactions](#round-transaction) and it's incentivized by the fees charged on the virtual UTXOs created. Each of these rounds expire after a certain period of time, to allow Server to reclaim the Bitcoin liquidity locked on-chain, unless the user decides to refresh their VTXOs and pay the liquidity provider fees again.

### Users

**Users** are the ones who sends and receive VTXOs, virtual UTXOs that can be transformed in UTXO at any time, but are kept off-chain for cheaper and faster settlements of Bitcoin payments. They can unilaterally exit their funds from the Ark to the mainchain without asking the Server for permission, assuming the cost of the on-chain transaction to exit is not greater than the value of the VTXO being spent.

## 📝 Contracts and Primitives
:::note
All time periods used on timelocks (**5s**, **24h**, **4w**, **1y**) are arbitrary: each Server can use different values.
:::

### VTXO

A Virtual UTXO, or VTXO in short, is a Bitcoin transaction output that can be spent off-chain and can be redeemed on-chain at any time. A VTXO is the leaf of the [VTXO tree](#vtxo-tree) to which the [Shared Output](#shared-output) of a [round transaction](#round-transaction) commits to. The VTXO refers to a set of transactions owned by a user, whose validity cannot be revoked by anyone, allowing the user to create a specific UTXO on the blockchain if needed.


A VTXO should appear on-chain only if the owner decided to unilaterally exit the Ark.

A VTXO is locked by a taproot script that must contain these kinds of spending conditions: 

#### Redeem Paths
Allow unilateral spending after a CSV delay. Each path requires:
- The transaction must be on-chain (the VTXO has to be unrolled on-chain)
- The delay must not be shorter than a threshold set by the Server
- Only the designated user(s) signature is needed

examples:

```btcscript
// 1-sig redeem path
<delay> CHECKSEQUENCEVERIFY DROP <pubkey> CHECKSIG

// 2-sig redeem path
<delay> CHECKSEQUENCEVERIFY DROP <pubkey1> CHECKSIGVERIFY <pubkey2> CHECKSIG
```

#### Forfeit Paths

Allow cooperative spending between parties. Each path requires:
- The Server's signature must always be included
- Can optionally require additional signatures

examples:

```btcscript
// 1-sig forfeit path
<pubkey> CHECKSIGVERIFY <server_pubkey> CHECKSIG

// 2-sig forfeit path
<pubkey1> CHECKSIGVERIFY <pubkey2> CHECKSIGVERIFY <server_pubkey> CHECKSIG
```

#### Default VTXO Script

The most common VTXO script, where Alice is the only owner of the coin, is composed by one forfeit path and one redeem path:

```hack
(Alice + Server) OR (Alice after 24hr)
```

```btcscript
<delay> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIG
<alice> CHECKSIGVERIFY <server> CHECKSIG
```

For more examples, see the [VTXO scripts examples](../developers/protocol/address#vtxo-scripts-examples).

### VTXO Tree

VTXOs are created by a [shared output](#shared-output). The root of the VTXO tree spends the shared output and splits it into 2 other shared outputs, which are respecively split into other 2 shared outputs, etc. At the leaf level of this binary tree we find the VTXOs of the round participants.

![An image from the static](/img/vtxo-tree.png)

- Represents a tree of virtual transactions on the blockchain
- In an optimistic scenario, this tree is never revealed
- Each leaf on this tree represents a [VTXO](#vtxo)

### Shared Output

A shared output is a bitcoin transaction output locked by a taproot script with 2 tapscript closures:

1. **Unroll** forces the spending transaction format. A shared output can be spent only by being split into 2 other sub-shared outputs. This gives the tree the shape of a binary tree.
2. **Sweep** lets the Ark Service Provider to spend a shared output after a timeout.

### Rounds

Ark payments traditionally occur in scheduled rounds organized by the Server. During these rounds, users with a VTXO in the Ark can request the Server to include their new virtual transactions output. The Server then creates a new [shared output](#shared-output) that aggregates all the payments from that round.
To participate, users sign an off-chain [forfeit transaction](#forfeit-transaction), transferring their input VTXO to the Server. In exchange, the Server generates a new shared on-chain UTXO containing the desired output VTXOs and broadcasts the transaction.

A round transaction typically has two outputs: a _Shared Output_ that commits to a VTXO tree, and a _Connector Output_ that commits to a chain of connectors.

### Connectors

Connectors are used to ensure atomicity when forfeiting VTXOs in exchange for others in a new VTXO tree, ie. spending a VTXO by joining a round.

As introduced before, a round transaction typically has two outputs: a _Shared Output_ that commits to a VTXO tree, and a _Connector Output_ that commits to a chain of connectors.

A connector is a dust value ouptut that _connects_ a forfeit tx to the round tx that creates a new VTXO. It's created in the round tx and used as input of the forfeit tx, and it's signed by the Server only. It's purpose is to force the forfeit tx to be broadcastable only if the round one is broadcasted as well. Without connectors, the users would need to trust the Server to broadcast the round transaction after they signed their forfeit txs. With connectors, instead, there's no need of trust as connectors are the guarantee for the users that the Server can't broadcast the forfeit txs unless the round tx is already onchain.

![connectors](/img/connectors.png)
In this example Alice owns a 10k sats VTXO and joins a round to send 2k sats to Bob.
The Server creates the next VTXO tree with the new VTXOs, and a chain of connectors for each spent (forfeited) VTXO, included the one used in Alice's forfeit tx.


## ⛓️‍💥 Transactions

### Boarding transaction

- Alice funds an output that can be **accepted as a VTXO** in a future round
- **Alice** can unlock after a timeout ie. _6 months_
- **Alice and Server** can cooperate to include the UTXO as input of a [round transaction](#round-transaction)

| Inputs       | Outputs                                                     |
| ------------ | ----------------------------------------------------------- |
| Alice’s UTXO | `(Alice after 6 months) or (Alice + Server)`                         |


### Forfeit transaction

- Insurance for the Server, in case Alice tries to double spend her VTXO after spending it inside Ark
- Before the Server funds Bob’s VTXO in the next Round transaction, he must receive this transaction signed by Alice
- Uses a connector from the next Round transaction to achieve atomicity

| Inputs                               | Outputs |
| ------------------------------------ | ------- |
| VTXO spending `Alice + Server`          | `Server`   |
| Connector from next Round transaction |

### Round transaction

- Funded by the Server, creates VTXOs.
- Has at least two outputs:
  - A shared output with a VTXOs tree
  - A connectors output with a connectors tree
- A new transaction is periodically broadcasted by the Server to create new VTXOs. 

| Inputs   | Outputs           |
| -------- | ----------------- |
| Server UTXO | Shared output     |
|          | Connectors output |