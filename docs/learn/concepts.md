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

A VTXO should appear on-chain only if the VTXO owner decided to unilaterally exit the Ark. It's locked by a taproot script that must contain only two types of spending paths:

1. **Redeem paths**: Allow unilateral spending after a CSV delay. Each path requires:
   - The transaction must be on-chain, the VTXO has to be unrolled on-chain
   - The delay must not be shorter than a threshold set by the Server
   - Only the designated user(s) signature is needed

```btcscript
// 1-sig redeem path
<delay> CHECKSEQUENCEVERIFY DROP <pubkey> CHECKSIG

// 2-sig redeem path
<delay> CHECKSEQUENCEVERIFY DROP <pubkey1> CHECKSIGVERIFY <pubkey2> CHECKSIG
```

2. **Forfeit paths**: Allow cooperative spending between parties. Each path requires:
   - The Server's signature must always be included
   - Can optionally require additional signatures

```btcscript
// 1-sig forfeit path
<pubkey> CHECKSIGVERIFY <server_pubkey> CHECKSIG

// 2-sig forfeit path
<pubkey1> CHECKSIGVERIFY <pubkey2> CHECKSIGVERIFY <server_pubkey> CHECKSIG
```

Therefore, the default VTXO script is:
```btcscript
<alice> CHECKSIGVERIFY <server> CHECKSIG            // (Alice + Server)
<delay> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIG   // (Alice after <delay>)
```

2-of-2 VTXO script:
```btcscript
<alice> CHECKSIGVERIFY <bob> CHECKSIGVERIFY <server> CHECKSIG    // (Alice + Bob + Server)
<delay1> CHECKSEQUENCEVERIFY DROP <alice> CHECKSIG               // (Alice after <delay1>)
<delay2> CHECKSEQUENCEVERIFY DROP <bob> CHECKSIG                 // (Bob after <delay2>)
```

:::note
The server considers the VTXO invalid if any other type of tapscript path is used.
:::

### VTXO Address

VTXO address is built from the taproot key concatenated with the server's public key. We use bech32m encoding for the address. The server public key aims to identify the Ark service provider. The taproot key encodes the forfeits and redeem paths of the VTXO, the server will use it as a scriptpubkey of a VTXO tree leaf transaction.

Example:
* VTXO public key: `25a43cecfa0e1b1a4f72d64ad15f4cfa7a84d0723e8511c969aa543638ea9967`
* Server public key: `33ffb3dee353b1a9ebe4ced64b946238d0a4ac364f275d771da6ad2445d07ae0`

The VTXO address is:
```
ark1x0lm8hhr2wc6n6lyemtyh9rz8rg2ftpkfun46aca56kjg3ws0tsztfpuanaquxc6faedvjk3tax0575y6perapg3e95654pk8r4fjecs5fyd2
```

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