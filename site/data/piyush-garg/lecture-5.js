window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 5,
  title: "Back of Envelope Calculation - System Design Concept",
  video: "https://www.youtube.com/watch?v=DwqTon7ZS_s",
  category: "Piyush Garg",
  tagline: "150M DAU × 2 tweets / 1e5 s ≈ 3500 QPS, peak 7000, media 55 PB — before you buy the box.",
  summary: "Back-of-the-envelope estimates (Jeff Dean) are the rough numbers you owe DevOps before a design: how many servers, how much CPU/RAM, how big a managed DB, how many GB of SSD. Freshers guess an 8-CPU machine and waste money, or pick 2 CPU and crash. Round everything: 86,400 s ≈ 100,000 s/day. ByteByteGo latencies remind you RAM is ~100 ns and a disk seek is ~10 ms. Twitter walkthrough: 300M MAU, 50% daily → 150M DAU, 2 tweets/day, 10% media, 5 years keep: ~3500 insert QPS, ~7000 peak, ~30 TB/day, ~55 PB. Write assumptions, label units, start tiny (2 CPU / 4 GB / 256 GB, 8–10 users) and scale from measured CPU and QPS.",

  theory: [
    {
      heading: "DevOps will ask for a number before you have a design",
      body: "A running system needs three physical things at minimum: a <b>compute/server</b>, a <b>database</b>, and <b>storage</b> for media. The sizes are unknown. In the lecture's real project, DevOps asked: how many physical servers? CPU and memory per box? CPU and RAM for a managed database? How many GB of SSD? Freshers freeze, then say <b>8 CPU</b> — a random guess. Maybe you do not have that many users and you burn hourly cost on idle cores. Or you cost-cut to 2 CPU and the box dies. Back-of-the-envelope calculation is how you produce those numbers <b>before</b> you architect, not after the invoice.",
      bullets: [
        "Seniors who design systems treat this chapter as mandatory. Freshers skip it.",
        "Guessing 8 CPU without QPS is how you waste a decent per-hour bill."
      ]
    },
    {
      heading: "The envelope is a napkin, not a spreadsheet",
      body: "The name is literal: you scribble on the back of a letter envelope. No structured model. If this many users store this much, and this many are daily active, then a machine of about this size will do. Jeff Dean's Google talk is the source Piyush points at. Rule one: <b>approximate and round</b>. 24 × 60 × 60 = 86,400 seconds in a day. Treat that as <b>~100,000 (1 lakh) seconds/day</b>. You are estimating capacity, not closing the books.",
      bullets: [
        "Every figure in this lecture is a round number on purpose.",
        "If you need three decimal places, you are no longer on the envelope."
      ]
    },
    {
      heading: "Units of 1000, and the latency numbers every programmer should know",
      body: "Know the ladder: 8 bits in a byte; then KB, MB, GB, TB, PB each ×1000 (thousand, million, billion, trillion, quadrillion in the talk's powers-of-10 story). ByteByteGo's latency table: <b>L1 cache ~0.5 ns</b>, L2 ~7 ns, <b>main memory ~100 ns</b>, <b>disk seek ~10 ms</b>. Crux: memory (RAM) is fast; disk is slow — that is why a Postgres query feels different from Redis. RAM is volatile; disk keeps bytes. Avoid disk seeks when you can. Simple compression is fast; fancy compression costs time. Compress before you send over the internet. Data centers live in different regions: talking from India to a Google box in the US adds latency you must budget.",
      bullets: [
        "Redis vs DB is the same sentence as RAM vs disk.",
        "Region hop is a capacity input, not a surprise on launch day."
      ]
    },
    {
      heading: "Twitter assumptions: write them down before any arithmetic",
      body: "Estimate Twitter QPS and storage. Assumptions, not facts: <b>300 million monthly active users</b>. Not everyone opens the app every day, so take <b>50% daily</b> (could have been 40 or 60 — it is an average). Users post <b>2 tweets per day</b> on average (could be 0, 1, or 4). <b>10% of tweets carry photo/video</b>. Keep data <b>at least five years</b>. The lecture's standing advice: write those bullets on the board so an interviewer can attack the inputs, not your division.",
      bullets: [
        "MAU ≠ DAU. 50% is a rounding choice you must say out loud.",
        "Media percent and retention years move storage more than tweet text does."
      ]
    },
    {
      heading: "150M DAU → ~3500 tweet QPS, peak 7000",
      body: "Daily active users: 300 million × 50% = <b>150 million DAU</b>. Tweets per second: 150 million users × 2 tweets / ~100,000 seconds ≈ <b>3,500 inserts per second</b> (86,400 s gives ~3,472; the envelope says ~3500). That is the write scale of the database for tweet inserts alone — reads are extra. Peak QPS: a global event (the talk's Donald Trump announcement) can suddenly double activity. Design for <b>~7,000 QPS</b> so the system stays up at the spike, not only at the daily mean.",
      bullets: [
        "3500 is insert QPS for tweets, not a full read+write budget.",
        "Peak = 2× average is the lecture's spike rule, not a law of nature."
      ]
    },
    {
      heading: "Media math: 30 TB/day, ~55 PB in five years",
      body: "Per tweet you store a 64-byte id, ~140 bytes of text, and — when present — ~1 MB of media. Media dominates. 150 million DAU × 2 tweets × 10% with media × 1 MB ≈ <b>30 TB per day</b>. Hold that for five years: ~30 TB × 365 × 5 ≈ <b>55 PB</b> of object storage to buy. Text and ids are rounding error next to that blob store. Label every number with MB, TB, or PB so you do not treat 5 as a unitless trophy.",
      bullets: [
        "Id 64 B + text 140 B is on the envelope so you remember media is the bill.",
        "Five-year retention is an assumption. Changing it changes PB, not QPS."
      ]
    },
    {
      heading: "Round, label, then grow from a 2 CPU box you actually measured",
      body: "Tips from the slide: round to nearest tens — 99,987 / 9.1 becomes 100,000 / 10. Always write assumptions. Always label units (millions, hours, seconds, MB vs TB). Common asks: QPS, peak QPS, storage. There is no fixed formula; experience is the teacher — if production ate more than you guessed, the next envelope is better. Piyush's personal start when data is missing: <b>bare minimum</b>, because cost, and because you want to see how the code behaves with little hardware. Dev box: <b>2 CPU, 4 GB RAM, 256 GB disk</b>, about <b>8–10 users</b>. After deploy, watch average CPU, QPS, network in/out, memory. If 8–10 users fill the box, you have a measured point. Production guess: 100 signups, <b>30% return as DAU → 30 users</b>, then scale the 10-user numbers up. That loop is still back-of-the-envelope, just with a calibration point.",
      bullets: [
        "Do not launch on a supercomputer to hide an unknown QPS.",
        "8–10 users on 2 CPU/4 GB is a probe, not a production sizing."
      ]
    }
  ],

  keyTerms: [
    { term: "Back-of-the-envelope", def: "Rough, rounded capacity math (servers, DB, disk) done before the design, named for scribbling on an envelope." },
    { term: "~1e5 s/day", def: "86,400 seconds rounded to 100,000. Divide daily totals by this to get QPS." },
    { term: "DAU / MAU", def: "Daily vs monthly active users. Lecture Twitter: 300M MAU × 50% = 150M DAU." },
    { term: "QPS", def: "Queries (here: tweet inserts) per second. 150M × 2 / 1e5 ≈ 3500." },
    { term: "Peak QPS", def: "Spike budget. Lecture doubles 3500 to ~7000 for a global event." },
    { term: "Latency table", def: "L1 ~0.5 ns, RAM ~100 ns, disk seek ~10 ms — why Redis beats a seek." },
    { term: "Unit ladder", def: "KB/MB/GB/TB/PB each ×1000. 30 TB/day × 5 years ≈ 55 PB." }
  ],

  tradeoffs: [
    { pro: "Rounding 86400 → 1e5 makes QPS mental math possible in an interview.", con: "You are off by ~14%; that is fine for order-of-magnitude, not for a purchase order." },
    { pro: "Peak = 2× mean is a simple availability story for a Trump-scale spike.", con: "Real peaks can be worse than 2×; the envelope does not replace load tests." },
    { pro: "Starting at 2 CPU / 4 GB / 256 GB shows how the code behaves and saves cost.", con: "That box is a probe for 8–10 users; shipping it as production is the crash path." },
    { pro: "RAM (~100 ns) vs disk seek (~10 ms) tells you when Redis is worth the volatility.", con: "Memory forgets on power loss; the envelope still needs durable disk for truth." }
  ],

  interviewTips: [
    "Write assumptions first: 300M MAU, 50% DAU, 2 tweets/day, 10% media, 5 years.",
    "Say 86400 ≈ 1e5 seconds/day before you divide. Round 99987/9.1 to 1e5/10.",
    "Show the arithmetic: 150M × 2 / 1e5 ≈ 3500 insert QPS; peak 7000; 30 TB/day; 55 PB.",
    "Label every line with users, seconds, MB, TB, or PB. A bare 5 is a fail.",
    "Name L1 0.5 ns, RAM 100 ns, disk 10 ms when they ask why cache exists.",
    "If you have no production data, start 2 CPU/4 GB/256 GB, measure 8–10 users, then scale to 30% DAU of expected signups."
  ],

  scene: {
    nodes: [
      { id: "dev", label: "You", type: "user", pos: [-11, 0, 0] },
      { id: "ops", label: "DevOps", type: "service", pos: [-6, 0, 0] },
      { id: "box", label: "8 CPU guess", type: "server", pos: [0, 0, 0] },
      { id: "mdb", label: "Managed DB?", type: "db", pos: [5.5, 0, 0] },
      { id: "ssd", label: "SSD ? GB", type: "storage", pos: [10.5, 0, 0] },
      { id: "nAsk", label: "How many boxes / CPU / RAM?", type: "note", pos: [-6, 0, -3.4] },

      { id: "nDay", label: "86400 s ≈ 1e5 s/day", type: "note", pos: [-6, 0, 3.6], showAt: 1 },
      { id: "nUnit", label: "KB→MB→GB→TB→PB ×1000", type: "note", pos: [2, 0, 3.6], showAt: 1 },

      { id: "l1", label: "L1 0.5 ns", type: "cache", pos: [-8, 0, -5], showAt: 2 },
      { id: "ram", label: "RAM 100 ns", type: "cache", pos: [-2.5, 0, -5], showAt: 2 },
      { id: "disk", label: "Disk 10 ms", type: "storage", pos: [4, 0, -5], showAt: 2 },
      { id: "us", label: "US origin", type: "server", pos: [10, 0, -5], showAt: 2 },
      { id: "nGeo", label: "India→US extra RTT", type: "note", pos: [10, 0, -7.5], showAt: 2 },

      { id: "tw", label: "Twitter", type: "service", pos: [-11, 0, 5.5], showAt: 3 },
      { id: "mau", label: "300M MAU", type: "note", pos: [-6, 0, 7.4], showAt: 3 },
      { id: "pct", label: "50% daily", type: "note", pos: [-1, 0, 7.4], showAt: 3 },
      { id: "twt", label: "2 tweets/day", type: "note", pos: [4.5, 0, 7.4], showAt: 3 },
      { id: "med", label: "10% media, 5 yr", type: "note", pos: [10, 0, 7.4], showAt: 3 },

      { id: "dau", label: "150M DAU", type: "user", pos: [-1, 0, 5.5], showAt: 4 },
      { id: "nDau", label: "300M × 50% = 150M", type: "note", pos: [-1, 0, 3.2], showAt: 4 },

      { id: "qps", label: "~3500 ins/s", type: "db", pos: [5.5, 0, 5.5], showAt: 5 },
      { id: "nQps", label: "150M×2 / 1e5 ≈ 3500", type: "note", pos: [5.5, 0, 3.2], showAt: 5 },

      { id: "peak", label: "Peak ~7000", type: "db", pos: [10.5, 0, 5.5], showAt: 6, color: "#fb923c" },
      { id: "nPeak", label: "2× mean (global event)", type: "note", pos: [10.5, 0, 3.2], showAt: 6 },

      { id: "idb", label: "id 64 B", type: "note", pos: [-8, 0, -5], showAt: 7 },
      { id: "txt", label: "text 140 B", type: "note", pos: [-2.5, 0, -5], showAt: 7 },
      { id: "blob", label: "media 1 MB", type: "storage", pos: [4, 0, -5], showAt: 7 },
      { id: "dayS", label: "30 TB/day", type: "storage", pos: [10, 0, -5], showAt: 7 },
      { id: "five", label: "~55 PB / 5 yr", type: "note", pos: [10, 0, -7.5], showAt: 7 },

      { id: "tiny", label: "2 CPU / 4 GB", type: "server", pos: [-6, 0, 0], showAt: 8 },
      { id: "disk2", label: "256 GB disk", type: "storage", pos: [0, 0, 0], showAt: 8 },
      { id: "u8", label: "8–10 users", type: "user", pos: [5.5, 0, 0], showAt: 8 },
      { id: "mon", label: "CPU QPS net mem", type: "note", pos: [10.5, 0, 0], showAt: 8 },
      { id: "n30", label: "100 signups × 30% DAU", type: "note", pos: [5.5, 0, -3.4], showAt: 8 }
    ],
    edges: [
      { from: "dev", to: "ops" },
      { from: "ops", to: "box", label: "how many?" },
      { from: "ops", to: "mdb" },
      { from: "ops", to: "ssd" },
      { from: "l1", to: "ram", showAt: 2 },
      { from: "ram", to: "disk", showAt: 2 },
      { from: "disk", to: "us", showAt: 2, dashed: true },
      { from: "mau", to: "pct", showAt: 3 },
      { from: "pct", to: "dau", showAt: 4 },
      { from: "dau", to: "qps", showAt: 5 },
      { from: "qps", to: "peak", showAt: 6 },
      { from: "blob", to: "dayS", showAt: 7 },
      { from: "dayS", to: "five", showAt: 7 },
      { from: "tiny", to: "u8", showAt: 8 },
      { from: "u8", to: "mon", showAt: 8 }
    ],
    steps: [
      {
        title: "DevOps wants cores, RAM, and disk",
        text: "Minimum to run: servers, a database, storage. They ask how many boxes, CPU/RAM per box, managed-DB size, SSD GB. An 8-CPU guess with no user count wastes money; a 2-CPU guess can crash. The envelope exists so you stop shrugging.",
        highlight: ["dev", "ops", "box", "mdb", "ssd", "nAsk"],
        flows: [
          { from: "dev", to: "ops", color: "#4ade80", label: "need prod" },
          { from: "ops", to: "box", color: "#fb923c", label: "8 CPU?" }
        ]
      },
      {
        title: "Round the day to 1e5 seconds",
        text: "Back of the envelope means rough. 24×60×60 = 86,400 s. Call it 100,000 seconds in a day. Units climb by 1000: KB, MB, GB, TB, PB. You are choosing an order of magnitude, not invoicing.",
        highlight: ["nDay", "nUnit", "ops"],
        hide: ["box", "mdb", "ssd", "nAsk"],
        flows: [
          { from: "dev", to: "ops", color: "#60a5fa", label: "round" }
        ]
      },
      {
        title: "L1 0.5 ns, RAM 100 ns, disk 10 ms",
        text: "ByteByteGo numbers: L1 ~0.5 ns, RAM ~100 ns, disk seek ~10 ms. Memory is fast and volatile; disk is slow and durable — Redis vs Postgres. Avoid seeks. Compress simply, and compress before the wire. India talking to a US Google box pays extra RTT.",
        highlight: ["l1", "ram", "disk", "us", "nGeo"],
        hide: ["box", "mdb", "ssd", "nAsk", "nDay", "nUnit"],
        flows: [
          { from: "l1", to: "ram", color: "#4ade80", label: "ns" },
          { from: "ram", to: "disk", color: "#f87171", label: "ms" },
          { from: "disk", to: "us", color: "#fb923c", label: "WAN" }
        ]
      },
      {
        title: "Write Twitter assumptions on the board",
        text: "300 million MAU. 50% use it daily (a round average). 2 tweets per user per day. 10% of tweets have media. Store at least five years. Attack these inputs, then the arithmetic is just multiplication.",
        highlight: ["tw", "mau", "pct", "twt", "med"],
        hide: ["box", "mdb", "ssd", "nAsk", "nDay", "nUnit", "l1", "ram", "disk", "us", "nGeo"],
        flows: [
          { from: "mau", to: "pct", color: "#60a5fa", label: "assume" }
        ]
      },
      {
        title: "300M × 50% = 150M DAU",
        text: "Monthly actives are not daily actives. Half of 300 million is 150 million people who actually tweet today. That DAU is the load number every later line uses.",
        highlight: ["mau", "pct", "dau", "nDau", "tw"],
        hide: ["box", "mdb", "ssd", "nAsk", "nDay", "nUnit", "l1", "ram", "disk", "us", "nGeo", "twt", "med"],
        flows: [
          { from: "pct", to: "dau", color: "#4ade80", label: "150M" }
        ]
      },
      {
        title: "150M × 2 / 1e5 ≈ 3500 insert QPS",
        text: "150 million DAU × 2 tweets divided by ~100,000 seconds is about 3500 tweet inserts per second (86,400 s gives ~3472). Size the database to take 3500 writes/s. Reads are a separate envelope.",
        highlight: ["dau", "qps", "nQps"],
        hide: ["box", "mdb", "ssd", "nAsk", "nDay", "nUnit", "l1", "ram", "disk", "us", "nGeo", "mau", "pct", "twt", "med", "nDau"],
        flows: [
          { from: "dau", to: "qps", color: "#c084fc", label: "inserts" }
        ]
      },
      {
        title: "Peak QPS ≈ 7000 on a global event",
        text: "Someone famous announces something and people tweet twice as hard. Double 3500 to ~7000. High availability means surviving that peak, not only the quiet average.",
        highlight: ["qps", "peak", "nPeak"],
        hide: ["box", "mdb", "ssd", "nAsk", "nDay", "nUnit", "l1", "ram", "disk", "us", "nGeo", "mau", "pct", "twt", "med", "nDau", "nQps", "tw"],
        flows: [
          { from: "qps", to: "peak", color: "#fb923c", label: "2×" }
        ]
      },
      {
        title: "10% × 1 MB → 30 TB/day → ~55 PB",
        text: "Tweet id ~64 B, text ~140 B, media ~1 MB. 150M × 2 × 10% × 1 MB ≈ 30 TB of blobs per day. Five years is ~55 PB. Buy object storage from this line, not from the 140-byte caption.",
        highlight: ["idb", "txt", "blob", "dayS", "five"],
        hide: ["box", "mdb", "ssd", "nAsk", "nDay", "nUnit", "l1", "ram", "disk", "us", "nGeo", "mau", "pct", "twt", "med", "nDau", "nQps", "nPeak", "tw", "dau", "qps", "peak"],
        flows: [
          { from: "blob", to: "dayS", color: "#4ade80", label: "30 TB" },
          { from: "dayS", to: "five", color: "#c084fc", label: "5 yr" }
        ]
      },
      {
        title: "Probe 2 CPU / 4 GB with 8–10 users",
        text: "No production data? Start bare-minimum: 2 CPU, 4 GB, 256 GB, 8–10 users. Watch CPU, QPS, network, memory. Then 100 signups × 30% DAU ≈ 30 users, and scale the measured point. Experience is how the next envelope gets less wrong.",
        highlight: ["tiny", "disk2", "u8", "mon", "n30"],
        hide: ["box", "mdb", "ssd", "nAsk", "nDay", "nUnit", "l1", "ram", "disk", "us", "nGeo", "mau", "pct", "twt", "med", "nDau", "nQps", "nPeak", "tw", "dau", "qps", "peak", "idb", "txt", "blob", "dayS", "five", "ops"],
        fail: ["tiny"],
        flows: [
          { from: "tiny", to: "u8", color: "#4ade80", label: "load" },
          { from: "u8", to: "mon", color: "#60a5fa", label: "metrics" }
        ]
      }
    ]
  }
});
