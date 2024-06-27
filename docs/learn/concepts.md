---
sidebar_position: 2
title: 'Key Concepts'
toc_max_heading_level: 5
---

- [🕴️ Actors](#️-actors)
- [📝 Contracts and Primitives](#-contracts-and-primitives)
  - [VTXO](#vtxo)
  - [VTXO Tree](#vtxo-tree)
  - [Shared Output](#shared-output)
  - [Rounds](#rounds)
  - [Connectors](#connectors)
- [⛓️‍💥 Transactions](#️-transactions)

<details>
<summary>Legend</summary>
- **Alice**: Alice signature is required
- **Bob**: Bob signature is required
- **ASP**: ASP signature is required
- **cov\*\*(script)**: covenant that forces the spending transaction to have a mandatory first output with the **script**
- **and(Alice,Bob)**: both conditions needed to unlock
- **or(Alice,Bob)**: only one condition needed to unlock
</details>

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

A Virtual UTXO or VTXO in short, it's a Bitcoin transaction output that can be spent off-chain and can be redeemed on-chain at any time. A VTXO is the leaf of the [VTXO tree](#vtxo-tree) commited by the [Shared Output](#shared-output) in the blockchain when the ASP broadcast his [round transaction](#round-transaction). The VTXO refers to a set of transactions owned by a user, whose validity cannot be revoked by anyone, allowing the user to create a specific UTXO on the blockchain if needed.

The **VTXO leaf script** is the last level of the [VTXO tree](#vtxo-tree). It should appear on-chain only if the VTXO owner decided to unilaterally exit the Ark. It has 2 tapscript closures

1. **Redeem** lets to spend the VTXO onchain after a CSV delay. the delay prevents the ASP to loose a VTXO spent off-chain.
2. **Forfeit** expects both parties (owner and ASP) to sign the spending transaction. It is used to spend the VTXO off-chain.

```hack
(Alice + ASP) OR (Alice after 24h)
```

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

### Rounds

Ark payments traditionally occur in scheduled rounds organized by the ASP. During these rounds, users with a VTXO in the Ark can request the ASP to include their new virtual transactions output. The ASP then creates a new [shared output](#shared-output) that aggregates all the payments from that round.
To participate, users sign an off-chain [forfeit transaction](#forfeit-transaction), transferring their input VTXO to the ASP. In exchange, the ASP generates a new shared on-chain UTXO containing the desired output VTXOs and broadcasts the transaction.

### Connectors

To ensure atomicity—preventing users from losing their VTXOs without confirmation of the new ones—the forfeit transaction is contingent on the new shared UTXO transaction. This is achieved by using connector outputs, which are part of the shared UTXO transaction and serve as inputs for the forfeit transactions.

## ⛓️‍💥 Transactions

:::note
The boarding transaction is peculiar to the Ark protocol with covenants. It is used to fund a VTXO by sending it directly to a boarding address without having to interact with the ASP. In the covenant-less version, Alice and ASP MUST interact to finalize the funding and redeem transactions.
:::

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="ark" label="Ark" default>

### Boarding transaction

- Alice funds an output that can be **accepted as a VTXO** in a future round
- A covenant forces the creation of an output with the same script as [**VTXO**](#vtxo). No need for interactivity after funding it, anyone can spend.
- **ASP** can unlock after a timeout ie. _4 weeks_
- Alice is **required to be online** to maintain access to funds: after the timeout, ASP becomes the only owner funds

| Inputs       | Outputs                                                     |
| ------------ | ----------------------------------------------------------- |
| Alice’s UTXO | `(ASP after 4w) or cov((Alice + ASP) or (Alice after 24h))` |

</TabItem>
<TabItem value="clark" label="clArk">

### Funding transaction

- Alice creates a PSBT
- Alice adds any segwit utxo as an input (must be segwit)
- Alice adds an output with the script `(Alice + ASP) or (ASP after 1 month)`
- Alice sends the PSBT to the ASP

| Inputs       | Outputs                                                     |
| ------------ | ----------------------------------------------------------- |
| Alice’s UTXO | `(Alice + ASP) or (ASP after 1 month)` |

### Redeem transaction

- ASP creates a new PSBT
- ASP adds the added output in the [Funding transaction](#funding-transaction) shared by Alice.
- ASP spends from the `Alice + ASP` cooperative path.
- ASP adds the output with the script `(Alice + ASP) or (Alice after 24h)`. This output is the [VTXO](#vtxo) of Alice.
- ASP signs the PSBT and sends it to Alice.
- Is now safe for Alice to broadcast his funding transaction because now she can leave anytime with Redeem transaction spending from `Alice in 24h` path.

| Inputs       | Outputs                                                     |
| ------------ | ----------------------------------------------------------- |
| Funding's UTXO | `(Alice + ASP) or (Alice after 24h)` |

</TabItem>
</Tabs>

### Forfeit transaction

- Insurance for the ASP, in case Alice tries to double spend her VTXO after spending it inside Ark
- Before the ASP funds Bob’s VTXO in the next Round transaction, he must receive this transaction signed by Alice
- Uses a connector from the next Round transaction to achieve atomicity

| Inputs                               | Outputs |
| ------------------------------------ | ------- |
| VTXO spending `Alice + ASP`          | `ASP`   |
| Connector from next Round transaction |

### Round transaction

- Funded by the ASP, creates VTXOs.
- Has at least two outputs:
  - A shared output with a VTXOs tree
  - A connectors output with a connectors tree
- A new transaction is periodically broadcasted by the ASP to create new VTXOs. 

| Inputs   | Outputs           |
| -------- | ----------------- |
| ASP UTXO | Shared output     |
|          | Connectors output |