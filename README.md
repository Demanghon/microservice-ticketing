# Ticketing project

This project offers a hub to sell and buy tickets between users. It is based on a Microservices Architecture.

## Requirements

The stack is deployed on a Kubernetes cluster, so you need to have this tools installed to continue:
- [docker](https://www.docker.com/)
- [kind](https://kind.sigs.k8s.io/): you can use an another too to run Kubernetes as minikube, k3s or Kubernetes
- [skaffold](https://skaffold.dev/) to deploy the stack on kubernetes

## Configure the registry

We are using a docker local registry for this project. 

Execute the following commands to start the local registry:

```bash
docker run -d -p 5000:5000 --restart=always --name registry registry:2
```

> more information [here](https://docs.docker.com/registry/deploying/)

## Create and configure cluster

A script is available to create a cluster on kind and configure it:

```bash
bash infra/create-kind-cluster.sh
```

This script :
- configures an NGINX ingress
- Create a secret to store the JWT Key (we are using JWT for the authentication)
- Generate a self-signed certificate with [cert-manager](https://cert-manager.io/docs/)

> You can use an another tool to run kubernetes than kind but you have to assume the installation and the configuration of your cluster.
 
## Configure .env

The following projects use *.env* file as configuration:
- auth

The .env files are not commited for securtiy issue. However, each project has a sample.env file to help you to generate your own .env files corresponding at your configuration.

## Start the stack

During the development we use [skaffold](https://skaffold.dev/). To start the stack with skaffold execute this command:

```bash
skaffold dev
```

### Debug

To debug the application you can run the skaffold on [debug mode](https://skaffold.dev/docs/workflows/debug/) that use inspector protocol.

```bash
skaffold debug --auto-sync
```
A remote url is open to attach the VSCode debugger "**Auth NodeJS Code**" configured into the file *.vscode/lauch.json*.

We set **--auto-sync** flag to ensure the synchronization of change:

> One notable difference from skaffold dev is that debug disables image rebuilding and syncing as it leads to users accidentally terminating debugging sessions by saving file changes. These behaviours can be re-enabled with the --auto-build, --auto-deploy, and --auto-sync flags. 

