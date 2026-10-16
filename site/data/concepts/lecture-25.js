window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 25,
  title: "Service Mesh",
  category: "Service Patterns",
  tagline: "A sidecar next to every process — mTLS, retries, and metrics — without rewriting the service.",
  summary: "A service mesh moves network policy out of application code and into a proxy that runs beside each instance. The proxy (the data plane) does mutual TLS, retries, and telemetry. A control plane pushes the policy. You adopt it when many services need the same secure, observable network and you are tired of each team shipping its own HTTP client. You skip it when you have a handful of services and a gateway is enough.",

  theory: [
    {
      heading: "The sidecar is the network stack you did not write",
      body: "Each pod or host runs the service and a <b>sidecar proxy</b>. The service sends traffic to localhost; the proxy forwards it, presents certificates, and records latency. The application still thinks it is calling <code>orders:8080</code>. It does not contain the retry loop, the certificate rotation, or the metric exporter. That split is the whole idea: policy changes ship as mesh config, not as a library upgrade in forty repos.",
      bullets: [
        "Data plane: the proxies that touch packets.",
        "Control plane: the place you declare retries, timeouts, and which services may talk.",
        "Istio, Linkerd, and Consul are products. The pattern is the sidecar plus policy."
      ]
    },
    {
      heading: "mTLS without a ticket in every service",
      body: "Service-to-service calls on a flat network are anonymous. <b>Mutual TLS</b> means both sides present certificates, so orders knows it is really payments and not a laptop on the VPN. The mesh issues and rotates those certificates. Application code keeps using HTTP. You still do user-level auth in the gateway or the service — mesh identity is the workload, not the end user.",
      bullets: [
        "Workload identity: this process is payments.",
        "User identity: this token is Ada. Different question, still yours to answer.",
        "A policy can say only the order service may call the payment admin port."
      ]
    },
    {
      heading: "Retries and telemetry, with the same warning as always",
      body: "The mesh can retry a failed call, time it out, and emit the golden signals (rate, errors, duration) without a custom interceptor. Blind retries are still dangerous. A retried <code>POST /charge</code> that is not idempotent double-charges, whether the retry lives in your code or in Envoy. Use mesh retries for idempotent reads, or for writes you have already made safe.",
      bullets: [
        "Timeouts belong in the mesh so one slow callee cannot hold every thread.",
        "Circuit breaking can live here too: stop calling a host that is failing.",
        "Traces need the mesh to forward headers, or the span breaks at the sidecar."
      ]
    },
    {
      heading: "When the mesh is overhead",
      body: "Every call gains a hop through the proxy, and you operate a control plane. Three services behind one gateway do not need that. A mesh pays off when certificate rotation, per-route timeouts, and \"who may call whom\" are being reimplemented badly in each codebase. Start at the edge. Add the mesh when the east-west rules are the thing you keep getting wrong."
    }
  ],

  keyTerms: [
    { term: "Sidecar", def: "A proxy process deployed next to the app. Traffic is redirected through it." },
    { term: "Data plane", def: "The proxies that move bytes, terminate mTLS, and emit metrics." },
    { term: "Control plane", def: "The API that distributes routes, retries, and certificates to the proxies." },
    { term: "mTLS", def: "TLS where both client and server present certificates, so workloads authenticate each other." },
    { term: "Workload identity", def: "Who the process is (orders, payments), as opposed to which end user called." }
  ],

  tradeoffs: [
    { pro: "mTLS and metrics land without a library bump in every repo.", con: "You debug two processes per pod, and misrouted iptables look like application bugs." },
    { pro: "Policy is data: change a timeout without a product deploy.", con: "A bad policy rolls out to every sidecar at once." },
    { pro: "Consistent retries and traces across languages.", con: "An extra hop adds latency, and retries can duplicate a non-idempotent write." },
    { pro: "Service-to-service auth is finally uniform.", con: "A mesh is too much machinery for a few services and one team." }
  ],

  interviewTips: [
    "Separate data plane and control plane in the first sentence.",
    "mTLS identifies the workload. The user token is still the application's job.",
    "Say you will not retry a charge from the mesh unless the charge is idempotent.",
    "Admit the cost: another hop, another control plane. Recommend it only when many services need the same policy.",
    "Name a product if you have used one, then describe the pattern so the answer survives a different vendor."
  ],

  scene: {
    nodes: [
      { id: "orders", label: "Orders", type: "service", pos: [-6, 0, 0] },
      { id: "sideA", label: "Sidecar A", type: "gateway", pos: [-2.2, 0, 0] },
      { id: "sideB", label: "Sidecar B", type: "gateway", pos: [2.2, 0, 0], showAt: 1 },
      { id: "pay", label: "Payments", type: "service", pos: [6, 0, 0], showAt: 1 },
      { id: "ctrl", label: "Control plane", type: "worker", pos: [0, 0, 4], showAt: 2 },
      { id: "n0", label: "mTLS between proxies", type: "note", pos: [0, 0, -6], showAt: 1 },
      { id: "n1", label: "App speaks localhost", type: "note", pos: [-8, 0, -6] }
    ],
    edges: [
      { from: "orders", to: "sideA", label: "localhost" },
      { from: "sideA", to: "sideB", label: "mTLS", showAt: 1 },
      { from: "sideB", to: "pay", showAt: 1 },
      { from: "ctrl", to: "sideA", label: "policy", showAt: 2, dashed: true },
      { from: "ctrl", to: "sideB", showAt: 2, dashed: true }
    ],
    steps: [
      {
        title: "The app does not dial the network",
        text: "Orders calls what it thinks is payments. The packet is redirected to the local sidecar. Certificate code is not in the order service.",
        highlight: ["orders", "sideA", "n1"],
        flows: [{ from: "orders", to: "sideA", color: "#60a5fa", label: "local" }]
      },
      {
        title: "Proxies authenticate each other",
        text: "Sidecar A presents orders' certificate. Sidecar B presents payments'. Both sides must match. A random host on the network cannot impersonate payments.",
        highlight: ["sideA", "sideB", "pay", "n0"],
        flows: [{ from: "sideA", to: "sideB", color: "#4ade80", label: "mTLS" }]
      },
      {
        title: "Policy comes from the control plane",
        text: "Timeouts, retries, and \"orders may call payments\" are pushed to both sidecars. Changing them does not require an orders deploy.",
        highlight: ["ctrl", "sideA", "sideB"],
        flows: [{ from: "ctrl", to: "sideA", color: "#fb923c", label: "config" }]
      },
      {
        title: "Retries stay inside the rule",
        text: "The sidecar can retry a failed GET. A POST charge is retried only if payments treats a repeated idempotency key as the same charge. Otherwise the mesh will double-charge for you.",
        highlight: ["sideA", "sideB", "pay"],
        flows: [{ from: "sideB", to: "pay", color: "#c084fc", label: "forward" }]
      },
      {
        title: "The user is a different identity",
        text: "After mTLS, payments still checks the end-user token the gateway forwarded. Workload identity does not answer \"may Ada refund this order?\"",
        highlight: ["pay", "sideB", "orders"],
        flows: [{ from: "sideB", to: "pay", color: "#facc15", label: "user token" }]
      }
    ]
  }
});
