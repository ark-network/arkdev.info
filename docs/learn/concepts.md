---
sidebar_position: 1
title: 'Key Concepts'
toc_max_heading_level: 5
---

- [🕴️ Actors](#️-actors)
  - [Server](#server)
  - [Users](#users)
- [📝 Contracts and Primitives](#-contracts-and-primitives)
  - [VTXO](#vtxo)
    - [Exit path](#exit-path)
    - [Collaborative path](#collaborative-path)
  - [VTXO Tree](#vtxo-tree)
  - [Shared Output](#shared-output)
    - [Unroll path](#unroll-path)
    - [Sweep path](#sweep-path)
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

The **Ark Server** is an always-on service with two primary functions:

1.	Batching VTXOs into UTXOs: It consolidates Virtual Transaction Outputs ([VTXOs](#vtxo)) into on-chain Unspent Transaction Outputs (UTXOs), reducing the blockchain footprint to a single on-chain transaction, regardless of the number of VTXOs involved.
2.	Funding On-Chain Transactions: It provides the inputs needed to fund and publish these on-chain transactions, utilizing its own liquidity.

It is important to note that, by no means, does the Ark Server have trusted control over user funds.

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
- any script path must be either a **collaborative** or a **exit**

#### Exit path
The exit path allows the owner of a VTXO to spend it unilaterally, without the collaboration of the server and must respect the following rules:
- Must be delayed with CSV (relative timelock)
- The delay must not be shorter than a threshold set by the server
- Must not require server's signature
- At least one exit path must be included in the VTXO script

Example:

```btcscript
// 1-sig exit path
<delay> CHECKSEQUENCEVERIFY DROP <pubkey> CHECKSIG
```

#### Collaborative path

A collaborative path allows the owner of VTXO to spend it off-chain in collaboration with the server and must respect the following rules:
- Can be delayed with CLTV (absolute timelock)
- Must require server's signature
- At least one collaborative path must be included in the VTXO script

Example:

```btcscript
// 1-sig collaborative path
<pubkey> CHECKSIGVERIFY <server_pubkey> CHECKSIG
```

The most common VTXO script, where Alice is the only owner of a coin, is composed of one collaborative path and one exit path like:

```hack
(Alice + Server) OR (Alice after 24hr)
```

```btcscript
<delay> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIG
<alice> CHECKSIGVERIFY <server> CHECKSIG
```

### VTXO Tree

VTXOs are created by a [shared output](#shared-output). The root transaction of the VTXO tree spends the shared output and splits it into 2 other shared outputs, which are respecively split into other 2 shared outputs, etc.  
At the leaf level of this binary tree we find the 1-input-1-output transactions. The outputs of these transactions are the VTXOs of the users.

![An image from the static](/img/vtxo-tree.png)

- Represents a tree of virtual transactions on the blockchain
- All transactions are fully signed and ready to be brodcasted for users to unilateral exit
- In an optimistic scenario, this tree is never revealed

### Shared Output

A shared output is a bitcoin transaction output funded by the server that is locked by a taproot script that must contain the following spending conditions:

* unspendable key path
* there must be only 2 script paths,  **unroll** and **sweep**

#### Unroll path

The unroll path is the one used by the server and the users when signing the VTXO tree. The server builds the VTXO tree and shares it with the users. Once all parties validated the tree, they can sign it so it's ready to be revealed on-chain in the (rare) case a user wants to unilateral exit and redeem a VTXO.

#### Sweep path

The sweep path allows the Ark Server to spend a shared output alone after a locktime, for example 1 month. This locktime defines the expiry duration of the VTXOs included in a tree.

### Rounds

The Ark Server's main job is to build new VTXO trees whenever users want to swap close-to-expiry VTXOs for new ones to extend their liveness.  
To make it possible at any time, one strategy the server can adopt is to periodically attempt to create a new VTXO tree in so-called "round transactions".
Users can request the server to join the next round and when they are selected, they forfeit (send back) their close-to-expiry VTXOs to the server in exchange for new ones in the next VTXO tree.  
The result of this process is an on-chain transaction funded by the server that typically has two outputs: a _Shared Output_ that commits to a VTXO tree, and a _Connector Output_ that commits to a chain of [connectors](#connectors).

### Connectors

Connectors are used to ensure atomicity when forfeiting VTXOs in exchange for others in a new VTXO tree.

As introduced before, a round transaction typically has two outputs: a _Shared Output_ that commits to a VTXO tree, and a _Connector Output_ that commits to a tree of connectors.

A connector is a dust value ouptut that _connects_ a forfeit tx that spends a VTXO, to the round tx that creates another one.  
The connector is created by the server in the round tx and is used as input of a user's forfeit tx. It's signed by the Server only and its purpose is to force the forfeit tx to be broadcastable only if the round tx is broadcasted as well.
Without connectors, the users would need to trust the Server to broadcast the round tx after they signed their forfeit txs. With connectors, instead, there's no need of trust as they are the guarantee for the users that the Server can't broadcast the forfeit txs unless the round tx is already on-chain.

![connectors](/img/connectors.png)
In this example Alice owns a 10k sats VTXO and joins a round to refresh it.
The Server creates the next VTXO tree with the new VTXO, and a connectors tree with one leaf for each spent (forfeited) VTXO, included the one used in Alice's forfeit tx. The example doesn't take into account service fees for sake of simplicity.





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