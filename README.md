# BitByBit

A production-deployed full-stack enterprise application demonstrating event-driven microservices architecture on Kubernetes.

**Live:** [bitbybit.hialt.dev](https://bitbybit.hialt.dev)

---

## Overview

BitByBit is a full-stack enterprise application designed to manage complex data lifecycles with strict audit requirements. It leverages a modern microservices-inspired architecture where a Java/Spring Boot backend coordinates with Apache Kafka for decoupled event processing, MongoDB for flexible document storage, and a React/TypeScript frontend for real-time visibility.

The system is fully containerized and orchestrated on a k3s Kubernetes cluster, utilizing Strimzi Kafka operators and Cloudflare Tunnels to mirror production-grade DevOps environments.

A Note on the Project's Origin
BitByBit was inspired by a personal experience with a loved one living with dementia. The intended audience includes both people experiencing memory issues and their partners and caretakers.
The vision is simple: a place where curated photographs with gentle captions can help surface familiar moments — not to restore what's lost, but to offer brief reconnection with a life well lived. The project's name came from a conversation with her husband, who described watching her fade as losing her bit by bit.
Every UI and design decision was made with that audience in mind — clarity over complexity, calm over noise, accessibility over feature density.


---

## Architecture

```
Browser
    └── Cloudflare Tunnel (Zero-Trust Ingress — no open ports)
            ├── BitByBit Frontend (React 18 / TypeScript / Vite)
            │       └── JWT-authenticated API calls
            └── BitByBit Backend (Java 17 / Spring Boot 3.x)
                    ├── REST Controllers  — JWT / OAuth2 secured
                    ├── Kafka Producer    — audit & event stream
                    ├── Kafka Consumer    — async audit persistence
                    ├── MongoDB Service   — BSON schema-validated storage
                    └── Seq Logger        — CLEF structured log shipping
```

---

## Technical Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.x, Spring Security (JWT/OAuth2) |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Messaging | Apache Kafka (Strimzi Operator, KRaft mode) |
| Database | MongoDB 7.0 (Atlas / Local-Path Provisioner) |
| Networking | Cloudflare Tunnel (Tunnel-as-Code) |
| Logging | Seq (Structured CLEF format over HTTP) |
| Orchestration | k3s Kubernetes, Kustomize, Traefik Ingress |
| CI/CD | GitHub Actions (Docker multi-stage builds) |
| Security | JWT, Spring Security RBAC, OAuth2, TLS, SOX-aware design |

---

## Key Design Decisions

### Event-Driven Audit Integrity
Every significant state change is published to a Kafka topic before the HTTP response is returned. A dedicated consumer processes these events asynchronously and persists structured audit records to MongoDB. Audit logs are decoupled from primary transactions — they cannot be suppressed by application errors or database contention.

### Schema-First MongoDB Validation
Rather than treating MongoDB as schemaless, BitByBit enforces strict BSON JSON Schema Validation at the database level. Every document — Users, Events, Audit Logs — adheres to a versioned contract enforced by the database engine, not the application layer. Migration scripts manage schema evolution.

### Zero-Trust Ingress with Cloudflare Tunnel
The application is exposed via a Cloudflare Tunnel, eliminating the need for open inbound ports on the cluster. No load balancer, no public IP. Traffic is authenticated and routed at the Cloudflare edge before it reaches the cluster — the same pattern used in zero-trust enterprise network architectures.

### Resilient Structured Logging with PVC
Seq is configured with Persistent Volume Claims on k3s ensuring structured telemetry and audit logs survive pod restarts and cluster maintenance. CLEF-format JSON logs ship over HTTP from both the backend and the Rust foxwatch service on the same cluster — queryable from a single Seq dashboard.

### Contract-Driven Frontend
The React frontend uses shared TypeScript interfaces derived directly from the backend's domain models. Type safety is enforced across the network boundary — API response shapes are validated at compile time, not discovered at runtime. This pattern surfaces integration bugs before deployment.

### Staging / Production Namespace Isolation
Both backend and frontend are deployed to isolated `staging` and `production` namespaces on the same k3s cluster using Kustomize overlays. Each namespace has independent deployments, services, and config — rolling updates to staging never affect production.

---

## Project Structure

This repository is a public showcase focused on architecture and infrastructure. Implementation source is intentionally omitted.

```
bitbybit/
├── backend/
│   ├── Dockerfile              — Multi-stage Spring Boot build
│   ├── k8s/
│   │   ├── base/               — Deployment, Service, Ingress, Kafka cluster manifests
│   │   ├── staging/            — Staging namespace kustomization
│   │   └── production/         — Production namespace kustomization
│   ├── database/
│   │   ├── migrations/         — Versioned MongoDB migration scripts
│   │   └── schema/             — BSON validation documentation
│   └── docs/
│       └── bitbybit-cluster-runbook.md
├── frontend/
│   ├── Dockerfile              — Nginx-based production image
│   ├── k8s/
│   │   ├── base/
│   │   ├── staging/
│   │   └── production/
│   └── src/
│       └── types/              — TypeScript contract interfaces
└── .github/
    └── workflows/
        ├── ci-backend.yml      — Java build, test, Docker
        └── ci-frontend.yml     — Node build, lint, Docker
```

---

## Kubernetes Deployment

Both backend and frontend deploy to staging and production namespaces using Kustomize:

```bash
# Backend — staging
kubectl apply -k backend/k8s/staging/
kubectl rollout status deployment/bitbybit-deployment -n staging

# Frontend — staging
kubectl apply -k frontend/k8s/staging/
kubectl rollout status deployment/bitbybit-frontend -n staging
```

Running pods on the cluster (representative):

```
NAMESPACE    NAME                                    READY   STATUS
production   bitbybit-deployment-65fb6b764-2w8cs     1/1     Running
production   bitbybit-frontend-65476568f4-jdgw7      1/1     Running
staging      bitbybit-deployment-75f5f888f8-nbv78    1/1     Running
staging      bitbybit-frontend-f889c6c84-qmgh8       1/1     Running
kafka        bitbybit-kafka-combined-0                1/1     Running
kafka        kafka-ui-6677fcfbcf-sdzxg               1/1     Running
default      mongodb-69dfdcfc75-8vrsm                1/1     Running
default      seq-6c85dcbd57-7vxns                    1/1     Running
default      cloudflared-655f8dddd6-6h66b            1/1     Running
```

---

## Data Model

Three core domain entities with enforced BSON schema validation:

**Users** — Authentication, roles, profile data. Schema enforces required fields, type constraints, and index uniqueness at the database level.

**Events** — Business domain events with full lifecycle tracking. Kafka-backed — every state transition is published before acknowledgement.

**Audit Logs** — Immutable append-only records produced by the Kafka consumer. Captures actor, action, timestamp, and before/after state for every significant operation.

---

## CI/CD Pipeline

GitHub Actions pipelines for both services:

**Backend CI:**
1. Maven build and test
2. JaCoCo coverage report
3. SonarQube-style static analysis
4. Docker multi-stage image build

**Frontend CI:**
1. Node/npm install
2. ESLint
3. TypeScript compile check
4. Docker image build

---

## Author

Robert Glasser — [hialt.dev](https://hialt.dev)
