window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 36,
  title: "Design Food Delivery and Ride Dispatch",
  video: "",
  category: "Roadmap Case Studies",
  tagline: "Ping locations, match with constraints, assign once, then track the trip until complete.",
  summary: "Swiggy and Uber share a dispatch loop: a demand event (order or ride), a set of supply (riders) with live locations, constraints (food hot, car type, ETA, batching), a single assignment, then tracking. This is not the quadtree lecture — indexing nearby points is one lookup. The interview is matching under churn, idempotent assign, cancellations, and what happens when 10k pings/s meet a rain spike. P0: request, match, assign, track, complete. Catalog and payments are neighboring boxes, not the core.",

  theory: [
    {
      heading: "Two products, one dispatch machine",
      body: "Food: a restaurant needs a rider in 5–10 minutes, the bag has a spoilage clock, you may batch two orders. Rides: a rider wants a car of a type now, the match is two-sided (driver can reject), surge prices, pooling. P0 for both: (1) place demand, (2) find candidates, (3) assign exactly one supply, (4) live track, (5) complete and pay. P1: ads, chat, subscriptions. NFRs: p95 match 2–5 s felt time (can include a search animation), assignment must not double-bind a rider, location freshness < 5 s on an active trip, catalog of restaurants can lag. Scale: 1 M concurrent sessions, 1–5 Hz pings from active workers, far fewer from idle ones. The hotspot is ping ingest + the matcher, not the menu CDN.",
      bullets: [
        "Out of scope: building maps tiles (use a provider) and the full ledger (reuse payments).",
        "Geo-index (quadtree, geohash, Redis GEO) is a tool inside candidate search, not the architecture.",
        "Rain/surge is the estimate that should change the diagram: matcher backlog, not a bigger menu DB."
      ]
    },
    {
      heading: "Location pings and presence",
      body: "Riders send lat/lng/heading/speed. Do not write each ping to Postgres. Ingest via gateway → Kafka (partition by riderId) → a location service that (a) updates an in-memory or Redis GEO structure, (b) optionally persists a downsampled trail for the active trip. Idle riders ping every 10–30 s; assigned riders every 1–2 s; after 90 s silence they are offline. Spring: a WebSocket or HTTP POST <code>/pings</code> that only validates JWT and appends to Kafka — the servlet must not run the matcher. Presence is a TTL key. The trip polyline for the customer is a small cache updated from the same consumer, not a query of the global GEO set.",
      bullets: [
        "Partition pings by riderId so one rider's locations stay ordered.",
        "Drop pings with poor accuracy or jumps of 5 km/s — GPS lies.",
        "Do not build the quadtree in the interview unless they pull you there; name Redis GEO or geohash cells."
      ]
    },
    {
      heading: "Match: candidates, score, offer, assign",
      body: "On demand create, the matcher queries supply within a radius/cell, filters by vehicle, remaining bag capacity, shift, and already-assigned flag, then scores (ETA, rating, batching detour, fairness). Food often auto-assigns the top score. Rides often offer to N drivers for T seconds (or sequential). <b>Exactly-once assignment</b>: <code>UPDATE riders SET trip_id=? WHERE id=? AND trip_id IS NULL</code> or a unique active-trip constraint. If the offer times out, the demand returns to the pool. Idempotency: a retry of \"place order\" must not spawn two match loops — unique demand id. Spring: <code>DispatchService</code> is a single-threaded actor per geohash cell or a lock per demand id so two matchers do not offer the same rider.",
      bullets: [
        "ETA is a routing estimate plus load; lying ETA is a product incident.",
        "Batching: second order only if detour < threshold and both bags fit. Re-score, do not greedily dump.",
        "Reject/timeout is the common path. Design the loop, not the happy assign only."
      ]
    },
    {
      heading: "Trip state machine and tracking",
      body: "Demand states: created → matching → assigned → (picked up / at restaurant) → in progress → completed | cancelled. Persist transitions in a trip table; push to the customer over WebSocket. The assigned rider's pings now fan into that trip's channel only. Cancellation: if before pickup, free the rider with the same CAS that assigned them; if after pickup, apply a fee via the ledger. Dual-write of \"assigned\" to rider and trip goes through one DB transaction or an outbox so you never have a rider bound to a dead trip. Chat and support are P1 consumers of the same trip id.",
      bullets: [
        "Customer map: last ping + predicted point. Do not stream 5 Hz to 1 M idle app opens — only the active trip.",
        "Restaurant accepted vs rider assigned are two clocks in food; either can fail independently.",
        "Complete is the only state that triggers capture of the hold/preauth."
      ]
    },
    {
      heading: "Surge, failure, and fairness",
      body: "Rain spike: ping QPS and demand QPS jump together. Kafka absorbs pings; the matcher may lag — show \"looking\" not a 500. Broaden radius, raise prices, cap waiting time, then fail the request with a retry. Matcher crash: unassigned demands are in a queue with visibility timeout; another worker takes them. Assigned-but-worker-died: the trip row is source of truth, not the worker heap. Multi-region: city is the shard. Do not match a Delhi rider to a Mumbai order. Split-brain in one city is the real danger — one leader per cell or a DB CAS. Fairness: a greedy nearest-neighbor starves far riders; inject a small exploration term. Fraud: ping spoofing, fake completes — bind to device, snap GPS at pickup.",
      bullets: [
        "City shard is the scale story. Global GEO of the planet is a trap.",
        "Dead-letter demands that fail match for 15 minutes. Ops, not an infinite loop.",
        "When they ask quadtrees, one sentence: we bucket pings in geohash cells of ~500 m, then scan k cells. Then return to assign CAS."
      ]
    },
    {
      heading: "Recap versus e-commerce stock",
      body: "Inventory here is a moving human with a TTL presence, not a SKU counter. You still need CAS on assign, but you also need a live index and an offer/timeout loop. Payments and restaurant menus are caches and a checkout-like pay step — do not let them eat the board. Metrics: match time p95, assign conflict rate, ping lag, cancel-after-assign, idle rider minutes. Java: bounded ping ingest pool, matcher actors per cell, no lock held across the maps ETA HTTP call — snapshot candidates, drop the lock, score, then CAS.",
      bullets: [
        "If they combine food+ride in one app, still one dispatch service with a demand type enum.",
        "Pooling/batching is a constraint on the scorer, not a second system.",
        "P1 waitlists from ticket booking do not apply; unmatched demand expires or reprices."
      ]
    }
  ],

  keyTerms: [
    { term: "Ping", def: "A location heartbeat. High rate when on-trip, TTL-offline when silent." },
    { term: "Presence", def: "Whether a rider is matchable: online, not assigned, fresh ping, right vehicle." },
    { term: "Candidate set", def: "Supply inside a geohash/radius after hard filters, before scoring." },
    { term: "Offer window", def: "Seconds a driver has to accept; on timeout the demand is rematched." },
    { term: "Assign CAS", def: "Update supply to busy only if still free; the uniqueness invariant for dispatch." },
    { term: "Batching", def: "Second drop on the same rider if detour and capacity allow, re-scored not dumped." },
    { term: "City shard", def: "Match never crosses city/region. Ping and demand partitions follow the city." },
    { term: "Trip state", def: "Durable machine from matching through complete; workers are expendable." }
  ],

  tradeoffs: [
    { pro: "Auto-assign is simple and fast for food.", con: "Drivers cannot reject a bad batch; you pay in cancellations." },
    { pro: "Offer-to-N is fairer for rides.", con: "Match time grows; two drivers can accept and one must lose the CAS." },
    { pro: "Redis GEO makes radius queries easy.", con: "It is not the trip source of truth; a flush must not strand assignments." },
    { pro: "Kafka ping ingest survives a rain spike.", con: "Matcher lag means stale locations unless you read the latest per riderId." },
    { pro: "City shards avoid planet-wide indexes.", con: "Airport trips that cross a boundary need an explicit extra cell list." }
  ],

  interviewTips: [
    "Say this is a dispatch loop, not a maps product. Geo-index is one lookup.",
    "Pings → Kafka by riderId → Redis GEO/presence. Matcher is a different consumer.",
    "Assignment is CAS on the rider. Offers can race; the unique trip_id wins.",
    "Draw the trip state machine. Cancel and timeout are first-class.",
    "Shard by city. Rain spike: queue pings, broaden radius, surge, then fail.",
    "Do not hold a lock while calling the ETA provider. Snapshot, score, CAS."
  ],

  scene: {
    nodes: [
      { id: "cust", label: "Customer", type: "phone", pos: [-11, 0, -2.5] },
      { id: "rider", label: "Rider", type: "phone", pos: [-11, 0, 2.5] },
      { id: "gw", label: "Gateway", type: "gateway", pos: [-7, 0, 0] },
      { id: "pingq", label: "Ping Kafka", type: "queue", pos: [-3, 0, 3.5], showAt: 1 },
      { id: "geo", label: "Presence GEO", type: "cache", pos: [1.5, 0, 3.5], showAt: 1 },
      { id: "demand", label: "Demand svc", type: "service", pos: [-3, 0, -2.5], showAt: 2 },
      { id: "match", label: "Matcher", type: "worker", pos: [1.5, 0, 0], showAt: 3 },
      { id: "trip", label: "Trip DB", type: "db", pos: [5.5, 0, 0], showAt: 4 },
      { id: "eta", label: "ETA maps", type: "service", pos: [1.5, 0, -3.5], showAt: 3 },
      { id: "ws", label: "Track WS", type: "server", pos: [5.5, 0, -3.5], showAt: 5 },
      { id: "cell", label: "City shard", type: "zone", pos: [1.5, 0, 0], size: [12, 10], showAt: 1 },
      { id: "surge", label: "Surge rules", type: "note", pos: [5.5, 0, 3.5], showAt: 7 },
      { id: "n0", label: "Assign exactly one", type: "note", pos: [-7, 0, -6.8] },
      { id: "n1", label: "Pings not in Postgres", type: "note", pos: [-3, 0, 6.8], showAt: 1 },
      { id: "n2", label: "CAS trip_id IS NULL", type: "note", pos: [5.5, 0, 6.8], showAt: 4 }
    ],
    edges: [
      { from: "rider", to: "gw", label: "ping" },
      { from: "gw", to: "pingq", showAt: 1 },
      { from: "pingq", to: "geo", showAt: 1 },
      { from: "cust", to: "gw" },
      { from: "gw", to: "demand", showAt: 2 },
      { from: "demand", to: "match", showAt: 3 },
      { from: "match", to: "geo", showAt: 3 },
      { from: "match", to: "eta", showAt: 3, dashed: true },
      { from: "match", to: "trip", showAt: 4 },
      { from: "trip", to: "ws", showAt: 5 },
      { from: "ws", to: "cust", showAt: 5, dashed: true },
      { from: "geo", to: "ws", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "P0 is dispatch, not menus",
        text: "Customer wants food or a ride. Rider is supply. P0: demand, match, assign once, track, complete. Menus and payments are neighbors. The invariant: a rider is on at most one active trip (plus explicit batching).",
        highlight: ["cust", "rider", "gw", "n0"],
        hide: ["pingq", "geo", "demand", "match", "trip", "eta", "ws", "cell", "surge", "n1", "n2"],
        flows: [
          { from: "cust", to: "gw", color: "#4ade80", label: "order" },
          { from: "rider", to: "gw", color: "#60a5fa", label: "online" }
        ]
      },
      {
        title: "Pings go to Kafka, not Postgres",
        text: "Gateway validates JWT and appends to a ping topic partitioned by riderId. A consumer updates Redis GEO + presence TTL. Idle 10–30 s, on-trip 1–2 s, silence 90 s → offline. Servlet threads do not run matching.",
        highlight: ["rider", "gw", "pingq", "geo", "n1", "cell"],
        hide: ["demand", "match", "trip", "eta", "ws", "surge", "n2", "n0"],
        flows: [
          { from: "rider", to: "gw", color: "#22d3ee", label: "1-2 Hz" },
          { from: "gw", to: "pingq", color: "#fb923c" },
          { from: "pingq", to: "geo", color: "#facc15", label: "GEO" }
        ]
      },
      {
        title: "Demand is a durable row",
        text: "Place order/ride creates a demand id (idempotent). Restaurant accept may be a second clock in food. The matcher will pull unassigned demands. A retry must not start two loops.",
        highlight: ["cust", "demand", "gw"],
        hide: ["match", "trip", "eta", "ws", "surge", "n2", "n0", "n1"],
        flows: [
          { from: "cust", to: "gw", color: "#4ade80", label: "POST" },
          { from: "gw", to: "demand", color: "#4ade80" }
        ]
      },
      {
        title: "Candidates, then score off-lock",
        text: "Matcher reads GEO cells, filters vehicle/capacity/shift, snapshots ids, drops any lock, calls ETA, scores. Holding a lock across maps HTTP is the deadlock lesson. Batching is a detour threshold on that score.",
        highlight: ["match", "geo", "eta", "demand"],
        hide: ["trip", "ws", "surge", "n2", "n0", "n1"],
        flows: [
          { from: "demand", to: "match", color: "#fb923c", label: "pull" },
          { from: "match", to: "geo", color: "#facc15", label: "cells" },
          { from: "match", to: "eta", color: "#60a5fa", label: "ETA" }
        ]
      },
      {
        title: "Assign with CAS; offers may race",
        text: "UPDATE riders SET trip_id=? WHERE trip_id IS NULL. Food may auto-bind. Rides may offer N drivers; two accepts, one CAS wins, the other rematches. Timeout returns demand to the pool. Trip row is the source of truth.",
        highlight: ["match", "trip", "rider", "n2"],
        hide: ["ws", "surge", "n0", "n1", "eta"],
        flows: [
          { from: "match", to: "trip", color: "#c084fc", label: "CAS" },
          { from: "match", to: "rider", color: "#4ade80", label: "offer" }
        ]
      },
      {
        title: "Track only the active trip",
        text: "Assigned pings fan into a WebSocket for that customer. Do not blast 5 Hz to idle app opens. State machine: assigned → pickup → in progress → complete. Complete captures payment. Dual-write rider+trip via one transaction or outbox.",
        highlight: ["geo", "ws", "cust", "trip", "rider"],
        hide: ["surge", "n0", "n1", "n2", "eta"],
        flows: [
          { from: "geo", to: "ws", color: "#22d3ee", label: "ping" },
          { from: "ws", to: "cust", color: "#60a5fa", label: "map" }
        ]
      },
      {
        title: "Cancel frees the CAS",
        text: "Before pickup, CAS the rider back to free and rematch or expire. After pickup, fee via ledger. Matcher crash is fine: demands have visibility timeout, trip rows outlive workers. Poison GPS drops, it does not assign.",
        highlight: ["trip", "match", "rider", "cust"],
        fail: ["cust"],
        hide: ["surge", "n0", "n1", "n2", "eta", "ws"],
        flows: [{ from: "cust", to: "demand", color: "#f87171", label: "cancel" }]
      },
      {
        title: "Rain: lag, broaden, surge, then fail",
        text: "Ping QPS and demand jump. Kafka holds pings. Matcher backlog shows \"looking.\" Broaden radius, raise surge, cap wait, DLQ after 15 min. City shard: no Delhi-Mumbai match. Fairness: not only nearest neighbor.",
        highlight: ["pingq", "match", "surge", "geo", "cell"],
        hide: ["n0", "n1", "n2", "ws", "eta"],
        flows: [
          { from: "rider", to: "pingq", color: "#fb923c", label: "spike" },
          { from: "demand", to: "match", color: "#fb923c", label: "backlog" }
        ]
      },
      {
        title: "Recap: moving inventory plus CAS",
        text: "Unlike tickets, supply moves and goes offline. Unlike SKUs, you offer and timeout. Still one uniqueness invariant on the rider. Metrics: match p95, assign conflicts, ping lag. Maps tiles were never P0.",
        highlight: ["cust", "rider", "match", "trip", "geo"],
        hide: ["n0", "n1", "surge", "eta"],
        flows: [
          { from: "match", to: "trip", color: "#4ade80", label: "assigned" },
          { from: "ws", to: "cust", color: "#60a5fa", label: "track" }
        ]
      }
    ]
  }
});
