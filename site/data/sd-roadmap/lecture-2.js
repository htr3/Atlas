window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 2,
  title: "DNS, TCP, and UDP",
  video: "",
  category: "Networking",
  tagline: "Resolve a name, then pick a reliable stream (TCP) or a datagram (UDP).",
  summary: "Before a Spring service sees HTTP, the OS has already asked DNS for an IP and opened a transport. DNS is a cached hierarchical lookup with TTLs. TCP gives a reliable byte stream after a three-way handshake — what RestTemplate and JDBC use. UDP sends datagrams with no handshake — what DNS itself often uses, and what games and QUIC start from. Timeouts, retries, and connection pools sit on top of these primitives; they do not replace them.",

  theory: [
    {
      heading: "DNS is a cached tree, not a hosts file",
      body: "Humans type <code>api.shop.example</code>. The stub resolver on the phone asks a recursive resolver, which walks root → TLD → authoritative nameserver and caches each answer for its <b>TTL</b>. The record that matters for a service is usually an A/AAAA (IP) or a CNAME that eventually becomes one. Spring Cloud LoadBalancer and Kubernetes CoreDNS are the same idea inside the cluster: name → endpoint, with a cache that can be stale.",
      bullets: [
        "A 300s TTL means you cannot fail over DNS in one second without waiting or lowering TTL first.",
        "NXDOMAIN is cached too (negative caching). A typo can linger.",
        "Health-check IPs in DNS (or a load balancer in front) beat publishing every pod IP."
      ]
    },
    {
      heading: "Recursive versus authoritative",
      body: "The recursive resolver does the walking so the phone does not. The authoritative server is the source of truth for the zone. Interview diagrams often flatten this into one 'DNS box'; say the two roles if you have time. Split-horizon DNS can return a private IP inside the VPC and a public IP outside — useful for a Spring app that talks to an internal Postgres hostname.",
      bullets: [
        "Clients talk to recursive; operators edit authoritative.",
        "Lower TTL for cutovers; raise it for hot records once traffic is stable."
      ]
    },
    {
      heading: "TCP: handshake, stream, and ordered bytes",
      body: "TCP opens with SYN, SYN-ACK, ACK. After that you have a duplex byte stream with retransmission, flow control, and congestion control. HTTP/1.1, JDBC, gRPC-on-HTTP/2, and Redis protocol over a socket all sit here. The cost is handshake RTT (worse with TLS on top) and head-of-line blocking: one lost packet stalls the stream. Java's <code>Socket</code> and Netty (used by WebClient/Netty) are TCP APIs. Connection pooling exists because the handshake is expensive compared with a 2 ms query.",
      bullets: [
        "Three packets before any HTTP byte — plus more for TLS.",
        "SO_TIMEOUT / connect timeout are how Spring WebClient fails instead of hanging.",
        "TIME_WAIT and file-descriptor limits show up when you open a new TCP conn per request."
      ]
    },
    {
      heading: "UDP: one datagram, no apology",
      body: "UDP sends a packet and forgets it. No handshake, no retransmission, no ordering. DNS queries are classically UDP (port 53) because they are tiny and retry is cheap at the application. Games, voice, and some telemetry prefer a late packet over a delayed one. Java's <code>DatagramSocket</code> is the primitive. The application must invent retries, correlation IDs, and congestion control if it needs them — or use QUIC, which rebuilds reliability on UDP to avoid TCP's kernel hol-blocking and to combine handshake with TLS.",
      bullets: [
        "If a packet can be dropped, UDP is honest. If it cannot, you will rebuild TCP poorly.",
        "Firewall and NAT friendliness still often favor TCP for public APIs."
      ]
    },
    {
      heading: "What a Spring call actually does",
      body: "WebClient calling <code>https://payments.internal</code>: OS resolver (or JVM cache) → maybe CoreDNS → TCP connect to the VIP → TLS → HTTP. A wrong connect timeout (infinite) plus a dead peer equals a stuck Tomcat thread. A too-aggressive DNS TTL plus a crashed pod IP equals a storm of failed connects until cache expires. Keep DNS, TCP, and app timeouts in one story: name, handshake, then request.",
      bullets: [
        "Prefer a load-balanced DNS name, not a pod IP, from Spring config.",
        "Cache DNS in the JVM carefully; InetAddress cache can outlive a failover.",
        "Health checks should fail the VIP, not wait for TTL, when a backend is dead."
      ]
    },
    {
      heading: "When the interview wants UDP versus TCP",
      body: "Public JSON APIs, databases, and most Spring inter-service calls are TCP. DNS lookup, service discovery probes, and loss-tolerant telemetry can be UDP. Video conferencing and multiplayer tick streams are UDP with an application protocol. Do not put checkout on UDP. Do not invent a custom UDP RPC when gRPC already exists."
    }
  ],

  keyTerms: [
    { term: "Recursive resolver", def: "The DNS server that walks the tree on behalf of the client and caches answers." },
    { term: "TTL", def: "Seconds a resolver may reuse an answer. Lower is faster failover; higher is less query load." },
    { term: "A / AAAA record", def: "Maps a name to an IPv4 or IPv6 address." },
    { term: "Three-way handshake", def: "TCP SYN, SYN-ACK, ACK that establishes a reliable byte stream." },
    { term: "Head-of-line blocking", def: "A lost TCP packet stalls later bytes on that connection, even if they arrived." },
    { term: "UDP datagram", def: "A single message with no delivery or order guarantee." },
    { term: "QUIC", def: "A UDP-based transport that folds TLS and avoids TCP's connection-wide HOL blocking." },
    { term: "Connect timeout", def: "How long the client waits for TCP handshake before failing the call." }
  ],

  tradeoffs: [
    { pro: "Long DNS TTLs cut query load on authoritative servers.", con: "Failover waits for the cache; a dead IP keeps being returned." },
    { pro: "TCP gives ordered, retransmitted bytes — JDBC and HTTP can assume a stream.", con: "Handshake RTT and HOL blocking punish lossy mobile networks." },
    { pro: "UDP is fast to send and natural for tiny lookups and realtime ticks.", con: "You own retries, ordering, and congestion — or you drop data." },
    { pro: "Pooling TCP connections in WebClient/Hikari avoids handshake tax.", con: "Stale pooled sockets to a dead VIP need validation or they stall threads." }
  ],

  interviewTips: [
    "Walk DNS then TCP then HTTP. Jumping to REST skips the failure modes that actually page people.",
    "Say TTL out loud when you propose DNS failover. If TTL is 300s, that is not a 1s cutover.",
    "TCP handshake + TLS is why connection pools exist. Mention WebClient or Hikari, not just 'reuse connections.'",
    "UDP is for DNS, games, voice, telemetry — not for money movement.",
    "Name connect vs read timeout. Infinite connect timeout plus a black-holed IP is a thread leak.",
    "If they mention HTTP/3, the one-liner is 'HTTP over QUIC over UDP.'"
  ],

  scene: {
    nodes: [
      { id: "phone", label: "Phone", type: "phone", pos: [-11, 0, -2] },
      { id: "stub", label: "Stub resolver", type: "service", pos: [-7, 0, -2] },
      { id: "rec", label: "Recursive DNS", type: "service", pos: [-3, 0, -5] },
      { id: "root", label: "Root NS", type: "server", pos: [2, 0, -6.5], showAt: 1 },
      { id: "tld", label: "TLD .com", type: "server", pos: [6, 0, -6.5], showAt: 1 },
      { id: "auth", label: "Auth NS", type: "server", pos: [10, 0, -5], showAt: 1 },
      { id: "n_ttl", label: "A record TTL 300s", type: "note", pos: [6, 3.4, -8], showAt: 2 },
      { id: "vip", label: "api.shop VIP", type: "lb", pos: [-3, 0, 2] },
      { id: "app", label: "Spring API", type: "server", pos: [3, 0, 2] },
      { id: "db", label: "Postgres", type: "db", pos: [9, 0, 2] },
      { id: "n_tcp", label: "SYN / SYN-ACK / ACK", type: "note", pos: [-3, 3.4, 6.5], showAt: 3 },
      { id: "udpDns", label: "UDP :53", type: "queue", pos: [-7, 0, -5], showAt: 5 },
      { id: "game", label: "Game tick UDP", type: "worker", pos: [3, 0, 6], showAt: 6 },
      { id: "n_udp", label: "No handshake, may drop", type: "note", pos: [3, 3.4, 8], showAt: 6 },
      { id: "dead", label: "Stale pod IP", type: "server", pos: [3, 0, -2], showAt: 7 },
      { id: "n_fail", label: "TTL holds dead A record", type: "note", pos: [9, 3.4, 6.5], showAt: 7 }
    ],
    edges: [
      { from: "phone", to: "stub", label: "lookup" },
      { from: "stub", to: "rec", label: "query" },
      { from: "rec", to: "root", showAt: 1, dashed: true },
      { from: "root", to: "tld", showAt: 1, dashed: true },
      { from: "tld", to: "auth", showAt: 1, dashed: true },
      { from: "auth", to: "rec", label: "A record", showAt: 1 },
      { from: "phone", to: "vip", label: "TCP", showAt: 3 },
      { from: "vip", to: "app", showAt: 3 },
      { from: "app", to: "db", label: "JDBC TCP", showAt: 4 },
      { from: "stub", to: "udpDns", label: "UDP", showAt: 5 },
      { from: "udpDns", to: "rec", showAt: 5 },
      { from: "phone", to: "game", label: "tick", showAt: 6 },
      { from: "phone", to: "dead", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "The phone has a name, not an IP",
        text: "The shopper hits api.shop.example. The stub resolver on the device asks a recursive resolver. No TCP to the API has happened yet — only a name lookup.",
        highlight: ["phone", "stub", "rec"],
        flows: [
          { from: "phone", to: "stub", color: "#60a5fa", label: "name" },
          { from: "stub", to: "rec", color: "#60a5fa", label: "query" }
        ]
      },
      {
        title: "Recursive walk of the tree",
        text: "On a cold cache the recursive resolver asks root, then the .com TLD, then the zone's authoritative nameserver. The A record for the VIP comes back. Later lookups reuse the cache.",
        highlight: ["rec", "root", "tld", "auth"],
        flows: [
          { from: "rec", to: "root", color: "#c084fc", label: "." },
          { from: "root", to: "tld", color: "#c084fc", label: ".com" },
          { from: "tld", to: "auth", color: "#c084fc", label: "zone" },
          { from: "auth", to: "rec", color: "#4ade80", label: "IP" }
        ]
      },
      {
        title: "TTL is the failover clock",
        text: "The A record is cached for 300 seconds. That is great for query load and terrible if the VIP IP must change right now. Lower TTL before a planned cutover.",
        highlight: ["rec", "auth", "n_ttl", "vip"],
        flows: [
          { from: "auth", to: "rec", color: "#fb923c", label: "TTL 300" }
        ]
      },
      {
        title: "TCP three-way handshake to the VIP",
        text: "With an IP in hand the phone sends SYN to the load balancer. SYN-ACK, ACK, then HTTP can start. Spring's connect timeout is this wait. A black hole here burns a thread.",
        highlight: ["phone", "vip", "app", "n_tcp"],
        flows: [
          { from: "phone", to: "vip", color: "#4ade80", label: "SYN" },
          { from: "vip", to: "phone", color: "#60a5fa", label: "SYN-ACK" },
          { from: "vip", to: "app", color: "#4ade80", label: "stream" }
        ]
      },
      {
        title: "The API opens its own TCP to Postgres",
        text: "JDBC is another TCP stream, usually from a Hikari pool so checkout does not pay a handshake per query. Ordered bytes and retransmits are why money does not ride UDP.",
        highlight: ["app", "db", "vip"],
        flows: [
          { from: "app", to: "db", color: "#4ade80", label: "JDBC" },
          { from: "db", to: "app", color: "#60a5fa", label: "rows" }
        ]
      },
      {
        title: "DNS itself is often UDP",
        text: "The lookup that started this story is typically a small UDP packet to port 53. If it is lost, the stub retries. That is cheaper than a TCP handshake for a 100-byte question.",
        highlight: ["stub", "udpDns", "rec"],
        flows: [
          { from: "stub", to: "udpDns", color: "#fb923c", label: "UDP 53" },
          { from: "udpDns", to: "rec", color: "#fb923c", label: "query" }
        ]
      },
      {
        title: "Realtime ticks choose loss over delay",
        text: "A game or voice packet that arrives late is useless. UDP sends the tick and moves on. The app may fill gaps; it will not stall the stream the way TCP HOL blocking would.",
        highlight: ["phone", "game", "n_udp"],
        flows: [
          { from: "phone", to: "game", color: "#fb923c", label: "tick" }
        ]
      },
      {
        title: "Stale A record plus a dead pod",
        text: "TTL still points at a crashed instance IP. TCP SYNs time out until the cache expires. This is why Spring should target a VIP, and why DNS failover is not a health check.",
        highlight: ["phone", "dead", "n_fail", "rec"],
        fail: ["dead"],
        flows: [
          { from: "phone", to: "dead", color: "#f87171", label: "SYN timeout" }
        ]
      }
    ]
  }
});
