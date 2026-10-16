window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 10,
  title: "Why do Databases fail? AntiPatterns to avoid!",
  video: "https://www.youtube.com/watch?v=9T-gNZ5bGCw",
  category: "Advanced Concepts",
  tagline: "Inserts plus polling is not a queue. At interview scale it is an antipattern.",
  summary: "Using a database as a mailbox — S1–S3 INSERT rows, peers SELECT every few seconds — looks like a queue and is not. The database cannot push, so you choose overload (tight polls) or lag (a 50s interval when the phone wanted 2–3s). Engines are rarely fast at mixed CRUD; rows pile up until you UPDATE-as-done or cron-delete; extra servers S4–S6 drown the same box. Real message queues push, isolate writes from reads, and scale by adding brokers. Tiny, quiet systems can keep the table. Interviews almost never are that tiny.",

  theory: [
    {
      heading: "The mailbox nobody can knock on",
      body: "Three app servers sit in front of phones and desktops. When S3's cron wants S2 to do work, it <code>INSERT</code>s a row — say id <code>123</code> — and hopes. A database only <b>receives</b>; it will not call S2. So every server <b>polls</b>: \"any new rows for me?\" S2 might ask every ten seconds, pull 123, change its own state, maybe notify a client. You have reinvented a queue with SQL.",
      bullets: [
        "Producers write rows. Consumers must come looking.",
        "The row is the message; the table is the backlog.",
        "Nothing in the engine knows S2 is waiting."
      ]
    },
    {
      heading: "Poll fast and melt; poll slow and miss the SLA",
      body: "Short intervals hammer the database with empty reads. Long intervals feel cheap until a message that should have hit a mobile in two or three seconds waits on a <b>50-second</b> tick. That is the first trap of the antipattern: polling frequency is a knob with no safe setting once chatty servers and impatient clients share the same table."
    },
    {
      heading: "Engines pick a side: read or write",
      body: "Most stores are tuned for <b>create/update/delete</b> or for <b>read</b>, not both at once. A queue table does all of CRUD on the same pages: inserts from producers, selects from every poller, updates that mark \"done\", deletes that vacuum. Locks and deadlocks show up because you asked one data structure to be a log and a lookup table. There is no structure that is optimal for heavy mixed read/write in the way a broker's log is optimal for append-and-deliver.",
      bullets: [
        "Create / update / delete are writes; poll is a read.",
        "Hot rows and gap locks appear when everyone touches \"the next message\".",
        "\"Just add indexes\" often slows the insert path you also need."
      ]
    },
    {
      heading: "The table fills, then you pay to empty it",
      body: "Chatty S1–S3 fill disk. Leaving rows forever needs capacity you will not have. Marking completed is an extra write on every successful consume. Deleting — by hand or by cron — is another write path with its own scripts and corner cases (delete what S2 already applied but S1 has not seen). A real queue treats retention as a first-class policy, not a cleanup job you write in week eight."
    },
    {
      heading: "S4, S5, S6 and the fake extra database",
      body: "The fourth failure is scale. Each new server is another poller. The same primary cannot answer that many \"anything for me?\" queries. Adding a second database for S4/S5 immediately asks: how does S4 talk to S2? You invent a broker between the two stores — which is the component you were avoiding. Horizontal growth of a queue-table is how you accidentally design messaging badly."
    },
    {
      heading: "What a message queue actually changes",
      body: "A dedicated broker <b>pushes</b> (or long-polls as a push analogue). Consumers do not poke a table on a timer, so the interval debate disappears. Writes are cheap appends; delivery is the queue's job in its own time. Need more capacity? Add more of the same broker. The lecture's list: no poll tax, no mixed-CRUD engine, scale by cloning. Rabbit, Kafka, SQS and friends exist because this pattern is old.",
      bullets: [
        "Push (or blocking consume) replaces <code>SELECT</code> every N seconds.",
        "Retention, ack, and retry are APIs, not cron SQL.",
        "You scale the queue fleet, not a second OLTP that cannot see S2."
      ]
    },
    {
      heading: "When the antipattern is allowed — and when interviews are not",
      body: "If the fleet is small, the table holds. If messages are rare, you can optimize the store for reads and live with occasional writes. If the team has never operated a broker, teaching Kafka can cost more than a locked table. Those are honest exceptions. In a system-design interview, about <b>ninety percent</b> of prompts want large user counts. Starting with \"we'll INSERT and poll\" without asking the scale is the failure. Ask QPS and delivery delay first; at size, name the antipattern and put a queue in the diagram."
    }
  ],

  keyTerms: [
    { term: "DB-as-queue", def: "Servers communicate by inserting rows that other servers discover with periodic SELECT." },
    { term: "Polling interval", def: "How often a consumer asks \"anything for me?\"; short melts the DB, long misses the client SLA." },
    { term: "CRUD mix", def: "Create, read, update, and delete hitting one table — the pattern OLTP engines handle poorly as a hot path." },
    { term: "Completion mark", def: "UPDATE-as-done or DELETE-after-read; both are extra writes plus cleanup logic." },
    { term: "Push vs poll", def: "A broker delivers (or blocks until work exists); a database waits to be asked." },
    { term: "Split-brain stores", def: "A second database for new servers that cannot see S2's mailbox without inventing a broker." },
    { term: "Interview scale", def: "The default assumption in these interviews: enough users that a mailbox table will not hold." }
  ],

  tradeoffs: [
    { pro: "A table you already run needs no new ops skill and no new vendor.", con: "You cannot push; every consumer is a timer that is either hot or late." },
    { pro: "Tight polls catch id 123 within seconds.", con: "Empty SELECTs become the database's main workload." },
    { pro: "A 50-second poll is easy on the primary.", con: "A mobile that expected 2–3s waits a full tick — the UX failure." },
    { pro: "Marking rows complete keeps an audit trail.", con: "UPDATE/DELETE plus cron vacuum is how the table becomes a second product." },
    { pro: "Real queues push, isolate delivery, and add brokers for capacity.", con: "On a tiny, quiet system the extra concept (and training) can outweigh the gain." }
  ],

  interviewTips: [
    "Ask expected message rate and max delivery delay before drawing a table between S1 and S2.",
    "If they want millions of users, call DB-as-queue an antipattern in the first minute and put a broker in.",
    "Walk the four failure modes: poll knob, mixed CRUD locks, table growth/cleanup, extra pollers.",
    "Say the second database for S4 cannot address S2 without a broker — so add the broker now.",
    "Admit the exceptions: few servers, few messages, team that cannot yet operate Kafka.",
    "Do not open with INSERT/poll \"for simplicity\" on a high-QPS prompt — that is the trap."
  ],

  scene: {
    nodes: [
      { id: "mobile", label: "Mobile client", type: "phone", pos: [-11, 0, -4] },
      { id: "desk", label: "Desktop client", type: "user", pos: [-11, 0, 4] },
      { id: "s1", label: "Server S1", type: "server", pos: [-6, 0, -4] },
      { id: "s2", label: "Server S2", type: "server", pos: [-6, 0, 0] },
      { id: "s3", label: "Server S3", type: "server", pos: [-6, 0, 4] },
      { id: "db", label: "Shared database", type: "db", pos: [1.5, 0, 0] },
      { id: "s4", label: "Server S4", type: "server", pos: [1.5, 0, -5.5], showAt: 5 },
      { id: "s5", label: "Server S5", type: "server", pos: [1.5, 0, 5.5], showAt: 5 },
      { id: "s6", label: "Server S6", type: "server", pos: [6, 0, 5.5], showAt: 5 },
      { id: "mq", label: "Message queue", type: "queue", pos: [8, 0, 0], showAt: 6 },
      { id: "db2", label: "Second database", type: "db", pos: [8, 0, -5.5], showAt: 5 },

      { id: "n0", label: "INSERT as a mailbox", type: "note", pos: [-8, 4, 7.5] },
      { id: "n1", label: "DB cannot push", type: "note", pos: [3, 4, 7.5], showAt: 1 },
      { id: "n2", label: "10s vs 50s poll", type: "note", pos: [-8, 4, -7.5], showAt: 2 },
      { id: "n3", label: "CRUD lock storm", type: "note", pos: [8, 4, 7.5], showAt: 3 },
      { id: "n4", label: "Rows never drain", type: "note", pos: [3, 4, -7.5], showAt: 4 },
      { id: "n5", label: "Push, don't poll", type: "note", pos: [11, 4, -7.5], showAt: 6 }
    ],
    edges: [
      { from: "mobile", to: "s2" },
      { from: "desk", to: "s1" },
      { from: "s1", to: "db", label: "INSERT" },
      { from: "s2", to: "db", label: "INSERT" },
      { from: "s3", to: "db", label: "INSERT" },
      { from: "s2", to: "db", label: "SELECT?", dashed: true, showAt: 1 },
      { from: "s4", to: "db", dashed: true, showAt: 5 },
      { from: "s5", to: "db", dashed: true, showAt: 5 },
      { from: "s6", to: "db", dashed: true, showAt: 5 },
      { from: "s4", to: "db2", showAt: 5 },
      { from: "s3", to: "mq", label: "publish", showAt: 6 },
      { from: "mq", to: "s2", label: "push", showAt: 6 }
    ],
    steps: [
      {
        title: "Mail is an INSERT",
        text: "S1, S2, and S3 sit in front of phones and desktops. S3's cron writes row 123 when it needs a peer. The table is the only conversation these servers have.",
        highlight: ["s1", "s2", "s3", "db", "n0", "mobile"],
        flows: [
          { from: "s3", to: "db", color: "#4ade80", label: "INSERT 123" },
          { from: "s1", to: "db", color: "#4ade80", label: "INSERT" }
        ]
      },
      {
        title: "The database will not call you",
        text: "Stores only receive. S2 must poll: every ten seconds, \"anything for me?\" It reads 123, mutates its state, maybe pokes the phone. You built a queue out of SELECT.",
        highlight: ["s2", "db", "mobile", "n1"],
        hide: ["n0"],
        flows: [
          { from: "s2", to: "db", color: "#60a5fa", label: "SELECT?" },
          { from: "db", to: "s2", color: "#fb923c", label: "row 123" },
          { from: "s2", to: "mobile", color: "#60a5fa", label: "notify" }
        ]
      },
      {
        title: "Two ugly settings on one knob",
        text: "Poll every few seconds and empty reads melt the primary. Poll every fifty seconds and a mobile that expected two or three seconds waits a full tick. There is no interval that is both kind to the database and kind to the user.",
        highlight: ["s2", "db", "mobile", "n2"],
        hide: ["n0"],
        flows: [
          { from: "s2", to: "db", color: "#f87171", label: "tight poll" },
          { from: "db", to: "mobile", color: "#f87171", label: "50s late" }
        ]
      },
      {
        title: "CRUD on the same pages",
        text: "Inserts, polls, completion updates, and deletes all hit one table. Engines prefer read-heavy or write-heavy, not both. Locks and deadlocks are the symptom of a log forced to be a mailbox.",
        highlight: ["db", "s1", "s2", "s3", "n3"],
        hide: ["n0", "n2"],
        flows: [
          { from: "s1", to: "db", color: "#4ade80", label: "C" },
          { from: "s2", to: "db", color: "#60a5fa", label: "R" },
          { from: "s3", to: "db", color: "#fb923c", label: "U/D" }
        ]
      },
      {
        title: "The table never drains itself",
        text: "Chatty servers fill disk. Keep every row and you need storage. Mark completed and you pay an UPDATE per consume. Cron-delete and you own cleanup scripts. Retention is now your product.",
        highlight: ["db", "s3", "n4"],
        hide: ["n0", "n1"],
        flows: [
          { from: "s3", to: "db", color: "#4ade80", label: "more rows" },
          { from: "db", to: "s2", color: "#fb923c", label: "DELETE?" }
        ]
      },
      {
        title: "S4–S6 drown the primary",
        text: "Each new server is another poller. A second database for S4/S5 cannot tell S4 how to reach S2 — you invent a broker between stores, which is the thing you refused to run.",
        highlight: ["s4", "s5", "s6", "db", "db2"],
        fail: ["db"],
        hide: ["n0", "n2", "n3"],
        flows: [
          { from: "s4", to: "db", color: "#f87171", label: "poll" },
          { from: "s5", to: "db", color: "#f87171", label: "poll" },
          { from: "s6", to: "db", color: "#f87171", label: "poll" },
          { from: "s4", to: "db2", color: "#fb923c", label: "split?" }
        ]
      },
      {
        title: "A broker pushes",
        text: "A real queue delivers 123 to S2 instead of waiting for a timer. Appends are the write path; delivery is the broker's job. Need capacity? Add more of the same queue, not a second OLTP.",
        highlight: ["mq", "s3", "s2", "n5"],
        hide: ["n0", "n3", "n4"],
        flows: [
          { from: "s3", to: "mq", color: "#4ade80", label: "publish" },
          { from: "mq", to: "s2", color: "#fb923c", label: "push 123" }
        ]
      },
      {
        title: "Tiny systems vs interview scale",
        text: "Few servers or few messages: the table can still win, and a new broker is a training bill. Interviews assume large user counts about ninety percent of the time. Ask QPS first; at size, do not open with INSERT-and-poll.",
        highlight: ["db", "mq", "s2", "mobile", "n5"],
        hide: ["n0", "n3"],
        flows: [
          { from: "s3", to: "db", color: "#60a5fa", label: "small OK" },
          { from: "s3", to: "mq", color: "#4ade80", label: "interview" }
        ]
      }
    ]
  }
});
