---
authors: [altafan]
description: A new VTXO Tree signing scheme that allows the server to unlock liquidity before a round expiration.
image: /img/blog/unlock-liquidity.jpg
slug: unlock-liquidity-before-shared-output-expiration
tags: [ark, bitcoin, layer2, blockchain, vtxo, liquidity]
title: "Unlocking Liquidity Before Shared Output Expiration"
---
![Tree with branches](/img/blog/unlock-liquidity.jpg)

Building on [insights from Brandon Black](https://x.com/reardencode/status/1667968763927592960), we present a generalized method for Ark clients to collaborate with Ark Servers to release liquidity ahead of the expiration of the shared output that commits to a **Virtual Tree of Bitcoin transactions** kept off the chain, also known as **VTXOs (Virtual Transaction Outputs)** tree.

Early unlocking of liquidity not only enhances Servers' liquidity but also benefits all participants in the Ark protocol.

<!-- truncate -->

## The Evolution of the VTXO Tree Signing Process

### The Current implementation

In the current VTXO tree signing process, all senders in a round sign every transaction within the tree using ephemeral keys. This was essential when users were required to join rounds to send funds to receivers, ensuring that receivers didn’t have to be online to sign transactions. The use of ephemeral keys during the signing process was promoted to minimize the risk of double-spending shared outputs intended for receivers.

![Current VTXO Tree Signing](https://gist.github.com/user-attachments/assets/3e50c4b0-40e9-4ea3-8fb1-44256d14e530)

- **Signatures Required**: Each participant signs (2n - 1) transactions, where n is the number of participants.
- **Ephemeral Keys**: Participants sign with ephemeral keys (A’, B’, etc.).

### The Shift to Out-of-Round (OOR) Transactions

With the introduction of Out-of-Round transactions, users no longer need to join rounds to send funds. Instead, they participate in rounds primarily to settle or refresh their own VTXOs, acting as both senders and receivers. This eliminates the need for the extensive trust mechanisms previously required between senders and receivers, rendering the use of ephemeral keys and signing all transactions in the tree unnecessary.

### The New Simplified VTXO Tree Signing Process

We propose a streamlined VTXO tree signing process where users sign only their specific branches using the keys of their wallets, eliminating the need for ephemeral keys. In this optimized approach, each transaction in the tree is signed exclusively by the participants whose VTXOs are descendants of that transaction in the tree hierarchy, rather than requiring signatures from all participants. This method maintains security because the server still requires collaboration from some or all users to double-spend a shared output of the VTXO tree, effectively preserving the system's integrity while significantly reducing the signing overhead.

![New VTXO Tree Signing](https://gist.github.com/user-attachments/assets/4f69b6e8-6bf4-4e72-9cd2-8c989e0e55c3)

- **Signatures Required**: Each participant now only needs to sign log₂(n) transactions.
- **No Ephemeral Keys**: The use of ephemeral keys is no longer necessary.
- **Security Maintained**: The server cannot double-spend a shared output without the explicit consent of all underlying participants.

This simplified process empowers the server to regain liquidity allocated for a round — either fully or partially — before the shared outputs naturally expire. This is achieved through user collaboration after they've spent their VTXOs and can be incentivized in different ways.

## How It Works

- **User Collaboration**: In case two sibling VTXOs are spent out of round and the receivers settled their funds, the senders can collaborate with the server to double-spend their shared output, effectively unlocking liquidity earlier.
- **Controlled Unrolling**: The server may start unrolling a VTXO tree to sweep a shared output.

![Anticipated Sweep](https://gist.github.com/user-attachments/assets/572a5bfc-73c0-4964-8d7d-636cc1cd0ce9)

In this example, users A and B spent their VTXOs (VTXO_A, VTXO_B) so server asks for their collaboration to double-spend and sweep their shared output (SO'). Once the server collected both signatures, he starts unrolling the tree to broadcast the transaction that sweeps SO'.

## Benefits of the proposal

### Pros

- **Reduced signing overhead**: Users sign far fewer transactions when joining a round, thus reducing the amount of data exchanged in the process 
- **Efficient Liquidity**: Servers can adopt strategies to group high-value VTXOs, allowing for partial sweeps and better liquidity allocation.
- **Win-Win**: Users are rewarded by the server for participating in the early unlocking of liquidity

### Cons

- **Potential for Collusion**: Users could theoretically collude with the server to sweep shared outputs before the receivers of the OOR txs settled their funds. However, this risk isn’t new; similar issues exist with OOR itself -- user and server can collude to double-spend a VTXO spent out of round before the receiver's settlement. The inherent trust dynamics between parties remain unchanged.

## Conclusion

Such optimizations illustrate Ark's evolving properties. After spending more time with the protocol, we believe its early iterations were only a stepping stone for future, more optimized, implementations. While the method we've shared in this post is by no means groundbreaking, it is only one example of the protocol's versatile nature.

By simplifying the VTXO tree signing process and incentivizing users to participate in liquidity unlocking, we create a more efficient and user-friendly platform. We’re excited about the possibilities this opens up and look forward to your participation in making Ark even better.

## Credits

The core concept behind this optimization was originally proposed by [@reardencode](https://x.com/reardencode) in a Twitter thread. We've built upon and expanded this idea.

Stay tuned for more updates, and don’t hesitate to reach out with any questions or feedback.
