# Ticketing project

This project offers a hub to sell and buy tickets between users. It is based on a Microservices Architecture.

## Deployement

The deployment of services is based on Kubernetes. 

### Registry

We are using a docker local registry for this project. 

Execute the following commands to start the local registry:

```bash
docker run -d -p 5000:5000 --restart=always --name registry registry:2
```

> more information [here](https://docs.docker.com/registry/deploying/)

## Kind

We are using [kind(https://kind.sigs.k8s.io/)] as local Kubernetes. To install it you can follow [these instructions](https://kind.sigs.k8s.io/docs/user/quick-start/).

After you can run the script infra/create-kind-cluster.sh to configure the cluster with Ingress NGINX.

```bash
bash infra/create-kind-cluster.sh
```

### Another tool

You can use another tool to run Kubernetes as k3s, microk8s or minikube. You have to assume to install Ingress NGINX as ingress controller. 

## Development

During the development we use (skaffold)[https://skaffold.dev/]. To start the stack with skaffold execute this command:

```bash
skaffold dev
```

### DEBUG

To debug the application you can run the skaffold on [debug mode](https://skaffold.dev/docs/workflows/debug/) that use inspector protocol.

```bash
skaffold debug
```

A remote url is open to attach the VSCode debugger "Auth NodeJS Code".