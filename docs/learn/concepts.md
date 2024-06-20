---
sidebar_position: 2
title: 'Key Concepts'
toc_max_heading_level: 5
---

- [Actors](#️-actors)
  - [ASP](#asp)
  - [Users](#users)
- [Contracts and Primitives](#-contracts-and-primitives)
  - [VTXO](#vtxo)
  - [VTXO Tree](#vtxo-tree)
  - [Shared output](#shared-output)
  - [Rounds](#rounds)
  - [Connectors](#connectors)
- [Transactions](#️-transactions)
  - [Boarding transaction](#boarding-transaction)
  - [Forfeit transaction](#forfeit-transaction)
  - [Round transaction](#round-transaction)

## 🕴️ Actors

### ASP

Ark Service Providers, or **ASPs** in short, are always-on servers that provide liquidity to the network, similar to how Lightning service providers work. The ASP is responsible for creating new [VTXOs](#vtxo) and broadcasting periodically the [Round transactions](#round-transaction) and it's incentivized by the fees charged on the virtual UTXOs created. Each of these rounds expire after a certain period of time, to allow ASP to reclaim the Bitcoin liquidity locked on-chain, unless the user decides to refresh their VTXOs and pay the liquidity provider fees again.

### Users

**Users** are the ones who sends and receive VTXOs, virtual UTXOs that can be transformed in UTXO at any time, but are kept off-chain for cheaper and faster settlements of Bitcoin payments. They can unilaterally exit their funds from the Ark to the mainchain without asking the ASP for permission, assuming the cost of the on-chain transaction to exit is not greater than the value of the VTXO being spent.

## 📝 Contracts and Primitives
:::note
All time periods used on timelocks (**5s**, **24h**, **4w**, **1y**) are arbitrary: each ASP can use different values.
:::

### VTXO

A Virtual UTXO or VTXO in short, it's a Bitcoin transaction output that can be spent off-chain and can be redeemed on-chain at any time. The VTXO is the leaf of the [VTXO tree](#vtxo-tree) commited by the [Shared Output](#shared-output) in the blockchain when the ASP broadcast his [round transaction](#round-transaction).

The **VTXO script** is the last level of the [VTXO tree](#vtxo-tree). It should appear on-chain only if the VTXO owner decided to unilaterally exit the Ark. It has 2 tapscript closures:

1. **Redeem** lets to spend the VTXO onchain after a CSV delay. the delay prevents the ASP to lost a VTXO spent off-chain.
2. **Forfeit** expects both parties (owner and ASP) to sign the spending transaction. It is used to spend the VTXO off-chain.

| Inputs                       | Outputs                              |
| ---------------------------- | ------------------------------------ |
| Boarding or Round transaction | `VTXO script` |

### VTXO Tree

VTXOs are created by a [shared output](#shared-output). This output is enforcing the value to be splitted into a binary tree of other scripts.

![An image from the static](/img/vtxo-tree.png)

_Each node of the diagram is a taproot script._

### Shared output

- Represents a tree of virtual transactions on the blockchain
- In an optimistic scenario, this tree is never revealed
- Each leaf on this tree represents a [VTXO](#vtxo)

A shared output is a bitcoin transaction output locked by a taproot script with 2 tapscript closures:

1. **Unroll** forces the spending transaction format. The tx creates the next level of the script tree on-chain. Splitting the value into 2 outputs with the children taproot scripts.
2. **Sweep** lets the Ark Service Provider to spend the whole shared output after a timeout.
![shared output](/img/shared-output.png)
- Tree can have a radix higher than 2 (ex: radix 4)

### Rounds

Ark payments traditionally occur in scheduled rounds organized by the ASP. During these rounds, users with a VTXO in the Ark can request the ASP to include their new virtual transactions output. The ASP then creates a new [shared output](#shared-output) that aggregates all the payments from that round.
To participate, users sign an off-chain [forfeit transaction](#forfeit-transaction), transferring their input VTXO to the ASP. In exchange, the ASP generates a new shared on-chain UTXO containing the desired output VTXOs and broadcasts the transaction.

### Connectors

To ensure atomicity—preventing users from losing their VTXOs without confirmation of the new ones—the forfeit transaction is contingent on the new shared UTXO transaction. This is achieved by using connector outputs, which are part of the shared UTXO transaction and serve as inputs for the forfeit transactions.

### Out of round

Rounds require user interaction and result in an on-chain transaction that must be confirmed before finalizing. This process can be time-consuming.
To allow users to spend their VTXOs more quickly, out-of-round (OOR) payments are available. These enable participants to make instant payments directly from one party to another without waiting for an Ark round.
OOR payments are co-signed by the ASP. Users **trust that the ASP and sender won't collude** for a double spend. The recipient can either rely on the ASP's reputation and keep the OOR VTXO or choose to convert it into a regular VTXO in the next Ark round for added security.

## ⛓️‍💥 Transactions

### Legend

- **Alice**: Alice signature is required
- **ASP**: ASP signature is required
- **cov\*\*(script)**: covenant that forces the spending transaction to have a mandatory first output with the **script**
- **and(Alice,Bob)**: both conditions needed to unlock
- **or(Alice,Bob)**: only one condition needed to unlock

### Boarding transaction

- Alice funds an output that can be **accepted as a VTXO** in a future round
- A covenant forces the creation of an output with the same script as [**VTXO**](#vtxo). No need for interactivity after funding it, anyone can spend.
- **ASP** can unlock after a timeout ie. _4 weeks_
- Alice is **required to be online** to maintain access to funds: after the timeout, ASP becomes the only owner funds

| Inputs       | Outputs                                                     |
| ------------ | ----------------------------------------------------------- |
| Alice’s UTXO | `(ASP after 4w) or cov((Alice + ASP) or (Alice after 24h))` |


### Redeem transaction

### Redeem transaction

- The recipient of a VTXO initiates this transaction to convert their VTXO into a regular UTXO
- This transaction can be completed without any interaction with the sender
- It ensures the security and integrity of the Ark system by allowing users to move their funds from the off-chain environment back to the on-chain

| Inputs       | Outputs                                                     |
| ------------ | ----------------------------------------------------------- |
| Recipient's VTXO | `(ASP after 4w) or cov((Recipient + ASP) or (Recipient after 24h))` |

### Forfeit transaction

- Insurance for the ASP, in case Alice tries to double spend her VTXO after spending it inside Ark
- Before the ASP funds Bob’s VTXO in the next Round transaction, he must receive this transaction signed by Alice
- Uses a connector from the next Round transaction to achieve atomicity

| Inputs                               | Outputs |
| ------------------------------------ | ------- |
| VTXO spending `Alice + ASP`          | `ASP`   |
| Connector from next Round transaction |

### Round transaction

- Funded by the ASP, creates VTXOs
- Has at least two outputs:
  - A shared output with a VTXOs tree
  - A connectors output with a connectors tree
- A new transaction is broadcasted every 5 seconds

| Inputs   | Outputs           |
| -------- | ----------------- |
| ASP UTXO | Shared output     |
|          | Connectors output |

