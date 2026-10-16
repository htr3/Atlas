window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 31,
  title: "Idempotent APIs",
  category: "Service Patterns",
  tagline: "The same request, applied twice, leaves the system as if it had been applied once.",
  summary: "Retries are normal: clients time out, gateways retry, queues redeliver. An idempotent API makes those retries safe. GET, PUT, and DELETE are naturally close to idempotent. POST create is not, unless the client sends an idempotency key and you store the result of the first call. The second call returns that result and does not create a second order or take a second payment.",

  theory: [
    {
      heading: "Retry is not an edge case",
      body: "A client sends \"charge 20 and create the order.\" The server does it and the response is lost. The client tries again. Without a rule, you now have two orders. <b>Idempotency</b> means that second call is a replay, not a new intent. You promise: performing the operation once or many times with the same identity has the same effect on state, and the caller can receive the original success.",
      bullets: [
        "The network duplicates requests. Design for that first.",
        "\"We hope the client will not retry\" is not a design.",
        "Internal retries (a mesh, a worker) count. The caller is not always a human."
      ]
    },
    {
      heading: "Verbs are not enough",
      body: "GET does not change state, so repeating it is fine if it really does not. PUT replaces a resource at a URL; putting the same document twice leaves that document. DELETE of a gone resource can return the same 404 or 204 every time. <b>POST</b> usually means \"create a new one,\" which is the opposite of idempotent. Payments and order creates are POSTs. They become safe only when you add an explicit key.",
      bullets: [
        "PUT /orders/17 with the same body is idempotent.",
        "POST /orders without a key is not.",
        "A handler that sends email as a side effect of GET is a bug, not a GET."
      ]
    },
    {
      heading: "Store the key and the outcome",
      body: "The client generates an <b>idempotency key</b> (a UUID) and sends it on every retry of that attempt. The server stores key → request hash → response, uniquely. The first call executes and saves the response. A retry with the same key and the same body returns the saved response and does not run the side effect again. The same key with a different body is a 409: the client mixed two intents. Keys expire (24 hours is common) so the table does not grow forever; after expiry a retry can double-apply, so the window must cover real client retries.",
      bullets: [
        "Uniqueness is per caller, or globally if the key is a UUID.",
        "Lock the key row so two in-flight retries do not both execute.",
        "If the first call is still running, the second waits or receives \"in progress,\" it does not start another charge."
      ]
    },
    {
      heading: "Where else the same idea shows up",
      body: "Consumers of an at-least-once queue dedupe on event id. That is the same table: seen ids, unique. A saga step \"reserve stock\" must accept a repeated reserve for reservation id R and return the original hold. Idempotent APIs are what make circuit-breaker retries, outbox relays, and client timeouts safe to turn on. If you cannot store the key, you cannot claim the retry is harmless."
    }
  ],

  keyTerms: [
    { term: "Idempotent", def: "Repeating the same operation does not change the outcome beyond the first successful application." },
    { term: "Idempotency key", def: "A client-generated id that ties retries of one attempt together." },
    { term: "Replay", def: "A later call with a known key returns the stored response instead of executing again." },
    { term: "In-progress lock", def: "A row that stops a concurrent duplicate from starting the side effect while the first call is open." },
    { term: "Key expiry", def: "How long you remember a key. Retries after that window are new calls." }
  ],

  tradeoffs: [
    { pro: "Clients and proxies can retry without double-charging.", con: "You store every key and response, and you must lock the in-flight row." },
    { pro: "PUT and DELETE already fit the model if you implement them honestly.", con: "A POST with a fresh key on every timeout still duplicates. The client has to reuse the key." },
    { pro: "A 409 on a reused key with a new body catches client bugs.", con: "Expiry is a judgment: too short and a late retry duplicates; too long and the table grows." },
    { pro: "The same dedupe table serves queue consumers.", con: "Side effects you forgot (an email on the first path only) still double-fire if they are outside the lock." }
  ],

  interviewTips: [
    "Define it with a lost response: the work happened, the client did not hear, the retry must not repeat the work.",
    "POST needs an idempotency key. Do not claim POST is idempotent by itself.",
    "Store the response, lock the in-flight key, and return the original success on replay.",
    "Same key plus different body is a conflict, not a second create.",
    "Connect it to outbox and sagas: at least once is safe only because handlers are idempotent."
  ],

  scene: {
    nodes: [
      { id: "client", label: "Client", type: "phone", pos: [-9, 0, 0] },
      { id: "api", label: "Payments API", type: "service", pos: [-3.5, 0, 0] },
      { id: "keys", label: "Key store", type: "db", pos: [1.5, 0, -2.6] },
      { id: "bank", label: "Charge", type: "worker", pos: [1.5, 0, 2.8], showAt: 1 },
      { id: "n0", label: "Same key, same result", type: "note", pos: [6, 0, -6.5], showAt: 3 },
      { id: "n1", label: "Lost response", type: "note", pos: [-6, 0, -6.5], showAt: 2 }
    ],
    edges: [
      { from: "client", to: "api", label: "key K" },
      { from: "api", to: "keys" },
      { from: "api", to: "bank", label: "once", showAt: 1 },
      { from: "client", to: "api", label: "retry K", showAt: 3, dashed: true }
    ],
    steps: [
      {
        title: "The client names the attempt",
        text: "The request carries idempotency key K and the charge body. K was generated once for this click. A timeout must reuse K, not mint a new one.",
        highlight: ["client", "api"],
        flows: [{ from: "client", to: "api", color: "#4ade80", label: "POST K" }]
      },
      {
        title: "Claim the key, then charge",
        text: "The API inserts K as in progress. Only the winner of that insert calls the bank. A concurrent duplicate waits on the same row.",
        highlight: ["api", "keys", "bank"],
        flows: [
          { from: "api", to: "keys", color: "#c084fc", label: "lock K" },
          { from: "api", to: "bank", color: "#facc15", label: "charge" }
        ]
      },
      {
        title: "The response never arrives",
        text: "The charge succeeded and the response was saved under K. The client timed out and thinks it failed. From the client's side the money is in doubt.",
        highlight: ["client", "api", "n1"],
        fail: ["client"],
        flows: [{ from: "api", to: "client", color: "#f87171", label: "lost" }]
      },
      {
        title: "The retry is a lookup",
        text: "The same POST with K finds a completed row and returns the stored success. The bank is not called. The order exists once.",
        highlight: ["client", "api", "keys", "n0"],
        flows: [
          { from: "client", to: "api", color: "#60a5fa", label: "retry K" },
          { from: "api", to: "keys", color: "#4ade80", label: "replay" }
        ]
      },
      {
        title: "A different body is not a retry",
        text: "K with a new amount is a conflict. The client mixed two payments under one key. You refuse rather than charge the second amount silently.",
        highlight: ["api", "keys"],
        flows: [{ from: "api", to: "keys", color: "#f87171", label: "409" }]
      }
    ]
  }
});
