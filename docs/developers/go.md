---
sidebar_position: 2
title: '🐹 Go'
---

Welcome to the client-facing Go SDK for Ark! This SDK provides a simple way to integrate Ark functionality into your Go applications.

## Documentation

The complete API documentation for the Go SDK is automatically generated and published on [pkg.go.dev](https://pkg.go.dev) with each GitHub release. This ensures that you always have access to the most up-to-date documentation for the version you're using.

To view the documentation, visit: [https://pkg.go.dev/github.com/ark-network/ark-sdk](https://pkg.go.dev/github.com/ark-network/ark-sdk)

## Installation

To install the Ark Go SDK, use the following command:

```bash
go get github.com/ark-network/ark-sdk
```

## Usage

Here's a quick overview of the classic lifecycle flows using the Ark Go SDK:

### 1. Create or Restore Wallet

```go
import (
    arksdk "github.com/ark-network/ark-sdk"
    inmemorystore "github.com/ark-network/ark-sdk/store/inmemory"
)

func setupArkClient() (arksdk.ArkClient, error) {
    storeSvc, err := inmemorystore.NewConfigStore()
    if err != nil {
        return nil, fmt.Errorf("failed to setup store: %s", err)
    }
    client, err := arksdk.NewCovenantClient(storeSvc)
    if err != nil {
        return nil, fmt.Errorf("failed to setup ark client: %s", err)
    }

    if err := client.Init(context.Background(), arksdk.InitArgs{
        WalletType: arksdk.SingleKeyWallet,
        ClientType: arksdk.GrpcClient,
        AspUrl:     "localhost:8080",
        Password:   "password",
    }); err != nil {
        return nil, fmt.Errorf("failed to initialize wallet: %s", err)
    }

    return client, nil
}

// Unlock the wallet
if err := arkClient.Unlock(ctx, password); err != nil {
    log.Fatal(err)
}
defer arkClient.Lock(ctx, password)
```

### 2. Receive Funds

```go
// Get receiving address
offchainAddr, onchainAddr, err := arkClient.Receive(ctx)
if err != nil {
    log.Fatal(err)
}

// Check balance
balance, err := arkClient.Balance(ctx, false)
if err != nil {
    log.Fatal(err)
}
log.Infof("Onchain balance: %d", balance.OnchainBalance.SpendableAmount)
log.Infof("Offchain balance: %d", balance.OffchainBalance.Total)
```

### 3. Onboard Funds

```go
onboardAmount := uint64(20000)
txid, err := arkClient.Onboard(ctx, onboardAmount)
if err != nil {
    log.Fatal(err)
}
log.Infof("Onboarded with tx: %s", txid)
```

### 4. Send Offchain

```go
amount := uint64(1000)
receivers := []arksdk.Receiver{
    arksdk.NewLiquidReceiver(recipientOffchainAddr, amount),
}

txid, err = arkClient.SendOffChain(ctx, false, receivers)
if err != nil {
    log.Fatal(err)
}
log.Infof("Payment completed in round tx: %s", txid)
```

## Support

If you encounter any issues or have questions, please file an issue on our [GitHub repository](https://github.com/ark-network/ark-sdk/issues).

Happy coding with Ark and Go! 🚀

## Full Example

For a complete end-to-end example demonstrating the usage of the Ark Go SDK, including setting up multiple clients, onboarding, and transferring funds, please refer to our [GitHub repository](https://github.com/ark-network/ark-sdk/examples/covenant_example.go).