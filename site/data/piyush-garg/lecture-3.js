window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 3,
  title: "System Design - Event Sourcing",
  video: "https://www.youtube.com/watch?v=JTmgi0vO5Ug",
  category: "Piyush Garg",
  tagline: "Append-only events are the truth; hydration replays them so a stuck \"processing\" row can be explained.",
  summary: "CRUD overwrites a row (product 90→100, video status=processing) and loses history. Frequent updates lock the row while readers still see 90. A YouTube-style pipeline that writes uploaded → processing → success desyncs the moment any one UPDATE fails. Event sourcing stores append-only facts (VideoUploaded, ProcessingInit, Success) with timestamps. Hydration replays the log to rebuild state — the same walk that turns bank 500+200+300−500 into 500 and answers \"what was my balance last month?\" Kafka partitions pin one video's events to one consumer so a slow worker cannot apply Uploaded after Success. Amazon checkout is the same sequence: cart, pay, ship, deliver — never a single Delivered cell.",

  theory: [
    {
      heading: "An event is a click with a name",
      body: "Large products are streams of user actions. On Amazon: add-to-cart, checkout, seller uploaded a product, seller changed a price. Those named facts are <b>events</b>. Event sourcing is inspired by event-driven architecture but stricter about what is stored. Traditional full-stack CRUD (create, read, update, delete) overwrites a row. Event sourcing does not behave like that CRUD loop.",
      bullets: [
        "Name the action (AddItemToCart, ProductPriceChanged), do not only mutate a cell.",
        "Uber and Netflix-sized systems are cited as users of this pattern."
      ]
    },
    {
      heading: "PATCH 90 → 100 and the locked row",
      body: "User → API gateway → Nginx reverse proxy → EC2 → Postgres. A PATCH sets product 1's price to 100. The next GET reads 100. That is the usual source of truth: the primary DB row. Under many writers and readers the database is the bottleneck. An UPDATE takes a <b>row lock</b>. A GET a millisecond earlier still returns 90. While the lock is held, nobody else reads that row. Frequent locks are a traffic jam, not just a consistency puzzle. The second problem is state management: the row only knows the latest string.",
      bullets: [
        "Gateway → Nginx → app → Postgres is the CRUD path in the lecture.",
        "Lock + stale read is why a hot product price row does not scale."
      ]
    },
    {
      heading: "Video pipeline: uploaded, processing, success — until one UPDATE fails",
      body: "YouTube does not show the file you uploaded. It encodes 360p/480p/720p/1080p/4K, transcribes, and optimizes; an hour of video can take 10–20 minutes. Flow: user uploads raw bytes to S3, the app inserts a row <code>status=uploaded</code>. A worker in a four-box pool picks the job and the row becomes <code>processing</code> so the UI can say it was picked up. On finish, re-upload the renditions and set <code>success</code> (or <code>failed</code>). Pseudo-code is three UPDATEs. Any one can fail because Postgres was busy or the SQL was wrong: the file is on S3 but status never became uploaded; the worker is encoding but the UI still says uploaded; re-upload succeeded but status stays processing forever. Reality and the string column have no audit trail back. That stuck \"processing\" spinner is this lecture's bug.",
      bullets: [
        "State is a column you overwrite. The previous value is gone.",
        "A failed UPDATE after a successful side effect is permanently unexplained."
      ]
    },
    {
      heading: "Append-only event log is the source of truth",
      body: "The name event sourcing means <b>events</b> are the source of truth — not the latest status string. Application code never UPDATEs the domain row. It <b>appends</b> a log: <code>VideoUploaded {path, id}</code>, then <code>VideoProcessingInit</code>, optional 10%/20%/30% progress events, then <code>VideoProcessingSuccess</code>, each with a timestamp. Append-only because processing cannot happen before upload; you do not splice events in the middle. Store the log (S3 in the talk). The current state is whatever you get by reading the log in order.",
      bullets: [
        "Always append. Never rewrite history in the middle of the log.",
        "Atomic replace of a status string is how you go out of sync."
      ]
    },
    {
      heading: "Hydration replays; banking 500 + 200 + 300 − 500",
      body: "<b>Hydration</b> reconstructs state by iterating events. Ask \"status of this video id\": read Uploaded → state uploaded; ProcessingInit → processing; Success → success. The UI can also show the timeline. A bank column that stores only 500 hides how you got there. The log is Deposit 200, Deposit 300, Withdraw 500 on an opening 500. Replay: 500 → 700 → 1000 → 500. The customer can see every line. <b>Replay</b> is also the audit: if they swear the balance should be 300, walk the log. A time machine is \"replay only events until last month.\" CRUD has no such tape.",
      bullets: [
        "Hydration = fold the log into a state. Replay = do it again for audit or time travel.",
        "500+200+300−500 is the lecture's arithmetic, not a generic example."
      ]
    },
    {
      heading: "Cache the fold, then reconcile when someone complains",
      body: "A growing append-only file makes every GET a full replay — too slow in production. After each event, a hydrator writes the latest state into a store (the lecture uses Postgres as this cache). Users read the cache. They never update it synchronously on the click path. If a user says the video is stuck in processing, <b>reconcile</b>: replay the log in order and overwrite the cache. You still know how you arrived, not only the destination. This split (commands append, queries read a projection) is the toe-dip into CQRS the speaker postpones to the next video.",
      bullets: [
        "Projection/cache = latest state for queries. Log = truth.",
        "Complaint → replay → fix the cache. Do not invent a new status by hand."
      ]
    },
    {
      heading: "Out-of-order workers, then Kafka partitions per video",
      body: "Three Node workers on one stream: worker 1 is overloaded on Uploaded; worker 2 applies ProcessingInit; worker 3 applies Success; then worker 1 finally writes Uploaded. The UI walked processing → success → uploaded. The log still has the order, so a sequenced replay repairs the cache — but you should not apply events out of order. Kafka <b>consumer groups</b> and <b>topic partitions</b> fix it: all events for video A go to partition 0, video B to partition 1. One worker owns partition 0, so A's Uploaded, Init, Success stay in order even if that worker is slow (Success is delayed, never inverted). Hash video id to a partition; several partitions can still share a group of processors (1+4, 2+5, 3). Dirty reads happen when two boxes apply one object's events.",
      bullets: [
        "Same aggregate (one video, one order) → one partition → one consumer.",
        "Slow is allowed. Reordered Success-then-Uploaded is not."
      ]
    },
    {
      heading: "Amazon never stores only Delivered",
      body: "Add to cart, pay, dispatch, ship, deliver, return: each is an event. When the app shows Delivered it is because the last replayed event was Delivered, not because a column was overwritten. If the customer says it never arrived, replay and find which step was wrong. Sequence in the log is sacred; Kafka's grouping is how you keep one order on one box. Going all-in on event logs means re-architecting — Microsoft and AWS blogs in the talk warn that turning back is hard. Use it where history, audit, and rebuild matter (orders, balances, pipelines), not as default CRUD.",
      bullets: [
        "Show state by replaying. Store the tape, not only the last stamp.",
        "Event sourcing is a whole-system bet, not a plugin."
      ]
    }
  ],

  keyTerms: [
    { term: "Event", def: "A named fact: AddItemToCart, VideoUploaded, Deposit. Not the latest column value." },
    { term: "Append-only log", def: "New events only go on the end. Processing cannot be spliced before Uploaded." },
    { term: "Event sourcing", def: "The log is the source of truth. State is derived, never the thing you write first." },
    { term: "Hydration", def: "Iterate events in order to reconstruct the current state (uploaded → processing → success)." },
    { term: "Replay / reconcile", def: "Walk the log again to audit, time-travel, or fix a wrong cached state." },
    { term: "Projection cache", def: "Materialized latest state (Postgres in the talk) so every GET does not replay the whole file." },
    { term: "Partition + consumer group", def: "Kafka guarantee: one video's events always hit the same consumer, in order." }
  ],

  tradeoffs: [
    { pro: "The log explains a stuck processing spinner: which event never arrived.", con: "CRUD's single status column is simpler until the first silent UPDATE failure." },
    { pro: "Banking replay shows 500+200+300−500 and last-month balance.", con: "Naive hydration on a huge append-only file is too slow for every GET." },
    { pro: "A projection cache makes reads cheap; reconcile repairs it from the tape.", con: "Cache and log can diverge until someone complains and you replay." },
    { pro: "Kafka partitions keep one video's events on one worker so Success cannot land before Uploaded.", con: "Cross-partition work and extra consumers do not get that order guarantee." },
    { pro: "You can rebuild any view (or migrate storage) by replaying.", con: "Adopting the log as truth is a full rewrite; the blogs say going back is hard." }
  ],

  interviewTips: [
    "Contrast PATCH price 90→100 (locked row, lost history) with an appended PriceChanged event.",
    "Walk the video pipeline: three UPDATEs, one fails, UI stuck on processing — that is the why.",
    "Say append-only out loud: processing cannot be inserted before upload.",
    "Hydration = fold events. Demo 500+200+300−500. Replay = audit and time travel.",
    "Reads hit a projection. Complaints trigger reconcile from the log, not a manual status edit.",
    "Kafka: partition by videoId/orderId so one aggregate never runs on two boxes out of order."
  ],

  scene: {
    nodes: [
      { id: "user", label: "Uploader", type: "user", pos: [-11, 0, 0] },
      { id: "gw", label: "API Gateway", type: "gateway", pos: [-7.5, 0, 0] },
      { id: "ngx", label: "Nginx", type: "lb", pos: [-4, 0, 0] },
      { id: "api", label: "EC2 API", type: "server", pos: [-0.5, 0, 0] },
      { id: "pg", label: "Postgres row", type: "db", pos: [4, 0, 0] },
      { id: "n_lock", label: "UPDATE locks row; GET saw 90", type: "note", pos: [4, 0, -3] },
      { id: "s3raw", label: "S3 raw", type: "storage", pos: [-0.5, 0, -4], showAt: 1 },
      { id: "status", label: "status=uploaded", type: "note", pos: [4, 0, 3], showAt: 1 },
      { id: "pool", label: "Worker pool", type: "zone", pos: [8.2, 0, 0], size: [5.5, 6], showAt: 2 },
      { id: "w1", label: "Worker 1", type: "worker", pos: [8.2, 0, -1.6], showAt: 2 },
      { id: "w2", label: "Worker 2", type: "worker", pos: [8.2, 0, 0.4], showAt: 2 },
      { id: "w3", label: "Worker 3", type: "worker", pos: [8.2, 0, 2.4], showAt: 2 },
      { id: "n_proc", label: "status=processing", type: "note", pos: [4, 0, 3], showAt: 2 },
      { id: "n_fail", label: "Re-upload ok; UPDATE failed", type: "note", pos: [4, 0, -3], showAt: 3 },
      { id: "log", label: "Append-only log", type: "queue", pos: [3.5, 0, 4.5], showAt: 4 },
      { id: "e1", label: "Uploaded", type: "point", pos: [0.5, 0, 4.5], showAt: 4 },
      { id: "e2", label: "ProcInit", type: "point", pos: [3.5, 0, 6.5], showAt: 4 },
      { id: "e3", label: "Success", type: "point", pos: [6.5, 0, 4.5], showAt: 4 },
      { id: "n_ts", label: "Each event has a timestamp", type: "note", pos: [3.5, 0, 7.8], showAt: 4 },
      { id: "hyd", label: "Hydrator", type: "worker", pos: [-4, 0, 4.5], showAt: 5 },
      { id: "view", label: "State=success", type: "note", pos: [-7.5, 0, 4.5], showAt: 5 },
      { id: "bank", label: "Balance fold", type: "db", pos: [-7.5, 0, -4.5], showAt: 6 },
      { id: "d200", label: "+200 → 700", type: "note", pos: [-3.5, 0, -6.2], showAt: 6 },
      { id: "d300", label: "+300 → 1000", type: "note", pos: [1, 0, -6.2], showAt: 6 },
      { id: "w500", label: "-500 → 500", type: "note", pos: [5.5, 0, -6.2], showAt: 6 },
      { id: "n_open", label: "Open 500", type: "note", pos: [-7.5, 0, -6.2], showAt: 6 },
      { id: "p0", label: "Partition 0 video A", type: "queue", pos: [-4, 0, 2.2], showAt: 8 },
      { id: "p1", label: "Partition 1 video B", type: "queue", pos: [-4, 0, -2.2], showAt: 8 },
      { id: "cA", label: "Consumer A", type: "worker", pos: [1, 0, 2.2], showAt: 8 },
      { id: "cB", label: "Consumer B", type: "worker", pos: [1, 0, -2.2], showAt: 8 },
      { id: "n_ord", label: "A always on consumer A", type: "note", pos: [1, 0, 4.4], showAt: 8 },
      { id: "cart", label: "Cart", type: "point", pos: [-8, 0, 6.5], showAt: 9 },
      { id: "pay", label: "Paid", type: "point", pos: [-5, 0, 6.5], showAt: 9 },
      { id: "ship", label: "Shipped", type: "point", pos: [-2, 0, 6.5], showAt: 9 },
      { id: "del", label: "Delivered", type: "point", pos: [1, 0, 6.5], showAt: 9 },
      { id: "n_amz", label: "Replay last event = Delivered", type: "note", pos: [-3.5, 0, 7.8], showAt: 9 }
    ],
    edges: [
      { from: "user", to: "gw" },
      { from: "gw", to: "ngx" },
      { from: "ngx", to: "api" },
      { from: "api", to: "pg", label: "PATCH 100" },
      { from: "user", to: "s3raw", label: "raw video", showAt: 1 },
      { from: "api", to: "s3raw", showAt: 1, dashed: true },
      { from: "pg", to: "w1", label: "pick", showAt: 2 },
      { from: "w1", to: "pg", label: "UPDATE", showAt: 2 },
      { from: "w1", to: "log", label: "append", showAt: 4 },
      { from: "e1", to: "log", showAt: 4 },
      { from: "log", to: "e2", showAt: 4 },
      { from: "log", to: "e3", showAt: 4 },
      { from: "log", to: "hyd", showAt: 5 },
      { from: "hyd", to: "view", showAt: 5 },
      { from: "n_open", to: "d200", showAt: 6 },
      { from: "d200", to: "d300", showAt: 6 },
      { from: "d300", to: "w500", showAt: 6 },
      { from: "p0", to: "cA", showAt: 8 },
      { from: "p1", to: "cB", showAt: 8 },
      { from: "cart", to: "pay", showAt: 9 },
      { from: "pay", to: "ship", showAt: 9 },
      { from: "ship", to: "del", showAt: 9 }
    ],
    steps: [
      {
        title: "CRUD PATCH locks the price row",
        text: "User → gateway → Nginx → EC2 → Postgres. PATCH product 1 to 100. A GET a millisecond earlier still saw 90. The UPDATE holds a row lock, so other reads wait. The row is the only truth, and it has already forgotten 90.",
        highlight: ["user", "gw", "ngx", "api", "pg", "n_lock"],
        flows: [
          { from: "user", to: "gw", color: "#4ade80", label: "PATCH" },
          { from: "api", to: "pg", color: "#c084fc", label: "90→100" }
        ]
      },
      {
        title: "Raw video lands; status=uploaded",
        text: "The YouTube-style pipeline: bytes go to S3, Postgres gets a row with status=uploaded. Encoding 360p through 4K has not started. This column will be overwritten for the rest of the job.",
        highlight: ["user", "s3raw", "api", "pg", "status"],
        flows: [
          { from: "user", to: "s3raw", color: "#4ade80", label: "upload" },
          { from: "api", to: "pg", color: "#c084fc", label: "uploaded" }
        ]
      },
      {
        title: "Worker pick flips status=processing",
        text: "A four-box worker pool takes the job. The row becomes processing so the UI can say it was picked up. Next UPDATE will be success or failed after re-upload.",
        highlight: ["w1", "w2", "w3", "pool", "pg", "n_proc", "s3raw"],
        flows: [
          { from: "pg", to: "w1", color: "#fb923c", label: "pick" },
          { from: "w1", to: "pg", color: "#c084fc", label: "processing" }
        ]
      },
      {
        title: "Renditions uploaded; the UPDATE dies",
        text: "Re-upload of the encoded files succeeds. The SQL that should set success fails because Postgres is busy. Reality is done; the UI is processing forever. CRUD has no tape to ask why.",
        highlight: ["w1", "s3raw", "pg", "n_fail"],
        fail: ["pg"],
        flows: [
          { from: "w1", to: "s3raw", color: "#4ade80", label: "renditions" },
          { from: "w1", to: "pg", color: "#f87171", label: "UPDATE fail" }
        ]
      },
      {
        title: "Append Uploaded, ProcInit, Success",
        text: "Application code stops UPDATEing the status column. It appends timestamped events. You cannot splice processing before upload. The log (here on the side of S3) is now the source of truth.",
        highlight: ["log", "e1", "e2", "e3", "n_ts", "w1"],
        flows: [
          { from: "w1", to: "log", color: "#fb923c", label: "append" },
          { from: "e1", to: "log", color: "#4ade80", label: "1" },
          { from: "log", to: "e3", color: "#4ade80", label: "3" }
        ]
      },
      {
        title: "Hydration folds the log into success",
        text: "Ask for current status. The hydrator reads Uploaded → uploaded, ProcInit → processing, Success → success, and returns success. The same walk is the UI timeline if the user wants the story, not only the stamp.",
        highlight: ["log", "hyd", "view", "e1", "e2", "e3"],
        flows: [
          { from: "log", to: "hyd", color: "#60a5fa", label: "replay" },
          { from: "hyd", to: "view", color: "#4ade80", label: "success" }
        ]
      },
      {
        title: "Bank fold: 500 + 200 + 300 − 500",
        text: "A balance column that only stores 500 cannot explain itself. Replay Deposit 200 (700), Deposit 300 (1000), Withdraw 500 (500). Last month's balance is the same fold stopped at last month. That is the time machine.",
        highlight: ["bank", "n_open", "d200", "d300", "w500"],
        hide: ["s3raw", "pool", "w1", "w2", "w3", "n_proc", "n_fail", "status"],
        flows: [
          { from: "n_open", to: "d200", color: "#4ade80", label: "+200" },
          { from: "d200", to: "d300", color: "#4ade80", label: "+300" },
          { from: "d300", to: "w500", color: "#fb923c", label: "-500" }
        ]
      },
      {
        title: "Busy worker writes Uploaded last",
        text: "Three workers on one stream: Init and Success land, then the overloaded worker applies Uploaded. The cached UI walks processing → success → uploaded. The log is still ordered, so a sequenced replay can repair — but you should not apply out of order.",
        highlight: ["w1", "w2", "w3", "pg", "log"],
        hide: ["bank", "n_open", "d200", "d300", "w500", "s3raw"],
        fail: ["w1"],
        flows: [
          { from: "w2", to: "pg", color: "#fb923c", label: "init" },
          { from: "w3", to: "pg", color: "#4ade80", label: "success" },
          { from: "w1", to: "pg", color: "#f87171", label: "uploaded late" }
        ]
      },
      {
        title: "Video A stays on partition 0",
        text: "Kafka: video A events always go to partition 0, video B to 1. Consumer A owns 0. A's Uploaded → Init → Success stay in order even if A is slow. Success waits; it never jumps the queue. Dirty reads are two boxes applying one object.",
        highlight: ["p0", "p1", "cA", "cB", "n_ord", "e1", "e2", "e3"],
        hide: ["bank", "n_open", "d200", "d300", "w500", "s3raw", "pool", "w1", "w2", "w3"],
        flows: [
          { from: "p0", to: "cA", color: "#4ade80", label: "A in order" },
          { from: "p1", to: "cB", color: "#60a5fa", label: "B" }
        ]
      },
      {
        title: "Cart → paid → shipped → delivered",
        text: "Amazon does not store only Delivered. Each step is an event. The app shows Delivered because that is the last replayed fact. If the box never arrived, replay the tape and find the broken step.",
        highlight: ["cart", "pay", "ship", "del", "n_amz", "log"],
        hide: ["bank", "n_open", "d200", "d300", "w500", "s3raw", "pool", "w1", "w2", "w3", "p0", "p1", "cA", "cB"],
        flows: [
          { from: "cart", to: "pay", color: "#4ade80", label: "event" },
          { from: "pay", to: "ship", color: "#4ade80", label: "event" },
          { from: "ship", to: "del", color: "#4ade80", label: "event" }
        ]
      }
    ]
  }
});
