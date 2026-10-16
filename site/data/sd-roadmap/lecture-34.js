window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 34,
  title: "The 13-Step System Design Interview Method",
  video: "",
  category: "Interview Method",
  tagline: "Thirteen pauses from prompt to recap so you lead the room instead of drowning in boxes.",
  summary: "A system design round is 35–45 minutes. The failure mode is drawing Kafka before you know the write QPS. This method is thirteen named steps you can say out loud: bound the problem, split P0/P1, write NFRs, estimate, name entities, sketch APIs, box the high-level, walk write then read, pick storage, scale the bottleneck, fail the design, then recap tradeoffs. The next five lectures apply this exact spine to booking, dispatch, checkout, search, markets, and object storage.",

  theory: [
    {
      heading: "Steps 1–3: bound it, P0 features, NFRs",
      body: "<b>1. Restate.</b> \"Design a ticket booking system\" is a festival, a movie seat, or an airline. Pick one, say the users, and ask what is out of scope (payments provider vs we-store-cards). <b>2. Functional P0 vs P1.</b> P0 is the path that must work in 40 minutes: search events, hold a seat, pay, confirm. P1 is waitlists, social graph, recommendations — write them down so you are not accused of missing them, then ignore them. <b>3. Non-functionals.</b> Latency (p95 hold < 200 ms), consistency (no double-sell), availability (reads can degrade, holds cannot lie), freshness. Put AP vs CP on the board for the one resource that cannot fork (the seat, the SKU, the ticker).",
      bullets: [
        "If you skip the pause after the prompt, you will design the wrong product.",
        "Numbers on NFRs beat adjectives. \"Fast\" is not an NFR.",
        "One hard consistency constraint is enough. Not every arrow is linearizable."
      ]
    },
    {
      heading: "Steps 4–6: estimates, entities, APIs",
      body: "<b>4. Back-of-envelope.</b> DAU, peak QPS, payload size, storage/year, cache working set. Round: 10^5 seconds/day, 1 KB metadata, 1 MB media. You are proving you will not put 10 TB in one MySQL row. <b>5. Entities.</b> User, Event, Seat, Hold, Order. This is the data model in words before tables. <b>6. APIs.</b> Five or six endpoints with verb, path, body, error. <code>POST /holds</code> returns 409 on conflict. Version the resource. Do not design GraphQL vs REST unless asked — REST is the default, WebSocket when the server must push (dispatch, ticks).",
      bullets: [
        "Estimates should change the diagram. If they do not, you performed arithmetic.",
        "APIs make hidden requirements visible: pagination, idempotency keys, cursor vs offset.",
        "Write QPS vs read QPS tells you which path gets the cache."
      ]
    },
    {
      heading: "Steps 7–9: boxes, write path, read path",
      body: "<b>7. High-level boxes.</b> Client, gateway, one service per P0 verb, the stores they need, a queue if work is async. Pause. Do not add a service that has no API. <b>8. Critical write path.</b> Narrate one request hop by hop until durable: auth, validate, lock/unique, persist, enqueue side effects, 201. This is where double-sell, double-charge, and lost updates live. <b>9. Critical read path.</b> Cache keys, CDN vs app cache, stale-while-revalidate, what a miss costs. Read and write paths often use different stores (CQRS without the buzzword: listing pages are not the booking row).",
      bullets: [
        "Talk while you draw. Silence plus a spaghetti board scores poorly.",
        "One happy-path sequence diagram is worth five unused microservices.",
        "If a box is not on the write or read path, delete it or justify it as async."
      ]
    },
    {
      heading: "Steps 10–11: storage choice and the bottleneck",
      body: "<b>10. Data model + storage.</b> Relational for invariants (unique seat, foreign keys). KV/document for baggy metadata. Object storage for blobs. Queue for at-least-once work. Time-series for ticks. Say the primary key and the query you optimize. <b>11. Scale the hottest bottleneck.</b> Use the estimates. If hold QPS is 5k on one event, you need a per-event shard or an in-memory lock service, not a bigger VM. Caching, sharding, queues, and CDN are tools you attach to a named hotspot — never a default garnish. This is also where you mention Java/Spring realities: bounded thread pools, idempotency tables, <code>@Version</code> optimistic locks.",
      bullets: [
        "Pick the store from the query, not from fashion. Seats are not a good Kafka topic.",
        "Shard key = the dimension you always have in the query (eventId, userId, ticker).",
        "State the fan-out: one write to N readers, or N writes to one reader."
      ]
    },
    {
      heading: "Steps 12–13: fail it, then recap",
      body: "<b>12. Failure and uniqueness.</b> Kill a zone, a worker, a cache, a queue consumer. What is lost, what is duplicated, what the user sees. Idempotency keys, outbox, recon, leader election — only the ones this design needs. Multi-region: active-active vs active-passive, and which rows cannot fork. <b>13. Recap tradeoffs.</b> Two minutes. \"We chose strong uniqueness on holds and eventual listing pages; p99 hold stays in one region; recon closes money. If I had another hour I would add waitlists.\" The recap is how they remember you. The five case studies that follow are this method applied, not a new method.",
      bullets: [
        "Name one thing you would monitor: hold conflict rate, consumer lag, recon unmatched.",
        "Do not volunteer a rewrite (\"actually let's use CRDTs\") at minute 44.",
        "If the interviewer pulls you deep on one box, skip later steps they waived — and say you are skipping."
      ]
    },
    {
      heading: "Clock discipline and how you get scored",
      body: "Minutes 0–8: steps 1–6 (talk more than draw). 8–25: steps 7–11 (the board). 25–35: step 12 plus one deep dive they chose. 35–40: step 13. Interviewers score clarity, correctness of the critical path, and flexibility when they change a constraint (\"now it is IPL finals, 10× QPS\"). Flexibility is step 11 redone, not a new fashion stack. Keep a visible list of the 13 steps; crossing them off is a feature, not a crutch. Java details belong in the bottleneck and failure steps, not in step 7.",
      bullets: [
        "Change of constraint is a gift: show which box absorbs the 10×.",
        "If you do not know a store, say what property you need (compare-and-set, TTL, ordered log) and pick a placeholder.",
        "Never fight the interviewer on product scope. Update P0 and redraw the arrow they care about."
      ]
    }
  ],

  keyTerms: [
    { term: "P0 / P1", def: "Must-design now versus parked with a sentence. The clock only fits P0." },
    { term: "NFR", def: "Numeric latency, consistency, availability, and freshness targets, not \"scalable.\"" },
    { term: "Critical path", def: "The one request you narrate hop by hop until it is durable or served." },
    { term: "Bottleneck", def: "The resource the estimates say will melt first; the only thing you scale first." },
    { term: "Uniqueness invariant", def: "A fact that cannot fork: one seat, one SKU unit, one transfer id." },
    { term: "Deep dive", def: "The box the interviewer picks after the happy path; go deep only there." },
    { term: "Recap", def: "Two-minute restatement of constraints, the invariant, and the tradeoff you accepted." }
  ],

  tradeoffs: [
    { pro: "A named 13-step spine keeps you from drowning in Kafka at minute five.", con: "Followed robotically it sounds like a script; skip steps they waived out loud." },
    { pro: "Estimates that change the diagram prove seniority.", con: "Fake precision (QPS to four decimals) wastes clock and looks insecure." },
    { pro: "Separating write and read paths lets you CP the hold and AP the catalog.", con: "Two stores mean recon and lag; you must say who is source of truth." },
    { pro: "Recap plus one metric is memorable.", con: "Opening a second architecture at minute 44 erases the recap." }
  ],

  interviewTips: [
    "Say the step names. \"Before I draw, P0 is hold+pay; P1 is waitlist.\" That is leadership.",
    "Write NFRs as numbers. Circle the one invariant that cannot fork.",
    "Estimates exist to pick shard keys and caches, not to fill a whiteboard corner.",
    "Narrate one write then one read. Delete boxes that are on neither path.",
    "Scale only the named bottleneck. \"We will add Redis\" without a hotspot is a fail.",
    "Kill a zone in step 12. End with a two-minute recap and one metric."
  ],

  scene: {
    nodes: [
      { id: "iv", label: "Interviewer", type: "user", pos: [-11, 0, -3] },
      { id: "you", label: "You", type: "user", pos: [-11, 0, 3] },
      { id: "board", label: "Whiteboard", type: "zone", pos: [1, 0, 0], size: [16, 12] },
      { id: "p0", label: "P0 hold+pay", type: "note", pos: [-4, 0, -4], showAt: 1 },
      { id: "nfr", label: "p95 200ms, no double-sell", type: "note", pos: [1, 0, -4], showAt: 1 },
      { id: "est", label: "5k hold QPS peak", type: "note", pos: [6.5, 0, -4], showAt: 2 },
      { id: "api", label: "POST /holds", type: "gateway", pos: [-4, 0, 0], showAt: 3 },
      { id: "svc", label: "Booking svc", type: "service", pos: [1, 0, 0], showAt: 4 },
      { id: "db", label: "Holds DB", type: "db", pos: [6.5, 0, 0], showAt: 4 },
      { id: "cache", label: "Catalog cache", type: "cache", pos: [1, 0, 3.5], showAt: 5 },
      { id: "q", label: "Outbox", type: "queue", pos: [6.5, 0, 3.5], showAt: 6 },
      { id: "fail", label: "AZ down", type: "server", pos: [6.5, 0, 6.2], showAt: 7 },
      { id: "n1", label: "Restate the product first", type: "note", pos: [-4, 0, 6.5] },
      { id: "n2", label: "Scale the hotspot only", type: "note", pos: [-4, 0, 6.5], showAt: 6 },
      { id: "n3", label: "Recap the invariant", type: "note", pos: [1, 0, 6.5], showAt: 8 }
    ],
    edges: [
      { from: "iv", to: "you", label: "prompt" },
      { from: "you", to: "api", showAt: 3 },
      { from: "api", to: "svc", showAt: 4 },
      { from: "svc", to: "db", showAt: 4 },
      { from: "svc", to: "cache", showAt: 5, dashed: true },
      { from: "svc", to: "q", showAt: 6 },
      { from: "db", to: "fail", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "Step 1: restate, then shut up",
        text: "The prompt is a sentence. Repeat the product, the users, and what you are not building. Wait for a nod. Drawing Kafka now is how you design the wrong system in the remaining 40 minutes.",
        highlight: ["iv", "you", "n1"],
        hide: ["p0", "nfr", "est", "api", "svc", "db", "cache", "q", "fail", "n2", "n3"],
        flows: [{ from: "iv", to: "you", color: "#4ade80", label: "design X" }]
      },
      {
        title: "Steps 2–3: P0/P1 and numeric NFRs",
        text: "P0 is hold+pay. P1 is waitlist — written, then ignored. NFRs: p95 hold 200 ms, never double-sell a seat, listing pages may be slightly stale. Circle the uniqueness invariant. One CP resource, not every arrow.",
        highlight: ["you", "p0", "nfr"],
        hide: ["est", "api", "svc", "db", "cache", "q", "fail", "n2", "n3", "n1"],
        flows: [{ from: "you", to: "p0", color: "#fb923c", label: "P0" }]
      },
      {
        title: "Steps 4–5: estimates that will change boxes",
        text: "Peak 5k hold QPS on one event, 1 KB hold rows, catalog mostly read. That number later forces a per-event shard or lock, not a bigger VM. Entities: User, Event, Seat, Hold, Order. Arithmetic without a hotspot is theater.",
        highlight: ["est", "nfr", "you"],
        hide: ["api", "svc", "db", "cache", "q", "fail", "n2", "n3", "n1"],
        flows: [{ from: "you", to: "est", color: "#c084fc", label: "QPS" }]
      },
      {
        title: "Step 6: APIs make requirements testable",
        text: "POST /holds with an idempotency key, 409 on conflict, GET /events/{id} for the catalog. Errors you own: 409 sold, 410 expired hold. REST unless the server must push. Five endpoints, not twenty.",
        highlight: ["api", "you", "p0"],
        hide: ["svc", "db", "cache", "q", "fail", "n2", "n3", "n1"],
        flows: [{ from: "you", to: "api", color: "#4ade80", label: "POST /holds" }]
      },
      {
        title: "Steps 7–8: boxes, then the write path",
        text: "Client, gateway, booking service, holds DB. Narrate one hold until it is durable: auth, unique(seat,event), persist, 201. This is where double-sell lives. Do not add a microservice that has no API on the board.",
        highlight: ["api", "svc", "db"],
        hide: ["cache", "q", "fail", "n2", "n3", "n1", "est"],
        flows: [
          { from: "api", to: "svc", color: "#4ade80", label: "hold" },
          { from: "svc", to: "db", color: "#c084fc", label: "unique" }
        ]
      },
      {
        title: "Step 9: a different read path",
        text: "Catalog pages hit a cache. They may lag. The hold row does not. CQRS without the lecture: listings are not the booking source of truth. If a box serves neither path, delete it.",
        highlight: ["cache", "svc", "api"],
        hide: ["q", "fail", "n2", "n3", "n1", "p0"],
        flows: [
          { from: "api", to: "svc", color: "#60a5fa", label: "GET" },
          { from: "svc", to: "cache", color: "#facc15", label: "catalog" }
        ]
      },
      {
        title: "Steps 10–11: store, then scale the hotspot",
        text: "Relational unique constraint for seats. Cache for catalog. Outbox for email. The 5k QPS number now places a per-event lock or shard on holds — not a decorative Redis. Java: @Version or a compare-and-set, bounded pools.",
        highlight: ["db", "q", "est", "n2", "svc"],
        hide: ["fail", "n3", "n1", "p0"],
        flows: [
          { from: "svc", to: "db", color: "#c084fc", label: "shard" },
          { from: "svc", to: "q", color: "#fb923c", label: "outbox" }
        ]
      },
      {
        title: "Step 12: kill a zone",
        text: "Primary AZ dies. Are in-flight holds committed? Does a retry double-book? Idempotency keys and a failover replica are the answers, not a new logo. Mention one metric: hold conflict rate.",
        highlight: ["fail", "db", "svc", "q"],
        fail: ["fail"],
        hide: ["n3", "n1", "n2", "p0", "est"],
        flows: [{ from: "db", to: "fail", color: "#f87171", label: "timeout" }]
      },
      {
        title: "Step 13: recap and park P1",
        text: "Two minutes: we CP the seat, AP the catalog, shard holds by eventId, recon later if money moves. Waitlist was P1. If they 10× IPL traffic, the hold shard is the box that changes. Stop talking.",
        highlight: ["you", "iv", "n3", "db", "nfr"],
        hide: ["n1", "n2", "fail", "est"],
        flows: [{ from: "you", to: "iv", color: "#60a5fa", label: "recap" }]
      }
    ]
  }
});
