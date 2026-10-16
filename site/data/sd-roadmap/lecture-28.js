window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 28,
  title: "Presence, Push Notifications, and Distributed Cron",
  video: "",
  category: "Operations",
  tagline: "Online status is a TTL. Push is a vendor. Cron in a replica set is a stampeding herd unless one pod holds a lock.",
  summary: "Presence is not a long-lived socket per user on a random Spring pod. It is a heartbeat that refreshes a Redis key with a TTL, plus optional fan-out to watchers. Push notifications go through APNs and FCM; your API records intent and workers talk to the vendor. Distributed cron is the trap: @Scheduled on every replica fires N times. Use a leader lock (ShedLock, Quartz clustering, or a K8s CronJob with one concurrency) so a job runs once per interval, and still make the work idempotent.",

  theory: [
    {
      heading: "Presence is last-seen plus a TTL",
      body: "\"Online\" is a product lie with a timeout. A mobile app sends a heartbeat every 15–30 s (websocket ping, or a cheap HTTP). The server sets <code>SETEX presence:{userId} 45 1</code> in Redis. If the key expires, they are offline. Watchers (a chat roster) subscribe to changes or poll a bitmap. Do not store presence only in the heap of the pod that accepted the websocket: that pod will die and take \"online\" with it, or sticky sessions will pin millions of sockets. For scale, shard presence by user id, and expire aggressively. Last-seen timestamps in Postgres are for \"active this week,\" not for live dots.",
      bullets: [
        "TTL slightly longer than the heartbeat interval. Clock skew on clients is expected.",
        "Websockets for chat; heartbeats for presence. Do not mix a 30-minute idle socket with 'green dot.'",
        "Privacy: some products expose last-seen; some only a boolean. That is a preference row, not a Redis accident."
      ]
    },
    {
      heading: "Who should be told, and how often",
      body: "A presence change is a hot fan-out: a celebrity coming online can notify millions. Do not write a row per follower in the heartbeat path. Push presence to a channel per user (Redis pub/sub or a gateway that already holds the websocket) and let only currently connected watchers hear it. Persist nothing on the hot path except the TTL key. Rate-limit: a flapping network should not emit 10 online/offline events per second to the roster. Debounce in the presence service.",
      bullets: [
        "Connected watchers, not the entire follower list, on the live path.",
        "Debounce flapping. The UI can lag two seconds.",
        "Fan-out here is the same pattern as notifications, with tighter latency."
      ]
    },
    {
      heading: "Push is a vendor, not a loop over devices",
      body: "APNs and FCM own the last mile to the device. Your Spring API stores device tokens, respects notification preferences, and enqueues a payload. A worker calls the vendor with batching and retries. Tokens die; handle Unregistered. Do not open a million HTTP calls from a @Scheduled method. Collapse with the notification lecture: accept intent, enqueue, fan out per channel. Presence and push meet when you skip a push if the user has an open websocket on that device — optional, not required for v1.",
      bullets: [
        "Device token is a secret-ish identifier. Do not log it in full.",
        "Quiet hours and opt-out live in preferences, not in the worker guess.",
        "Idempotency keys so a retry does not double-ding."
      ]
    },
    {
      heading: "The @Scheduled stampede",
      body: "Three Spring pods, <code>@Scheduled(cron = \"0 * * * * *\")</code> on a billing tick: three charges. Kubernetes replicas make this worse as you scale. Fixes, in order of bluntness: a Kubernetes CronJob with <code>concurrencyPolicy: Forbid</code> (one Job pod); ShedLock or a similar DB/Redis lock around the method so only one replica runs; a dedicated worker Deployment with replicas=1 (fragile). Even with a lock, the job must be idempotent: a crash after charging but before unlocking will retry. Store a run id. Quartz in clustered mode is the old Java version of the same idea.",
      bullets: [
        "Locks have TTLs so a dead leader does not hold the cron forever.",
        "Fencing: ignore a job result if you lost the lock mid-run.",
        "Do not use system cron on every node of an autoscaling group."
      ]
    },
    {
      heading: "When the job is actually a queue",
      body: "If \"every minute\" really means \"process due rows,\" a poller that <code>SELECT ... FOR UPDATE SKIP LOCKED</code> on a work table scales better than a global cron. Each replica takes a batch. That is distributed cron without a leader: the database is the scheduler. Delayed messages on a queue (visible-after) are the same idea. Use a single locked cron only for true singleton work: \"emit the midnight snapshot,\" \"rotate this week's partition.\" Mix: a CronJob enqueues a message; many workers consume. Spring's <code>TaskScheduler</code> is in-process. It is not a cluster scheduler until you add a lock or an external job.",
      bullets: [
        "Skip Locked = competing consumers on a table.",
        "A CronJob that only enqueues is easier to reason about than a CronJob that does all the work.",
        "Missed intervals: decide catch-up vs skip. Billing catch-up is not optional."
      ]
    }
  ],

  keyTerms: [
    { term: "Heartbeat", def: "A periodic ping that refreshes a presence key before its TTL fires." },
    { term: "Presence TTL", def: "Redis (or similar) expiry that turns silence into offline without a logout call." },
    { term: "Device token", def: "APNs/FCM handle that addresses one installed app. It expires and must be refreshed." },
    { term: "ShedLock", def: "A library that wraps @Scheduled with a database or Redis lock so one replica runs." },
    { term: "CronJob", def: "A Kubernetes object that starts a Job on a schedule, preferably with Forbid concurrency." },
    { term: "SKIP LOCKED", def: "SQL that lets workers claim distinct due rows without a global leader." },
    { term: "Fencing", def: "Ignoring work from a process that no longer holds the lock." },
    { term: "Debounce", def: "Collapsing rapid online/offline flaps into one presence event." }
  ],

  tradeoffs: [
    { pro: "TTL presence is simple and self-healing when a pod dies.", con: "You get a grace window of false online, and Redis is now on the chat hot path." },
    { pro: "Vendor push reaches devices that have no open socket.", con: "Tokens rot, vendors throttle, and you still need a queue and preferences." },
    { pro: "A lock around @Scheduled is a small code change.", con: "Lock expiry and double-run on pause-the-world GC still happen; jobs must be idempotent." },
    { pro: "K8s CronJob keeps scheduling out of the API pods.", con: "A long Job plus Forbid will skip intervals unless you design catch-up." }
  ],

  interviewTips: [
    "Presence = heartbeat + Redis TTL. Not a boolean in the user row updated on login.",
    "Do not pin millions of websockets to one Spring pod without a plan to shard the gateway.",
    "Push: enqueue intent, worker talks to APNs/FCM, handle dead tokens.",
    "Say @Scheduled on every replica is a bug. Name ShedLock or a CronJob with Forbid.",
    "For due-work tables, prefer SKIP LOCKED over a global leader."
  ],

  scene: {
    nodes: [
      { id: "p1", label: "Phone A", type: "phone", pos: [-11, 0, -3] },
      { id: "p2", label: "Phone B", type: "phone", pos: [-11, 0, 2] },
      { id: "gw", label: "WS gateway", type: "gateway", pos: [-6, 0, 0] },
      { id: "redis", label: "Presence Redis", type: "cache", pos: [-1, 0, -3], showAt: 1 },
      { id: "api", label: "Notify API", type: "service", pos: [-1, 0, 2.5], showAt: 3 },
      { id: "q", label: "Push queue", type: "queue", pos: [4, 0, 2.5], showAt: 3 },
      { id: "fcm", label: "FCM / APNs", type: "cdn", pos: [9, 0, 2.5], showAt: 4 },
      { id: "pods", label: "API replicas", type: "zone", pos: [4, 0, -3.2], size: [10, 5], showAt: 5 },
      { id: "r1", label: "Pod 1 @Scheduled", type: "server", pos: [1.5, 0, -3.2], showAt: 5 },
      { id: "r2", label: "Pod 2 @Scheduled", type: "server", pos: [6.5, 0, -3.2], showAt: 5 },
      { id: "lock", label: "ShedLock row", type: "db", pos: [9.5, 0, -0.5], showAt: 5 },
      { id: "n0", label: "SETEX user 45s", type: "note", pos: [-1, 0, -7], showAt: 1 },
      { id: "n1", label: "One lock, still idempotent", type: "note", pos: [6.5, 0, -7], showAt: 6 }
    ],
    edges: [
      { from: "p1", to: "gw" },
      { from: "p2", to: "gw" },
      { from: "gw", to: "redis", showAt: 1 },
      { from: "api", to: "q", showAt: 3 },
      { from: "q", to: "fcm", showAt: 4 },
      { from: "fcm", to: "p2", showAt: 4 },
      { from: "r1", to: "lock", showAt: 6 },
      { from: "r2", to: "lock", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Sockets terminate at a gateway",
        text: "Phones keep a websocket to a gateway tier, not to a random API pod's heap. Presence and chat messages can both ride this hop. The gateway is sharded; users can reconnect elsewhere.",
        highlight: ["p1", "p2", "gw"],
        flows: [
          { from: "p1", to: "gw", color: "#4ade80", label: "ws" },
          { from: "p2", to: "gw", color: "#4ade80", label: "ws" }
        ]
      },
      {
        title: "Heartbeat refreshes a TTL",
        text: "Every 20 seconds the gateway SETEX presence:A 45. If A disappears, the key expires and A is offline. No logout required. Last-seen in SQL is a slower, coarser signal.",
        highlight: ["gw", "redis", "n0", "p1"],
        flows: [{ from: "gw", to: "redis", color: "#facc15", label: "SETEX" }]
      },
      {
        title: "Watchers see expiry, not a herd",
        text: "B is looking at A's roster. Pub/sub tells connected watchers. You do not fan out to a million followers on every heartbeat. Debounce flaps from a bad cell network.",
        highlight: ["redis", "gw", "p2"],
        flows: [{ from: "redis", to: "gw", color: "#60a5fa", label: "offline" }]
      },
      {
        title: "Push is an accepted intent",
        text: "A is offline. A mention enqueues a push. The API does not call FCM on the request thread. Preferences already dropped marketing; this is transactional.",
        highlight: ["api", "q", "p1"],
        flows: [{ from: "api", to: "q", color: "#fb923c", label: "intent" }]
      },
      {
        title: "Worker talks to the vendor",
        text: "A worker sends to FCM/APNs. A 200 is vendor accept, not a human glance. Dead tokens are deleted. Retries use an idempotency key so B is not dinged twice.",
        highlight: ["q", "fcm", "p2"],
        flows: [
          { from: "q", to: "fcm", color: "#4ade80", label: "send" },
          { from: "fcm", to: "p2", color: "#4ade80", label: "push" }
        ]
      },
      {
        title: "Every replica has @Scheduled",
        text: "Two API pods both run a midnight billing cron. Without a lock this is two charges. Scaling the Deployment made the bug worse. This is the distributed cron trap.",
        highlight: ["r1", "r2", "pods"],
        fail: ["r2"],
        flows: [
          { from: "r1", to: "lock", color: "#f87171", label: "tick" },
          { from: "r2", to: "lock", color: "#f87171", label: "tick" }
        ]
      },
      {
        title: "One lock, one runner",
        text: "ShedLock (or a CronJob with Forbid) lets pod 1 run. Pod 2 skips. The lock has a TTL so a killed JVM does not own midnight forever. The job still must be idempotent.",
        highlight: ["r1", "lock", "n1", "r2"],
        flows: [{ from: "r1", to: "lock", color: "#4ade80", label: "acquired" }]
      },
      {
        title: "Better: enqueue, then many workers",
        text: "The locked cron only inserts due work or a queue message. SKIP LOCKED or competing consumers process the rows. Singleton schedule, parallel work, no double charge.",
        highlight: ["r1", "q", "lock", "api"],
        flows: [{ from: "r1", to: "q", color: "#c084fc", label: "due work" }]
      }
    ]
  }
});
