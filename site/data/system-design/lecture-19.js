window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 19,
  title: "Capacity Planning and Estimation: How Much Data Does YouTube Store Daily?",
  video: "https://www.youtube.com/watch?v=0myM0k1mjZw",
  category: "Interview Prep",
  tagline: "1M videos × 1 GB × ladder × 3 copies ≈ 10 PB/day.",
  summary: "Back-of-the-envelope capacity planning, the interview cousin of 'how many petrol pumps are in this city?'. Work YouTube daily storage from first principles: 1 billion users, 1 in 1000 uploads, ~1 GB per video, three replicas, a geometric bitrate ladder, then a sanity check against published upload rates. The point is order of magnitude and stated assumptions, not a spreadsheet.",

  theory: [
    {
      heading: "Why interviews ask this",
      body: "Capacity planning is deciding how many disks, machines, and dollars a design needs before you build it. Interviewers like it because it is the same muscle as Fermi problems ('petrol pumps in Mumbai'): pick a population, guess a rate, multiply, and keep only powers of ten. You will be wrong in the details; you must not be wrong by three zeros. State every assumption out loud so the interviewer can nudge a number instead of watching you silently derail."
    },
    {
      heading: "Units you actually use",
      body: "Work in powers of 10^3 (interview convention, even if real disks are 2^10):<br><code>1 KB = 10^3 B, 1 MB = 10^6 B, 1 GB = 10^9 B, 1 TB = 10^12 B, 1 PB = 10^15 B</code>.<br>Useful equalities: <code>1 PB = 10^6 GB = 1000 TB</code>. A 100 TB drive is 0.1 PB. Round aggressively (700 MB to 1 GB) once you are within about 2x."
    },
    {
      heading: "Step 1 — how many new videos?",
      body: "Assume <b>1 billion</b> (10^9) active users. Not everyone uploads. Take <b>1 in 1000</b> producing a video on a given day.<br><br><code>uploads/day = 10^9 / 10^3 = 10^6 = 1 million videos/day</code>.<br><br>Average length: <b>10 minutes</b>. That is an assumption; say it, then move."
    },
    {
      heading: "Step 2 — naive uncompressed size (and why it is wrong)",
      body: "A video is a stack of stills. First-principles size, as walked on the whiteboard:<br><br><code>10 min = 600 seconds</code><br><code>~25 frames/sec → about 1.5 × 10^5 frames</code> (the lecture writes 25 × 600 = 150,000)<br><code>1 MB per uncompressed frame → 1.5 × 10^5 × 10^6 B = 1.5 × 10^11 B = 150 GB per video</code>.<br><br>That number is wildly high: a normal 10-minute upload is about <b>700 MB</b>, not 150 GB. Codecs exist precisely so you do not store raw frames. Call the miss, let the interviewer correct you, and round to <b>1 GB per video</b>. Overshooting uncompressed size by ~100x is expected; refusing to revise it is the actual fail."
    },
    {
      heading: "Step 3 — raw ingest per day",
      body: "<code>1 million videos/day × 1 GB = 10^6 GB = 1 PB/day</code> of original bits.<br><br>That is the <i>bare minimum</i> to keep masters. Production systems replicate for durability and to serve from more than one building. The lecture picks <b>3 copies</b>:<br><br><code>raw with redundancy = 3 × 1 PB = 3 PB/day</code>."
    },
    {
      heading: "Step 4 — bitrate ladder (geometric series)",
      body: "Players need more than the original. Assume one container (MP4) and a resolution ladder from 720p down through 480p, 360p, 240p (and 144p). A workable interview model: each rung is about <b>half the bits</b> of the one above.<br><br>Let <code>X = 1 PB</code> be the top-rung size for a day's uploads.<br><code>total encoded = X + X/2 + X/4 + X/8</code><br><code>= X (1 + 1/2 + 1/4 + 1/8) = X × 1.875 ≈ 2X</code>.<br><br>So the processed ladder is ~<b>2 PB</b> before copies. Three replicas of that ladder:<br><code>3 × 2X = 6X = 6 PB/day processed</code>.<br><br>Keep the 3 PB of raw masters as well (mezzanine / original, separate from derived rungs):<br><code>6 PB processed + 3 PB raw = 10 PB/day</code>.<br><br>That 10 PB figure is the lecture's headline."
    },
    {
      heading: "Step 5 — boxes and money",
      body: "If a drive holds <b>100 TB = 0.1 PB</b>:<br><code>drives/day = 10 PB / 0.1 PB = 100 hard drives</code> (the lecture's 'about 100').<br><br>If a drive is roughly $10,000, daily disk spend is about <b>$1 million/day</b>. Over a 3-year planning horizon (~1000 days):<br><code>1000 × $1M ≈ $1 billion</code> of storage cost — before power, buildings, or transcode compute. You are not trying to get accounting-grade CAPEX; you are showing that YouTube's storage bill is a <i>billion-dollar</i> problem, not a $10k one."
    },
    {
      heading: "Step 6 — sanity check against published upload rate",
      body: "Public stat used in the lecture: about <b>3 × 10^4 minutes of video uploaded per minute</b> (30,000 min of footage every wall-clock minute).<br><br><code>minutes/day = 3 × 10^4 min/min × 1440 min/day = 4.32 × 10^7 ≈ 4.5 × 10^7 minutes/day</code>.<br><br>A typical encoded feature compresses to about <b>1 GB per hour</b>:<br><code>hours/day = 4.5 × 10^7 / 60 = 7.5 × 10^5 hours/day</code><br><code>GB/day ≈ 7.5 × 10^5 GB ≈ 0.75 PB/day</code>, which the lecture rounds to <b>~1 million GB = 1 PB</b>.<br><br>That matches Step 3's 1 PB of compressed originals. Encoding plus replicas still push you into several-to-10 PB/day of retained data. Same order of magnitude as the Fermi estimate, so you keep the design.<br><br>If an interviewer uses a later public figure of ~500 hours uploaded per minute: <code>500 h/min × 1440 = 720,000 hours/day × 1 GB/h ≈ 0.72 PB/day</code> raw — still the same 1 PB bucket."
    }
  ],

  keyTerms: [
    { term: "Back-of-the-envelope", def: "Arithmetic with stated assumptions and powers of ten; good to ~2–5×, not to three significant figures." },
    { term: "Fermi problem", def: "Estimate a huge count from a population × a rate (petrol pumps, videos/day, etc.)." },
    { term: "Order of magnitude", def: "Nearest power of ten. 0.75 PB and 1 PB are the same bucket; 1 PB vs 1 EB is not." },
    { term: "Bitrate ladder", def: "Set of resolutions/bitrates stored per video. Modeled here as X + X/2 + X/4 + X/8 ≈ 2X." },
    { term: "Redundancy factor", def: "Extra copies for durability and locality. This lecture uses 3× on both raw and encoded." },
    { term: "Petabyte (PB)", def: "10^15 bytes ≈ 10^6 GB. The unit YouTube daily ingest lives in." },
    { term: "Mezzanine / raw master", def: "The original uploaded (or lightly transcoded) file you keep besides derived rungs." },
    { term: "Sanity check", def: "Compare your Fermi number to a public rate so you catch 100× mistakes (like uncompressed frames)." }
  ],

  tradeoffs: [
    { pro: "Rounding 700 MB to 1 GB keeps the algebra in powers of ten you can do on a whiteboard.", con: "You hide codec and resolution mix; a 4K-heavy day is several times larger." },
    { pro: "3 replicas make durability and multi-region reads obvious.", con: "Erasure coding can give similar durability at ~1.3–1.6× instead of 3×, which changes the dollar answer." },
    { pro: "Geometric ladder (half each rung) is easy to sum to 2X.", con: "Real ABR ladders are not exact halves and often include 1080p/4K rungs that dominate size." },
    { pro: "Checking against 'minutes uploaded per minute' catches the 150 GB/frame blunder.", con: "Public stats are themselves rounded and dated; treat them as a second Fermi input, not ground truth." }
  ],

  interviewTips: [
    "Talk assumptions before multiplying: users, upload fraction, minutes, GB/video, replica factor, ladder.",
    "If uncompressed math explodes (150 GB), say so and switch to a known compressed size. That is a feature, not a fail.",
    "Keep every line a power of ten so the interviewer can audit it from the back of the room.",
    "Always add replicas and transcodes; quoting only '1 PB of uploads' undercounts what you must buy.",
    "Finish with a sanity check against a public rate (minutes/minute or hours/minute).",
    "Translate the final PB number into drives and a 3-year dollar figure so the design has a budget, not just a volume."
  ],

  scene: {
    nodes: [
      { id: "board", label: "Daily YouTube ingest", type: "zone", pos: [0, 0, 0], size: [22, 14] },
      { id: "users", label: "1B users", type: "user", pos: [-10, 0, 0] },
      { id: "uploaders", label: "1 in 1000", type: "user", pos: [-6, 0, 0], showAt: 1 },
      { id: "pile", label: "1M videos/day", type: "storage", pos: [-2, 0, 0], showAt: 1 },
      { id: "naive", label: "150 GB/video", type: "storage", pos: [-2, 0, -5], showAt: 2, color: "#f87171" },
      { id: "real", label: "1 GB/video", type: "storage", pos: [-2, 0, 5], showAt: 3, color: "#4ade80" },
      { id: "raw", label: "1 PB raw", type: "storage", pos: [3, 0, 0], showAt: 3 },
      { id: "rep1", label: "Copy A", type: "storage", pos: [3, 0, -5], showAt: 4 },
      { id: "rep2", label: "Copy B", type: "storage", pos: [3, 0, 5], showAt: 4 },
      { id: "r720", label: "720p = X", type: "service", pos: [8, 0, -6], showAt: 5 },
      { id: "r480", label: "480p = X/2", type: "service", pos: [8, 0, -2], showAt: 5 },
      { id: "r360", label: "360p = X/4", type: "service", pos: [8, 0, 2], showAt: 5 },
      { id: "r240", label: "240p = X/8", type: "service", pos: [8, 0, 6], showAt: 5 },
      { id: "total", label: "10 PB retained", type: "db", pos: [11.5, 0, 0], showAt: 6 },
      { id: "drives", label: "100 HDDs", type: "worker", pos: [11.5, 0, -5], showAt: 7 },
      { id: "cash", label: "$1M / day", type: "note", pos: [11.5, 3.3, 0], showAt: 7 },
      { id: "n_fermi", label: "like petrol pumps", type: "note", pos: [-10, 3.3, 0] },
      { id: "n_rate", label: "10^9 / 10^3 = 10^6", type: "note", pos: [-6, 3.3, 0], showAt: 1 },
      { id: "n_frames", label: "1.5e5 frames x 1MB", type: "note", pos: [-2, 3.3, -5], showAt: 2 },
      { id: "n_fix", label: "real ~700MB → 1GB", type: "note", pos: [-2, 3.3, 5], showAt: 3 },
      { id: "n_geo", label: "X+X/2+X/4+X/8=2X", type: "note", pos: [8, 3.3, 0], showAt: 5 },
      { id: "n_sum", label: "6PB encoded + 3PB raw", type: "note", pos: [8, 3.3, 4], showAt: 6 },
      { id: "n_real", label: "3e4 min/min x 1440", type: "note", pos: [3, 3.3, 0], showAt: 8 },
      { id: "n_ok", label: "public rate ~1 PB too", type: "note", pos: [3, 3.3, 5], showAt: 8 }
    ],
    edges: [
      { from: "users", to: "uploaders", showAt: 1 },
      { from: "uploaders", to: "pile", showAt: 1 },
      { from: "pile", to: "naive", showAt: 2, dashed: true },
      { from: "pile", to: "real", showAt: 3 },
      { from: "real", to: "raw", showAt: 3 },
      { from: "raw", to: "rep1", showAt: 4, dashed: true },
      { from: "raw", to: "rep2", showAt: 4, dashed: true },
      { from: "raw", to: "r720", showAt: 5 },
      { from: "r720", to: "r480", showAt: 5 },
      { from: "r480", to: "r360", showAt: 5 },
      { from: "r360", to: "r240", showAt: 5 },
      { from: "r720", to: "total", showAt: 6 },
      { from: "rep1", to: "total", showAt: 6, dashed: true },
      { from: "total", to: "drives", showAt: 7 }
    ],
    steps: [
      {
        title: "Estimate, don't measure",
        text: "Same game as counting petrol pumps in a city. You will invent a population and a rate. Say the assumptions so the interviewer can edit them.",
        highlight: ["users", "n_fermi"]
      },
      {
        title: "1B users, 1 in 1000 upload",
        text: "10^9 active users × 1/1000 posters = 10^6 new videos per day. Average length 10 minutes. Write it on the board before touching file size.",
        highlight: ["users", "uploaders", "pile", "n_rate"],
        flows: [
          { from: "users", to: "uploaders", color: "#4ade80", label: "0.1%" },
          { from: "uploaders", to: "pile", color: "#4ade80", label: "1M/day" }
        ]
      },
      {
        title: "Uncompressed frames explode",
        text: "10 min × ~25 fps ≈ 1.5×10^5 frames. At 1 MB/frame that is 150 GB per video — two orders too big. You just discovered why codecs exist. Flag this path as wrong.",
        highlight: ["naive", "n_frames", "pile"],
        fail: ["naive"],
        flows: [
          { from: "pile", to: "naive", color: "#f87171", label: "150 GB?" }
        ]
      },
      {
        title: "Revise to 1 GB, get 1 PB raw",
        text: "A real 10-minute file is about 700 MB. Round to 1 GB. 1 million × 1 GB = 1 PB of originals per day. That is the bare minimum ingest.",
        highlight: ["real", "raw", "n_fix"],
        hide: ["naive", "n_frames"],
        flows: [
          { from: "pile", to: "real", color: "#4ade80", label: "1 GB" },
          { from: "real", to: "raw", color: "#4ade80", label: "1 PB" }
        ]
      },
      {
        title: "Three copies of the masters",
        text: "Durability and locality mean replicas. Factor 3 → 3 PB/day of raw storage before any transcode. Say the factor; they may want 2 or erasure coding instead.",
        highlight: ["raw", "rep1", "rep2"],
        hide: ["naive", "n_frames"],
        flows: [
          { from: "raw", to: "rep1", color: "#c084fc", label: "replica" },
          { from: "raw", to: "rep2", color: "#c084fc", label: "replica" }
        ]
      },
      {
        title: "Ladder sums to 2X",
        text: "MP4 at 720p plus 480/360/240, each about half the previous: X + X/2 + X/4 + X/8 ≈ 2X. Processed volume ≈ 2 PB/day before copies, 6 PB after ×3.",
        highlight: ["r720", "r480", "r360", "r240", "n_geo"],
        hide: ["naive", "n_frames"],
        flows: [
          { from: "raw", to: "r720", color: "#fb923c", label: "transcode" },
          { from: "r720", to: "r480", color: "#fb923c", label: "X/2" },
          { from: "r480", to: "r360", color: "#fb923c", label: "X/4" },
          { from: "r360", to: "r240", color: "#fb923c", label: "X/8" }
        ]
      },
      {
        title: "6 PB encoded + 3 PB raw = 10 PB",
        text: "Keep masters and the derived ladder. Headline number: about 10 PB of new retained video per day.",
        highlight: ["total", "n_sum", "r720", "raw"],
        hide: ["naive", "n_frames"],
        flows: [
          { from: "r720", to: "total", color: "#4ade80", label: "6 PB" },
          { from: "rep1", to: "total", color: "#c084fc", label: "3 PB raw" }
        ]
      },
      {
        title: "100 drives, $1M/day, $1B / 3 years",
        text: "10 PB at 100 TB/drive is ~100 HDDs. At ~$10k each that is ~$1 million per day, or about a billion dollars over a 3-year plan. Storage is a budget line, not an afterthought.",
        highlight: ["drives", "cash", "total"],
        hide: ["naive", "n_frames"],
        flows: [
          { from: "total", to: "drives", color: "#fb923c", label: "buy disks" }
        ]
      },
      {
        title: "Public rate lands on the same PB",
        text: "3×10^4 minutes uploaded per minute × 1440 ≈ 4.5×10^7 minutes/day ≈ 7.5×10^5 hours. At ~1 GB per encoded hour that is ~0.75–1 PB of originals — the same order as step 3. Keep the design.",
        highlight: ["n_real", "n_ok", "raw", "pile"],
        hide: ["naive", "n_frames"],
        flows: [
          { from: "pile", to: "raw", color: "#60a5fa", label: "matches ~1 PB" }
        ]
      }
    ]
  }
});
