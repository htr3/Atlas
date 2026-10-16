window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 1,
  title: "System Design for Beginners",
  video: "https://www.youtube.com/watch?v=lFeYU31TnQ8",
  category: "Piyush Garg",
  tagline: "Grow Amazon from one public-IP box into DNS, ELB, gateway, queues, fan-out, and CloudFront.",
  summary: "A beginner map of a production Amazon-style stack. A client reaches a 24/7 machine only by public IP, so DNS turns amazon.com into 10.2.3.4. Vertical scaling (2 CPU / 4 GB up to a 6000-CPU monster) wastes money and restarts at Big Billion Days. Horizontal replicas need an elastic load balancer, an API gateway to split /auth /orders /payments, SQS so payment does not wait on Gmail, SNS fan-out into WhatsApp/email/SMS queues, Redis plus a read replica, and CloudFront anycast so North India does not pull every product photo from a US origin.",

  theory: [
    {
      heading: "A client and a machine with a public IP",
      body: "At the highest level the lecture draws two boxes: a <b>client</b> (phone, laptop, or IoT) and a <b>server</b>. The server is just a machine that can stay up 24/7 and that the internet can address. Cloud is not magic — AWS or DigitalOcean rent you someone else's always-on box plus a public IP because you will not leave your laptop powered and exposed. Without that IP the client has no street address on the internet. Your home PC can act as a server if you give it power and an IP; companies exist so you do not have to.",
      bullets: [
        "Client = whoever hits your API. Server = a 24/7 machine with a public IP.",
        "Cloud = rented VMs, not a different kind of computer."
      ]
    },
    {
      heading: "DNS is the telephone directory for amazon.com",
      body: "Nobody memorizes <code>10.2.3.4</code> the way nobody memorizes friends' phone numbers. A <b>DNS</b> server is a global key-value directory: domain → IP. Typing amazon.com sends the <i>first</i> request to DNS, which returns the IP; only then does the browser talk to your machine. That lookup is DNS resolution. You pay a fee when you point a bought domain at an IP. DNS itself is decentralized; its only job is the directory.",
      bullets: [
        "amazon.com is easier than 10.2.3.4. DNS stores that pair.",
        "First hop of a browser visit is DNS, not the origin server."
      ]
    },
    {
      heading: "Vertical scaling: more CPU on one box, like hiring cooks by the hour",
      body: "A 2 CPU / 4 GB box dies when exam-result traffic or a sale overwhelms RAM — that is why board sites go down. Adding 64 CPU and 128 GB (or a cartoon 6000 CPU / 128000 GB supercomputer) is <b>vertical scaling / scale-up</b>: grow one machine. Amazon's load is not flat; festival peaks and recession troughs mean you would pay for a supercomputer that sits 90% idle. Cloud autoscaling is the restaurant trick: keep two cooks on salary, rent extra cooks by the hour when the rush hits, and stop paying when the dining room empties. You still have one kitchen.",
      bullets: [
        "Scale-up = more CPU, RAM, disk on the existing server.",
        "Peak-sized hardware wastes money for the other 90% of the year."
      ]
    },
    {
      heading: "Big Billion Days cannot wait for a reboot",
      body: "You cannot slide extra RAM into a running machine. Vertical scale means stop, add parts, restart — downtime. A Big Billion sale opens at 12:00. At 11:00 the shop is quiet; at 12:05 the spike arrives. If the box is rebooting for a scale-up, even one minute is unacceptable. Horizontal scaling spins a <i>second</i> replica while the first keeps serving. The new VM takes a minute to boot, so the site may go slow, but it does not go dark. DNS still returns one IP, so you cannot just publish three replica IPs and hope users pick them.",
      bullets: [
        "Vertical scale needs a restart. Horizontal scale adds replicas beside a live box.",
        "DNS returns one address, so replicas need a front door."
      ]
    },
    {
      heading: "ELB, round-robin, and a health check before traffic",
      body: "Put an <b>elastic load balancer</b> in front and register <i>its</i> IP in DNS (the lecture uses 10.2.3.7). Clients always hit the balancer; the balancer spreads work. Simplest policy is <b>round-robin</b>: request 1 → server 1, 2 → 2, 3 → 3, 4 → 1. When you scale out a fourth replica you register it; when the sale ends you scale in and the balancer only knows two. A new EC2 boots first, then the balancer health-checks it (up for ~1 minute) before sending live traffic. Vertical scaling never needed this box because there was still one IP.",
      bullets: [
        "Register the balancer IP in DNS, not each replica.",
        "Health check, then traffic. Scale in by unregistering idle replicas."
      ]
    },
    {
      heading: "API gateway: /auth, /orders, /payments each have their own fleet",
      body: "Microservices do not share one farm. Auth, a public API, orders, and payments each run their own replicas because people browse more than they buy — the lecture draws six API boxes, four auth, three order, two payment. Path rules send <code>/auth</code> to the auth load balancer, <code>/orders</code> to orders, <code>/payments</code> to payments. That router is an <b>API gateway</b>: a reverse proxy and the centralized entry. Its public IP (example 10.5.8.3) is what DNS now stores. The gateway can also attach Auth0-style auth, or send <code>/docs</code> to S3 and another path to Lambda. Per-service LBs still round-robin identical replicas (EC2 = Amazon's VM name).",
      bullets: [
        "Gateway routes by path. Per-service LB balances identical clones.",
        "DNS points at the gateway, not at auth or payments directly."
      ]
    },
    {
      heading: "Do not wait on Gmail: SQS, 10 emails/sec, then SNS fan-out",
      body: "A sale email to a million users, a vendor bulk Excel, or a payment receipt must not sit on the request thread. Calling the email worker with HTTP POST is <b>synchronous</b>: the payment server waits on Gmail. Instead payment <b>pushes order IDs onto an SQS queue</b> (FIFO). The email worker pulls, talks to Gmail, discards. That is why the confirmation mail lands 2–3 seconds later. If Gmail allows 10 emails/sec, the worker must never pick more than 10 per second — a bottleneck you create on purpose. SQS is pull (short poll every second vs long poll block ~10s and batch). One SQS message has one consumer. A payment that must also fire WhatsApp, SMS, vendor mail, and user mail is <b>pub/sub (SNS)</b>: one publish, many listeners. SNS has no ack, so failed Gmail can lose the event. <b>Fan-out</b> binds SNS to three SQS queues (WhatsApp, email, SMS); each queue has its own EC2 processors, retries, and a dead-letter queue. YouTube-style upload is the same pattern: S3 object → SNS → 480p / 360p / audio / thumbnail queues.",
      bullets: [
        "SQS = one consumer, ack, DLQ. SNS = announce to many, no ack.",
        "Fan-out = SNS copies into SQS so each side effect can retry."
      ]
    },
    {
      heading: "Rate limits, a tired primary, Redis, and CloudFront anycast",
      body: "Clients can DDoS you. Cap at five requests/sec (429 too many requests) with token bucket or leaky bucket — the lecture points at Piyush's own article. The shared Postgres/Mongo still melts under every microservice. Writes and realtime reads stay on the <b>primary</b>; slightly stale analytics hit a <b>read replica</b>. Redis sits in front: miss → DB → fill cache. Do not expose the origin LB globally. <b>CloudFront (CDN)</b> plants edge caches worldwide. <b>Anycast</b> gives every edge the same IP so North India, the US, and Canada each land on the nearest PoP. First photo miss goes to origin and is cached; the next North-India viewer never leaves the region. Product images already opened in your region skip the origin, cut latency to America, and drop origin load.",
      bullets: [
        "Primary for writes/fresh reads. Replica for delayed analytics. Redis to cut DB calls.",
        "CloudFront + anycast: nearest edge, then origin only on miss."
      ]
    }
  ],

  keyTerms: [
    { term: "Public IP", def: "The internet street address of a 24/7 machine. No IP, no client can find the server." },
    { term: "DNS resolution", def: "First query: amazon.com → IP from a global directory, then the real HTTP call." },
    { term: "Vertical scaling", def: "Add CPU/RAM/disk to one server (scale up). Needs a restart on physical hardware." },
    { term: "Horizontal scaling", def: "Spin more replica VMs (scale out) so the live box never reboots for capacity." },
    { term: "ELB", def: "Elastic load balancer. DNS points here; it round-robins healthy EC2 replicas." },
    { term: "API gateway", def: "Path-based reverse proxy (/auth vs /orders) in front of per-service load balancers." },
    { term: "SQS vs SNS", def: "SQS is one-to-one with ack/DLQ. SNS is one-to-many announce with no ack." },
    { term: "Fan-out", def: "SNS copies one payment event into WhatsApp, email, and SMS queues so each can retry." },
    { term: "Anycast CDN", def: "Same IP on every CloudFront edge; the network delivers you to the nearest cache." }
  ],

  tradeoffs: [
    { pro: "Vertical scaling is one IP and no balancer to operate.", con: "Restart downtime at 12:00 on Big Billion Days, and a peak-sized box sits idle most of the year." },
    { pro: "Horizontal replicas plus ELB keep serving while a new VM boots.", con: "You now own health checks, registration, and a balancer that itself needs beefy workers." },
    { pro: "SQS decouples payment from Gmail and lets you cap 10 emails/sec.", con: "The user waits 2–3 seconds, and you must choose short vs long polling cost." },
    { pro: "SNS fan-out into SQS gives many side effects plus retries/DLQ.", con: "Bare SNS has no acknowledgement; a listener that is down simply misses the event." },
    { pro: "CloudFront anycast plus Redis plus a read replica take load off origin.", con: "Replica data can lag; a cache miss still walks to a far-away origin." }
  ],

  interviewTips: [
    "Start with client + public IP + DNS (amazon.com vs 10.2.3.4). Do not jump to Kubernetes.",
    "Say why vertical scale fails at a 12:00 sale: you cannot add RAM without a reboot.",
    "DNS still returns one IP after you clone servers — that sentence is why the ELB exists.",
    "Draw /auth /orders /payments as separate LBs behind an API gateway, not one shared farm.",
    "Payment must not HTTP-POST the email worker. Queue it. If many notifications, SNS fan-out into SQS, not SNS alone.",
    "Close with CloudFront anycast: North India should not fetch a cached product photo from a US origin."
  ],

  scene: {
    nodes: [
      { id: "phone", label: "Phone", type: "phone", pos: [-11, 0, -4] },
      { id: "laptop", label: "Laptop", type: "user", pos: [-11, 0, -1] },
      { id: "iot", label: "IoT client", type: "user", pos: [-11, 0, 2] },
      { id: "dns", label: "DNS", type: "service", pos: [-7, 0, -6] },
      { id: "n_dns", label: "amazon.com → 10.2.3.4", type: "note", pos: [-7, 0, -8] },
      { id: "origin", label: "Origin 2CPU 4GB", type: "server", pos: [-3, 0, -1] },
      { id: "n_vert", label: "Scale-up: 64 CPU / 128 GB", type: "note", pos: [-3, 0, -8], showAt: 2 },
      { id: "elb", label: "ELB 10.2.3.7", type: "lb", pos: [-3, 0, -1], showAt: 4 },
      { id: "ec2a", label: "EC2 A", type: "server", pos: [1, 0, -4], showAt: 4 },
      { id: "ec2b", label: "EC2 B", type: "server", pos: [1, 0, -1], showAt: 4 },
      { id: "ec2c", label: "EC2 C", type: "server", pos: [1, 0, 2], showAt: 4 },
      { id: "gw", label: "API Gateway", type: "gateway", pos: [-7, 0, 0], showAt: 5 },
      { id: "authZ", label: "Auth fleet", type: "zone", pos: [1.2, 0, -5], size: [6.2, 3], showAt: 5 },
      { id: "authLb", label: "Auth LB", type: "lb", pos: [-1, 0, -5], showAt: 5 },
      { id: "auth1", label: "Auth EC2", type: "server", pos: [2.4, 0, -5], showAt: 5 },
      { id: "ordZ", label: "Orders fleet", type: "zone", pos: [1.2, 0, -1], size: [6.2, 3], showAt: 5 },
      { id: "ordLb", label: "Orders LB", type: "lb", pos: [-1, 0, -1], showAt: 5 },
      { id: "ord1", label: "Orders EC2", type: "server", pos: [2.4, 0, -1], showAt: 5 },
      { id: "payZ", label: "Payments fleet", type: "zone", pos: [1.2, 0, 3.2], size: [6.2, 3], showAt: 5 },
      { id: "payLb", label: "Pay LB", type: "lb", pos: [-1, 0, 3.2], showAt: 5 },
      { id: "pay1", label: "Pay EC2", type: "server", pos: [2.4, 0, 3.2], showAt: 5 },
      { id: "sqs", label: "SQS orders", type: "queue", pos: [6.6, 0, 3.2], showAt: 6 },
      { id: "mailW", label: "Email worker", type: "worker", pos: [10, 0, 3.2], showAt: 6 },
      { id: "gmail", label: "Gmail 10/s", type: "service", pos: [10, 0, 6], showAt: 6 },
      { id: "n_rate", label: "Pick at most 10 emails/sec", type: "note", pos: [6.6, 0, 6], showAt: 6 },
      { id: "sns", label: "SNS payment", type: "queue", pos: [6.6, 0, 0], showAt: 7 },
      { id: "qWa", label: "WhatsApp Q", type: "queue", pos: [10, 0, -2], showAt: 7 },
      { id: "qEm", label: "Email Q", type: "queue", pos: [10, 0, 0], showAt: 7 },
      { id: "qSms", label: "SMS Q", type: "queue", pos: [10, 0, 2], showAt: 7 },
      { id: "primary", label: "Primary DB", type: "db", pos: [6.6, 0, -5], showAt: 8 },
      { id: "replica", label: "Read replica", type: "db", pos: [10, 0, -5], showAt: 8 },
      { id: "redis", label: "Redis", type: "cache", pos: [6.6, 0, -2.2], showAt: 8 },
      { id: "cdnIn", label: "CF North India", type: "cdn", pos: [-7, 0, 5.5], showAt: 9 },
      { id: "cdnUs", label: "CF US origin-side", type: "cdn", pos: [-3, 0, 5.5], showAt: 9 },
      { id: "n_any", label: "Anycast: nearest edge wins", type: "note", pos: [-5, 0, 7.6], showAt: 9 }
    ],
    edges: [
      { from: "laptop", to: "dns", label: "amazon.com" },
      { from: "dns", to: "laptop", label: "10.2.3.4" },
      { from: "laptop", to: "origin", label: "HTTP" },
      { from: "phone", to: "elb", showAt: 4 },
      { from: "laptop", to: "elb", showAt: 4 },
      { from: "iot", to: "elb", showAt: 4 },
      { from: "elb", to: "ec2a", label: "RR 1", showAt: 4 },
      { from: "elb", to: "ec2b", label: "RR 2", showAt: 4 },
      { from: "elb", to: "ec2c", label: "RR 3", showAt: 4 },
      { from: "laptop", to: "gw", label: "10.5.8.3", showAt: 5 },
      { from: "gw", to: "authLb", label: "/auth", showAt: 5 },
      { from: "gw", to: "ordLb", label: "/orders", showAt: 5 },
      { from: "gw", to: "payLb", label: "/payments", showAt: 5 },
      { from: "authLb", to: "auth1", showAt: 5 },
      { from: "ordLb", to: "ord1", showAt: 5 },
      { from: "payLb", to: "pay1", showAt: 5 },
      { from: "pay1", to: "sqs", label: "orderId", showAt: 6 },
      { from: "sqs", to: "mailW", label: "long poll", showAt: 6 },
      { from: "mailW", to: "gmail", label: "<=10/s", showAt: 6 },
      { from: "pay1", to: "sns", label: "paid", showAt: 7 },
      { from: "sns", to: "qWa", showAt: 7 },
      { from: "sns", to: "qEm", showAt: 7 },
      { from: "sns", to: "qSms", showAt: 7 },
      { from: "ord1", to: "redis", showAt: 8 },
      { from: "redis", to: "primary", label: "miss", showAt: 8, dashed: true },
      { from: "primary", to: "replica", label: "async", showAt: 8, dashed: true },
      { from: "phone", to: "cdnIn", label: "photo", showAt: 9 },
      { from: "cdnIn", to: "cdnUs", label: "miss", showAt: 9, dashed: true },
      { from: "cdnUs", to: "gw", showAt: 9, dashed: true }
    ],
    steps: [
      {
        title: "Client meets a public-IP box",
        text: "Phone, laptop, or IoT can only reach a 24/7 machine if it has a public IP. Cloud here is just someone else's always-on VM — your laptop could be the server if you left it on.",
        highlight: ["phone", "laptop", "iot", "origin"],
        flows: [{ from: "laptop", to: "origin", color: "#4ade80", label: "IP" }]
      },
      {
        title: "DNS turns amazon.com into 10.2.3.4",
        text: "The first request is not HTTP to origin. DNS, a global telephone directory, returns the IP. Then the laptop can actually talk to the machine.",
        highlight: ["laptop", "dns", "n_dns", "origin"],
        flows: [
          { from: "laptop", to: "dns", color: "#60a5fa", label: "lookup" },
          { from: "dns", to: "laptop", color: "#c084fc", label: "IP" }
        ]
      },
      {
        title: "2 CPU / 4 GB is not enough",
        text: "Exam-result rushes OOM the small box. Vertical scale-up to 64 CPU / 128 GB (or a cartoon 6000-CPU supercomputer) handles a festival — and sits idle the rest of the year, like ten cooks on monthly salary for a lunch rush.",
        highlight: ["origin", "n_vert"],
        fail: ["origin"],
        flows: [
          { from: "phone", to: "origin", color: "#f87171", label: "rush" },
          { from: "laptop", to: "origin", color: "#f87171", label: "rush" }
        ]
      },
      {
        title: "12:00 sale cannot reboot",
        text: "Adding RAM needs a restart. Big Billion Days opens at noon. At 11:00 it is quiet; at 12:05 the spike hits. One minute of scale-up downtime is not allowed. You need another live replica, not a bigger single box.",
        highlight: ["origin", "n_vert", "laptop"],
        fail: ["origin"],
        flows: [{ from: "laptop", to: "origin", color: "#f87171", label: "12:05" }]
      },
      {
        title: "ELB 10.2.3.7 round-robins replicas",
        text: "DNS now stores the balancer IP. Request 1 → A, 2 → B, 3 → C. A new EC2 boots, the ELB health-checks ~1 minute, then it joins the rotation. Scale in when the sale ends.",
        highlight: ["elb", "ec2a", "ec2b", "ec2c", "dns"],
        hide: ["origin"],
        flows: [
          { from: "laptop", to: "elb", color: "#4ade80", label: "DNS IP" },
          { from: "elb", to: "ec2a", color: "#60a5fa", label: "1" },
          { from: "elb", to: "ec2b", color: "#60a5fa", label: "2" },
          { from: "elb", to: "ec2c", color: "#60a5fa", label: "3" }
        ]
      },
      {
        title: "Gateway splits /auth /orders /payments",
        text: "Browse traffic dwarfs checkout, so each service has its own fleet and LB. DNS points at the API gateway (10.5.8.3). Path rules forward /auth, /orders, /payments to the matching balancer.",
        highlight: ["gw", "authLb", "ordLb", "payLb", "auth1", "ord1", "pay1"],
        hide: ["elb", "ec2a", "ec2b", "ec2c", "origin"],
        flows: [
          { from: "laptop", to: "gw", color: "#4ade80", label: "amazon.com" },
          { from: "gw", to: "authLb", color: "#fb923c", label: "/auth" },
          { from: "gw", to: "payLb", color: "#60a5fa", label: "/payments" }
        ]
      },
      {
        title: "Payment enqueues; Gmail is capped at 10/s",
        text: "Do not HTTP-POST the email worker from payment (synchronous wait). Push the orderId to SQS. The worker long-polls, sends via Gmail, and must never pick more than 10 mails per second so Gmail's rate limit never fires. Mail arrives 2–3 seconds later.",
        highlight: ["pay1", "sqs", "mailW", "gmail", "n_rate"],
        hide: ["elb", "ec2a", "ec2b", "ec2c", "origin"],
        flows: [
          { from: "pay1", to: "sqs", color: "#4ade80", label: "orderId" },
          { from: "sqs", to: "mailW", color: "#fb923c", label: "poll" },
          { from: "mailW", to: "gmail", color: "#60a5fa", label: "10/s" }
        ]
      },
      {
        title: "SNS fans one payment into three SQS queues",
        text: "One paid event must also WhatsApp, SMS, and email. Bare SNS has no ack. Fan-out binds SNS to three SQS queues so each processor can retry or dead-letter on its own.",
        highlight: ["pay1", "sns", "qWa", "qEm", "qSms"],
        hide: ["elb", "ec2a", "ec2b", "ec2c", "origin"],
        flows: [
          { from: "pay1", to: "sns", color: "#fb923c", label: "paid" },
          { from: "sns", to: "qWa", color: "#c084fc", label: "copy" },
          { from: "sns", to: "qEm", color: "#c084fc", label: "copy" },
          { from: "sns", to: "qSms", color: "#c084fc", label: "copy" }
        ]
      },
      {
        title: "Redis miss, then primary; replica for analytics",
        text: "Every microservice would crush one database. Check Redis first. On miss, read the primary, fill the cache. Writes always hit the primary. Slightly delayed analytics can use the read replica.",
        highlight: ["ord1", "redis", "primary", "replica"],
        hide: ["elb", "ec2a", "ec2b", "ec2c", "origin"],
        flows: [
          { from: "ord1", to: "redis", color: "#facc15", label: "get" },
          { from: "redis", to: "primary", color: "#c084fc", label: "miss" },
          { from: "primary", to: "replica", color: "#60a5fa", label: "repl" }
        ]
      },
      {
        title: "North India hits CloudFront, not the US origin",
        text: "Anycast advertises one IP on every edge. A North-India photo miss walks to origin once and is cached. The next viewer in the region never leaves the PoP — lower latency than America, and the origin never sees the repeat.",
        highlight: ["phone", "cdnIn", "cdnUs", "n_any", "gw"],
        hide: ["elb", "ec2a", "ec2b", "ec2c", "origin"],
        flows: [
          { from: "phone", to: "cdnIn", color: "#22d3ee", label: "photo" },
          { from: "cdnIn", to: "cdnUs", color: "#fb923c", label: "1st miss" }
        ]
      }
    ]
  }
});
