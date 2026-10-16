window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 12,
  title: "What's an Event Driven System?",
  video: "https://www.youtube.com/watch?v=rJHTK2TfZ1I",
  category: "Communication",
  tagline: "Services announce what happened; they do not ask each other to do work.",
  summary: "Event-driven architecture sits on pub/sub: a service emits an event when its world changed, and anyone who cares consumes it. Each consumer keeps a local event log, which buys availability, time-travel debugging, and painless service replacement by replay. The same log makes consistency weaker, external I/O (email) un-replayable, and program flow hard to read. The FPS headshot example shows why timestamps plus rewind exist.",

  theory: [
    {
      heading: "Announce, don’t ask",
      body: "In request-response, service A <b>asks</b> service B for data or work. In an event-driven system the client still hits a gateway, but internals never call each other directly. When something changes, a service publishes an <b>event</b> onto an event bus: “this happened, and it might matter to you.” Interested consumers (subscribers) pull it, maybe change their own state, and may publish new events. The graph is a tree of reactions, ending perhaps in an email to another user. Git (commits), React, Node.js, Smalltalk, and many games are built this way.",
      bullets: [
        "Producer: I observed a change.",
        "Consumer: I decide if that change is my business.",
        "Almost every pro and con of the style flows from that one swap (announce vs ask)."
      ]
    },
    {
      heading: "Local logs, not a shared god table",
      body: "Service 1 handles a request and emits. Service 2 does not just “run code” — it <b>persists the event in its own database</b>, optionally adding fields it cares about and dropping the rest. The bus can then forget the payload. You can keep a single store on the bus, but pushing persistence to consumers keeps the bus dumb and lets each service stay up without asking a downed peer for history. That is different from a classic microservice that only stores “its” entities: here you also store <i>other people’s facts, as events</i>.",
      bullets: [
        "The database becomes an event log you can replay.",
        "Availability goes up: you already have what you used to fetch over RPC.",
        "Consistency goes down: copies drift until the next event arrives."
      ]
    },
    {
      heading: "Headshots and rewind",
      body: "Two players in a Counter-Strike-style shooter. You click a headshot when you see player 2 at <b>position 9</b>. The packet is late. Meanwhile player 2 told the server they are at <b>position 10</b>, so the server says miss — unfair, because at time T they were at 9. Treat moves and shots as <b>timestamped events</b>. To judge the shot, the server rewinds: either undo, or take a snapshot and replay the ~50 events up to T. If player 2 is at 9 in that reconstructed world, it counts. Interviews: only reach for this when the problem is naturally a log of facts over time; do not force it.",
      bullets: [
        "Events + timestamps = a time machine for disputed state.",
        "Replay forward from 0, or undo back to T, or store diffs."
      ]
    },
    {
      heading: "Why teams like the log",
      body: "If a bug appeared after timestamp T, replay production events one-by-one up to T and watch. Replacing Service 2 with Service 5 is a catch-up: replay history into S5, then subscribe to live events, then cut over — no big-bang data copy. Delivery can be tuned per event type: a welcome email can be <b>at most once</b> (loss is fine); an invoice email should be <b>at least once</b> (retry until it lands). Because you stored <b>intent</b> (“why did this row change?”), a future service can interpret the same history into a totally different local model.",
      bullets: [
        "Time-travel debug on real traffic.",
        "Blue-green a consumer by replaying, not by dual-writing tables.",
        "At-most-once vs at-least-once is a per-event product choice."
      ]
    },
    {
      heading: "Replay dies at the system boundary",
      body: "Service 4 sends email to an external provider. You cannot replace S4 the way you replaced S2: replaying old “send email” events hits the provider <i>now</i>, and time-dependent replies will not match history. You would need to record every external response and its timestamp — and some replies are inherently “what time is it?” Storing that still does not make a new send equivalent to the old one. Anything with side effects outside your bus is a replay landmine (the same reason “undo send email” is nonsense).",
      bullets: [
        "Gateway-adjacent services that call the outside world need extra care.",
        "Compaction (squash a day’s events) and snapshots exist because replaying from genesis does not scale.",
        "Some operations have no inverse; subtraction does, email does not."
      ]
    },
    {
      heading: "Control, secrecy, and readability",
      body: "Request-response lets you pick the exact service, set a timeout, and know who ran. On a bus you wait for the consumer to notice the event; priorities appear when that is too vague. Publishing every internal state change can leak data you never meant to share, and allowing only some services to subscribe adds a policy layer on the bus. From a codebase view, Service 1’s code ends at “publish.” To understand the product you must leave the file, list subscribers, then repeat. Mixing a request-response island back into an all-event system is awkward — everything is already an event.",
      bullets: [
        "Fine-grained latency SLAs fight the bus.",
        "Event design is also a security design.",
        "Flow lives in topology, not in a call stack — onboarding cost is real."
      ]
    }
  ],

  keyTerms: [
    { term: "Event", def: "A timestamped fact: something already happened in a service’s world." },
    { term: "Event bus", def: "The pub/sub backbone that routes events from producers to interested consumers." },
    { term: "Event log", def: "Ordered history a service stores locally so it can rebuild state without calling peers." },
    { term: "Replay", def: "Re-applying stored events to rebuild state, debug, or warm a replacement service." },
    { term: "At-most-once", def: "Try to deliver; if it drops, accept the loss (welcome email)." },
    { term: "At-least-once", def: "Retry until delivery succeeds; duplicates possible (invoice email)." },
    { term: "Intent", def: "The reason a change happened, stored with the event so future consumers can reinterpret it." },
    { term: "Compaction", def: "Periodically squashing old events into a snapshot so replay does not start at time zero." }
  ],

  tradeoffs: [
    { pro: "Consumers stay available using their local log even if the producer is down.", con: "Replicas of the same fact diverge; consistency is the bill for that availability." },
    { pro: "Replay replaces a service smoothly and debugs production by walking time.", con: "Full replay is impractical at scale; undo does not exist for email-like effects." },
    { pro: "You can choose at-least-once vs at-most-once per event type.", con: "You lose request-response control: exact target, tight timeouts, simple call graphs." },
    { pro: "Storing intent lets a new service derive a different model from the same history.", con: "Teams cannot read one service’s code and know where the business actually goes." }
  ],

  interviewTips: [
    "Open with the one-liner: request-response asks; events announce. Map the rest of the tradeoffs from that.",
    "Only propose EDA when the domain is a log (feeds, games, Git-like history). If it does not click in two minutes, switch designs.",
    "Walk through rewind for the laggy shooter so they see timestamps are not decoration.",
    "Call out the email/external API exception when you talk about “just replay to migrate.”",
    "Mention compaction or snapshots so you are not claiming you replay five years of events on every boot."
  ],

  scene: {
    nodes: [
      { id: "zone_svc", label: "Event-driven services", type: "zone", pos: [0, 0, 2.5], size: [22, 10] },
      { id: "zone_game", label: "FPS timelines", type: "zone", pos: [0, 0, -7], size: [20, 3], showAt: 2 },
      { id: "phone", label: "Client A", type: "phone", pos: [-10, 0, 2] },
      { id: "s1", label: "Service 1", type: "service", pos: [-5, 0, 2] },
      { id: "bus", label: "Event bus", type: "queue", pos: [0, 0, 2] },
      { id: "s2", label: "Service 2", type: "service", pos: [6, 0, -1] },
      { id: "db2", label: "S2 event log", type: "db", pos: [10, 0, -1] },
      { id: "s3", label: "Service 3", type: "service", pos: [6, 0, 3] },
      { id: "db3", label: "S3 event log", type: "db", pos: [10, 0, 3] },
      { id: "s4", label: "Email service", type: "service", pos: [6, 0, 6] },
      { id: "mail", label: "Client B", type: "phone", pos: [10, 0, 6] },
      { id: "s5", label: "Service 5", type: "service", pos: [6, 0, -4], showAt: 6 },
      { id: "p1", label: "Player 1", type: "user", pos: [-8, 0, -7], showAt: 2 },
      { id: "gsrv", label: "Game server", type: "server", pos: [-1, 0, -7], showAt: 2 },
      { id: "p2", label: "Player 2", type: "user", pos: [6, 0, -7], showAt: 2 },
      { id: "pos9", label: "Shot: P2 at position 9", type: "note", pos: [2, 2.5, -7], showAt: 2 },
      { id: "pos10", label: "Server: P2 at position 10", type: "note", pos: [9, 2.5, -7], showAt: 2 },
      { id: "note_rewind", label: "Replay events up to time T", type: "note", pos: [-1, 3.2, -7], showAt: 3 },
      { id: "note_avail", label: "Local log → available, stale", type: "note", pos: [0, 3.2, 2], showAt: 5 }
    ],
    edges: [
      { from: "phone", to: "s1", label: "HTTP" },
      { from: "s1", to: "bus", label: "event" },
      { from: "bus", to: "s2", label: "fan-out", showAt: 1 },
      { from: "bus", to: "s3", label: "fan-out", showAt: 1 },
      { from: "s2", to: "db2", label: "append", showAt: 1 },
      { from: "s3", to: "db3", label: "append", showAt: 1 },
      { from: "s2", to: "bus", label: "new event", showAt: 1, dashed: true },
      { from: "bus", to: "s4", label: "send-mail", showAt: 1 },
      { from: "s4", to: "mail", label: "SMTP", showAt: 1 },
      { from: "p1", to: "gsrv", label: "shot @ t", showAt: 2 },
      { from: "p2", to: "gsrv", label: "moved to 10", showAt: 2 },
      { from: "bus", to: "s5", label: "replay", showAt: 6 }
    ],
    steps: [
      {
        title: "No direct service calls",
        text: "Client A hits Service 1. Internally, services do not RPC each other. They only speak to the event bus: “something happened that might concern you.” That is the difference from request-response.",
        highlight: ["phone", "s1", "bus"],
        flows: [{ from: "phone", to: "s1", color: "#4ade80", label: "req" }]
      },
      {
        title: "Consume, store, maybe emit",
        text: "S2 and S3 take the event if it is relevant, write it into their own logs, and S2 may emit a follow-on event. S4 turns a later event into an email to Client B. The tree of reactions replaces a call stack.",
        highlight: ["bus", "s2", "db2", "s3", "s4", "mail"],
        flows: [
          { from: "s1", to: "bus", color: "#fb923c", label: "event" },
          { from: "bus", to: "s2", color: "#fb923c", label: "sub" },
          { from: "bus", to: "s3", color: "#fb923c", label: "sub" },
          { from: "s2", to: "db2", color: "#c084fc", label: "log" },
          { from: "bus", to: "s4", color: "#fb923c", label: "mail?" },
          { from: "s4", to: "mail", color: "#fb923c", label: "email" }
        ]
      },
      {
        title: "The unfair headshot",
        text: "Player 1 fires when they see Player 2 at position 9. The packet is late. Player 2 has already reported position 10, so a naive server calls it a miss. At time T the world really was at 9.",
        highlight: ["p1", "gsrv", "p2", "pos9", "pos10"],
        flows: [
          { from: "p1", to: "gsrv", color: "#4ade80", label: "shot" },
          { from: "p2", to: "gsrv", color: "#60a5fa", label: "pos 10" }
        ]
      },
      {
        title: "Events are a time machine",
        text: "Treat movement and shots as timestamped events. Replay (or undo) to time T and re-evaluate: if Player 2 is at 9 in that reconstructed state, the headshot stands. This is why games and Git both think in event logs.",
        highlight: ["gsrv", "p1", "p2", "note_rewind", "pos9"],
        flows: [
          { from: "p1", to: "gsrv", color: "#fb923c", label: "event t" },
          { from: "p2", to: "gsrv", color: "#fb923c", label: "event t" }
        ]
      },
      {
        title: "Push persistence to consumers",
        text: "Each service stores the events it consumed, shaped for its needs. The bus can drop them. S2 does not have to ask S1 again if S1 later goes down. That is the availability trick — and the start of replica drift.",
        highlight: ["s2", "db2", "s3", "db3", "bus"],
        fail: ["s1"],
        flows: [
          { from: "s2", to: "db2", color: "#c084fc", label: "persist" },
          { from: "s3", to: "db3", color: "#c084fc", label: "persist" }
        ]
      },
      {
        title: "Available, not consistent",
        text: "High availability means S2 can answer from its log while S1 is dead. Consistency means every service’s copy of a fact matches — and it will not, until events catch up. Debug by walking the log to timestamp T. That is the CAP-shaped bill.",
        highlight: ["s2", "db2", "s1", "note_avail"],
        fail: ["s1"],
        flows: [{ from: "db2", to: "s2", color: "#60a5fa", label: "read local" }]
      },
      {
        title: "Replace S2 by replaying",
        text: "Stand up Service 5. Replay the event log from time 0 (or a snapshot) until S5 matches S2, subscribe to live events, then cut over. Smooth replacement — unless the service talks to the outside world.",
        highlight: ["bus", "s5", "s2", "db2"],
        hide: ["s2"],
        flows: [
          { from: "bus", to: "s5", color: "#c084fc", label: "history" },
          { from: "bus", to: "s5", color: "#fb923c", label: "live" }
        ]
      },
      {
        title: "Email cannot be replayed honestly",
        text: "S4 calls an external mail API. Replaying “send invoice” hits the provider at a new time with new responses. Time-dependent I/O breaks the replace-by-replay trick. Welcome mail can be at-most-once; invoices should be at-least-once — and still not blindly replayed years later.",
        highlight: ["s4", "mail", "bus"],
        flows: [
          { from: "bus", to: "s4", color: "#fb923c", label: "replay?" },
          { from: "s4", to: "mail", color: "#f87171", label: "wrong time" }
        ]
      },
      {
        title: "Flow lives on the bus",
        text: "S1’s source ends at publish. To know the product you inspect subscribers, ACLs, and priorities. Compaction snapshots keep replay feasible. Use this style when facts over time are the domain; do not fight it back into RPC.",
        highlight: ["s1", "bus", "s3", "s4", "s5"],
        flows: [
          { from: "s1", to: "bus", color: "#fb923c", label: "announce" },
          { from: "bus", to: "s3", color: "#fb923c", label: "?" },
          { from: "bus", to: "s4", color: "#fb923c", label: "?" },
          { from: "bus", to: "s5", color: "#fb923c", label: "?" }
        ]
      }
    ]
  }
});
