window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 21,
  title: "Design a Notification System",
  category: "Service Patterns",
  tagline: "One event, many channels — accept fast, fan out on queues, and let each provider fail alone.",
  summary: "A notification system takes an event (order shipped, mention, OTP) and delivers it as push, email, or SMS. The API only records the intent and enqueues it. Workers render a template, check the user's preferences, and call the provider. Each channel has its own queue, retry budget, and rate limit. Idempotency keys stop a retry from texting someone twice.",

  theory: [
    {
      heading: "Accept the intent, do not send it inline",
      body: "The caller — checkout, a chat service, a cron — should not wait on Apple, an email vendor, or a telecom. The notification API validates the request, writes a row keyed by an <b>idempotency key</b>, and pushes a message. The HTTP call returns \"accepted,\" not \"delivered.\" Delivery is asynchronous and visible later as a status.",
      bullets: [
        "Request: user, template id, channel hints, variables, idempotency key.",
        "A duplicate key returns the original accept and does not enqueue again.",
        "The caller never holds a connection open while a provider times out."
      ]
    },
    {
      heading: "Fan out after preferences, not before",
      body: "One event often becomes several sends: a push, an email, and nothing on SMS because the user opted out. A <b>router</b> loads preferences and the template, then drops one message per allowed channel. Doing this in the producer spreads channel rules across every product team. Doing it here keeps \"quiet hours\" and \"no marketing SMS\" in one place.",
      bullets: [
        "Transactional messages (OTP, receipt) can ignore marketing opt-out; say so explicitly.",
        "Templates are data, not code in the checkout service.",
        "Missing variables fail the render, not the provider call."
      ]
    },
    {
      heading: "One queue per channel",
      body: "SMS providers throttle hard. Email can be slower and larger. Push is bursty. A single shared queue lets a marketing email blast delay an OTP. Separate queues (and separate worker pools) are a <b>bulkhead</b>: SMS slowness stays in SMS. Workers pull, call the provider, and record delivered, failed, or retry.",
      bullets: [
        "Retry with backoff only when the provider error is temporary.",
        "A permanent failure (bad number, uninstalled app) goes to a dead-letter queue, not an infinite loop.",
        "Priority is a second queue or a priority field — OTPs jump the marketing line."
      ]
    },
    {
      heading: "What \"sent\" is allowed to mean",
      body: "The provider's 200 means they accepted the message, not that a human read it. Store that distinction. Read receipts and bounces come back on a webhook and update the same row. At interview scale, name the storage: a notification log for status, a preference store, and the queues. Do not put the log in the queue and call it a database."
    }
  ],

  keyTerms: [
    { term: "Idempotency key", def: "A caller-supplied id so a retried \"send\" does not deliver a second copy." },
    { term: "Fan-out", def: "One event becomes zero or more channel messages after preferences are applied." },
    { term: "Channel queue", def: "A dedicated queue and worker pool for push, email, or SMS so one provider cannot block the others." },
    { term: "Template", def: "A stored body with variables, rendered before the provider call." },
    { term: "Provider ack", def: "The vendor accepted the message. It is not proof the user saw it." }
  ],

  tradeoffs: [
    { pro: "Returning \"accepted\" keeps checkout fast.", con: "The caller must learn about failure from status, not from the HTTP response." },
    { pro: "Per-channel queues isolate a slow SMS vendor.", con: "You operate three pipelines, three dashboards, and three retry policies." },
    { pro: "Central preferences stop every team reimplementing opt-out.", con: "A bad preference deploy can silence every product at once." },
    { pro: "Idempotency keys make retries safe.", con: "Callers who mint a new key on every retry will double-send." }
  ],

  interviewTips: [
    "Say the API enqueues and returns. Do not send email inside the request thread.",
    "Draw preferences and templates before the provider. Fan-out happens after opt-out.",
    "Give OTP and marketing different queues. Mention rate limits and a dead-letter queue.",
    "Use an idempotency key so the producer's retry does not text twice.",
    "Distinguish provider accept from user read. Webhooks update status later."
  ],

  scene: {
    nodes: [
      { id: "app", label: "Checkout", type: "service", pos: [-9, 0, 0] },
      { id: "api", label: "Notify API", type: "gateway", pos: [-4.5, 0, 0] },
      { id: "prefs", label: "Preferences", type: "db", pos: [-4.5, 0, 3.5], showAt: 1 },
      { id: "router", label: "Router", type: "worker", pos: [0, 0, 0], showAt: 1 },
      { id: "qpush", label: "Push queue", type: "queue", pos: [4.5, 0, -3.2], showAt: 2 },
      { id: "qmail", label: "Email queue", type: "queue", pos: [4.5, 0, 0], showAt: 2 },
      { id: "qsms", label: "SMS queue", type: "queue", pos: [4.5, 0, 3.2], showAt: 2 },
      { id: "vendor", label: "SMS vendor", type: "cdn", pos: [9, 0, 3.2], showAt: 3 },
      { id: "dlq", label: "DLQ", type: "storage", pos: [9, 0, 0], showAt: 4 },
      { id: "n0", label: "Accept, don't send", type: "note", pos: [0, 0, -7] }
    ],
    edges: [
      { from: "app", to: "api", label: "event" },
      { from: "api", to: "router", showAt: 1 },
      { from: "router", to: "prefs", label: "opt-in?", showAt: 1 },
      { from: "router", to: "qpush", showAt: 2 },
      { from: "router", to: "qmail", showAt: 2 },
      { from: "router", to: "qsms", showAt: 2 },
      { from: "qsms", to: "vendor", showAt: 3 },
      { from: "qsms", to: "dlq", label: "poison", showAt: 4, dashed: true }
    ],
    steps: [
      {
        title: "Record the intent",
        text: "Checkout posts one event with an idempotency key. The API stores it and returns accepted. No provider has been called.",
        highlight: ["app", "api", "n0"],
        flows: [{ from: "app", to: "api", color: "#4ade80", label: "accept" }]
      },
      {
        title: "Ask preferences",
        text: "The router loads the template and the user's channels. Marketing SMS is dropped. An OTP would be allowed through even when marketing is off.",
        highlight: ["router", "prefs", "api"],
        flows: [{ from: "router", to: "prefs", color: "#c084fc", label: "read" }]
      },
      {
        title: "One message per channel",
        text: "Push, email, and SMS land on separate queues. A slow mailbox cannot sit in front of a one-time password.",
        highlight: ["router", "qpush", "qmail", "qsms"],
        flows: [
          { from: "router", to: "qpush", color: "#60a5fa", label: "push" },
          { from: "router", to: "qsms", color: "#fb923c", label: "sms" }
        ]
      },
      {
        title: "Workers call the vendor",
        text: "An SMS worker pulls, renders the final text, and calls the provider. A 200 here means the vendor accepted the message.",
        highlight: ["qsms", "vendor"],
        flows: [{ from: "qsms", to: "vendor", color: "#4ade80", label: "send" }]
      },
      {
        title: "Retry, then give up",
        text: "A timeout is retried with backoff. A bad phone number is permanent: it goes to the dead-letter queue and the row is marked failed. The same idempotency key will not create a second send.",
        highlight: ["qsms", "dlq", "vendor"],
        fail: ["vendor"],
        flows: [{ from: "qsms", to: "dlq", color: "#f87171", label: "DLQ" }]
      }
    ]
  }
});
