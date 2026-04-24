# BitByBit Cluster Runbook
> Recreate the staging and production namespaces from scratch. All manifests live in git — this covers secrets, manual steps, and verification commands only.

---




## Prerequisites

- kubectl configured and pointing at the cluster
- GitHub PAT with `read:packages` and `write:packages` scopes
- Cloudflare Zero Trust tunnel already configured (see tunnel token below)

---

## 1. Create namespaces

```bash
kubectl create namespace staging
kubectl create namespace production
```

---

## 2. GHCR image pull secret (both namespaces)

```bash
for NS in staging production; do
  kubectl create secret docker-registry ghcr-secret \
    --docker-server=ghcr.io \
    --docker-username=rocketmclosth \
    --docker-password=<YOUR_GITHUB_PAT> \
    --namespace=$NS
done
```

---

## 3. App secrets (both namespaces)

```bash
for NS in staging production; do
  kubectl create secret generic bitbybit-secrets \
    --from-literal=mongodb-uri='<MONGODB_CONNECTION_STRING>' \
    --from-literal=aes-key='<AES_ENCRYPTION_KEY>' \
    --namespace=$NS
done
```

---

## 4. Cloudflare tunnel token (both namespaces)

```bash
for NS in staging production; do
  kubectl create secret generic tunnel-token \
    --from-literal=token='<CLOUDFLARE_TUNNEL_TOKEN>' \
    --namespace=$NS
done
```

---

## 5. Deploy via kustomize

```bash
# Staging
cd ~/IdeaProjects/bitbybit-service
kubectl apply -k k8s/staging

# Production
kubectl apply -k k8s/production
```

---

## 6. Verify rollout

```bash
kubectl rollout status deployment/bitbybit-deployment -n staging --timeout=180s
kubectl rollout status deployment/bitbybit-deployment -n production --timeout=180s
```

---

## 7. Verify pods are running

```bash
kubectl get pods -n staging
kubectl get pods -n production
```

Expected in each namespace:
- `bitbybit-deployment-*` 1/1 Running
- `bitbybit-frontend-*` 1/1 Running
- `cloudflared-*` (x2) 1/1 Running

---

## 8. Verify images

```bash
kubectl get pod -n staging -l app=bitbybit \
  -o jsonpath='{.items[0].spec.containers[0].image}'
# expected: ghcr.io/rocketmclosth/bitbybit-backend:staging

kubectl get pod -n production -l app=bitbybit \
  -o jsonpath='{.items[0].spec.containers[0].image}'
# expected: ghcr.io/rocketmclosth/bitbybit-backend:latest
```

---

## 9. Smoke test

```bash
# Staging
curl https://bitbybit-staging.hialt.dev/actuator/health
# expected: {"status":"UP",...}

# Production
curl https://bitbybit.hialt.dev/actuator/health
# expected: {"status":"UP",...}
```

---

## Pipeline triggers

| Branch | Environment | How to trigger |
|--------|-------------|----------------|
| `dev`  | staging     | Push or merge PR to `dev` |
| `main` | production  | Merge PR from `dev` to `main` |

---

## Monitoring in k9s

```bash
k9s -n staging      # watch staging namespace
k9s -n production   # watch production namespace
```

Inside k9s: press `0` to see all namespaces. Press `l` on a pod to view logs.

---

## Force redeploy without a code change

```bash
kubectl rollout restart deployment/bitbybit-deployment -n staging
kubectl rollout restart deployment/bitbybit-deployment -n production
```

---

## Clean up dead pods (kafka or elsewhere)

```bash
kubectl delete pods -n kafka --field-selector=status.phase!=Running
```
