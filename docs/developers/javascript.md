---
sidebar_position: 3
title: '📜 JavaScript (WASM)'
---

:::info
🚧 👷‍♀️ **Work in Progress** 👷‍♂️ 🏗️ The vanilla JavaScript version of our SDK is currently under development. You can use the WASM binary in the meantime compiled from the Go SDK. 
:::

## Installation

To use the Ark SDK WASM package in your web project, you need to include two files:

1. The WebAssembly file (`main.wasm`). Download from our [GitHub Releases](https://github.com/ark-network/ark/releases).
2. The JavaScript support file (`wasm_exec.js`). This file is provided by the Go project and can be found in the Go repository. You can download it from the [Go repository](https://github.com/golang/go/blob/master/misc/wasm/wasm_exec.js)

Once you have these files, you can include them in your project and start using the WASM package.

```html
    <script src="wasm_exec.js"></script>
    <script>
        const go = new Go();
        WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then((result) => {
            go.run(result.instance);
        });
    </script>
```

## Usage

Here's a quick overview of the main functions available in the WASM package:

```javascript
// Initialize the wallet
await init(walletType, clientType, aspUrl, privateKey, password, chain);

// Unlock the wallet
await unlock(password);

// Lock the wallet
await lock(password);

// Get balance
const balance = await balance(false);

// Onboard funds
const txID = await onboard(amount);

// Get receive addresses
const addresses = await receive();

// Send off-chain
const txID = await sendOffChain(false, [{ To: address, Amount: amount }]);

// Get configuration
const aspUrl = await getAspUrl();
const aspPubKeyHex = await getAspPubKeyHex();
const walletType = await getWalletType();
const clientType = await getClientType();
const roundLifetime = await getRoundLifetime();
const unilateralExitDelay = await getUnilateralExitDelay();
const minRelayFee = await getMinRelayFee();
```

## Example HTML

Here's a minimal HTML template to get you started with the Ark SDK WASM package assuming both `main.wasm` and `wasm_exec.js` are in the same directory of the `index.html` file

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ark SDK WASM Example</title>
    <script src="wasm_exec.js"></script>
    <script>
        const go = new Go();
        WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then((result) => {
            go.run(result.instance);
        });

        async function initWallet() {
            try {
                const chain = "bitcoin";
                const walletType = "singlekey";
                const clientType = "rest";
                const privateKey = document.getElementById("prvkey").value;
                const password = document.getElementById("password").value;
                const aspUrl = document.getElementById("aspUrl").value;
                
                await init(walletType, clientType, aspUrl, privateKey, password, chain);
                console.log("Wallet initialized and connected to ASP");
            } catch (err) {
                console.error("Init error:", err.message);
            }
        }

        async function getBalance() {
            try {
                const bal = await balance(false);
                console.log("Onchain balance:", bal.onchain_balance);
                console.log("Offchain balance:", bal.offchain_balance);
            } catch (err) {
                console.error("Balance error:", err.message);
            }
        }
    </script>
</head>
<body>
    <h1>Ark SDK WASM Example</h1>
    <div>
        <input type="text" id="aspUrl" placeholder="ASP URL">
        <input type="password" id="password" placeholder="Password">
        <input type="text" id="prvkey" placeholder="Private Key (optional)">
        <button onclick="initWallet()">Initialize Wallet</button>
    </div>
    <div>
        <button onclick="getBalance()">Get Balance</button>
    </div>
</body>
</html>
```

To use this example:

1. Save this HTML as `index.html` in your project directory.
2. Place `main.wasm` and `wasm_exec.js` in the same directory.
3. Serve the directory with a local web server (e.g., `python -m http.server`).
4. Open the HTML file in a web browser and interact with the Ark SDK through the browser console.

## Support

If you encounter any issues or have questions about the WASM package, please file an issue on our [GitHub repository](https://github.com/ark-network/ark/issues).

Happy coding with Ark and JavaScript! 🚀
