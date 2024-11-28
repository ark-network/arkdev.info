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
    - [Redeem](#redeem)
    - [Forfeit](#forfeit)
  - [VTXO Tree](#vtxo-tree)
  - [Shared Output](#shared-output)
  - [Rounds](#rounds)
  - [Connectors](#connectors)
- [⛓️‍💥 Transactions](#️-transactions)
  - [Boarding transaction](#boarding-transaction)
  - [Forfeit transaction](#forfeit-transaction)
  - [Round transaction](#round-transaction)
  - [Redeem transaction](#redeem-transaction)

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

**Users** are the ones who sends and receive VTXOs, virtual UTXOs that can be transformed in UTXO at any time, but are kept off-chain for cheaper and faster settlements of Bitcoin transactions. They can unilaterally exit their funds from the Ark to the mainchain without asking the Server for permission, assuming the cost of the on-chain transaction to exit is not greater than the value of the VTXO being spent.

## 📝 Contracts and Primitives
:::note
All time periods used on timelocks (**5s**, **24h**, **4w**, **1y**) are arbitrary: each Server can use different values.
:::

### VTXO

A Virtual UTXO, or VTXO in short, is a Bitcoin transaction output that can be spent off-chain and can be redeemed on-chain at any time. A VTXO is the leaf of the [VTXO tree](#vtxo-tree) to which the [Shared Output](#shared-output) of a [round transaction](#round-transaction) commits to. The VTXO refers to a set of transactions owned by a user, whose validity cannot be revoked by anyone, allowing the user to create a specific UTXO on the blockchain if needed.

A VTXO should appear on-chain only if the owner decided to unilaterally exit the Ark.

A VTXO is locked by a [taproot](https://bips.dev/341/) script that must contain the following spending conditions:
- unspendable key path
- any script path must be either a **redeem** or a **forfeit**

#### Redeem
A redeem closure allows the owner of a VTXO to spend it unilaterally, without the collaboration of the server and must respect the following rules:
- Must be delayed with CSV (relative timelock)
- The delay must not be shorter than a threshold set by the server
- Must not require server's signature
- At least one redeem closure must be included in the VTXO script

Example:

```btcscript
// 1-sig redeem path
<delay> CHECKSEQUENCEVERIFY DROP <pubkey> CHECKSIG
```

#### Forfeit

A forfeit closure allows the owner of VTXO to spend it off-chain in collaboration with the server and must respect the following rules:
- Can be delayed with CLTV (absolute timelock)
- Must require server's signature
- At least one forfeit closure must be included in the VTXO script

Example:

```btcscript
// 1-sig forfeit path
<pubkey> CHECKSIGVERIFY <server_pubkey> CHECKSIG
```

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

1. **Unroll** forces the spending transaction format. A shared output can be spent only by being split into 2 other sub-shared outputs. This gives the VTXO tree the shape of a binary tree.
2. **Sweep** lets the Ark Server to spend a shared output after a timeout.

### Rounds

One of the jobs of the Ark server is to periodically create round transactions in order for users to settle or refresh their VTXOs whenever they need. During these rounds, users with a VTXO in the Ark can request the Server to include their new virtual transactions output. The Server then creates a new [shared output](#shared-output) that aggregates all the off-chain transactions from that round.
To participate, users sign an off-chain [forfeit transaction](#forfeit-transaction), transferring their input VTXO to the Server. In exchange, the Server generates a new shared on-chain UTXO containing the desired output VTXOs and broadcasts the transaction.

A round transaction typically has two outputs: a _Shared Output_ that commits to a VTXO tree, and a _Connector Output_ that commits to a chain of connectors.

### Connectors

Connectors are used to ensure atomicity when forfeiting VTXOs in exchange for others in a new VTXO tree, ie. spending a VTXO by joining a round.

As introduced before, a round transaction typically has two outputs: a _Shared Output_ that commits to a VTXO tree, and a _Connector Output_ that commits to a chain of connectors.

A connector is a dust value ouptut that _connects_ a forfeit tx to the round tx that creates a new VTXO. The connector is created by the server in the round tx and is used as input of a user's forfeit tx. It's signed by the Server only and its purpose is to force the forfeit tx to be broadcastable only if the round tx is broadcasted as well. Without connectors, the users would need to trust the Server to broadcast the round transaction after they signed their forfeit txs. With connectors, instead, there's no need of trust as connectors are the guarantee for the users that the Server can't broadcast the forfeit txs unless the round tx is already onchain.

![connectors](/img/connectors.png)
In this example Alice owns a 10k sats VTXO and joins a round to refresh it.
The Server creates the next VTXO tree with the new VTXO, and a chain of connectors for each spent (forfeited) VTXO, included the one used in Alice's forfeit tx. The example doesn't take into account service fees for sake of simplicity.


## ⛓️‍💥 Transactions

### Boarding transaction

- Funded by Alice, creates an output that can be **accepted as a VTXO** in a future round
- **Alice** can unlock after a timeout ie. _6 months_
- **Alice and Server** can cooperate to include the UTXO as input of a [round transaction](#round-transaction)

| Inputs       | Outputs                                                     |
| ------------ | ----------------------------------------------------------- |
| Alice’s UTXO | `(Alice after 6 months) or (Alice + Server)`                         |


### Forfeit transaction

- Funded by both Alice and server, sends an old VTXO owned by Alice to the server in exchange for a new one in the next round transaction
- Servers funds a forfeit tx with a connector from the next round transaction to achieve atomicity
- The Server must receive all forfeit transactions signed by the round participants before broadcasting the round transaction

| Inputs                               | Outputs |
| ------------------------------------ | ------- |
| VTXO spending `Alice + Server`          | `Server`   |
| Connector from next Round transaction |

### Round transaction

- Funded by the Server, creates VTXOs.
- Has at least two outputs:
  - A shared output that commits to a VTXO tree
  - A connector output that commits to a connector chain
- A new transaction is periodically broadcasted by the Server to create new VTXOs. 

| Inputs   | Outputs           |
| -------- | ----------------- |
| Server UTXO | Shared output     |
|          | Connector output |

### Redeem transaction

- Funded by Alice, creates an output for Bob and an eventual change for her. They can both spend their VTXOs in another redeem tx or settle, ie. they can forfeit the VTXOs and join a round at any time prior the VTXO expiration
- Signed by both Alice and Server

| Inputs   | Outputs           |
| -------- | ----------------- |
| VTXO spending `Alice + Server` | `(Bob and Server) or (Bob after 24 hours)` |
|          | `(Alice and Server) or (Alice after 24 hours)` (change) |