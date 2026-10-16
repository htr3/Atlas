window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 3,
  title: "HTTP, TLS, Headers, and Timeouts",
  video: "",
  category: "Networking",
  tagline: "HTTPS is HTTP plus a handshake; headers and timeouts decide how it fails.",
  summary: "HTTP is a request/response protocol on a TCP (or QUIC) stream. Methods and status codes are the contract; headers carry auth, content type, caching, and correlation. TLS wraps the stream so a Spring Boot app can speak HTTPS without inventing crypto. Timeouts — connect, TLS, read, write — are how WebClient and RestTemplate stop hanging. Get them wrong and you either leak Tomcat threads or retry-storm a struggling dependency.",

  theory: [
    {
      heading: "HTTP is verbs on a resource, not 'the internet'",
      body: "A client sends a method, path, headers, and optional body. The server returns a status, headers, and optional body. GET and HEAD should be safe; PUT and DELETE should be idempotent; POST often is not. Spring's <code>@GetMapping</code> / <code>@PostMapping</code> are just annotations on that contract. Status codes are part of the API: 2xx success, 4xx the client may fix, 5xx the server (or an upstream) failed. A 404 from your gateway and a 404 from the domain are different stories — say which.",
      bullets: [
        "Idempotent retries are safe for GET/PUT/DELETE; POST needs an Idempotency-Key.",
        "201 vs 200 vs 204 are product choices, not decoration.",
        "HTTP/1.1 is one request at a time per connection unless pipelined (rare); HTTP/2 multiplexes streams."
      ]
    },
    {
      heading: "Headers are the control plane",
      body: "<code>Host</code> picks the virtual server. <code>Authorization: Bearer</code> carries the JWT from lecture 1. <code>Content-Type</code> and <code>Accept</code> negotiate JSON vs protobuf-in-HTTP. <code>Cache-Control</code> and <code>ETag</code> keep CDNs honest. <code>X-Request-Id</code> or W3C <code>traceparent</code> is how you grep one checkout across gateway, Spring, and JDBC logs. Custom headers are easy to forget at a mesh or CORS boundary — Spring Cloud Gateway must allow-list them.",
      bullets: [
        "Never put secrets in query strings; they leak to logs and Referer.",
        "Content-Length vs chunked encoding matters for proxies and timeouts.",
        "A missing correlation id is how a p99 spike becomes un-debuggable."
      ]
    },
    {
      heading: "TLS: encrypt the stream, authenticate the server",
      body: "TLS sits under HTTP (HTTPS). Handshake: client hello, server certificate, key agreement, then encrypted bytes. The certificate proves the server owns <code>api.shop.example</code> via a CA the client trusts. Mutual TLS (mTLS) also proves the client — common between Spring services inside a mesh. Handshake adds RTTs unless you have TLS 1.3, session resumption, or HTTP/3. In Spring Boot you terminate TLS at the gateway, at the embedded Tomcat, or both (gateway origin-verify).",
      bullets: [
        "A clock-skewed server with an 'expired' cert looks like an outage.",
        "Disable old ciphers; do not roll your own protocol.",
        "Certificate rotation is an ops problem — short-lived certs need automation (ACME, mesh SPIFFE)."
      ]
    },
    {
      heading: "Timeouts are a budget, not a default",
      body: "WebClient (Reactor Netty) and the JDK HttpClient expose connect, response, and sometimes idle timeouts. RestTemplate-on-Apache-HttpClient does too, but the historical Spring default was 'wait forever.' Set three numbers: connect (TCP+TLS), response (TTFB), and total. The caller's timeout must be larger than the callee's plus margin, or the caller retries while the callee is still working — a retry amplification. Resilience4j TimeLimiter and circuit breakers belong with these numbers, not instead of them.",
      bullets: [
        "Gateway 2s, Spring 1.5s, JDBC 1s — budgets nest inward.",
        "Read timeout covers a slow body, not only a slow status line.",
        "Keep-alive idle timeout that is longer than a NAT's idle timeout produces random connection resets."
      ]
    },
    {
      heading: "Keep-alive, HTTP/2, and the pool",
      body: "Reusing a TLS session and TCP connection avoids the handshake tax from lecture 2. HTTP/1.1 keep-alive is one in-flight request per connection. HTTP/2 multiplexes many streams, which is why gRPC and modern browsers like it — but a lost TCP packet still stalls the connection (HOL). Connection pools in WebClient must bound max connections per host or you will DDoS your own payment service. Health of a pooled connection is a first-class concern: stale sockets need eviction.",
      bullets: [
        "Pooling without a ceiling is a thundering-herd generator.",
        "HTTP/2 does not remove the need for timeouts; it hides more work on one socket."
      ]
    },
    {
      heading: "Retries, idempotency, and timeout storms",
      body: "A 503 with Retry-After is a signal. A connect timeout is also a signal — maybe retry. A read timeout on POST /charge is not, unless you sent an Idempotency-Key the payment service honors. Spring Retry or Resilience4j Retry with exponential backoff and jitter; never a tight loop. When p99 rises, shrinking timeouts without shrinking work just converts latency into 5xx and more retries."
    }
  ],

  keyTerms: [
    { term: "Safe method", def: "GET/HEAD must not change server state. Caches and crawlers rely on this." },
    { term: "Idempotent method", def: "Repeating PUT/DELETE has the same effect as doing it once. POST needs extra keys." },
    { term: "TLS handshake", def: "Certificate and key exchange that produces an encrypted HTTP stream (HTTPS)." },
    { term: "mTLS", def: "Both sides present certificates. Common for Spring-to-Spring inside a service mesh." },
    { term: "Connect timeout", def: "Budget for TCP+TLS before the request bytes are even sent." },
    { term: "Read / response timeout", def: "Budget for headers and body after the request is written." },
    { term: "Keep-alive", def: "Reuse of a TCP/TLS connection for later HTTP requests to the same host." },
    { term: "Correlation id", def: "A header (request id / traceparent) that ties gateway logs to Spring and JDBC." }
  ],

  tradeoffs: [
    { pro: "HTTPS everywhere stops on-path snooping and many trivial attacks.", con: "Handshake RTT and cert ops become part of every outage review." },
    { pro: "Tight timeouts free Tomcat threads and fail fast for the user.", con: "Too tight converts a slow dependency into a retry storm." },
    { pro: "HTTP/2 multiplexing cuts connection count and handshake load.", con: "One lossy TCP connection still HOL-blocks every multiplexed stream." },
    { pro: "Rich headers (ETag, cache, traces) make CDNs and debugging work.", con: "Proxies and CORS configs drop custom headers if you do not allow-list them." }
  ],

  interviewTips: [
    "When you say HTTPS, mention TLS handshake cost and where you terminate (gateway vs app).",
    "List connect vs read timeout and nest them: client > gateway > service > DB.",
    "POST + retry without Idempotency-Key is how you double-charge. Say the header.",
    "Name one tracing header. 'We log stuff' is weaker than traceparent on every hop.",
    "If they ask HTTP/1.1 vs 2 vs 3: 1.1 one-request-per-conn, 2 multiplex on TCP, 3 is QUIC/UDP.",
    "Default RestTemplate timeouts are a trivia item — never ship them."
  ],

  scene: {
    nodes: [
      { id: "phone", label: "App", type: "phone", pos: [-11, 0, 0] },
      { id: "gw", label: "Gateway TLS", type: "gateway", pos: [-6, 0, 0] },
      { id: "app", label: "Spring MVC", type: "server", pos: [-1, 0, 0] },
      { id: "pay", label: "Payments", type: "service", pos: [5, 0, -3] },
      { id: "db", label: "Orders DB", type: "db", pos: [5, 0, 3] },
      { id: "n_http", label: "POST /checkout HTTP/1.1", type: "note", pos: [-6, 3.4, -6.5] },
      { id: "n_hdr", label: "Bearer + X-Request-Id", type: "note", pos: [-1, 3.4, 6.5], showAt: 1 },
      { id: "ca", label: "Certificate CA", type: "service", pos: [-6, 0, -5], showAt: 2 },
      { id: "n_tls", label: "TLS 1.3 + cert verify", type: "note", pos: [-6, 3.4, 6.5], showAt: 2 },
      { id: "n_to", label: "GW 2s > app 1.5s > DB 1s", type: "note", pos: [5, 3.4, 6.5], showAt: 4 },
      { id: "pool", label: "WebClient pool", type: "cache", pos: [5, 0, 0], showAt: 5 },
      { id: "n_h2", label: "HTTP/2 multiplex", type: "note", pos: [9, 3.4, -6.5], showAt: 5 },
      { id: "n_retry", label: "Idempotency-Key required", type: "note", pos: [9, 3.4, 6.5], showAt: 6 },
      { id: "slow", label: "Slow payment", type: "service", pos: [10, 0, -3], showAt: 6 }
    ],
    edges: [
      { from: "phone", to: "gw", label: "HTTPS" },
      { from: "gw", to: "app", label: "HTTP" },
      { from: "app", to: "db", label: "JDBC" },
      { from: "app", to: "pay", label: "WebClient", showAt: 3 },
      { from: "ca", to: "gw", label: "cert", showAt: 2, dashed: true },
      { from: "app", to: "pool", showAt: 5 },
      { from: "pool", to: "pay", showAt: 5 },
      { from: "app", to: "slow", label: "retry", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "HTTP request on the wire",
        text: "The app sends POST /checkout with a JSON body. Until TLS is done this would be plaintext. Status codes and methods are the contract Spring MVC will honor.",
        highlight: ["phone", "gw", "app", "n_http"],
        flows: [
          { from: "phone", to: "gw", color: "#4ade80", label: "POST" },
          { from: "gw", to: "app", color: "#4ade80", label: "MVC" }
        ]
      },
      {
        title: "Headers carry auth and a trace",
        text: "Authorization: Bearer plus X-Request-Id (or traceparent) travel hop to hop. The gateway must forward them. Without a correlation id the later p99 spike cannot be grepped.",
        highlight: ["phone", "gw", "app", "n_hdr"],
        flows: [
          { from: "phone", to: "gw", color: "#c084fc", label: "headers" },
          { from: "gw", to: "app", color: "#c084fc", label: "forward" }
        ]
      },
      {
        title: "TLS handshake before the POST body",
        text: "The gateway presents a certificate the phone's CA bundle trusts. TLS 1.3 shortens the handshake. mTLS could also prove the app to payments later. Handshake RTT is why pooling matters.",
        highlight: ["phone", "gw", "ca", "n_tls"],
        flows: [
          { from: "phone", to: "gw", color: "#60a5fa", label: "ClientHello" },
          { from: "ca", to: "gw", color: "#c084fc", label: "cert" },
          { from: "gw", to: "phone", color: "#60a5fa", label: "Finished" }
        ]
      },
      {
        title: "Spring calls payments and Postgres",
        text: "The controller writes the order and charges the card. Two more HTTP/TCP hops appear. Each needs its own timeout nested inside the client's budget.",
        highlight: ["app", "pay", "db"],
        flows: [
          { from: "app", to: "db", color: "#60a5fa", label: "INSERT" },
          { from: "app", to: "pay", color: "#4ade80", label: "charge" }
        ]
      },
      {
        title: "Nested timeout budgets",
        text: "Gateway 2s, Spring 1.5s, JDBC 1s. If payments is slower than Spring's read timeout, the user gets 504 while Hikari may still be finishing — unless you cancel. Budgets nest inward.",
        highlight: ["gw", "app", "db", "pay", "n_to"],
        flows: [
          { from: "phone", to: "gw", color: "#fb923c", label: "2s" },
          { from: "app", to: "pay", color: "#fb923c", label: "1.5s" },
          { from: "app", to: "db", color: "#fb923c", label: "1s" }
        ]
      },
      {
        title: "Keep-alive pool and HTTP/2",
        text: "WebClient reuses TLS connections to payments. HTTP/2 can multiplex streams on one socket. Cap the pool or checkout traffic becomes a self-inflicted DDoS.",
        highlight: ["app", "pool", "pay", "n_h2"],
        flows: [
          { from: "app", to: "pool", color: "#4ade80", label: "borrow" },
          { from: "pool", to: "pay", color: "#60a5fa", label: "H2" }
        ]
      },
      {
        title: "Read timeout without an idempotency key",
        text: "Payments is slow. Spring times out and retries POST /charge. Without Idempotency-Key the card may be billed twice. Timeouts plus retries are only safe on idempotent operations.",
        highlight: ["app", "slow", "n_retry", "pay"],
        fail: ["slow"],
        flows: [
          { from: "app", to: "slow", color: "#f87171", label: "timeout" },
          { from: "app", to: "pay", color: "#f87171", label: "retry POST" }
        ]
      },
      {
        title: "Fail fast, then back off",
        text: "A 503 with Retry-After, Resilience4j backoff and jitter, and a circuit breaker let the fleet keep throughput. Shrinking timeouts without cutting work only turns latency into a storm of 5xx.",
        highlight: ["gw", "app", "pay", "n_to"],
        flows: [
          { from: "pay", to: "app", color: "#fb923c", label: "503" },
          { from: "app", to: "gw", color: "#60a5fa", label: "504" },
          { from: "gw", to: "phone", color: "#60a5fa", label: "retry later" }
        ]
      }
    ]
  }
});
