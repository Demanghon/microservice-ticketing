#!/usr/bin/env bash

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd -P)

usage() {
  cat << EOF # 

Usage: create-kind-cluster

Create a cluster with kind (https://kind.sigs.k8s.io/) and configure ingress NGINX. 

WARNING: This script doesn't assume the installation of kind.

Available options:

-h, --help      Print this help and exit

...
EOF
  exit
}

msg() {
  echo >&2 -e "${1-}"
}

die() {
  local msg=$1
  local code=${2-1} # default exit status 1
  msg "$msg"
  exit "$code"
}

parse_params() {
  # default values of variables set from params
  flag=0
  param=''

  while :; do
    case "${1-}" in
    -h | --help) usage ;;
    -?*) die "Unknown option: $1" ;;
    *) break ;;
    esac
    shift
  done

  args=("$@")

  return 0
}

parse_params "$@"

echo "Creating kind cluster"
cat <<EOF | kind create cluster --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
EOF

echo "Configuring ingress nginx"
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
echo "Installing cert-manager"
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.6.1/cert-manager.yaml
echo "Generate JWT_KEY"
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=$(date +%s | sha256sum | base64 | head -c 32)
echo "Generate MONGO configuration"
kubectl create secret generic mongo-secret --from-literal=PASSWORD=adminPassword