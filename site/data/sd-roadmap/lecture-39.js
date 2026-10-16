window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 39,
  title: "Design a Stock Market Data and Analysis Platform",
  video: "",
  category: "Roadmap Case Studies",
  tagline: "Order ticks per symbol, fan out quotes, persist bars, analyze off the write path.",
  summary: "A market-data platform is two SLAs glued together: a live quote that cannot be stale by seconds, and a history that cannot lose ticks. P0: ingest exchange feeds, order ticks per symbol, stream to subscribers, roll candles, serve charts and a simple screen. Trading/matching engines are out of scope unless asked. The design is a partitioned log per symbol, in-memory last-quote, a time-series store for bars, and workers for indicators — with late ticks, trading-halt gaps, and fan-out to a million watchlists as the failure stories.",

  theory: [
    {
      heading: "Requirements: live vs history vs analysis",
      body: "P0: (1) ingest a tick feed (last, bid, ask, size, timestamp, sequence), (2) latest quote per symbol in < 50–100 ms of the feed, (3) subscribe a watchlist over WebSocket, (4) OHLCV candles (1s/1m/1d) for charts, (5) a snapshot at market open. P1: options chains, news NLP, backtesting cluster, brokerage orders. NFRs: no reordering of ticks for a symbol, completeness of history (you may lag, you may not skip), 10 k symbols, 100 k–1 M ticks/s at the open, 1 M concurrent watchlists. Consistency: per-symbol total order. Cross-symbol is best-effort (two last trades are not a transactional spread). Regulatory: you are a data vendor, not an exchange — timestamps and sequence numbers are the exchange's.",
      bullets: [
        "Ask which venue and whether you need full order book (L2) or last sale (L1). L2 is a different size.",
        "Out of scope: matching engine, custody, the ledger from lesson 32 except for billing the vendor feed.",
        "Success: gap count vs exchange sequence, WS lag p95, candle reconstructability from ticks."
      ]
    },
    {
      heading: "Ingest: one ordered log per symbol",
      body: "Gateways accept vendor sessions (FIX, binary, or a cloud multicast). Validate sequence; a gap is an incident — request replay from the vendor, do not invent ticks. Append to Kafka (or a purpose-built sequencer) <b>partitioned by symbol</b> so one consumer sees ticks in order. Do not use a random partition key. Spring: a Netty or dedicated feed handler writes to Kafka; it does not compute RSI. Burst at the open: size partitions and disk for 10× midday. Duplicate sequence numbers are dropped (idempotent append). Trading halts are ticks too (status flags); charts must show a gap, not a interpolated line across a halt.",
      bullets: [
        "Clock: store exchange time and local receive time. Never sort by local clock across two gateways.",
        "A second gateway is hot-hot only if they share a sequencer or you elect a leader per symbol.",
        "Poison ticks (bad px) go to a quarantine topic; they must not zero a candle."
      ]
    },
    {
      heading: "Live path: last quote and fan-out",
      body: "A quote service keeps <code>ConcurrentHashMap&lt;Symbol, Quote&gt;</code> (or Redis) as the last tick, updated by the per-symbol consumer. Watchlists: user → set of symbols. Naïve: each tick fans to every user who watches it. At 1 M users that is a storm. Invert: symbol → local subscribers on this WS box, plus a pub/sub (Redis or Kafka compact topic) between boxes. A user connects to a gateway, registers symbols, and receives only those. Snapshot on subscribe (last quote) then deltas. Batch WS frames (50 ms) so a 1 kHz ticker does not explode a phone. Spring: <code>SimpMessagingBroker</code> is fine for a demo; at this QPS you will shard WS nodes by userId and fan-in symbol channels.",
      bullets: [
        "Do not pull last quote from the time-series store on every tick. Memory is the live path.",
        "Late joiners get a snapshot + subsequent ticks. Missed WS frames: client resubscribes, not a custom TCP.",
        "Authorization: delayed vs real-time feeds are different entitlements on the same socket."
      ]
    },
    {
      heading: "History: ticks, bars, and rollups",
      body: "Raw ticks: write-heavy, sequential, partitioned by symbol+day in object storage or a TSDB. Most charts never read ticks — they read <b>bars</b> (OHLCV). A rollup worker consumes the same log, maintains the open 1-second bar in memory, flushes on boundary. Higher frames (1m, 5m, 1d) roll from smaller bars, not from ticks, or you will not catch up. Query: <code>GET /bars?symbol=TCS&tf=1m&from=&to=</code> hits a TSDB (or compacted Parquet on object storage + a cache of recent days). Backfill: if a gap is filled from vendor replay, recompute bars for that window idempotently (bar id = symbol+tf+openTime). Spring batch or a Kafka consumer with a rocksdb state store (Kafka Streams) is the textbook rollup.",
      bullets: [
        "A 1s bar for 10 k symbols is tiny vs ticks. That is why charts feel instant.",
        "Corporate actions (splits) are a second stream that rewrites adjusted bars, not the raw ticks.",
        "Do not put candles in MySQL as one row per tick. That is the ingest anti-pattern."
      ]
    },
    {
      heading: "Analysis off the write path",
      body: "RSI, moving averages, screeners (\"RSI < 30 and volume spike\") run on bar workers or a query engine over Parquet. They subscribe to bar events, not to ticks, unless the product is a 1-second scalper (then you need a dedicated hot path and a smaller universe). Backtests replay bars from object storage into isolated compute; they never hit the live quote map. Feature store: materialized columns on the bar table, recomputed on replay. Java: bounded pools per analysis job so a runaway screener cannot stall rollups. Results cache with a key (symbol, tf, window, version of the formula).",
      bullets: [
        "A screener at 9:15 will stampede. Precompute into a snapshot, or paginate symbols.",
        "Correctness: analysis must pin a data version. Live bars are still mutating the current interval.",
        "ML price prediction is P1 and must be labeled as non-advisory if you are in a regulated shop."
      ]
    },
    {
      heading: "Failure, scale, and the recap",
      body: "Open bell: 10× ticks. Kafka lag is allowed for rollups; it is not allowed for the last-quote map — scale quote consumers first. Sequence gap: pause charts, request replay, mark the gap on the UI. WS node death: clients reconnect to another box and resubscribe (snapshot + live). Multi-region: live quotes can active-active if each region consumes the same sequenced log; do not sequence independently in two DCs. Exchange outage: show stale-with-timestamp, never a frozen number that looks live. Metrics: tick lag vs exchange time, sequence holes, WS fan-out drops, bar rebuild seconds. Recap: per-symbol log, in-memory last, inverted watchlist fan-out, bars from the log, analysis on bars.",
      bullets: [
        "L2 order book: per-symbol in-memory tree plus a shorter retention of deltas. Call it out as a size jump.",
        "Billing the vendor: a ledger of entitlements, not a mutable boolean on the user row.",
        "Compared with search: both are ingest+query, but here order is correctness, not BM25."
      ]
    }
  ],

  keyTerms: [
    { term: "Tick", def: "One market event: price, size, exchange timestamp, sequence, maybe bid/ask." },
    { term: "Sequence gap", def: "A missing seq from the venue. Replay; do not interpolate a trade." },
    { term: "Last quote", def: "The in-memory latest tick per symbol on the live path." },
    { term: "OHLCV bar", def: "Open/high/low/close/volume over a fixed interval, rolled from ticks or smaller bars." },
    { term: "Watchlist fan-out", def: "Inverted index symbol → subscribers so a tick does not scan 1 M users." },
    { term: "Delayed feed", def: "Entitlement that lags real-time (often 15 min) on the same infrastructure." },
    { term: "Halt", def: "Venue status that must appear as a gap, not a smooth line on the chart." },
    { term: "Adjusted bars", def: "History rewritten for splits/dividends; raw ticks stay the audit trail." }
  ],

  tradeoffs: [
    { pro: "Kafka per symbol gives a replayable total order.", con: "A hot symbol (index future) can saturate one partition; you may need a dedicated pipeline." },
    { pro: "In-memory last quote meets the 50–100 ms SLA.", con: "A process crash is a brief hole until it rebuilds from the log tail." },
    { pro: "Rolling bars from 1s upward is CPU-cheap for charts.", con: "You cannot reconstruct a tick-level tape from bars; keep raw ticks for disputes." },
    { pro: "Inverted fan-out scales watchlists.", con: "A mega-symbol (NIFTY) still has a huge subscriber set — shard WS by user, batch frames." },
    { pro: "Analysis on bars keeps ML off the ingest thread.", con: "A 1s trading signal needs a second, smaller hot path." }
  ],

  interviewTips: [
    "Split live quote SLA from history completeness. They use the same log, different consumers.",
    "Partition by symbol. Sequence gaps are incidents; sort by exchange time, not local clocks.",
    "Last quote in memory. Watchlists invert symbol → subscribers. Batch WS frames.",
    "Roll 1s bars, then 1m/1d from bars. Idempotent rebuild on replay.",
    "Open bell 10×: scale the quote consumer first; rollups may lag.",
    "Never draw a matching engine unless they ask. You are a data platform."
  ],

  scene: {
    nodes: [
      { id: "exch", label: "Exchange feed", type: "server", pos: [-11, 0, 0] },
      { id: "gw", label: "Feed gateway", type: "gateway", pos: [-7, 0, 0] },
      { id: "log", label: "Tick log", type: "queue", pos: [-3, 0, 0] },
      { id: "quote", label: "Last-quote", type: "cache", pos: [1.5, 0, -3.5], showAt: 2 },
      { id: "ws", label: "WS shard", type: "server", pos: [5.5, 0, -3.5], showAt: 3 },
      { id: "app", label: "Trader app", type: "phone", pos: [10, 0, -3.5], showAt: 3 },
      { id: "roll", label: "Bar worker", type: "worker", pos: [1.5, 0, 3.5], showAt: 4 },
      { id: "ts", label: "OHLCV store", type: "db", pos: [5.5, 0, 3.5], showAt: 4 },
      { id: "obj", label: "Tick lake", type: "storage", pos: [1.5, 0, 0], showAt: 4 },
      { id: "an", label: "Screener", type: "service", pos: [10, 0, 3.5], showAt: 6 },
      { id: "n0", label: "Partition by symbol", type: "note", pos: [-7, 0, -6.8] },
      { id: "n1", label: "Gap = replay, no fake px", type: "note", pos: [-3, 0, 6.8], showAt: 1 },
      { id: "n2", label: "Invert symbol→users", type: "note", pos: [5.5, 0, -6.8], showAt: 3 },
      { id: "n3", label: "Open bell 10x ticks", type: "note", pos: [10, 0, 6.8], showAt: 7 }
    ],
    edges: [
      { from: "exch", to: "gw", label: "FIX/binary" },
      { from: "gw", to: "log" },
      { from: "log", to: "quote", showAt: 2 },
      { from: "quote", to: "ws", showAt: 3 },
      { from: "ws", to: "app", showAt: 3 },
      { from: "log", to: "roll", showAt: 4 },
      { from: "log", to: "obj", showAt: 4 },
      { from: "roll", to: "ts", showAt: 4 },
      { from: "ts", to: "an", showAt: 6 },
      { from: "ts", to: "app", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Two SLAs: live quote and complete history",
        text: "The exchange pushes ticks. You are a data platform, not a matching engine. Live last-quote in tens of milliseconds. History may lag but must not skip. Per-symbol total order is the invariant.",
        highlight: ["exch", "gw", "log", "n0"],
        hide: ["quote", "ws", "app", "roll", "ts", "obj", "an", "n1", "n2", "n3"],
        flows: [{ from: "exch", to: "gw", color: "#4ade80", label: "ticks" }]
      },
      {
        title: "Sequence, then append by symbol",
        text: "Gateway checks seq. A hole pauses and requests replay — you never invent a price. Kafka key = symbol so one consumer sees order. Store exchange time, not only local receive time. Halts are ticks.",
        highlight: ["gw", "log", "n1", "exch"],
        hide: ["quote", "ws", "app", "roll", "ts", "obj", "an", "n2", "n3"],
        flows: [
          { from: "gw", to: "log", color: "#fb923c", label: "append" },
          { from: "exch", to: "gw", color: "#f87171", label: "gap?" }
        ]
      },
      {
        title: "Last quote is a map, not a SQL latest()",
        text: "A consumer updates ConcurrentHashMap or Redis: symbol → last tick. This is the live path. It rebuilds from the log tail after a crash. Analysis does not sit in this process.",
        highlight: ["log", "quote"],
        hide: ["ws", "app", "roll", "ts", "obj", "an", "n1", "n2", "n3"],
        flows: [{ from: "log", to: "quote", color: "#facc15", label: "last" }]
      },
      {
        title: "Watchlists invert the fan-out",
        text: "Do not scan 1 M users per tick. Symbol → subscribers on this WS box, pub/sub between boxes. Snapshot on subscribe, then deltas. Batch frames so a fast ticker does not melt the phone. Entitlements: delayed vs real-time.",
        highlight: ["quote", "ws", "app", "n2"],
        hide: ["roll", "ts", "obj", "an", "n1", "n3"],
        flows: [
          { from: "quote", to: "ws", color: "#22d3ee", label: "TCS" },
          { from: "ws", to: "app", color: "#60a5fa", label: "frame" }
        ]
      },
      {
        title: "Same log rolls bars and the lake",
        text: "Raw ticks land in a lake for disputes. A bar worker holds the open 1s OHLCV and flushes on the boundary. 1m/1d roll from smaller bars. Bar id is idempotent so replay can recompute a window.",
        highlight: ["log", "roll", "ts", "obj"],
        hide: ["n1", "n2", "n3", "an", "ws"],
        flows: [
          { from: "log", to: "obj", color: "#c084fc", label: "ticks" },
          { from: "log", to: "roll", color: "#fb923c" },
          { from: "roll", to: "ts", color: "#4ade80", label: "1s" }
        ]
      },
      {
        title: "Charts read bars, not the tape",
        text: "GET /bars hits the TSDB plus a cache of recent days. A 1s bar file is tiny next to ticks, which is why the chart is instant. Splits rewrite adjusted bars; raw ticks stay the audit.",
        highlight: ["ts", "app", "roll"],
        hide: ["n1", "n2", "n3", "an", "obj", "quote"],
        flows: [{ from: "ts", to: "app", color: "#60a5fa", label: "OHLCV" }]
      },
      {
        title: "Screeners sit on bars",
        text: "RSI and \"volume spike\" jobs consume bar events or Parquet. They pin a data version. They never contend for the last-quote map. Bounded pools so a runaway job cannot stall rollups. Precompute at 9:15.",
        highlight: ["an", "ts", "roll"],
        hide: ["n1", "n2", "n3", "gw", "exch"],
        flows: [{ from: "ts", to: "an", color: "#818cf8", label: "bars" }]
      },
      {
        title: "Open bell: 10×, lag where it is allowed",
        text: "Quote consumers must keep up; chart rollups may lag a few seconds. Sequence gap: mark the UI, replay, rebuild bars. WS node dies: reconnect and resubscribe. Two DCs do not sequence the same symbol twice.",
        highlight: ["exch", "log", "quote", "n3", "ws"],
        fail: ["ws"],
        hide: ["n0", "n1", "n2", "an"],
        flows: [
          { from: "exch", to: "log", color: "#fb923c", label: "10x" },
          { from: "log", to: "quote", color: "#facc15", label: "priority" }
        ]
      },
      {
        title: "Recap: one log, three consumers",
        text: "Per-symbol sequenced log. Live map + inverted WS. Bars and lake from the same tape. Analysis off to the side. Metric: sequence holes and WS lag vs exchange time. Matching engine still not on the board.",
        highlight: ["log", "quote", "roll", "an", "app"],
        hide: ["n0", "n1", "n2", "n3"],
        flows: [
          { from: "log", to: "quote", color: "#facc15" },
          { from: "log", to: "roll", color: "#4ade80" },
          { from: "ws", to: "app", color: "#60a5fa" }
        ]
      }
    ]
  }
});
