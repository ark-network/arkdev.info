---
sidebar_position: 2
title: 'Requirements'
---
### Install Docker

- For Mac users, download and install [OrbStack for Mac](https://orbstack.dev/).
- For Linux users, download and install [Docker](https://docs.docker.com/desktop/install/linux-install/). With the convenience script, you can install Docker on Linux with the following commands:

```sh
curl -fsSL https://get.docker.com -o get-docker.sh | sudo sh
```

### Install Nigiri Bitcoin

```sh
curl https://getnigiri.vulpem.com | bash
```

Run Bitcoin RegTest with Nigiri:

```sh
nigiri start
```