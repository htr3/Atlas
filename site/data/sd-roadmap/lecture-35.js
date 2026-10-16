window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 35,
  title: "Design a Ticket Booking System",
  video: "",
  category: "Roadmap Case Studies",
  tagline: "TTL holds, a unique seat invariant, then pay and confirm — never two tickets.",
  summary: "Movie and concert booking is a uniqueness problem dressed as a website. P0: browse events, hold seats for a few minutes, pay, confirm. The seat cannot be sold twice under a traffic spike. This design uses a short-lived hold with TTL, a compare-and-set or unique constraint per seat, an idempotent payment, and a confirm that turns the hold into a ticket. Catalog pages can be stale; the hold row cannot. Failures are expired holds, payment timeouts, and a hot event shard — not a missing CDN.",

  theory: [
    {
      heading: "Requirements and the one invariant",
      body: "P0: search/browse shows, pick a showtime, select seats, hold, pay, issue a ticket with a QR. P1: waitlists, social sharing, recommendations, multi-city packages. NFRs: p95 browse can be 300 ms and cached; p95 hold < 200 ms in the event's region; availability of browse can degrade; <b>no double-sell</b>. Scale sketch: 10 M DAU, but one IPL or concert is 50 k users on one event, 5–10 k hold attempts/s at open. That peak, not average DAU, sizes the hold path. Consistency: CP on (eventId, seatId). AP on catalog and reviews.",
      bullets: [
        "Users: fan, box office admin (P1). Device: mobile app + web.",
        "Out of scope unless asked: building a card network, dynamic pricing ML.",
        "Success metric: conflict rate on holds, abandoned-hold rate, tickets issued = seats sold."
      ]
    },
    {
      heading: "APIs and entities",
      body: "Entities: User, Event, Show (time + venue), Seat (or SeatMap), Hold, Payment, Ticket. APIs: <code>GET /events?city=</code>, <code>GET /shows/{id}/seats</code> (map with states free/held/sold), <code>POST /holds</code> {showId, seatIds, idempotencyKey} → holdId + expiry, <code>POST /holds/{id}/pay</code>, <code>GET /tickets/{id}</code>. 409 if a seat is taken, 410 if the hold expired, 402 if pay failed. Idempotency key on hold and on pay. Seat map is a read model; it lags the hold table by milliseconds and that is allowed if the hold API is the gate.",
      bullets: [
        "Hold payload includes a version or the show's seat-map etag so you do not hold a moved layout.",
        "Do not send the full stadium as one JSON if 40 k seats; paginate sections.",
        "QR/token is issued only after payment capture, not at hold."
      ]
    },
    {
      heading: "Write path: hold, then pay, then ticket",
      body: "Client → gateway → BookingService. Hold: in one DB transaction, for each seat <code>INSERT INTO holds(show_id, seat_id, user_id, expires_at) </code> with <code>UNIQUE(show_id, seat_id)</code> where state is active. Alternatively a seats row with <code>UPDATE seats SET holder=?, exp=? WHERE id=? AND holder IS NULL</code> — optimistic, 0 rows = 409. Spring: <code>@Transactional</code> plus <code>@Version</code> on the seat row, or native unique. TTL: a worker deletes expired holds every second, or the row carries expires_at and readers treat expiry as free (lazy). Return 201 with holdId. Pay: call the payment rail with the holdId as idempotency key (ledger lesson). On capture, insert Ticket, mark seats sold, emit outbox TicketIssued. Never call pay inside the hold transaction.",
      bullets: [
        "Lua in Redis is a valid hold store if you snapshot to DB before pay. Redis alone is a crash amnesia risk.",
        "Multi-seat hold is all-or-nothing in one transaction so you do not strand one seat of a pair.",
        "Payment timeout: hold still valid until TTL; client retries pay with the same key."
      ]
    },
    {
      heading: "Read path and the hot show",
      body: "Event list and pretty seat maps are cached (CDN for images, Redis for JSON maps) with 1–5 s TTL or pub/sub invalidation on hold. A slightly wrong green seat is OK because POST /holds is the truth. At IPL open, cache stampede: lock around rebuild or serve stale. The hot show's holds do not live in a global table scan — shard by showId (or eventId) so the unique constraint and row locks sit on one primary. A lock service (Redis SET NX PX) in front of the DB can shed 409s cheaper, but the DB unique remains the source of truth. Java pool: a dedicated executor for the hot shard so browse traffic cannot steal its connections.",
      bullets: [
        "Section-level occupancy counters in Redis are hints for UI, not authorization.",
        "Websocket fan-out of seat maps is P1; polling every 2 s is enough for P0.",
        "Read replica for analytics; never hold against a replica."
      ]
    },
    {
      heading: "Scale, failure, and abuse",
      body: "Open-sale thundering herd: queue at the gate (waiting room) so hold QPS is capped at what the shard commits. Bots: login + device attest + per-user rate limit on POST /holds. AZ failure: the hold primary must fail over faster than TTL, or you lose in-flight holds (users retry, unique key saves you). Payment success + app crash: pay idempotency + a sweeper that confirms holds whose payment captured but ticket row is missing. Overbooking is a P0 bug; underbooking from a stuck TTL worker is a P1 revenue leak — alert on holds past expiry still marked active. Multi-region: keep the show's primary in one region (the venue's). Cross-region dual-write of holds is how you double-sell.",
      bullets: [
        "Waiting room token is not a hold. It only lets you attempt POST /holds.",
        "Poison seat (bad id) must 400, not stall the transaction.",
        "Admin block a bot user without leaving their holds immortal — expire them."
      ]
    },
    {
      heading: "Tradeoffs you say at the recap",
      body: "We CP the seat in one region, AP the map. Unique(show,seat) is the invariant; Redis NX is an accelerator. Holds have TTL so a crashed client cannot tombstone a stadium. Payments are a second idempotent step, journaled if you own money. Waitlists are a queue of users per show, promoted by a worker when a hold expires — P1, one sentence. Compared with food-delivery geo or e-commerce SKUs: here the inventory is tiny and ultra-hot. That is why a per-show shard beats a giant orders table.",
      bullets: [
        "Metric: hold 409 rate, time-to-first-ticket, expired-hold count, pay/confirm mismatch.",
        "If they add resale: tickets become transferable with a new unique owner, same seat invariant.",
        "If they add groups of 10k GA (standing): inventory is a counter with atomic decrement, not per-seat rows."
      ]
    }
  ],

  keyTerms: [
    { term: "Hold", def: "A short-lived, exclusive claim on a seat with an expiry, not yet a ticket." },
    { term: "TTL sweeper", def: "Worker or lazy read that frees seats whose holds expired without payment." },
    { term: "Unique(show, seat)", def: "Database invariant that makes double-sell a constraint violation, not a race you hope to win." },
    { term: "Waiting room", def: "Admission control in front of holds so open-sale QPS matches commit rate." },
    { term: "Seat-map cache", def: "Stale-OK read model of free/held/sold for the UI, never the authorization layer." },
    { term: "All-or-nothing hold", def: "A multi-seat request commits every seat or none, so pairs are not split." },
    { term: "Confirm sweeper", def: "Job that issues tickets when payment captured but the ticket row never landed." },
    { term: "Hot-show shard", def: "Partitioning holds by showId so IPL open does not lock unrelated events." }
  ],

  tradeoffs: [
    { pro: "DB unique constraint survives crashes and is easy to explain.", con: "Commit QPS of one show's primary is the ceiling unless you shard or prepend a lock service." },
    { pro: "Redis SET NX PX is a fast 409.", con: "Without a DB snapshot before pay, a Redis flush double-sells." },
    { pro: "TTL holds recover inventory from abandoned checkouts.", con: "Too short and legit payers 410; too long and bots warehouse seats." },
    { pro: "Stale seat maps keep browse cheap.", con: "Users rage-tap green seats that POST /holds will 409. UX must expect conflict." },
    { pro: "Single-region primary per show prevents split-brain sells.", con: "Remote fans see higher hold latency; you do not active-active the seat row." }
  ],

  interviewTips: [
    "Circle no double-sell. Catalog staleness is allowed. That is the whole CP/AP split.",
    "Draw hold → pay → ticket as three steps. Pay is not inside the hold transaction.",
    "UNIQUE(show_id, seat_id) or UPDATE ... WHERE holder IS NULL. Show the 409 path.",
    "Size for one hot show (5–10 k holds/s), not average DAU. Waiting room + shard by showId.",
    "Payment timeout: retry pay with the same key; sweeper issues missing tickets.",
    "Recap: CP seat, AP map, TTL holds, never dual-write seats across regions."
  ],

  scene: {
    nodes: [
      { id: "fan", label: "Fan", type: "phone", pos: [-11, 0, 0] },
      { id: "cdn", label: "CDN posters", type: "cdn", pos: [-11, 0, -4], showAt: 1 },
      { id: "gw", label: "Gateway", type: "gateway", pos: [-7, 0, 0] },
      { id: "book", label: "Booking svc", type: "service", pos: [-3, 0, 0] },
      { id: "mapc", label: "Seat-map cache", type: "cache", pos: [-3, 0, -3.5], showAt: 1 },
      { id: "holddb", label: "Holds shard", type: "db", pos: [1.5, 0, 0], showAt: 2 },
      { id: "pay", label: "Payments", type: "service", pos: [1.5, 0, 3.5], showAt: 4 },
      { id: "led", label: "Ledger", type: "db", pos: [5.5, 0, 3.5], showAt: 4 },
      { id: "tix", label: "Tickets DB", type: "db", pos: [5.5, 0, 0], showAt: 5 },
      { id: "ttl", label: "TTL sweeper", type: "worker", pos: [1.5, 0, -3.5], showAt: 3 },
      { id: "room", label: "Waiting room", type: "lb", pos: [-7, 0, 3.5], showAt: 6 },
      { id: "q", label: "Outbox", type: "queue", pos: [5.5, 0, -3.5], showAt: 5 },
      { id: "bot", label: "Bot farm", type: "user", pos: [-11, 0, 3.5], showAt: 7 },
      { id: "n0", label: "No double-sell", type: "note", pos: [1.5, 0, -6.8] },
      { id: "n1", label: "UNIQUE(show,seat)", type: "note", pos: [5.5, 0, 6.8], showAt: 2 },
      { id: "n2", label: "One region per show", type: "note", pos: [-7, 0, 6.8], showAt: 8 }
    ],
    edges: [
      { from: "fan", to: "gw", label: "browse" },
      { from: "fan", to: "cdn", showAt: 1, dashed: true },
      { from: "gw", to: "book" },
      { from: "book", to: "mapc", showAt: 1 },
      { from: "book", to: "holddb", showAt: 2 },
      { from: "ttl", to: "holddb", showAt: 3, dashed: true },
      { from: "book", to: "pay", showAt: 4 },
      { from: "pay", to: "led", showAt: 4 },
      { from: "book", to: "tix", showAt: 5 },
      { from: "book", to: "q", showAt: 5 },
      { from: "fan", to: "room", showAt: 6 },
      { from: "room", to: "gw", showAt: 6 },
      { from: "bot", to: "gw", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "P0: browse, hold, pay, ticket",
        text: "A fan wants a seat for one show. P1 waitlists wait. The invariant is no double-sell. Catalog may lag. We will size for a hot open, not for average DAU.",
        highlight: ["fan", "gw", "book", "n0"],
        hide: ["cdn", "mapc", "holddb", "pay", "led", "tix", "ttl", "room", "q", "bot", "n1", "n2"],
        flows: [{ from: "fan", to: "gw", color: "#4ade80", label: "open app" }]
      },
      {
        title: "Read path: stale maps are OK",
        text: "Posters hit a CDN. Seat maps sit in Redis/JSON with a few seconds' TTL. Green on the map is a hint. POST /holds is the gate. Stampede: serve stale rather than stampede the shard.",
        highlight: ["fan", "cdn", "mapc", "book"],
        hide: ["holddb", "pay", "led", "tix", "ttl", "room", "q", "bot", "n1", "n2"],
        flows: [
          { from: "fan", to: "cdn", color: "#22d3ee", label: "art" },
          { from: "book", to: "mapc", color: "#facc15", label: "map" }
        ]
      },
      {
        title: "Hold: UNIQUE(show, seat) or CAS",
        text: "INSERT hold with UNIQUE(show_id, seat_id), or UPDATE seat SET holder WHERE holder IS NULL. 0 rows or constraint = 409. Multi-seat is one transaction, all-or-nothing. Spring @Transactional, not a hand-rolled thread lock.",
        highlight: ["book", "holddb", "n1", "fan"],
        hide: ["pay", "led", "tix", "ttl", "room", "q", "bot", "n2", "cdn"],
        flows: [
          { from: "fan", to: "gw", color: "#4ade80", label: "POST /holds" },
          { from: "book", to: "holddb", color: "#c084fc", label: "CAS" }
        ]
      },
      {
        title: "TTL frees abandoned seats",
        text: "Holds carry expires_at (2–8 min). A sweeper or lazy read releases them. Too short: payers 410. Too long: bots warehouse the stadium. The waiting room has not issued a hold; only this row has.",
        highlight: ["ttl", "holddb", "book"],
        hide: ["pay", "led", "tix", "room", "q", "bot", "n2", "cdn", "n0"],
        flows: [{ from: "ttl", to: "holddb", color: "#fb923c", label: "expire" }]
      },
      {
        title: "Pay is a second idempotent step",
        text: "Do not call the rail inside the hold transaction. Payments uses holdId as the idempotency key, journals if you own money, then booking confirms. Timeout: retry pay, do not insert a second hold.",
        highlight: ["book", "pay", "led", "holddb"],
        hide: ["tix", "room", "q", "bot", "n2", "cdn", "ttl", "n0"],
        flows: [
          { from: "book", to: "pay", color: "#4ade80", label: "capture" },
          { from: "pay", to: "led", color: "#c084fc", label: "lines" }
        ]
      },
      {
        title: "Confirm ticket, outbox QR",
        text: "Insert ticket, mark sold, outbox TicketIssued for email/QR. A sweeper heals payment-captured / ticket-missing. QR does not exist at hold time. Seat map invalidation can be pub/sub or short TTL.",
        highlight: ["book", "tix", "q", "fan"],
        hide: ["room", "bot", "n2", "cdn", "ttl", "n0", "mapc"],
        flows: [
          { from: "book", to: "tix", color: "#4ade80", label: "ticket" },
          { from: "book", to: "q", color: "#fb923c", label: "email" }
        ]
      },
      {
        title: "Open-sale: waiting room caps QPS",
        text: "5–10 k hold attempts/s on one show. A waiting room issues attempt tokens at the shard's commit rate. Shard holds by showId so a musical in Pune does not lock IPL. Redis NX may shed 409s; DB unique still owns truth.",
        highlight: ["room", "fan", "holddb", "gw"],
        hide: ["bot", "n2", "cdn", "ttl", "n0", "pay", "led"],
        flows: [
          { from: "fan", to: "room", color: "#fb923c", label: "queue" },
          { from: "room", to: "gw", color: "#4ade80", label: "token" }
        ]
      },
      {
        title: "Bots and rate limits",
        text: "Per-user hold rate limits, device attest, expire a blocked user's holds. A bot farm that wins the waiting room still 409s on unique seats. Admin tools must not leave immortal holds.",
        highlight: ["bot", "gw", "book", "holddb"],
        fail: ["bot"],
        hide: ["n2", "cdn", "ttl", "n0", "pay", "room", "q"],
        flows: [{ from: "bot", to: "gw", color: "#f87171", label: "spray" }]
      },
      {
        title: "AZ death and no dual-write",
        text: "Fail the hold primary over faster than TTL, or users retry with the same idempotency key. Never active-active the seat row across regions — that is how you sell seat 12A twice. Recap: CP seat, AP map, TTL, pay then ticket.",
        highlight: ["holddb", "n2", "book", "pay"],
        fail: ["holddb"],
        hide: ["cdn", "bot", "n0", "n1", "room", "mapc"],
        flows: [{ from: "book", to: "holddb", color: "#f87171", label: "retry key" }]
      }
    ]
  }
});
