window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 13,
  title: "Master Queues | System Design Interview",
  video: "https://www.youtube.com/watch?v=2tCfITBVKjA",
  category: "Piyush Garg",
  tagline: "Enqueue the welcome email. Do not make signup wait on SES.",
  summary: "A sync signup — insert user in Postgres, send welcome mail through AWS SES, mint a token, return — dies when SES is slow, down, or rate-limited at 25 mails per minute while 10,000 people join. Async means enqueue \"send welcome email\" and return. The queue is a line with a producer end and a consumer end. Push (RabbitMQ) has workers register, heartbeats, broker-side dispatch, built-in dedup and retry. Pull (SQS, BullMQ) has workers poll, own dedup, retry, DLQ, and backoff. Parallel consumers break FIFO; Kafka keys and partitions restore per-user order. Notifications can be push while video processing is pull.",

  theory: [
    {
      heading: "Signup is a synchronous chain",
      body: "A user hits a REST API with <code>POST /signup</code>. The server validates the body, reads email and password, inserts a row in <b>Postgres</b>, sends a welcome email through <b>AWS SES</b>, creates a token, and returns. That order is a <b>synchronous architecture</b>: each step waits for the previous. Fine for one user. Multiply by 10,000 or 100,000 and the chain is the product. High-level design starts here so you can see which step is allowed to be late.",
      bullets: [
        "Inserting the user is the meaning of signup. That stay synchronous.",
        "The token and the HTTP response also belong on the request path.",
        "The welcome email is the first thing you should suspect."
      ]
    },
    {
      heading: "SES is an external bottleneck",
      body: "Email is always an external dependency. If SES is down or slow, signup itself slows down — the request is blocked on a vendor. SES also rate-limits. The lecture's number is <b>25 emails per minute</b>. Fire 10,000 welcome mails in one minute from the controller and you look like spam: the limit hits, sends fail, and the whole signup handler crashes. You do not want to stall account creation because a welcome mail could not leave. That is why this path moves to async.",
      bullets: [
        "External calls on the request path are how an outage becomes your outage.",
        "Rate limits are expected. Bursting past 25/min is the bug, not SES.",
        "A non-critical mail is the classic thing to cut out of the critical path."
      ]
    },
    {
      heading: "Enqueue, then return",
      body: "Keep <code>insert user in DB</code> on the request. Instead of sending mail, <b>enqueue</b> a payload — \"send welcome email\" — onto a message queue. Then mint the token and return. You did not send mail. You put a job in a <b>line</b>, the same idea as a queue at a temple or a function. Messages sit. Nobody has processed them yet. The user already has an account. The mail might arrive in ten minutes. That is the definition of <b>asynchronous processing</b> here: a non-critical task is allowed to complete later. About 99% of async work in typical systems uses a queue. YouTube is the other picture: an upload is not live the second it finishes; processing takes 10–15 minutes on a worker that picks the job later.",
      bullets: [
        "The word to keep: enqueue, not send.",
        "HLD is producer, queue, consumer. Internals are a different lecture layer.",
        "Delay is acceptable because welcome mail is not signup."
      ]
    },
    {
      heading: "Producer end, consumer end, a throttle",
      body: "A queue has two ends. The <b>producer</b> is whoever writes the message (the signup API). The <b>consumer</b> is a worker that asks \"is anything there?\", picks a message, talks to SES, then discards the job. If the queue holds a thousand or a lakh messages, the worker still only picks <b>25 per minute</b> to match SES. Extra jobs wait; they are not going anywhere. The user's mail is not on a clock you promised in the HTTP response. That decoupling is the whole feature.",
      bullets: [
        "Producing is the easy end in every technology the lecture names.",
        "Consuming is where starvation, parallelism, and rate limits live.",
        "One worker is a start. You will want many. That is the next problem."
      ]
    },
    {
      heading: "Push: RabbitMQ is the broker",
      body: "Pushing into a queue is always straightforward — RabbitMQ, Kafka, SQS, BullMQ, the API is \"put this here.\" Hardness is <b>dequeue</b>. In a <b>push</b> system the queue is responsible for delivering the payload to a function. The worker does not pull. It <b>registers</b>: \"I am free, send me work\" — a laborer walking into a factory. RabbitMQ stores that mapping, load-balances messages across workers, and requires a <b>heartbeat</b> (the lecture uses every 30 seconds). Miss a minute and you are declared dead; no more pushes. The worker never chooses which message or at what rate. One broker owns dispatch, so <b>dedup is built in</b> (the same welcome mail does not go to two workers) and retries wait on ack. Architecture is simple. The broker is also a bottleneck and these queues tend to run slower because so much control sits in one place.",
      bullets: [
        "Workers implement business logic, not a poll loop.",
        "Unacked work can be given to someone else. Retry is a broker feature.",
        "Heartbeats stop you from sending mail to a crashed process."
      ]
    },
    {
      heading: "Pull: you poll SQS and you own the rest",
      body: "A <b>pull</b> queue (AWS <b>SQS</b> in the lecture) gives you push and pull APIs and no worker registry. Each processor runs something like <code>setInterval</code> every minute and calls pull. You choose when and how fast. That control is the pro and the con: you write a lot of code. Dedup is yours — three workers can pull the same message — so take a <b>Redis lock</b> on the message id before processing. Ack is yours: failed work must be put back, or moved to a <b>dead letter queue</b> you also own. Empty queues waste paid SQS API calls, so implement <b>backoff</b>: after 20 empty polls, wait 5 minutes, then 10, and reset to 1 minute when work returns. BullMQ on Redis hides some of the poll. SQS is raw; the lecture's teachers project uses <code>while (true)</code> with backoff, retry, and rate limits. Piyush prefers pull (BullMQ and SQS) because the control is with you.",
      bullets: [
        "Push is easy on small apps. Pull is an engineering problem you opted into.",
        "Backoff is how you stop paying for \"any mail? any mail?\" on a quiet queue.",
        "You can run both: notifications push, video processing pull."
      ]
    },
    {
      heading: "A queue is not FIFO once you have many workers",
      body: "The big misconception: queues are first-in first-out. Enqueue order is sequential. Consume order is not, the moment you have <b>parallel workers</b> on different machines at different speeds. An SMS sequence — welcome, greeting, \"how are you liking the product,\" then a paid-conversion pitch and a discount — can arrive as welcome, feedback, how-to, upgrade, discount. The user sees a scrambled onboarding. That is why \"queue\" in an interview does not mean FIFO. If order per user matters, you need a different contract.",
      bullets: [
        "One consumer preserves order. You never have one consumer in production.",
        "Starvation is the other consume-side failure: a job at the back waits days.",
        "You needed multiple processors so mail would not take three days. Parallelism is the FIFO break."
      ]
    },
    {
      heading: "Kafka keys restore per-user order",
      body: "<b>Kafka</b> exists in this lecture as the answer to scrambled SMS. Messages get a <b>key</b>. Partitions plus keys mean all of user 1's messages go to the same consumer, in order, while user 2's stream can run on another worker. You keep parallelism across users and order inside one user. <b>Consumer groups</b> are the next Kafka idea to read. Nothing else in the queue menagerie does this as cleanly. The interview close: know push vs pull, their tradeoffs, that FIFO is a lie under parallelism, and that you pick by business need — or you run both.",
      bullets: [
        "Key = user id (or whatever must stay ordered).",
        "Do not promise global FIFO. Promise per-key FIFO.",
        "Name the tradeoffs. There is no universally better queue."
      ]
    }
  ],

  keyTerms: [
    { term: "Enqueue", def: "Write a payload onto the queue without doing the work. Signup returns after enqueue, not after SES." },
    { term: "Producer / consumer", def: "The write end that creates messages, and the worker end that picks, processes, and discards them." },
    { term: "Push queue", def: "The broker delivers to registered workers (RabbitMQ). Heartbeats, dispatch, dedup, and retry live on the broker." },
    { term: "Pull queue", def: "Workers poll (SQS). Rate, dedup, retry, DLQ, and backoff are your code." },
    { term: "Heartbeat", def: "Periodic I'm-alive from a push worker. Miss the window (30s / ~1 min in the lecture) and the broker marks you dead." },
    { term: "Dead letter queue", def: "A side queue for messages that exhausted retries. In pull mode you build this yourself." },
    { term: "Backoff", def: "Slow the poll when the queue stays empty so you do not burn SQS API charges. Reset when work appears." },
    { term: "Kafka key / partition", def: "Stick all messages for one entity on one partition so one consumer processes them in order." }
  ],

  tradeoffs: [
    { pro: "Sync signup is easy to reason about and the mail is sent before you return 200.", con: "SES latency, downtime, and a 25/min cap become signup failures at 10k joins." },
    { pro: "Enqueue-and-return keeps account creation fast and lets the worker honor the rate limit.", con: "Welcome mail is eventually delivered. Ten minutes late is the design, not an incident." },
    { pro: "Push (RabbitMQ): simple workers, broker dedup, ack/retry, heartbeat eviction.", con: "One broker decides everything and becomes the bottleneck; workers cannot pick rate." },
    { pro: "Pull (SQS/BullMQ): you control poll rate, retries, DLQ, and backoff.", con: "You write polling, Redis locks for dedup, and you pay for empty SQS calls if you skip backoff." },
    { pro: "Many workers drain a deep queue so mail does not wait three days.", con: "Parallel consume scrambles FIFO. Per-user order needs Kafka keys, not a bigger queue." }
  ],

  interviewTips: [
    "Walk signup: insert Postgres, enqueue welcome mail, token, return. Name SES 25/min as why the send cannot stay on the request.",
    "A queue is not automatically FIFO. Say parallel workers and the scrambled SMS timeline out loud.",
    "Push vs pull is the LLD. RabbitMQ registers workers and pushes; SQS is polled. Dedup and retry move with that choice.",
    "If they ask what you prefer, pull is a valid answer — own the poll, backoff, DLQ — as long as you name the extra code.",
    "Order per user: Kafka key and partition, consumer groups. Notifications can still be a push queue in the same app."
  ],

  scene: {
    nodes: [
      { id: "user", label: "User", type: "user", pos: [-10, 0, 0] },
      { id: "api", label: "Signup API", type: "service", pos: [-5.5, 0, 0] },
      { id: "pg", label: "Postgres", type: "db", pos: [-5.5, 0, 5] },
      { id: "q", label: "Queue", type: "queue", pos: [0.5, 0, 0] },
      { id: "w1", label: "Worker 1", type: "worker", pos: [6, 0, -3], showAt: 3 },
      { id: "w2", label: "Worker 2", type: "worker", pos: [6, 0, 3], showAt: 5 },
      { id: "ses", label: "AWS SES", type: "gateway", pos: [10.5, 0, 0], showAt: 1 },
      { id: "rdb", label: "Redis lock", type: "cache", pos: [0.5, 0, 5], showAt: 7 },
      { id: "n0", label: "Enqueue, don't send", type: "note", pos: [0.5, 0, -7] },
      { id: "nFifo", label: "Parallelism breaks FIFO", type: "note", pos: [6, 0, -7], showAt: 8 }
    ],
    edges: [
      { from: "user", to: "api" },
      { from: "api", to: "pg" },
      { from: "api", to: "ses", showAt: 1 },
      { from: "api", to: "q", showAt: 2 },
      { from: "q", to: "w1", showAt: 3 },
      { from: "w1", to: "ses", showAt: 3 },
      { from: "q", to: "w2", showAt: 5 },
      { from: "w2", to: "ses", showAt: 5 },
      { from: "w1", to: "rdb", showAt: 7, dashed: true },
      { from: "w2", to: "rdb", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "Sync signup holds the HTTP request",
        text: "POST /signup validates, inserts the user in Postgres, then would send mail and only then mint a token. One user is fine. The chain is still synchronous: each arrow waits.",
        highlight: ["user", "api", "pg", "n0"],
        hide: ["nFifo"],
        flows: [
          { from: "user", to: "api", color: "#4ade80", label: "POST" },
          { from: "api", to: "pg", color: "#c084fc", label: "insert" }
        ]
      },
      {
        title: "SES 25/min vs 10,000 joins",
        text: "Mail is an external call. If SES is down, signup stalls. If 10,000 people join in a minute, the 25-mail cap looks like spam, sends fail, and the controller crashes. Welcome mail does not belong on this path.",
        highlight: ["api", "ses", "user"],
        hide: ["nFifo"],
        fail: ["ses"],
        flows: [
          { from: "api", to: "ses", color: "#f87171", label: "10k sends" }
        ]
      },
      {
        title: "Enqueue the mail, return the token",
        text: "Insert still happens on the request. Instead of calling SES, the API enqueues \"send welcome email,\" creates a token, and returns. The account exists. The mail has not been sent.",
        highlight: ["api", "pg", "q", "n0"],
        hide: ["nFifo"],
        flows: [
          { from: "api", to: "pg", color: "#c084fc", label: "insert" },
          { from: "api", to: "q", color: "#fb923c", label: "enqueue" }
        ]
      },
      {
        title: "Consumer picks, SES, discard",
        text: "A worker at the other end of the line asks whether work exists, processes one payload through SES, and drops it. Jobs wait in the queue. They are not running away.",
        highlight: ["q", "w1", "ses"],
        hide: ["nFifo"],
        flows: [
          { from: "q", to: "w1", color: "#fb923c", label: "pick" },
          { from: "w1", to: "ses", color: "#4ade80", label: "send" }
        ]
      },
      {
        title: "Throttle the consumer, not signup",
        text: "Even with a lakh of messages, pick 25 per minute to match SES. Extra jobs sit. Mail may arrive ten minutes later — same idea as YouTube taking 10–15 minutes to process an upload.",
        highlight: ["q", "w1", "ses", "n0"],
        hide: ["nFifo"],
        flows: [
          { from: "q", to: "w1", color: "#60a5fa", label: "25/min" },
          { from: "w1", to: "ses", color: "#4ade80", label: "ok" }
        ]
      },
      {
        title: "Push: workers register, broker dispatches",
        text: "RabbitMQ: workers register like free labor. The broker pushes, load-balances across W1 and W2, and expects a heartbeat about every 30 seconds. Dedup and retry live on that one broker. Workers do not pull.",
        highlight: ["q", "w1", "w2"],
        hide: ["nFifo"],
        flows: [
          { from: "w1", to: "q", color: "#60a5fa", label: "register" },
          { from: "w2", to: "q", color: "#60a5fa", label: "register" },
          { from: "q", to: "w1", color: "#fb923c", label: "push" },
          { from: "q", to: "w2", color: "#fb923c", label: "push" }
        ]
      },
      {
        title: "Missed heartbeat, broker stops pushing",
        text: "W2 crashes. After a missed heartbeat window the broker declares it dead and will not send it mail. Unacked work can go to W1. That eviction is why push needs liveness, not just a subscribe call.",
        highlight: ["q", "w1", "w2"],
        hide: ["nFifo"],
        fail: ["w2"],
        flows: [
          { from: "w2", to: "q", color: "#f87171", label: "no beat" },
          { from: "q", to: "w1", color: "#4ade80", label: "redeliver" }
        ]
      },
      {
        title: "Pull: poll SQS, lock in Redis",
        text: "No registry. W1 and W2 poll. Both can see the same message, so take a Redis lock on the id before processing. Retry, DLQ, and poll timing are your code. Control is the feature and the cost.",
        highlight: ["q", "w1", "w2", "rdb"],
        hide: ["nFifo"],
        flows: [
          { from: "w1", to: "q", color: "#60a5fa", label: "poll" },
          { from: "w2", to: "q", color: "#60a5fa", label: "poll" },
          { from: "w1", to: "rdb", color: "#c084fc", label: "lock 1" }
        ]
      },
      {
        title: "Empty queue: backoff the poll",
        text: "SQS charges per API call. If 20 polls come back empty, wait 5 minutes, then 10, and reset to 1 minute when a message appears. Push workers would have simply sat still. Pull has to implement boredom.",
        highlight: ["q", "w1", "w2", "n0"],
        hide: ["nFifo"],
        flows: [
          { from: "w1", to: "q", color: "#fb923c", label: "empty" },
          { from: "w2", to: "q", color: "#fb923c", label: "empty" }
        ]
      },
      {
        title: "Two workers scramble SMS order",
        text: "Enqueue was 1,2,3,4. W1 is fast and applies 1 then 3. W2 applies 2 late. Welcome, then \"how is the product,\" then the greeting. A queue is not FIFO under parallelism. Kafka keys pin one user's stream to one consumer so order holds where it must.",
        highlight: ["q", "w1", "w2", "nFifo"],
        hide: ["n0"],
        flows: [
          { from: "q", to: "w1", color: "#4ade80", label: "1 then 3" },
          { from: "q", to: "w2", color: "#fb923c", label: "2 late" }
        ]
      }
    ]
  }
});
