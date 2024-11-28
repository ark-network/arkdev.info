---
sidebar_position: 3
title: 'Boarding the Ark'
---


## Boarding Transaction 

The boarding transaction is a streamlined funding process for VTXOs (Virtual Transaction Outputs). This method allows Alice to swap onchain funds to VTXO(s) without requiring interactive steps with the Server, simplifying the initial funding phase and enhancing the efficiency of the protocol.

Alice initiates the process by creating a taproot **boarding address**. The key-path is disabled and the script tree includes two potential spending paths:
- **Alice exit**: Alice can unlock the funds after a timeout period of 6 months.
- **Multi-signature with Server**: Alice and the Server cooperate to spend the funds.

| Inputs       | Outputs                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| Alice’s UTXO | `(Alice after 6 months) or (Alice + Server)`                                         |

## Join the Ark

Once the boarding transaction is confirmed on the main chain, Alice can join the Ark by submitting the UTXO to the Server. The latter then includes the UTXO as input of a round transaction and co-sign it with Alice using the multi-signature path.

:::note
Before including the UTXO in the round, the Server verifies that the UTXO is not spendable by Alice alone. The exit path must be invalid according to the exit timeout.
:::

## Exit the boarding contract

### Unilateral

After the boarding transaction is confirmed, Alice can exit the boarding contract by spending the UTXO with the exit path. However, the exit path is only valid after the timeout period of 6 months. After the timeout, Alice can spend the UTXO without the Server's cooperation.

### Collaborative

If Alice wants to exit the boarding contract before the timeout, she can [join a round with onchain output](./leaving.md#cooperative-exit), the Server will include the output in the round transaction and co-sign the boarding UTXO.