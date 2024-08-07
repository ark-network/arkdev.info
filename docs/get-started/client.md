---
sidebar_position: 4
title: 'Use the Client'
---

### Create the Wallet

```sh
ark init --password secret --asp-url localhost:6060 --network regtest --explorer http://localhost:3000
```

> You can change the `--password` to whatever you want, but remember it for the next steps.

### Get an on-chain address

```sh
ark receive
# {
#   "offchain_address": "...",
#   "onchain_address": "...",
# }
```

### Fund the on-chain wallet

```sh
nigiri faucet <onchain_adress>

# You can check the on-chain and off-chain balance
ark balance
```

### Onboard

```sh
ark onboard --amount 21000

# You can check the on-chain and off-chain balance
ark balance
```

### Send offchain (to your-self)

You can self-transfer 15000 sats offchain.

```sh
ark send --password secret --to <offchain_address> --amount 15000
```

You can claim all the pending payments offchain before the spent VTXOs expire with the `claim` command. Until you claim a payment, it could be reverted by the sender at any time. 

```sh
ark claim --password secret 
```

> PS: being a self-transfer, it's not necessary to claim the payment, but if its a external payment, you must claim it to be enforceable unilaterally and commited in a VTXO tree.

### Collaborative exit

```sh
ark redeem --password secret --amount 10000

# You can check the on-chain and off-chain balance
ark balance
```

### Unilateral exit

This command will unilateral exit onchain all the [VTXO]s(../learn/concepts.md#vtxo) that you have in the offchain wallet.

```sh
ark redeem --force

# You can check the on-chain and off-chain balance
ark balance
```
