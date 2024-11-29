---
sidebar_position: 2
title: 'Boarding the Ark'
---


## Boarding Transaction 

The boarding transaction is a streamlined funding process for VTXOs (Virtual Transaction Outputs). This method allows Alice to swap onchain funds to VTXO(s) without requiring interactive steps with the Server, simplifying the initial funding phase and enhancing the efficiency of the protocol.

Alice initiates the process by creating a taproot **boarding address**. The key-path is disabled and the script tree includes two spending contidions:
- **Redeem path**: Alice can unlock the funds after a timeout period of 6 months.
- **Collaborative path**: Alice and the Server cooperate to spend the funds.

| Inputs       | Outputs                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| Alice’s UTXO | `(Alice after 6 months) or (Alice + Server)`                                         |

## Join the Ark

Once the boarding transaction is confirmed onchain, Alice can join the Ark by submitting the UTXO to the Server, that in exchange creates a VTXO for her in next VTXO tree. The boarding UTXO is included as input of the round transaction and co-signed by Alice and Server using the collaborative path.

:::note
Before including the UTXO in the round, the Server verifies that the UTXO is not spendable by Alice alone. The exit path must be invalid according to the exit timeout.
:::

## Exit the boarding contract

### Unilateral

After the boarding transaction is confirmed, Alice can exit the boarding contract by spending alone the UTXO with the redeem path. However, the this path is only valid after the timeout period of 6 months. After the timeout, Alice can spend the UTXO without the Server's cooperation.

### Collaborative

If Alice wants to exit the boarding contract before the timeout, she can [swap her boarding UTXO for a UTXO instead of a VTXO](./leaving.md#cooperative-exit) by spending in cooperation with the Server with the collaborative path.