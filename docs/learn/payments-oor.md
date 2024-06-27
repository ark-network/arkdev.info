---
sidebar_position: 5
title: 'Payments OOR'
---

Rounds require user interaction and result in an on-chain transaction that must be confirmed before finalizing. This process can fail multiple times and retries are necessary. As seen in [Payments](./payments.md) page, the protocol allows users to spend their VTXOs more quickly by making instant payments by co-signing with ASP only, but delegating to the recipient the responsibility to claim the VTXO, which means to join an Ark [round](./concepts.md#rounds) to claim an actual VTXO. This enables the ASP to postpone the liquidity requirement as long the recipient is comfortable in holding a payment that can be reverted by the sender, up to the very end of the expiration of the original VTXO that th sender is spending.
But why stopping here and not allowing the recipient to make another payment to someone else, without joining a round ever?

## Out-of-Round Payments

To allow users to spend their VTXOs more quickly and without liquidity requirements, out-of-round (OOR) payments enable participants to make instant payments directly from one party to another without waiting for an Ark round.
OOR payments are co-signed by the ASP. Users **trust that the ASP and sender won't collude** for a double spend. The recipient can either rely on the ASP's reputation and keep the OOR VTXO or choose to convert it into a regular VTXO in the next Ark round for added security.

## Timeline

1. **Alice wants to send bitcoin to Bob:** Alice asks the ASP to spend from her [VTXO](./concepts.md#vtxo).
2. **Creating the OOR Transaction:** This transaction spends from the [forfeit](./concepts.md#forfeit-transaction) path of the VTXO, which is a cooperative path between Alice and ASP, and creates an actual [VTXO](./concepts.md#vtxo) output that can be spent by Bob alone.
3. **Bob can spend the VTXO:** Bob can spend the OOR VTXO at any time without needing to join an Ark round. The OOR VTXO is a regular VTXO and can be spent like any other VTXO created in an Ark round.

![Ark Payment OOR](/img/OOR.png)
