---
sidebar_position: 3
title: 'Boarding the Ark'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="ark" label="Ark" default>

## Boarding Transaction (Non-interactive with Covenants)

The boarding transaction is a unique mechanism within the Ark protocol, leveraging covenants to enable a streamlined funding process for VTXOs (Virtual Transaction Outputs). This method allows Alice to fund a VTXO without requiring interactive steps with the ASP (Ark Service Provider), simplifying the initial funding phase and enhancing the efficiency of the protocol.

Alice initiates the process by creating a boarding transaction. This transaction includes an output that meets the necessary criteria to be accepted as a VTXO in future protocol rounds. The key feature here is the use of a covenant. A covenant in this context is a constraint applied to the transaction output that dictates specific conditions for future spending.

- **Mandatory Output Script**: The covenant enforces that the transaction must create an output with a specific script. This script aligns with the conditions of a VTXO, ensuring that the funds can be appropriately utilized in subsequent rounds.

The boarding transaction's primary role is to create VTXO depositing directly from Bitcoin onchain. Alice's UTXO (Unspent Transaction Output) is used as the input for this transaction. The output script structure includes two potential spending paths:

- **ASP Sweeps**: ASP can unlock the funds after a timeout period of 4 weeks.
- **Covenant Enforced Spending**: The funds MUST be sent to an output according to the covenant, ensuring the creation of a [VTXO](./concepts.md#vtxo) script:
  - `(Alice + ASP)` cooperatively, or
  - `Alice` alone after a 24-hour waiting period

| Inputs       | Outputs                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| Alice’s UTXO | `(ASP after 4w) or cov((Alice + ASP) or (Alice after 24h))`                 |

</TabItem>
<TabItem value="clark" label="clArk">

## Funding and Redeem Transactions (Interactive with PSBT)

In the clArk protocol, the process of funding and redeeming VTXOs is more interactive and involves the creation and sharing of PSBTs (Partially Signed Bitcoin Transactions) between Alice and the ASP. This method requires cooperation between Alice and ASP at multiple stages.

### Funding Transaction

#### 1. Creation of PSBT by Alice

Alice begins by creating a PSBT, adding any SegWit UTXO as an input. She then adds an output with the script `(Alice + ASP) or (ASP after 1 month)`. This PSBT is sent to the ASP for further processing.

| Inputs       | Outputs                                                     |
| ------------ | ----------------------------------------------------------- |
| Alice’s UTXO | `(Alice + ASP) or (ASP after 1 month)`                      |

### Redeem Transaction

#### 2. Creation of Redeem PSBT by ASP

The ASP takes the output from the funding transaction and creates a new PSBT. This PSBT spends from the cooperative path `(Alice + ASP)` and adds an output with the script `(Alice + ASP) or (Alice after 24h)`, setting up the conditions for the VTXO.

- **Cooperative Spending Path**: ASP signs the PSBT and sends it back to Alice.
- **Finalizing the Funding**: Alice now has a redeem transaction ready and can safely broadcast the initial funding transaction. She can leave anytime using the redeem transaction through the `Alice after 24h` path if necessary.

| Inputs            | Outputs                                                     |
| ----------------- | ----------------------------------------------------------- |
| Funding's UTXO    | `(Alice + ASP) or (Alice after 24h)`                        |

</TabItem>
</Tabs>
