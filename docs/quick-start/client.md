---
sidebar_position: 4
title: 'Use the Client'
---

This guide demonstrates how to use the Ark client for two users, Alice and Bob, focusing primarily on Alice's actions with some interactions from Bob.

## Setting Up Alice and Bob's Clients

First, let's set up instances of the Ark client for both Alice and Bob:

```sh
# Set up Alice's alias
alias ark-alice='ark --datadir ./alice-tmp'

# Set up Bob's alias
alias ark-bob='ark --datadir ./bob-tmp'

# Initialize Alice's client
ark-alice init --password alicesecret --asp-url localhost:7070 --network regtest --explorer http://localhost:3000

# Initialize Bob's client
ark-bob init --password bobsecret --asp-url localhost:7070 --network regtest --explorer http://localhost:3000
```

## 1. Get On-chain Addresses

### Alice gets her address

```sh
ark-alice receive
```

### Bob gets his address

```sh
ark-bob receive
```

Both commands will output their respective off-chain and on-chain addresses.

## 2. Fund Alice's On-chain Wallet

Use the Nigiri faucet to fund Alice's on-chain wallet:

```sh
nigiri faucet <alice_onchain_address>
```

Check Alice's balance:

```sh
ark-alice balance
```

## 3. Alice Onboards

Move funds from on-chain to off-chain for Alice:

```sh
ark-alice onboard --amount 50000
```

Verify Alice's updated balance:

```sh
ark-alice balance
```

## 4. Off-chain Transactions

### Alice sends to Bob

```sh
ark-alice send --password alicesecret --to <bob_offchain_address> --amount 15000
```

### Bob claims all the pending payments

```sh
ark-bob claim --password bobsecret
```

## 5. Check Balances

After these transactions, check both balances:

```sh
ark-alice balance
ark-bob balance
```

## 6. Alice's Collaborative Exit

Alice redeems some funds back to on-chain:

```sh
ark-alice redeem --password alicesecret --amount 10000
```

Check Alice's updated balance:

```sh
ark-alice balance
```

## 7. Alice's Unilateral Exit

If needed, Alice can force all her VTXOs to exit on-chain:

```sh
ark-alice redeem --force
```

Verify Alice's final balance:

```sh
ark-alice balance
```

This guide demonstrates how Alice can interact with the Ark network, including sending a payment to Bob and managing her on-chain and off-chain balances. It also shows how Bob can claim a received payment.