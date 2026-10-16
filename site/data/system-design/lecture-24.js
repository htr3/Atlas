window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 24,
  title: "TikTok Architecture (Mock Interview with sudoCODE)",
  video: "https://www.youtube.com/watch?v=07BVxmVFDGY",
  category: "Case Studies",
  tagline: "Short-video ingest, transcode farm, and CDN delivery under a 45-minute interview.",
  summary: "A live mock interview designing a TikTok / Reels clone: 7-second clips, 10M daily viewers, 100K creators. The design splits immutable blobs on S3+CDN, flexible video metadata, and relational users; queues uploads with HTTP 202; runs a chunked format×resolution worker pipeline; and serves a metadata list before CDN streaming. Availability and upload snappiness beat strict consistency.",

  theory: [
    {
      heading: "Clarify the product before drawing boxes",
      body: "The prompt is a short-video app: people <b>post</b> clips onto a feed, the system must <b>store</b> them, and it must <b>distribute</b> them worldwide. Target length is about <b>7 seconds</b> (special longer cases later). Consistency is optional — a clip can appear in one country a few minutes late. What is not optional: <b>fault tolerance</b> (worry only when a whole AZ dies), <b>availability</b> of playback, <b>fast upload</b> so the creator feels \"published\", and <b>low stream latency</b> once someone hits play. Notifications can lag ~30 minutes; the publish button cannot.",
      bullets: [
        "Functional: upload, store, list, play short videos.",
        "Non-functional: AP over CP, multi-AZ, snappy ingest, eventual visibility.",
        "Interview move: write NFRs on the board and keep pointing at them."
      ]
    },
    {
      heading: "Back-of-envelope that drives storage",
      body: "Assume ~<b>10 million</b> daily active <i>viewers</i> (ballpark: 1B installs, ~1 in 100 open the app daily) and ~<b>100K creators</b>. Write/read is about <code>1:100</code> — a read-heavy system. Later they size ingest at ~<b>200K videos/day</b> (regulars plus weekend/sporadic posters) at ~<b>1 MB</b> per ~10s clip → <b>200 GB/day</b> raw. Multiple codecs and resolutions (each step roughly 2×, files shrinking as resolution drops) land around <b>1.2 TB/day</b>. That volume is routine for a well-provisioned backbone; at TikTok scale you might leave AWS for owned data centers because the bill, not the bits, hurts.",
      bullets: [
        "Creators << consumers, so optimize the read/playback path.",
        "Do capacity math early — the interviewer called out hesitation here.",
        "Raw 200 GB/day becomes ~1.2 TB/day after format × resolution copies."
      ]
    },
    {
      heading: "Three stores, not one database",
      body: "Start with a monolith <code>TikTok 2.0</code> upload API (user id, metadata, file), then split data by access pattern. <b>Video bytes</b> go to object storage (S3-class): huge immutable blobs, read by millions, already wired to CDNs and regional buckets. Clips are not edited in place — TikTok/YouTube/Netflix generally treat an upload as final — so immutability is a feature. <b>Video metadata</b> (thumbnail, duration, timestamps, description, object key) is a <b>document / KV</b> store (Mongo-style): schema drifts (delete time, new thumbnails), point lookups by video id are hot, and recommenders plus history services need cheap horizontal scale without joins. <b>Users</b> stay in <b>MySQL</b> for profiles, countries, and ACID-ish relational facts many services will join later.",
      bullets: [
        "S3: don't reinvent durable blob IO; attach a CDN; replicate per region.",
        "KV/document meta: flexible fields + key lookup for the recs engine.",
        "MySQL users: structured profile data, proven, transactional."
      ]
    },
    {
      heading: "Ingest is asynchronous: queue, then 202",
      body: "A hundred thousand creators cannot be rate-limited to \"one clip at a time\". Put the upload API behind a <b>queue</b>, ack with <b>HTTP 202 Accepted</b> (\"we took the file, encoding is in flight\"), and process at worker pace. That <b>decouples ingest rate from transcode rate</b> — on New Year's the queue grows instead of the API falling over. Split the monolith into an <b>ingest / onboarding service</b> (write path) and a <b>streaming / serving service</b> (read path: geo, device, preferences, then fetch)."
    },
    {
      heading: "Transcode farm: validate, filter, chunk, fan-out",
      body: "A clip is a workflow, not a single write. Typical stages: <b>reject if too long</b> (e.g. &gt;60s even if the product target is 7s), <b>safety / category filters</b>, then <b>transcode</b>. Do not encode format A then format B serially. Split long videos into ~<b>10-second chunks</b> (a 7–10s TikTok is already one chunk; a 30s clip becomes three). Workers subscribe to tasks and fill a <b>format × resolution matrix</b> (iPhone vs Android containers, 1080 / 720 / 480). One uploaded file can explode to many stored objects — the lecture's scare number was hundreds of variants if you naively multiply devices × codecs, which is why you add a pipeline stage when a new phone appears instead of redesigning storage. Chunk + stitch at the end, then PUT objects to regional S3.",
      bullets: [
        "Parallel workers = lower publish SLA than a linear encoder chain.",
        "Short clips may skip chunking and still fan out across formats.",
        "Same pattern works for fat log files: split, process, join."
      ]
    },
    {
      heading: "Delivery: regions, CDN, then metadata-first playback",
      body: "Each finished variant is stored in several regions (the interview used ~four, matching demographics) with extra replicas inside a region so a node death is a redirect, not an outage. A <b>CDN</b> (Akamai-class buy vs Netflix Open Connect build) caches hot bytes near the viewer — Mumbai vs US should not share one origin RTT. Serving picks AZ by location, then bitrate by device and last-mile bandwidth. A profile tap does <b>not</b> dump every MP4 to the phone: query user DB + metadata (or a <b>hot/trending cache</b>) for titles and thumbnails; on click, the client pulls a CDN URL. Object caching is the CDN's job; metadata caching is yours. Buy vs build the CDN on SLA, money, and whether you can operate POPs under local regulation (a startup cannot).",
      bullets: [
        "List view = metadata links; play = CDN GET by video id.",
        "CDN hit after the first viewer in an edge; origin otherwise.",
        "InterviewReady-scale products rent a CDN; Netflix-scale may build one."
      ]
    },
    {
      heading: "Protocols and interview texture",
      body: "Uploads are recorded files, not a live studio, so <b>HTTPS over TCP</b> (chunked / fragmented PUTs) is the honest default: ordered, reliable transport. FTP exists; if you have never operated it, say so rather than inventing a stack. Playback is likewise HTTPS from the edge (often adaptive streaming in a real system). The interviewer praised the queue (ingest vs processing), multi-AZ replication, and matching databases to data. He wanted <b>capacity numbers earlier</b> and more fluency on <b>upload/download protocols</b> — first impressions matter, and hesitancy is where a 45-minute session will drill. The goal is not a perfect TikTok; it is showing breadth under pressure."
    }
  ],

  keyTerms: [
    { term: "HTTP 202 Accepted", def: "Upload API ack that the clip was queued; encoding and regional publish happen after the creator walks away." },
    { term: "Write/read ratio", def: "Here ~100K creators vs 10M viewers (~1:100); storage and caches are built for the read side." },
    { term: "Object storage (S3)", def: "Durable blob store for immutable video files, regionally replicated and CDN-fronted." },
    { term: "Video metadata store", def: "KV/document DB of thumbs, duration, keys, titles — schema-flexible, point-lookup heavy." },
    { term: "Ingest vs streaming service", def: "Write-path onboarding versus read-path geo/device/recommendation-aware playback." },
    { term: "Format × resolution matrix", def: "Each clip is transcoded into several containers and bitrates so cheap phones and flagships both play." },
    { term: "Chunked transcode", def: "Split ~10s slices, encode in parallel, stitch; a 7s TikTok is one chunk." },
    { term: "CDN", def: "Edge caches close to viewers (buy Akamai-like, or build Open Connect-like) for playback RTT and origin offload." },
    { term: "Decoupled ingest", def: "A queue that absorbs upload spikes so workers transcode at a stable rate instead of melting the API." }
  ],

  tradeoffs: [
    { pro: "S3 + CDN: regional copies, no homemade blob layer, low playback RTT.", con: "Egress/storage cost; immutability means \"edit\" is rewrite-and-re-transcode." },
    { pro: "KV metadata: flexible fields, easy scale, fast id lookup for recs.", con: "Weaker relational joins than putting everything in MySQL." },
    { pro: "Queue + 202: creator latency is \"accepted\", workers scale independently.", con: "Visibility is eventual; a flood grows the queue instead of failing fast." },
    { pro: "Many format/resolution variants: every device gets a playable file.", con: "1.2 TB/day and a combinatorial explosion if you multiply devices naively." },
    { pro: "Rented CDN: global POPs without becoming a telecom.", con: "SLA and cache-control are someone else's; building your own is years and geopolitics." }
  ],

  interviewTips: [
    "Lock NFRs first: AP, AZ-level fault tolerance, snappy publish, eventual feed visibility.",
    "State DAU, creator count, and TB/day before arguing S3 vs a custom file cluster.",
    "Split blobs / metadata / users — interviewers listen for why each store exists.",
    "Draw the transcode matrix and say new formats are a new worker stage, not a redesign.",
    "Walk a profile GET: metadata list + thumbnails, then CDN play on click — not a zip of every file.",
    "If weak on protocols, say HTTPS/TCP and that you have not run FTP — do not bluff a live-ingest stack."
  ],

  scene: {
    nodes: [
      { id: "z_in", label: "Creators & ingest", type: "zone", pos: [-7, 0, 0], size: [9, 8] },
      { id: "z_farm", label: "Transcode farm", type: "zone", pos: [1, 0, 3], size: [8, 6], showAt: 5 },
      { id: "z_india", label: "India region", type: "zone", pos: [8, 0, 4], size: [7, 5], showAt: 7 },
      { id: "z_us", label: "US region", type: "zone", pos: [8, 0, -4], size: [7, 5], showAt: 7 },

      { id: "c1", label: "Creator", type: "phone", pos: [-11, 0, -2] },
      { id: "c2", label: "Creator", type: "phone", pos: [-11, 0, 2], showAt: 2 },

      { id: "api", label: "Upload API", type: "gateway", pos: [-8, 0, 0] },
      { id: "q", label: "Ingest queue", type: "queue", pos: [-5, 0, 0], showAt: 3 },
      { id: "ing", label: "Ingest svc", type: "service", pos: [-5, 0, 3], showAt: 4 },

      { id: "udb", label: "Users MySQL", type: "db", pos: [-8, 0, -3.5], showAt: 1 },
      { id: "meta", label: "Video meta", type: "db", pos: [-5, 0, -3.5], showAt: 1 },
      { id: "s3", label: "S3 origin", type: "storage", pos: [1, 0, -3.5], showAt: 1 },

      { id: "val", label: "Validate 7s", type: "worker", pos: [-2, 0, 4.5], showAt: 5 },
      { id: "mod", label: "Safety filter", type: "worker", pos: [1, 0, 4.5], showAt: 5 },
      { id: "chk", label: "Chunk 10s", type: "worker", pos: [4, 0, 4.5], showAt: 5 },
      { id: "w1", label: "MP4 1080p", type: "worker", pos: [-2, 0, 2], showAt: 6 },
      { id: "w2", label: "HLS 720p", type: "worker", pos: [1, 0, 2], showAt: 6 },
      { id: "w3", label: "480p Android", type: "worker", pos: [4, 0, 2], showAt: 6 },

      { id: "serve", label: "Streaming svc", type: "service", pos: [5, 0, -1], showAt: 4 },
      { id: "hot", label: "Hot-video cache", type: "cache", pos: [1, 0, -1], showAt: 9 },

      { id: "cdn_in", label: "CDN Mumbai", type: "cdn", pos: [8, 0, 5], showAt: 7 },
      { id: "s3_in", label: "S3 India", type: "storage", pos: [8, 0, 2.5], showAt: 7 },
      { id: "cdn_us", label: "CDN US", type: "cdn", pos: [8, 0, -2.5], showAt: 7 },
      { id: "s3_us", label: "S3 US", type: "storage", pos: [8, 0, -5], showAt: 7 },

      { id: "v1", label: "Viewer IN", type: "phone", pos: [11, 0, 5], showAt: 8 },
      { id: "v2", label: "Viewer US", type: "phone", pos: [11, 0, -5], showAt: 8 },

      { id: "n_req", label: "7s clips, AP over CP", type: "note", pos: [0, 4, -7] },
      { id: "n_scale", label: "10M DAU / 100K creators", type: "note", pos: [0, 4, 7], showAt: 2 },
      { id: "n_202", label: "HTTP 202 Accepted", type: "note", pos: [-8, 3.5, 4], showAt: 3 },
      { id: "n_tb", label: "~1.2 TB new video / day", type: "note", pos: [0, 4, 7], showAt: 6 },
      { id: "n_https", label: "HTTPS + TCP chunks", type: "note", pos: [0, 4, -7], showAt: 10 }
    ],
    edges: [
      { from: "c1", to: "api", label: "upload" },
      { from: "c2", to: "api", label: "upload", showAt: 2 },
      { from: "api", to: "udb", showAt: 1 },
      { from: "api", to: "meta", showAt: 1 },
      { from: "api", to: "s3", showAt: 1, dashed: true },
      { from: "api", to: "q", label: "enqueue", showAt: 3 },
      { from: "q", to: "ing", showAt: 4 },
      { from: "ing", to: "val", showAt: 5 },
      { from: "val", to: "mod", showAt: 5 },
      { from: "mod", to: "chk", showAt: 5 },
      { from: "chk", to: "w1", showAt: 6 },
      { from: "chk", to: "w2", showAt: 6 },
      { from: "chk", to: "w3", showAt: 6 },
      { from: "w1", to: "s3", showAt: 6 },
      { from: "w2", to: "s3", showAt: 6 },
      { from: "w3", to: "s3", showAt: 6 },
      { from: "s3", to: "s3_in", label: "replicate", showAt: 7 },
      { from: "s3", to: "s3_us", label: "replicate", showAt: 7 },
      { from: "s3_in", to: "cdn_in", showAt: 7 },
      { from: "s3_us", to: "cdn_us", showAt: 7 },
      { from: "v1", to: "serve", label: "profile", showAt: 8 },
      { from: "serve", to: "meta", showAt: 8 },
      { from: "serve", to: "udb", showAt: 8 },
      { from: "v1", to: "cdn_in", label: "play", showAt: 8 },
      { from: "v2", to: "cdn_us", label: "play", showAt: 8 },
      { from: "serve", to: "hot", showAt: 9 }
    ],
    steps: [
      {
        title: "NFRs on the board",
        text: "Design a Reels/TikTok: post, store, and fan out ~7s clips. Availability and AZ-level fault tolerance matter; a few minutes of cross-country lag is fine. Creators need a fast publish ack; playback must start quickly once someone taps play.",
        highlight: ["c1", "api", "n_req"],
        hide: ["n_https"],
        flows: [
          { from: "c1", to: "api", color: "#4ade80", label: "clip" }
        ]
      },
      {
        title: "Three kinds of data",
        text: "Bytes go to S3 (immutable, CDN-ready). Metadata (thumb, duration, object key) sits in a document/KV store so the schema can grow. User profiles stay in MySQL. One monolith API writes all three before we split services.",
        highlight: ["api", "s3", "meta", "udb"],
        hide: ["n_https", "n_tb"],
        flows: [
          { from: "c1", to: "api", color: "#4ade80", label: "file+meta" },
          { from: "api", to: "s3", color: "#4ade80", label: "blob" },
          { from: "api", to: "meta", color: "#4ade80", label: "doc" },
          { from: "api", to: "udb", color: "#4ade80", label: "user" }
        ]
      },
      {
        title: "10M viewers, 100K creators",
        text: "About 10 million daily viewers and 100K uploaders — writes are ~1/100 of reads. Storage, caches, and the streaming path must be read-optimized. A second creator appears; the upload API will need a shock absorber.",
        highlight: ["c1", "c2", "n_scale", "api"],
        hide: ["n_tb", "n_https"],
        flows: [
          { from: "c1", to: "api", color: "#4ade80", label: "write" },
          { from: "c2", to: "api", color: "#4ade80", label: "write" }
        ]
      },
      {
        title: "Queue the upload, return 202",
        text: "Do not rate-limit creators to one file. Enqueue every upload and reply HTTP 202 Accepted so the phone can drop off. Encoding, filters, and replication happen behind the queue — publish feels instant even when workers are busy.",
        highlight: ["api", "q", "n_202", "c1"],
        hide: ["n_https", "n_tb"],
        flows: [
          { from: "c1", to: "api", color: "#4ade80", label: "PUT" },
          { from: "api", to: "q", color: "#fb923c", label: "job" },
          { from: "api", to: "c1", color: "#60a5fa", label: "202" }
        ]
      },
      {
        title: "Split ingest from streaming",
        text: "The monolith becomes an ingest service that only drains the queue, plus a streaming service that will later locate the viewer, pick a bitrate, and fetch. Write path and read path scale independently.",
        highlight: ["ing", "serve", "q"],
        hide: ["n_https", "n_tb"],
        flows: [
          { from: "q", to: "ing", color: "#fb923c", label: "job" }
        ]
      },
      {
        title: "Pipeline: validate, filter, chunk",
        text: "Each job is a workflow: drop clips over the max length, run safety/category checks, then split on ~10s boundaries. A 7s TikTok is one chunk; a 30s video becomes three so later encodes can run in parallel.",
        highlight: ["z_farm", "val", "mod", "chk", "ing"],
        hide: ["n_https"],
        flows: [
          { from: "ing", to: "val", color: "#fb923c", label: "clip" },
          { from: "val", to: "mod", color: "#fb923c", label: "ok" },
          { from: "mod", to: "chk", color: "#fb923c", label: "split" }
        ]
      },
      {
        title: "Format × resolution workers",
        text: "Chunk tasks fan out to subscribers: MP4 1080p, HLS 720p, 480p Android, and so on. Adding a new phone is one more worker stage. Raw ~200 GB/day becomes about 1.2 TB/day of variants, then lands on S3.",
        highlight: ["chk", "w1", "w2", "w3", "s3", "n_tb"],
        hide: ["n_scale", "n_https"],
        flows: [
          { from: "chk", to: "w1", color: "#fb923c", label: "chunk" },
          { from: "chk", to: "w2", color: "#fb923c", label: "chunk" },
          { from: "chk", to: "w3", color: "#fb923c", label: "chunk" },
          { from: "w1", to: "s3", color: "#4ade80", label: "PUT" },
          { from: "w2", to: "s3", color: "#4ade80", label: "PUT" },
          { from: "w3", to: "s3", color: "#4ade80", label: "PUT" }
        ]
      },
      {
        title: "Replicate to regions + CDN edges",
        text: "Finished objects copy into India and US buckets (and more AZs for demographics). Edges in Mumbai and the US cache hits so a US origin outage does not black out India. Extra replicas inside a region turn a dead node into a redirect.",
        highlight: ["s3", "s3_in", "s3_us", "cdn_in", "cdn_us", "z_india", "z_us"],
        hide: ["n_https"],
        flows: [
          { from: "s3", to: "s3_in", color: "#c084fc", label: "replica" },
          { from: "s3", to: "s3_us", color: "#c084fc", label: "replica" },
          { from: "s3_in", to: "cdn_in", color: "#c084fc", label: "fill" },
          { from: "s3_us", to: "cdn_us", color: "#c084fc", label: "fill" }
        ]
      },
      {
        title: "Profile list, then play from the edge",
        text: "A viewer opening a creator profile hits the streaming service, which loads user + metadata (titles, thumbs) — not the bytes. On tap, the phone streams from the nearest CDN. Nothing is pre-downloaded like a zip of every clip.",
        highlight: ["v1", "v2", "serve", "meta", "cdn_in", "cdn_us"],
        hide: ["n_https"],
        flows: [
          { from: "v1", to: "serve", color: "#60a5fa", label: "list GKCS" },
          { from: "serve", to: "meta", color: "#60a5fa", label: "keys" },
          { from: "serve", to: "v1", color: "#60a5fa", label: "thumbs" },
          { from: "v1", to: "cdn_in", color: "#4ade80", label: "play" },
          { from: "v2", to: "cdn_us", color: "#4ade80", label: "play" }
        ]
      },
      {
        title: "Cache hot titles; CDN caches bytes",
        text: "Trending metadata can sit in an app-level cache so the KV store is not on every For You request. Actual video bytes stay the CDN's problem. You are not poking Akamai to pin a clip unless you built the edge yourself.",
        highlight: ["hot", "serve", "cdn_in", "meta"],
        hide: ["n_https"],
        flows: [
          { from: "serve", to: "hot", color: "#60a5fa", label: "trending" },
          { from: "hot", to: "serve", color: "#60a5fa", label: "hit" },
          { from: "v1", to: "cdn_in", color: "#4ade80", label: "cached MP4" }
        ]
      },
      {
        title: "HTTPS chunks; queue absorbs the holiday",
        text: "Upload is a recorded file over HTTPS/TCP — reliable, ordered, fragmentable — not a live FTP studio. Playback is HTTPS from the edge. If New Year floods the API, the queue grows; workers keep transcoding at a steady rate. Ingest rate and processing rate stay decoupled.",
        highlight: ["c1", "api", "q", "ing", "n_https", "w1", "w2"],
        hide: ["n_req"],
        flows: [
          { from: "c1", to: "api", color: "#4ade80", label: "HTTPS PUT" },
          { from: "api", to: "q", color: "#fb923c", label: "spike" },
          { from: "q", to: "ing", color: "#fb923c", label: "drain" },
          { from: "ing", to: "w1", color: "#fb923c", label: "steady" }
        ]
      }
    ]
  }
});
