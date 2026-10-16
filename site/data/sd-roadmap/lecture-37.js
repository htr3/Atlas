window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 37,
  title: "Design an E-Commerce Checkout",
  video: "",
  category: "Roadmap Case Studies",
  tagline: "Cart is optimistic. Checkout reserves stock, takes money, then confirms — and can undo.",
  summary: "Checkout is a distributed transaction you refuse to run as 2PC across stock, tax, and the card network. P0: cart, address, quote, reserve inventory, pay, confirm order, release on failure. Catalog and search are read-heavy neighbors. The invariant is you never ship (or promise) a SKU you cannot fulfill, and you never capture two charges for one attempt. This design uses a reservation with TTL, an idempotent payment, an order state machine, and outbox events for email and fulfillment — plus a sweeper for the half-committed cases.",

  theory: [
    {
      heading: "Requirements: the last mile of shopping",
      body: "P0: add to cart, change qty, start checkout, pick address, see a quote (price, tax, ship), place order, pay, land on a confirmed order page. P1: gift cards, coupons graph, BNPL, subscriptions. NFRs: p95 quote < 300 ms, place-order < 1 s plus the rail, no oversell of a hot SKU, no double-charge. Scale: 100 M SKUs in catalog (read), but checkout QPS is thousands, flash-sale QPS tens of thousands on a handful of SKUs — same \"hot item\" shape as a concert, worse because qty > 1. Consistency: CP on (skuId) reservation for hot items; catalog price may lag (you re-quote at place). AP vs ticket booking: you can sometimes backorder (product choice); if you do, say so.",
      bullets: [
        "Guest checkout vs logged-in cart merge is a P0 edge, not a footnote.",
        "Out of scope: full search engine (next lecture), warehouse robotics.",
        "Success: orders confirmed = stock decremented = money captured, minus explicit cancels."
      ]
    },
    {
      heading: "Cart, quote, and the lie of the price tag",
      body: "Cart is a per-user document (Redis or Dynamo): skuId, qty, addedAt. It is not inventory. Quote is a read: price service + tax + shipping estimate + coupon. Cache prices aggressively; at <code>POST /checkout</code> you re-fetch price and refuse if it moved more than a threshold (or confirm with the user). Spring: <code>CartService</code> is boring CRUD; <code>CheckoutService</code> owns the state machine. Idempotency key is generated when checkout starts and reused for quote, reserve, and pay so a double-click is one order. Addresses are a user-service lookup; do not embed the world in the order payload without a snapshot (address can change after ship).",
      bullets: [
        "Snapshot price, tax, address onto the order at confirm. Future catalog edits must not rewrite history.",
        "Coupon application is a Strategy (fee lesson) with a unique redemption row per code+user.",
        "Cart in cookies-only is a XSS gift. Server-side cart with a guest id is the default."
      ]
    },
    {
      heading: "Reserve stock, then pay, then confirm",
      body: "Place order: create Order(state=PENDING, idempotencyKey), then <b>reserve</b>: <code>UPDATE sku SET reserved=reserved+q WHERE sku=? AND on_hand-reserved >= q</code> (or a reservations table with TTL, unique on orderId+sku). Hot SKU: the row is a shard of its own; Redis DECR with a DB backup is the ticket-hold pattern. If reserve fails, 409 and no payment. If it succeeds, call payments with the orderId as idempotency key (ledger + rail). On capture: state=CONFIRMED, convert reservation to sold, outbox OrderConfirmed (fulfillment, email, search decrement). On pay fail or TTL: release reservation, state=CANCELLED. Never increment sold before capture unless you accept unpaid holds (then you are a ticket system).",
      bullets: [
        "Multi-SKU orders: all-or-nothing reserve in one transaction, or a saga with compensating releases.",
        "Do not 2PC with Visa. Clearing account + recon from the ledger lesson.",
        "Spring: @Transactional on reserve; payment is after commit via a step or orchestrator."
      ]
    },
    {
      heading: "Sagas beat 2PC here",
      body: "Stock DB, payments, tax provider, gift-card service — they will not share a transaction. Orchestrator (or choreography on events): ReserveStock → AuthorizePay → ConfirmOrder. Each step is idempotent. Compensate: ReleaseStock, VoidAuth. Persist saga state (step, status) so a crash resumes, it does not restart from zero. Choreography-only (every service emits and hopes) is harder to debug in 45 minutes; draw an orchestrator. Timeout: a sweeper looks for PENDING older than N minutes and compensates. This is the confirm sweeper from booking, with more steps.",
      bullets: [
        "Name the compensating action for every step you draw.",
        "Gift cards: treat as a second ledger account, not a string on the order.",
        "Tax APIs fail: you can fail closed (no order) or use last-known rules with a recon — say which."
      ]
    },
    {
      heading: "Flash sale and failure",
      body: "Hot SKU: waiting room, per-sku serializer or Redis counter, cache the sold-out flag so you 409 before the DB. Oversell of 0.01% may be a business choice with apology coupons; oversell of a concert seat was not — ask. Payment captured / reserve lost: sweeper creates a backorder or auto-refund; this is an incident either way. Dual-click: same idempotency key returns the same order id. AZ loss: reservations in the primary; fail over or expire and let users retry. Multi-region: inventory for a warehouse is regional; a US sale must not decrement an IN warehouse without a transfer. Catalog CDN is worldwide and stale-OK.",
      bullets: [
        "Sold-out flag in cache needs a TTL so a restock is visible.",
        "Bot protection on POST /checkout, not only on login.",
        "Fulfillment at 3PL is an async consumer; do not block the confirm HTTP on it."
      ]
    },
    {
      heading: "Recap against tickets and dispatch",
      body: "Like tickets: reservation + TTL + idempotent pay. Unlike tickets: qty counters, many SKUs per order, sagas, price snapshots, warehouses as locations. Unlike dispatch: inventory does not send pings. Metrics: reserve fail rate, saga stuck count, pay/confirm mismatch, flash-sale QPS vs oversell. Recap sentence: we re-quote at place, CAS stock, pay with the order key, confirm via outbox, sweep PENDING.",
      bullets: [
        "If they add marketplace sellers, reservation is per (sku, seller) and payout is the ledger.",
        "Returns: a new journal entry, not an UPDATE of the original capture.",
        "P1 recommendations must not sit on the checkout critical path."
      ]
    }
  ],

  keyTerms: [
    { term: "Cart", def: "Optimistic document of intended SKUs. Not a stock reservation." },
    { term: "Quote", def: "Price + tax + ship computed at read time; revalidated at place." },
    { term: "Reservation", def: "TTL hold of qty on a SKU so concurrent checkouts cannot oversell." },
    { term: "Saga", def: "Sequence of local transactions with compensations; no 2PC with the card network." },
    { term: "Order snapshot", def: "Frozen price, tax, address on the order so later catalog edits cannot rewrite it." },
    { term: "Sold-out flag", def: "Cached bit that fails flash-sale traffic before it hits the SKU row." },
    { term: "Orchestrator", def: "A state machine that drives reserve → pay → confirm and resumes after crash." },
    { term: "Compensate", def: "Release stock, void auth, cancel order — the undo of a saga step." }
  ],

  tradeoffs: [
    { pro: "Reserve-then-pay prevents charging for air.", con: "Abandoned checkouts lock stock until TTL; too long hurts conversion of others." },
    { pro: "Saga + orchestrator is explainable and crash-safe.", con: "More states to sweep; a bug in compensate double-releases or never releases." },
    { pro: "Redis counter for a flash SKU takes tens of thousands of QPS.", con: "Must dual-write or log to DB or a crash oversells/undersells." },
    { pro: "Stale catalog CDN is cheap worldwide.", con: "You must re-quote at checkout or you confirm the wrong price." },
    { pro: "Allowing backorder raises conversion.", con: "You now owe a promise the warehouse cannot keep — a support product." }
  ],

  interviewTips: [
    "Cart is not stock. Draw reserve as an explicit step with TTL.",
    "Re-quote at place. Snapshot price and address onto the order.",
    "CAS: on_hand - reserved >= qty. Flash sale: per-sku counter + sold-out cache.",
    "Saga: Reserve → Pay → Confirm, each idempotent, each with a compensate.",
    "No 2PC with Visa. Outbox for fulfillment. Sweeper for PENDING.",
    "Recap vs tickets: counters and multi-SKU sagas, same hold-then-pay spine."
  ],

  scene: {
    nodes: [
      { id: "shop", label: "Shopper", type: "phone", pos: [-11, 0, 0] },
      { id: "cdn", label: "Catalog CDN", type: "cdn", pos: [-11, 0, -4], showAt: 1 },
      { id: "gw", label: "Gateway", type: "gateway", pos: [-7, 0, 0] },
      { id: "cart", label: "Cart svc", type: "service", pos: [-3, 0, -3.5], showAt: 1 },
      { id: "chk", label: "Checkout", type: "service", pos: [-3, 0, 0] },
      { id: "price", label: "Price/tax", type: "service", pos: [-3, 0, 3.5], showAt: 2 },
      { id: "inv", label: "Inventory", type: "db", pos: [2, 0, 0], showAt: 3 },
      { id: "hot", label: "SKU counter", type: "cache", pos: [2, 0, -3.5], showAt: 6 },
      { id: "pay", label: "Payments", type: "service", pos: [2, 0, 3.5], showAt: 4 },
      { id: "ord", label: "Orders DB", type: "db", pos: [6.5, 0, 0], showAt: 3 },
      { id: "saga", label: "Saga orch", type: "worker", pos: [6.5, 0, 3.5], showAt: 4 },
      { id: "outbox", label: "Outbox", type: "queue", pos: [6.5, 0, -3.5], showAt: 5 },
      { id: "wh", label: "Fulfillment", type: "worker", pos: [10.5, 0, -3.5], showAt: 5 },
      { id: "n0", label: "Cart ≠ stock", type: "note", pos: [-7, 0, -6.8] },
      { id: "n1", label: "No 2PC with Visa", type: "note", pos: [2, 0, 6.8], showAt: 4 },
      { id: "n2", label: "Sweep PENDING", type: "note", pos: [6.5, 0, 6.8], showAt: 7 }
    ],
    edges: [
      { from: "shop", to: "gw" },
      { from: "shop", to: "cdn", showAt: 1, dashed: true },
      { from: "gw", to: "cart", showAt: 1 },
      { from: "gw", to: "chk" },
      { from: "chk", to: "price", showAt: 2 },
      { from: "chk", to: "inv", showAt: 3 },
      { from: "chk", to: "ord", showAt: 3 },
      { from: "chk", to: "pay", showAt: 4 },
      { from: "saga", to: "pay", showAt: 4, dashed: true },
      { from: "saga", to: "inv", showAt: 4, dashed: true },
      { from: "chk", to: "outbox", showAt: 5 },
      { from: "outbox", to: "wh", showAt: 5 },
      { from: "chk", to: "hot", showAt: 6 }
    ],
    steps: [
      {
        title: "P0: cart, quote, reserve, pay, confirm",
        text: "Shopper will add items, start checkout, and pay. P1 coupons wait. Invariant: no oversell, no double-charge. Flash-sale QPS on a few SKUs sizes inventory, not the 100 M catalog.",
        highlight: ["shop", "gw", "chk", "n0"],
        hide: ["cdn", "cart", "price", "inv", "hot", "pay", "ord", "saga", "outbox", "wh", "n1", "n2"],
        flows: [{ from: "shop", to: "gw", color: "#4ade80", label: "shop" }]
      },
      {
        title: "Cart is optimistic; CDN is stale-OK",
        text: "Catalog images and product JSON sit on a CDN. Cart is a per-user document of sku+qty — not a reservation. Guest cart merge on login. XSS-safe server cart, not only cookies.",
        highlight: ["shop", "cdn", "cart", "n0"],
        hide: ["price", "inv", "hot", "pay", "ord", "saga", "outbox", "wh", "n1", "n2"],
        flows: [
          { from: "shop", to: "cdn", color: "#22d3ee", label: "PDP" },
          { from: "gw", to: "cart", color: "#4ade80", label: "add" }
        ]
      },
      {
        title: "Quote, then re-quote at place",
        text: "Price+tax+ship is a read, cacheable. POST /checkout re-fetches. If price moved, 409 or confirm with the user. Snapshot the accepted quote onto the order so later catalog edits cannot rewrite history.",
        highlight: ["chk", "price", "shop"],
        hide: ["inv", "hot", "pay", "ord", "saga", "outbox", "wh", "n1", "n2", "cdn"],
        flows: [
          { from: "chk", to: "price", color: "#60a5fa", label: "quote" },
          { from: "price", to: "chk", color: "#60a5fa", label: "₹" }
        ]
      },
      {
        title: "Reserve with CAS and TTL",
        text: "Order PENDING + UPDATE sku SET reserved+=q WHERE on_hand-reserved >= q. 0 rows = 409, no pay. Multi-SKU is one transaction or a saga with compensations. Idempotency key started at checkout begin.",
        highlight: ["chk", "inv", "ord"],
        hide: ["hot", "pay", "saga", "outbox", "wh", "n1", "n2", "cdn", "n0"],
        flows: [
          { from: "chk", to: "ord", color: "#c084fc", label: "PENDING" },
          { from: "chk", to: "inv", color: "#c084fc", label: "reserve" }
        ]
      },
      {
        title: "Saga: pay after reserve, not 2PC",
        text: "Orchestrator: Reserve → AuthorizePay → Confirm. Payment uses orderId as the key. No 2PC with Visa. Compensate: ReleaseStock, VoidAuth. Persist saga step so a crash resumes.",
        highlight: ["saga", "pay", "inv", "ord", "n1"],
        hide: ["hot", "outbox", "wh", "n2", "cdn", "n0", "cart"],
        flows: [
          { from: "saga", to: "pay", color: "#4ade80", label: "auth" },
          { from: "saga", to: "inv", color: "#fb923c", label: "still held" }
        ]
      },
      {
        title: "Confirm, outbox to the warehouse",
        text: "Capture → CONFIRMED, reservation becomes sold, outbox OrderConfirmed. Fulfillment is async; do not block the HTTP on a 3PL. Email is a consumer. Search stock decrement is another.",
        highlight: ["ord", "outbox", "wh", "chk"],
        hide: ["hot", "n2", "cdn", "n0", "n1", "cart", "price"],
        flows: [
          { from: "chk", to: "outbox", color: "#fb923c", label: "event" },
          { from: "outbox", to: "wh", color: "#4ade80", label: "ship" }
        ]
      },
      {
        title: "Flash SKU: counter + sold-out flag",
        text: "A handful of SKUs take the sale. Redis DECR (or a dedicated row) + cached sold-out bit so the herd 409s in cache. Dual-write or binlog to DB. Waiting room optional. Bots limited on POST /checkout.",
        highlight: ["hot", "inv", "shop", "chk"],
        hide: ["n2", "cdn", "n0", "n1", "wh", "outbox", "saga"],
        flows: [
          { from: "chk", to: "hot", color: "#facc15", label: "DECR" },
          { from: "hot", to: "chk", color: "#f87171", label: "0" }
        ]
      },
      {
        title: "Sweeper heals PENDING",
        text: "Pay captured / reserve missing → refund or backorder, page someone. PENDING too old → compensate. Dual-click returns the same order id. AZ death: fail over the inventory primary or expire reserves.",
        highlight: ["saga", "ord", "pay", "n2"],
        fail: ["pay"],
        hide: ["cdn", "n0", "n1", "hot", "wh", "cart"],
        flows: [{ from: "saga", to: "ord", color: "#f87171", label: "cancel" }]
      },
      {
        title: "Recap: hold-then-pay, saga, snapshot",
        text: "Cart optimistic, re-quote at place, CAS stock, pay with order key, confirm via outbox. Unlike tickets, qty counters and multi-SKU compensations. Unlike dispatch, SKUs do not ping. Metric: saga stuck count.",
        highlight: ["shop", "chk", "inv", "pay", "ord"],
        hide: ["cdn", "n0", "n1", "hot", "n2", "cart"],
        flows: [{ from: "shop", to: "gw", color: "#4ade80", label: "place" }]
      }
    ]
  }
});
