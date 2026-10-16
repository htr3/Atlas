window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 15,
  title: "System Design: Tinder as a Microservice Architecture",
  video: "https://www.youtube.com/watch?v=tndzLznxq40",
  category: "Case Studies",
  tagline: "Profiles, matches, chat, and geo recs as separate services behind a gateway.",
  summary: "A feature-first walkthrough of Tinder: four scoped capabilities, files instead of BLOBs for photos, an API gateway that owns auth, XMPP/WebSocket chat via a session map, a matcher as source of truth, and location-sharded recommendations. The lecture is a template for starting a dating-app interview without drowning in an ER diagram.",

  theory: [
    {
      heading: "Start from features, not the schema",
      body: "In the room you will be tempted to name databases and draw boxes immediately. Pause. Two starting styles exist: ER-first (model tables, then invent services that consume them) and feature-first (list what a user actually does, split services around those jobs, then give each service its own data). The lecture argues the second is more flexible and gets you shipping in an interview. Cap yourself at four or five features in a one-hour loop. Asking ten clarifying questions per feature looks like you cannot prioritize.",
      bullets: [
        "Confirm the obvious (yes, we store profiles) and one or two numbers, then move on.",
        "Do not invent extra products (stories, live video) unless the interviewer asks."
      ]
    },
    {
      heading: "Four features and a few numbers",
      body: "Walk the product as a story: create a profile, get suggested people, record a match, then chat. Photos matter on a dating app, so pin a constant such as five images per user. Ask for active-user count; skip country-by-country population rabbit holes. Matches can be estimated as a small fraction of swipes — the lecture uses a rough 0.1% match rate (active users times 10^-3) as an Indian-market assumption, not a measured Tinder statistic. Direct messaging only exists after a mutual match. Those four pillars are enough to drive the rest of the design.",
      bullets: [
        "Profiles + photos",
        "Recommendations (who to show next)",
        "Recording matches",
        "1:1 chat after a match"
      ]
    },
    {
      heading: "Photos: files beat BLOBs",
      body: "The only hard storage question is <i>where the bytes live</i>. A database BLOB gives mutability, transactions, indexes, and access control. Images do not need in-place bit edits (replace the file), do not need multi-row transactions on pixels, and cannot be indexed by binary content. Access control is doable on a locked-down file system about as painfully as on a secured DB. Files are cheaper, purpose-built for large objects, play nicely with a CDN, and avoid a <code>SELECT *</code> that accidentally pulls megabytes of image data. Keep a slim table of <code>profileId</code>, <code>imageId</code>, and file URL; put the bytes on a distributed file system. If the interviewer insists on BLOBs, accept it — the rest of the architecture still works.",
      bullets: [
        "DB extras you do not need: mutate, transactions, content indexes.",
        "File extras you do want: cost, CDN, no blob-in-row footgun."
      ]
    },
    {
      heading: "Profile service and the API gateway",
      body: "A mobile client registers with a profile service (username, password, later bio and age). Email / 2FA can live nearby; the lecture folds that into profile for brevity. Naive auth puts username+password on every call into profile. Tokens are the interview-safe upgrade. The real smell is duplication: tomorrow an image service, a matcher, and a chat path all need to know whether a token is valid, so they either copy crypto or call profile on every request. An API gateway is the single public door. Clients talk only to the gateway. The gateway asks profile 'is this token real?', then either fails the call or forwards it to the right internal service and relays the response. That also lets you terminate HTTP on the outside and speak a different protocol inside (useful once chat arrives).",
      bullets: [
        "Gateway owns routing + auth checks; profile owns user records.",
        "Images belong in their own service: ML or a heavy 'all photos' path should not drag the bio/age DB."
      ]
    },
    {
      heading: "Chat needs push, sessions, and a matcher",
      body: "HTTP is request/response. The server cannot spontaneously tap a phone, so the only HTTP chat is polling ('any messages?') every few seconds — wasteful on battery and fan-in. Use a peer-style protocol such as XMPP over a long-lived WebSocket, or say you will keep a raw TCP connection if you do not want to name XMPP. Someone must map <code>userId → connection</code>. Do not dump that table on the gateway; a session service owns live sockets. Matches should not live only on the phone: uninstall loses them, and the server must be source of truth. A matcher service stores duplicated rows <code>(A,B)</code> and <code>(B,A)</code> with indexes on both user ids. A DM is authorized by matcher ('are these two matched?'), then session service resolves the peer's socket, then the gateway writes down that connection. Swipe-left/right history can stay on device; losing it only re-shows people, which is acceptable.",
      bullets: [
        "Mention XMPP or TCP+WebSocket when the prompt is chat.",
        "Matcher gates messaging; sessions only answer 'which socket?'."
      ]
    },
    {
      heading: "Recommendations: one index is not three",
      body: "The expensive question is 'who is near me?', then filter gender and age. Putting three indexes on one relational table does not give you three sort orders at once — the optimizer picks one path, then scans. Options: a query-oriented store (Cassandra / Dynamo-style, table-per-access-pattern) or DIY sharding (horizontal partitioning). Shard on <b>location chunks</b> (city tiles, not necessarily city names) so 'people in this cell' is one node. On that node, sort by age and filter gender. Update the client's current cell every hour or so — more frequent pings are wasted writes. Each shard should not be a SPOF: master/replica (or multi-master if you can defend it). Cassandra/Dynamo package a lot of this; sharding is the story if you stay on RDS. A recommendation service stores userId + current cell and serves the nearby candidate set to the app.",
      bullets: [
        "Core rec loop: geo cell → age range → gender filter.",
        "Tinder is a gentle first case study: no news feed, no group chat."
      ]
    }
  ],

  keyTerms: [
    { term: "Feature-first design", def: "List user jobs, split services around them, then pick per-service storage — instead of drawing the global ER diagram first." },
    { term: "BLOB vs file", def: "Database binary large object versus bytes on a filesystem/DFS. Dating photos usually win as immutable files plus a URL in a table." },
    { term: "API gateway", def: "Only public entry. Checks tokens with the profile service, routes to the correct microservice, and can translate protocols." },
    { term: "XMPP / WebSocket", def: "Push-friendly session protocol so the server can deliver chat without the client polling HTTP." },
    { term: "Session service", def: "Maps userId to the live connection/socket the gateway must write to." },
    { term: "Matcher service", def: "Source of truth for mutual matches; duplicated (A,B) and (B,A) rows, indexed so either person can look up the other." },
    { term: "Location shard", def: "Horizontal partition keyed by a geo cell so nearby candidates live on one node; age/gender filtered inside that node." },
    { term: "Master-replica", def: "Per-shard standby so a crashed partition does not drop every user in that name/geo range." }
  ],

  tradeoffs: [
    { pro: "Files + CDN: cheap, immutable, hard to SELECT * a photo by accident.", con: "You still need a DB row for URL/ACL; blobs are simpler if the interviewer wants one store." },
    { pro: "Gateway centralizes auth and protocol translation so new services stay thin.", con: "The gateway becomes a critical hop; it must be scaled and kept simple." },
    { pro: "Swipe history on the phone keeps the matcher tiny (only mutual matches).", con: "Reinstall resets left/right history and people reappear in the deck." },
    { pro: "Geo sharding + one local age index makes 'who's nearby' a bounded query.", con: "Chunk boundaries, moves between cells, and hotspot cities all need a story (consistent hashing, replicas)." },
    { pro: "Cassandra/Dynamo give multi-access-pattern tables without hand-rolled shards.", con: "Operational novelty in an interview; a sharded SQL story may be easier to defend." }
  ],

  interviewTips: [
    "Open with four features and two numbers (photos per user, active users / match rate). Do not start with Kafka.",
    "Argue file vs BLOB once, then defer if they want BLOBs — they are testing judgment, not a hill to die on.",
    "Say 'token' at the gateway. If they dive into JWT crypto, keep it short and return to routing.",
    "For chat, name HTTP's poll problem and propose XMPP or a long-lived TCP/WebSocket plus a session map.",
    "Call out that one SQL table cannot be 'sorted three ways'; pick geo as the shard key and filter the rest.",
    "Keep swipe-left/right on the client and matches on the server so uninstall is a bounded loss."
  ],

  scene: {
    nodes: [
      { id: "u1", label: "Alice", type: "phone", pos: [-10, 0, -3] },
      { id: "u2", label: "Bob", type: "phone", pos: [-10, 0, 3] },
      { id: "nFeat", label: "4 features: profile, rec, match, chat", type: "note", pos: [-6, 3.4, -6] },
      { id: "gw", label: "API Gateway", type: "gateway", pos: [-5.5, 0, 0], showAt: 5 },
      { id: "profile", label: "Profile svc", type: "service", pos: [0, 0, -5], showAt: 1 },
      { id: "pdb", label: "Profile DB", type: "db", pos: [5, 0, -5], showAt: 1 },
      { id: "nFile", label: "Files beat BLOBs (CDN-ready)", type: "note", pos: [3, 3.4, -6.5], showAt: 2 },
      { id: "img", label: "Image svc", type: "service", pos: [0, 0, -1.5], showAt: 3 },
      { id: "dfs", label: "DFS (files)", type: "storage", pos: [5, 0, -1.5], showAt: 3 },
      { id: "imgdb", label: "Image meta", type: "db", pos: [9.5, 0, -1.5], showAt: 3 },
      { id: "cdn", label: "CDN", type: "cdn", pos: [9.5, 0, -5], showAt: 3 },
      { id: "nXmpp", label: "XMPP / WebSocket push", type: "note", pos: [-5.5, 3.4, 4], showAt: 6 },
      { id: "sess", label: "Session svc", type: "service", pos: [0, 0, 2], showAt: 7 },
      { id: "match", label: "Matcher svc", type: "service", pos: [0, 0, 5.5], showAt: 8 },
      { id: "mdb", label: "Matches DB", type: "db", pos: [5, 0, 5.5], showAt: 8 },
      { id: "rec", label: "Recs svc", type: "service", pos: [5, 0, 2], showAt: 10 },
      { id: "geo", label: "Location chunks", type: "zone", pos: [9.5, 0, 4.5], size: [5, 6], showAt: 10 },
      { id: "s1", label: "Chunk A", type: "db", pos: [7.5, 0, 3.2], showAt: 10 },
      { id: "s2", label: "Chunk B", type: "db", pos: [9.5, 0, 6], showAt: 10 },
      { id: "s3", label: "Chunk C", type: "db", pos: [11.5, 0, 3.2], showAt: 10 },
      { id: "nGeo", label: "Shard geo, then age/gender", type: "note", pos: [8, 3.4, 1], showAt: 10 }
    ],
    edges: [
      { from: "u1", to: "profile", label: "register", showAt: 1 },
      { from: "profile", to: "pdb", label: "user row", showAt: 1 },
      { from: "img", to: "dfs", label: "bytes", showAt: 3 },
      { from: "img", to: "imgdb", label: "URL", showAt: 3 },
      { from: "dfs", to: "cdn", label: "static", showAt: 3 },
      { from: "u1", to: "gw", label: "HTTPS", showAt: 5 },
      { from: "u2", to: "gw", label: "HTTPS", showAt: 5 },
      { from: "gw", to: "profile", label: "auth?", showAt: 5 },
      { from: "gw", to: "img", label: "photos", showAt: 5 },
      { from: "gw", to: "sess", label: "XMPP", showAt: 7 },
      { from: "sess", to: "u2", label: "socket", showAt: 7, dashed: true },
      { from: "gw", to: "match", label: "matched?", showAt: 8 },
      { from: "match", to: "mdb", label: "A\leftrightarrow B", showAt: 8 },
      { from: "match", to: "sess", label: "ok to DM", showAt: 9 },
      { from: "gw", to: "rec", label: "deck", showAt: 10 },
      { from: "rec", to: "s1", label: "nearby", showAt: 10 },
      { from: "rec", to: "s2", showAt: 10, dashed: true },
      { from: "rec", to: "s3", showAt: 10, dashed: true }
    ],
    steps: [
      {
        title: "Scope four features",
        text: "Alice and Bob open the app. In an interview, list a short story: store profiles (about five photos each), recommend nearby people, record mutual matches (~0.1% of swipes as a working guess), then 1:1 chat. Stop there.",
        highlight: ["u1", "u2", "nFeat"]
      },
      {
        title: "Profile service",
        text: "Registration hits a profile service: username, password, later bio, age, gender. Rows live in a regular database. Tokens replace sending the password on every later call.",
        highlight: ["u1", "profile", "pdb"],
        flows: [
          { from: "u1", to: "profile", color: "#4ade80", label: "sign up" },
          { from: "profile", to: "pdb", color: "#4ade80", label: "insert" }
        ]
      },
      {
        title: "Files, not BLOBs",
        text: "Photos are large and immutable. A DB BLOB's extra guarantees (in-place updates, transactions, content indexes) are unused. Store bytes as files; keep only IDs and URLs in a table.",
        highlight: ["nFile", "profile", "pdb"]
      },
      {
        title: "Image service + CDN",
        text: "A dedicated image service writes files to a distributed filesystem, stores profileId / imageId / URL in its own DB, and sits behind a CDN so static photos are cheap to read worldwide.",
        highlight: ["img", "dfs", "imgdb", "cdn"],
        flows: [
          { from: "img", to: "dfs", color: "#4ade80", label: "file" },
          { from: "img", to: "imgdb", color: "#4ade80", label: "URL" },
          { from: "dfs", to: "cdn", color: "#60a5fa", label: "cache" }
        ]
      },
      {
        title: "Do not let every service authenticate",
        text: "If profile, images, and tomorrow's matcher each check tokens, auth logic clones itself. Clients also should not know internal addresses. We need one front door.",
        highlight: ["u1", "profile", "img"]
      },
      {
        title: "API gateway",
        text: "Phones talk only to the gateway. It asks profile whether the token is valid. On yes, it forwards to the right service and copies the response back. On no, the request dies at the edge.",
        highlight: ["gw", "profile", "u1", "u2"],
        flows: [
          { from: "u1", to: "gw", color: "#4ade80", label: "token" },
          { from: "gw", to: "profile", color: "#fb923c", label: "auth?" },
          { from: "profile", to: "gw", color: "#60a5fa", label: "yes" },
          { from: "gw", to: "img", color: "#4ade80", label: "update" }
        ]
      },
      {
        title: "HTTP cannot push chat",
        text: "A client-server HTTP world means Bob only learns Alice wrote him by polling. Switch to XMPP (or a long-lived TCP/WebSocket) so the server can push. The gateway is a good place to terminate that protocol.",
        highlight: ["u1", "u2", "gw", "nXmpp"],
        flows: [
          { from: "u1", to: "gw", color: "#fb923c", label: "msg" }
        ]
      },
      {
        title: "Session service",
        text: "Each live socket is a connection the gateway holds. A session service stores userId → connection so we can find which socket Bob is listening on. That map is deliberately not stuffed into the gateway.",
        highlight: ["sess", "gw", "u2"],
        flows: [
          { from: "gw", to: "sess", color: "#fb923c", label: "where is Bob?" },
          { from: "sess", to: "u2", color: "#60a5fa", label: "socket id" }
        ]
      },
      {
        title: "Matcher is source of truth",
        text: "Mutual matches are written twice (A→B and B→A) with indexes on both ids. The phone may cache the list, but uninstall must be able to pull matches back from this service. Swipe history can die on the device.",
        highlight: ["match", "mdb", "u1", "u2"],
        flows: [
          { from: "gw", to: "match", color: "#4ade80", label: "it's a match" },
          { from: "match", to: "mdb", color: "#4ade80", label: "A,B + B,A" }
        ]
      },
      {
        title: "Direct message path",
        text: "Alice's chat frame hits the gateway, matcher confirms they matched, session service returns Bob's socket, then the payload is pushed to Bob. Long hop, but each box has one job.",
        highlight: ["u1", "gw", "match", "sess", "u2"],
        flows: [
          { from: "u1", to: "gw", color: "#4ade80", label: "DM" },
          { from: "gw", to: "match", color: "#fb923c", label: "allowed?" },
          { from: "match", to: "sess", color: "#60a5fa", label: "ok" },
          { from: "sess", to: "u2", color: "#4ade80", label: "push" }
        ]
      },
      {
        title: "Recommend by location chunks",
        text: "You cannot sort one table by age, gender, and GPS at once. Shard users into geo cells (Cassandra/Dynamo or hand-rolled horizontal partitions with replicas). Recs service reads Alice's cell, then filters age and gender.",
        highlight: ["rec", "geo", "s1", "s2", "s3", "nGeo"],
        flows: [
          { from: "gw", to: "rec", color: "#4ade80", label: "nearby?" },
          { from: "rec", to: "s1", color: "#60a5fa", label: "this chunk" }
        ]
      },
      {
        title: "Deck in, swipe out",
        text: "The full loop: recs fill Alice's deck from her location shard; she swipes on-device; a mutual like writes the matcher; chat is allowed only after that. Tinder stays simple because there is no news feed and no group chat.",
        highlight: ["u1", "gw", "rec", "s1", "match", "sess", "u2"],
        flows: [
          { from: "rec", to: "gw", color: "#60a5fa", label: "candidates" },
          { from: "gw", to: "u1", color: "#60a5fa", label: "deck" },
          { from: "u1", to: "gw", color: "#4ade80", label: "right-swipe" }
        ]
      }
    ]
  }
});
