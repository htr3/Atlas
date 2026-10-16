window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 17,
  title: "WhatsApp System Design: Chat Messaging Systems",
  video: "https://www.youtube.com/watch?v=vvhC64hQZMk",
  category: "Case Studies",
  tagline: "Dumb gateways, a session router, and fanout capped at 200.",
  summary: "Walk through a chat system the way an interview expects: one-to-one delivery with WebSockets and receipts, then presence, then group fanout. Gateways only hold TCP connections; a sessions service maps users to boxes, a group service expands membership, and a queue retries work when a downstream box dies.",

  theory: [
    {
      heading: "What to design in the hour",
      body: "A chat interview is easy to over-scope. The lecture picks features that actually change the architecture and parks the rest. Group chats (WhatsApp caps a group at 200 people), sent / delivered / read ticks, last-seen, and whether history lives on the device or forever on the server are the interesting ones. Image and video sharing is real, but it is the same object-store plus CDN pattern already covered in the Tinder lecture, so it is a poor first pick if you are short on time.",
      bullets: [
        "Start with one-to-one chat. Interviewers usually accept the first feature you name, so name something you can actually finish.",
        "Ask whether chats are ephemeral (privacy + cheaper storage on the phone) or retained (compliance, workplace tools).",
        "Skip load balancing, auth, profiles, email/SMS, and service discovery unless the interviewer pulls you there — they are not WhatsApp-specific."
      ]
    },
    {
      heading: "Gateways should be dumb pipes",
      body: "Each phone keeps a long-lived connection to a gateway box in the cloud. That box is a protocol edge: the client may speak HTTP or a TLS-wrapped chat protocol, while internal services can use something lighter (the lecture names Thrift) without repeating HTTP's bulky headers and auth on every hop. Security and protocol translation stop at the gateway.<br><br>The tempting mistake is to also store <b>which user sits on which gateway</b> on those same boxes. A TCP connection already costs RAM; stuffing a user-to-box map on top of it lowers how many sockets one machine can hold. The map is also hot (people connect and drop constantly) and would be duplicated or cached on every gateway, which couples the fleet together. Keep the socket dumb: bytes in, bytes out.",
      bullets: [
        "Gateway = connection + protocol translation.",
        "Sessions microservice = user id to gateway box id.",
        "Run several session boxes so the map itself is not a single point of failure."
      ]
    },
    {
      heading: "One-to-one send, persist, push",
      body: "Alice on gateway 1 sends \"deliver this to Bob\". The gateway does not know Bob; it forwards to sessions. Sessions looks up Bob's box and forwards to gateway 2, which writes onto Bob's socket. That last hop cannot be ordinary request/response HTTP — the server would have to wait for Bob to ask. Long polling (\"any messages?\" every minute) works but is not realtime enough for chat. The lecture uses <b>WebSockets</b> so either side can push over the same TCP connection.<br><br>Before or in parallel with the push, persist the payload in a chat store. Once it is on disk, the system can retry until Bob's phone is reachable, and Alice can be told the message is <i>sent</i> (server accepted it). When Bob's client actually receives the bytes it acks back through gateway 2 → sessions → Alice's gateway, which is the <i>delivered</i> tick. Opening the thread sends the same kind of ack and becomes the <i>read</i> tick. Store-and-forward plus acks is how ticks stay correct even if Bob was offline.",
      bullets: [
        "Sent = durable on the server, not yet on Bob's device.",
        "Delivered = Bob's client acked the payload.",
        "Read = Bob opened the chat; reuse the same ack path.",
        "The message carries from and to, so sessions always knows who to notify."
      ]
    },
    {
      heading: "Last seen without lying",
      body: "Bob should not have to ping Alice's phone to learn if she is around. A last-seen service stores <code>userId → timestamp</code> and refreshes it on real user activity: sending, reading, opening the app. If Alice was active 3 seconds ago, show <b>online</b>, not \"last seen 3 seconds ago\". Pick a threshold (10–20 seconds) and only show a clock after she has been quiet longer than that.<br><br>The client must flag which requests are human actions versus app housekeeping. Background delivery polls, receipt acks, and similar traffic must <i>not</i> bump last-seen, or people look online while the phone sits in a pocket. Route only the activity-flagged requests into the last-seen service.",
      bullets: [
        "Presence is a query against a timestamp table, not a live RPC to the other user.",
        "Online = last activity within the threshold; otherwise show last-seen."
      ]
    },
    {
      heading: "Group chat is bounded fanout",
      body: "Sessions should not also own \"who is in group G\". That is a different cardinality (one group, many user ids) and a different write pattern (joins and leaves). A <b>group service</b> answers membership. On a group send: gateway → sessions → group service (member list) → sessions maps each member to a gateway → push. Cache the membership list; it is read-heavy.<br><br>Why 200 and not 2 million? Chat wants realtime push. Fanout of hundreds of WebSocket writes is fine; fanout of millions is the Instagram celebrity problem, which that lecture solved with pull/batching. WhatsApp-style apps therefore hard-cap group size (200 here; some products go to 500–600) so the session layer can still push.",
      bullets: [
        "Route the group service on group id (consistent hashing) so each box only stores some groups.",
        "Group <i>sent</i> is cheap (server accepted the fanout). Per-member delivered/read ticks are expensive; many products skip them."
      ]
    },
    {
      heading: "Keep the hot path cheap, and degrade on festivals",
      body: "Gateways are the RAM-expensive machines (one socket per online user). Do not parse JSON, authenticate payloads, or build rich objects there. Forward the still-unparsed bytes to a parser/unparser service that turns them into internal RPC objects and then into sessions. That shrinks the gateway's CPU and memory footprint so each box can hold more connections.<br><br>If the group service (or any hop) dies, you only retry if you still have the request. A <b>message queue</b> owns retries, backoff, and the \"give up after N attempts and tell the client\" path. Clients need a definite sent or failed, not silence. Sends must be idempotent so a retry does not create a duplicate bubble (same idea as the Tinder messaging video).<br><br>On New Year or Diwali the fleet is drowning in \"happy new year\". Rate limiting by dropping everything is worse than ranking: keep accepting and delivering the actual chat body; deprioritize or skip last-seen updates and receipt ticks. Users notice a missing message, not a missing second tick."
    }
  ],

  keyTerms: [
    { term: "Gateway", def: "Edge process that holds the client's TCP/WebSocket and translates external protocol to internal RPC. Should not store routing state." },
    { term: "Sessions service", def: "User-id to gateway-box map. The router for one-to-one and the second hop after group expansion." },
    { term: "WebSocket", def: "Bidirectional channel over TCP so the server can push a message without waiting for the client to poll." },
    { term: "Store-and-forward", def: "Persist first, then push and retry. Lets you ack 'sent' before the recipient is online." },
    { term: "Last-seen threshold", def: "If activity is newer than ~10–20s, render 'online'; older timestamps show as last seen." },
    { term: "Group fanout", def: "Expand group id to member ids, then to sockets, and push. Practical only if membership is capped." },
    { term: "Parser service", def: "Turns raw gateway bytes into internal objects so the connection boxes stay dumb and small." },
    { term: "Idempotent send", def: "Retries (and queue redeliveries) must not create duplicate messages in the thread." }
  ],

  tradeoffs: [
    { pro: "Dedicated sessions map keeps gateway RAM for sockets and avoids duplicating hot routing state.", con: "Every send now depends on another service; sessions must be highly available and cached." },
    { pro: "WebSockets give true realtime push both ways.", con: "Sticky connections, reconnect storms, and more operational load than periodic HTTP polls." },
    { pro: "Device-local history is private and cheap for the company.", con: "Reinstalls wipe chat; compliance and workplace products need a durable server copy." },
    { pro: "Hard cap (~200) keeps group send on a realtime push path.", con: "You cannot host a million-person room without switching to pull, batching, or a different product." },
    { pro: "Deprioritizing receipts under load protects the message path.", con: "Ticks become stale during the exact events when people stare at them." }
  ],

  interviewTips: [
    "Name 1:1 chat first, then receipts, then last-seen, then groups. Do not open with image pipelines unless asked.",
    "Draw the gateway as a dumb socket and put user-to-box mapping in sessions — that split is the punchline of the 1:1 design.",
    "Say why HTTP is not enough (server cannot push) and offer long poll as a fallback before WebSockets.",
    "For groups, say the cap out loud and contrast it with Instagram celebrity fanout.",
    "Mention a retry queue plus idempotency keys; mention degrading last-seen/receipts on festival load.",
    "If they want media, reuse the Tinder object-store answer instead of inventing a new stack."
  ],

  scene: {
    nodes: [
      { id: "cloud", label: "WhatsApp cloud", type: "zone", pos: [2, 0, 0], size: [14, 12] },
      { id: "a", label: "Alice", type: "phone", pos: [-11, 0, -4] },
      { id: "b", label: "Bob", type: "phone", pos: [-11, 0, 4] },
      { id: "c", label: "Cara", type: "phone", pos: [11, 0, -4], showAt: 8, color: "#f87171" },
      { id: "d", label: "Dev", type: "phone", pos: [11, 0, 4], showAt: 8, color: "#f87171" },
      { id: "gw1", label: "Gateway 1", type: "gateway", pos: [-6, 0, -4], showAt: 1 },
      { id: "gw2", label: "Gateway 2", type: "gateway", pos: [-6, 0, 4], showAt: 1 },
      { id: "sessions", label: "Sessions", type: "service", pos: [0, 0, 0], showAt: 2 },
      { id: "chatdb", label: "Chat store", type: "db", pos: [5.5, 0, 5], showAt: 3 },
      { id: "lastseen", label: "Last seen", type: "service", pos: [0, 0, 5], showAt: 6 },
      { id: "groups", label: "Group service", type: "service", pos: [5.5, 0, -4], showAt: 8 },
      { id: "parser", label: "Parser", type: "service", pos: [0, 0, -5], showAt: 9 },
      { id: "mq", label: "Retry queue", type: "queue", pos: [5.5, 0, 1], showAt: 10 },
      { id: "n_ws", label: "WebSockets, not HTTP", type: "note", pos: [-6, 3.4, 0], showAt: 1 },
      { id: "n_map", label: "userId → boxId", type: "note", pos: [0, 3.4, 0], showAt: 2 },
      { id: "n_online", label: "online if last act <15s", type: "note", pos: [0, 3.4, 5], showAt: 7 },
      { id: "n_cap", label: "cap fanout at 200", type: "note", pos: [5.5, 3.4, -4], showAt: 8 },
      { id: "n_prio", label: "keep body, drop ticks", type: "note", pos: [5.5, 3.4, 2], showAt: 11 }
    ],
    edges: [
      { from: "a", to: "gw1", label: "WS", showAt: 1 },
      { from: "b", to: "gw2", label: "WS", showAt: 1 },
      { from: "c", to: "gw2", label: "WS", showAt: 8 },
      { from: "d", to: "gw2", label: "WS", showAt: 8 },
      { from: "gw1", to: "sessions", showAt: 2 },
      { from: "gw2", to: "sessions", showAt: 2 },
      { from: "sessions", to: "chatdb", showAt: 3 },
      { from: "gw1", to: "lastseen", showAt: 6, dashed: true },
      { from: "sessions", to: "groups", showAt: 8 },
      { from: "gw1", to: "parser", showAt: 9, dashed: true },
      { from: "parser", to: "sessions", showAt: 9 },
      { from: "sessions", to: "mq", showAt: 10 }
    ],
    steps: [
      {
        title: "Start with one-to-one",
        text: "Alice wants to message Bob. Scope the interview to 1:1 chat first; groups, receipts, and last-seen come after this path works. Media can wait — it is the same blob store as Tinder.",
        highlight: ["a", "b"],
        flows: []
      },
      {
        title: "Phones sit on gateways",
        text: "Each device holds a WebSocket to a gateway. The gateway is a protocol edge, not a chat brain: external crypto and headers stop here so internal hops can be cheap.",
        highlight: ["gw1", "gw2", "n_ws"],
        flows: [
          { from: "a", to: "gw1", color: "#4ade80", label: "connect" },
          { from: "b", to: "gw2", color: "#4ade80", label: "connect" }
        ]
      },
      {
        title: "Sessions owns the user-to-box map",
        text: "Do not store 'Bob is on gateway 2' on the gateway fleet — sockets already eat RAM, and the map churns. A sessions service is the router: user id in, box id out.",
        highlight: ["sessions", "n_map"],
        flows: [
          { from: "gw1", to: "sessions", color: "#60a5fa", label: "where is Bob?" }
        ]
      },
      {
        title: "Persist, then push",
        text: "Alice's send hits gateway 1 → sessions → gateway 2 → Bob. Write the payload to the chat store first so the system can retry if Bob is offline, and so Alice can get a sent tick.",
        highlight: ["sessions", "chatdb", "gw2"],
        flows: [
          { from: "a", to: "gw1", color: "#4ade80", label: "msg" },
          { from: "gw1", to: "sessions", color: "#4ade80", label: "to Bob" },
          { from: "sessions", to: "chatdb", color: "#c084fc", label: "persist" },
          { from: "sessions", to: "gw2", color: "#4ade80", label: "route" },
          { from: "gw2", to: "b", color: "#4ade80", label: "push" }
        ]
      },
      {
        title: "Sent tick comes back",
        text: "Once the server has the durable copy, sessions tells Alice's gateway. That is the single tick: the platform accepted the message and will keep retrying Bob.",
        highlight: ["a", "gw1", "chatdb"],
        flows: [
          { from: "sessions", to: "gw1", color: "#60a5fa", label: "sent" },
          { from: "gw1", to: "a", color: "#60a5fa", label: "1 tick" }
        ]
      },
      {
        title: "Delivered (and later read)",
        text: "Bob's client acks through gateway 2. Sessions looks up Alice's box and pushes a delivery receipt. Opening the thread is the same loop with a read flag.",
        highlight: ["b", "sessions", "a"],
        flows: [
          { from: "b", to: "gw2", color: "#fb923c", label: "ack" },
          { from: "gw2", to: "sessions", color: "#fb923c", label: "got it" },
          { from: "sessions", to: "gw1", color: "#60a5fa", label: "delivered" },
          { from: "gw1", to: "a", color: "#60a5fa", label: "2 ticks" }
        ]
      },
      {
        title: "Last-seen is a side channel",
        text: "Bob should not ask Alice's phone. Flag human actions on the request; those updates go to a last-seen service. App-generated polls and receipt acks must not bump the timestamp.",
        highlight: ["lastseen", "gw1"],
        flows: [
          { from: "gw1", to: "lastseen", color: "#fb923c", label: "activity" }
        ]
      },
      {
        title: "Online vs last seen",
        text: "If Alice acted within ~15 seconds, Bob sees 'online'. Older timestamps print as last seen. Presence is a read of that key-value row, not a live probe.",
        highlight: ["lastseen", "n_online", "b"],
        flows: [
          { from: "b", to: "gw2", color: "#60a5fa", label: "is Alice up?" },
          { from: "gw2", to: "lastseen", color: "#60a5fa", label: "query" }
        ]
      },
      {
        title: "Groups: expand, then fan out",
        text: "Cara and Dev are in Alice's red group but sit on gateway 2. Sessions asks the group service for member ids, maps each to a box, and pushes. Cap the group at 200 so this stays realtime — unlike Instagram celebrity blast.",
        highlight: ["groups", "n_cap", "c", "d", "a"],
        flows: [
          { from: "a", to: "gw1", color: "#4ade80", label: "group msg" },
          { from: "sessions", to: "groups", color: "#60a5fa", label: "members?" },
          { from: "sessions", to: "gw2", color: "#4ade80", label: "fanout" },
          { from: "gw2", to: "c", color: "#4ade80", label: "push" },
          { from: "gw2", to: "d", color: "#4ade80", label: "push" }
        ]
      },
      {
        title: "Parse off the gateway",
        text: "Do not deserialize or auth-check on the socket box. Ship unparsed bytes to a parser that emits internal objects (e.g. Thrift) and then into sessions. That is how you raise connections per machine.",
        highlight: ["parser", "gw1", "gw2"],
        flows: [
          { from: "gw1", to: "parser", color: "#fb923c", label: "raw bytes" },
          { from: "parser", to: "sessions", color: "#4ade80", label: "object" }
        ]
      },
      {
        title: "Queue the retries",
        text: "If the group box is down you can only retry if the request still exists. A message queue owns attempts and eventually surfaces failure to the client. Sends need idempotency keys so a retry is not a duplicate bubble.",
        highlight: ["mq", "groups", "sessions"],
        fail: ["groups"],
        flows: [
          { from: "sessions", to: "mq", color: "#fb923c", label: "retry" },
          { from: "mq", to: "groups", color: "#fb923c", label: "attempt" }
        ]
      },
      {
        title: "Festival load: keep the body",
        text: "On Diwali or New Year, deprioritize last-seen and receipt traffic instead of dropping chats. The first duty is accept + deliver the message; ticks are optional under stress.",
        highlight: ["n_prio", "sessions", "a"],
        hide: ["lastseen", "n_online"],
        flows: [
          { from: "a", to: "gw1", color: "#4ade80", label: "happy diwali" },
          { from: "gw2", to: "b", color: "#4ade80", label: "deliver" }
        ]
      }
    ]
  }
});
