window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 10,
  title: "Advanced Caching Patterns and Failure Modes",
  video: "",
  category: "Caching and Scale",
  tagline: "Cache-aside is the start; stampedes, stampede locks, and poison keys are the job.",
  summary: "Caching sits in front of Postgres to buy latency and throughput, but every pattern has a failure mode. Cache-aside (Spring @Cacheable / Redis) is the default: miss, load, fill. Write-through and write-behind move the write path. TTLs and eviction decide freshness. A stampede (thundering herd) is many Spring pods missing the same key after expiry. Stampede locks, singleflight, and stale-while-revalidate tame it. Poisoned cache, stampede on outage, and dogpile on failover are how Redis becomes an incident, not a speedup.",

  theory: [
    {
      heading: "Cache-aside (lazy loading)",
      body: "The Spring service looks up Redis. Hit: return. Miss: query Postgres, PUT the JSON, return. <code>@Cacheable(\"products\")</code> plus a Redis CacheManager is this pattern. The database remains source of truth (lecture 9). You must invalidate or TTL on write (<code>@CacheEvict</code> / <code>@CachePut</code>) or shoppers see yesterday's price until expiry. Aside is simple and survives Redis downtime if you fail open to the DB — which then needs protection.",
      bullets: [
        "Key design: product:{id} not a giant JSON of the whole catalog.",
        "Serialize the same way you read; a Jackson version bump is a silent miss storm.",
        "Null caching (cache a sentinel for 404) stops hammering missing ids — with a short TTL."
      ]
    },
    {
      heading: "Write-through, write-back, and refresh-ahead",
      body: "<b>Write-through</b>: every write hits cache and DB in the same user-visible path (DB still commits first if you like money). Reads are always warm if you wrote that key. <b>Write-behind (write-back)</b>: write cache, flush DB asynchronously — throughput at the cost of loss if Redis dies. Almost never for orders. <b>Refresh-ahead</b>: a worker reloads keys before TTL so the user path never misses. That worker is a new production citizen.",
      bullets: [
        "Write-through doubles write latency; aside doubles miss latency.",
        "Write-behind needs a WAL of pending writes or you accept data loss.",
        "CDN cache is aside for GET at the edge; purge on publish is the evict."
      ]
    },
    {
      heading: "TTL, eviction, and memory",
      body: "TTL is a freshness SLA, not a suggestion. LRU/LFU eviction fires when Redis hits maxmemory — hot keys can still be dropped if the working set does not fit. Spring Cache unless() / condition() keep huge values out. Compression vs CPU is a local trade. Multi-layer: Caffeine in-process (microseconds, per pod) in front of Redis (milliseconds, shared). In-process caches duplicate memory and go stale independently — cap them aggressively.",
      bullets: [
        "A 24h TTL on price is a product decision you should say out loud.",
        "maxmemory-policy allkeys-lru vs volatile-lru: know which keys may vanish.",
        "Local Caffeine + Redis is common; invalidate both on write or accept skew across pods."
      ]
    },
    {
      heading: "Stampede / thundering herd",
      body: "Key expires. 200 Tomcat threads on 20 pods all miss at once and all run the same expensive query. Postgres looks like it is down; it is only unloved. Variants: cold start after Redis failover (empty cache), deploy that changes the key prefix (intentional mass miss), and hotspot (one celebrity product). Fixes: <b>singleflight / request coalescing</b> (one loader per key per process), a distributed mutex (Redis SET NX with short TTL) so one pod loads, <b>stale-while-revalidate</b> (serve expired, refresh in background), probabilistic early expire (xfetch) so not everyone lands on the same millisecond, and warming the cache before a sale.",
      bullets: [
        "Circuit-break the DB when miss rate explodes; serve stale or fail 503.",
        "Jitter TTLs so neighbouring keys do not share a birthday.",
        "The mutex must have a TTL or a crashed loader locks the key forever."
      ]
    },
    {
      heading: "Poison, consistency, and stampedes of failure",
      body: "A bug caches a thrown exception or a truncated payload — now every hit is wrong until TTL (cache poisoning). Always cache the successful DTO, not the ResponseEntity. A partial Redis outage with fail-closed takes the site down; fail-open melts Postgres. The adult policy: fail-open with a bulkhead and rate limit to the DB, plus a circuit breaker. Stampede lock contention plus a slow query is still an outage — bound the loader time. Split-brain: two Redis clusters after a net split, pods see different prices — treat Redis as disposable.",
      bullets: [
        "Never cache an error status for long.",
        "Measure hit ratio AND origin QPS. Hit ratio of 99% can still kill a 1% of 1M RPS.",
        "Idempotent loaders: two concurrent fills must write the same bytes."
      ]
    },
    {
      heading: "Spring knobs that matter",
      body: "CacheManager per domain (products vs sessions) so eviction policies differ. @Cacheable(sync=true) coalesces loaders in one JVM — not across pods. Redis Lettuce timeouts nested like lecture 3. Disable caching in the one integration test that must see the write. For GraphQL, cache at the field or persisted-query layer, not a random service HashMap. When in doubt, log cache miss reason (ttl, eviction, invalidation) — 'Redis is slow' is usually a miss storm."
    }
  ],

  keyTerms: [
    { term: "Cache-aside", def: "App reads cache, on miss loads DB and fills cache. @Cacheable's usual shape." },
    { term: "Write-through", def: "User write updates cache and database before success is returned." },
    { term: "Write-behind", def: "User write hits cache; database flush is async. Fast, lossy on crash." },
    { term: "Stampede", def: "Many concurrent misses on one key after expiry or failover, slamming origin." },
    { term: "Singleflight", def: "Coalesce concurrent loads of the same key so only one query runs." },
    { term: "Stale-while-revalidate", def: "Serve expired value immediately; refresh in the background." },
    { term: "Poisoned cache", def: "A bad payload (error, truncated JSON) stored and served until TTL or flush." },
    { term: "Fail-open", def: "If Redis is down, go to Postgres — with a bulkhead so origin survives." }
  ],

  tradeoffs: [
    { pro: "Cache-aside is easy and leaves Postgres as truth.", con: "Every expiry is a possible stampede; writes must evict or users see stale prices." },
    { pro: "Write-through keeps cache warm after edits.", con: "Checkout now depends on Redis latency as well as DB commit." },
    { pro: "Stale-while-revalidate keeps p99 flat during refresh.", con: "You explicitly serve data past TTL — say for how long." },
    { pro: "Fail-open survives a Redis outage.", con: "Without a bulkhead it converts a cache outage into a database outage." }
  ],

  interviewTips: [
    "Draw cache-aside plus eviction on write. Then name stampede as the follow-up they want.",
    "Fixes: jittered TTL, singleflight, Redis NX lock with TTL, stale-while-revalidate, warm before a sale.",
    "Never write-behind orders. Say it. Use aside or write-through.",
    "Hit ratio without origin QPS is a vanity metric — 1% of a huge RPS still melts Postgres.",
    "@Cacheable(sync=true) is per JVM. Multi-pod still needs a distributed lock or SWR.",
    "Poison: do not cache exceptions; version the key when the DTO shape changes."
  ],

  scene: {
    nodes: [
      { id: "u1", label: "Shopper 1", type: "phone", pos: [-11, 0, -4] },
      { id: "u2", label: "Shopper 2", type: "user", pos: [-11, 0, 0] },
      { id: "u3", label: "Shopper 3", type: "user", pos: [-11, 0, 4] },
      { id: "lb", label: "LB", type: "lb", pos: [-7, 0, 0] },
      { id: "s1", label: "Spring A", type: "server", pos: [-3, 0, -3] },
      { id: "s2", label: "Spring B", type: "server", pos: [-3, 0, 3] },
      { id: "redis", label: "Redis", type: "cache", pos: [2, 0, 0] },
      { id: "db", label: "Postgres", type: "db", pos: [8, 0, 0] },
      { id: "n_aside", label: "aside: miss → DB → SET", type: "note", pos: [2, 3.4, -7.5] },
      { id: "n_ttl", label: "TTL expires together", type: "note", pos: [8, 3.4, -7.5], showAt: 3 },
      { id: "lock", label: "SET NX lock", type: "point", pos: [2, 0, -5], showAt: 5 },
      { id: "n_swr", label: "Serve stale, refresh bg", type: "note", pos: [-3, 3.4, 7], showAt: 6 },
      { id: "n_pois", label: "Poisoned JSON cached", type: "note", pos: [8, 3.4, 7], showAt: 7 },
      { id: "cdn", label: "CDN GET", type: "cdn", pos: [-7, 0, -5], showAt: 2 }
    ],
    edges: [
      { from: "u1", to: "lb" },
      { from: "u2", to: "lb" },
      { from: "u3", to: "lb" },
      { from: "lb", to: "s1" },
      { from: "lb", to: "s2" },
      { from: "s1", to: "redis" },
      { from: "s2", to: "redis" },
      { from: "s1", to: "db", dashed: true },
      { from: "s2", to: "db", dashed: true },
      { from: "u1", to: "cdn", showAt: 2 },
      { from: "cdn", to: "s1", showAt: 2, dashed: true },
      { from: "s1", to: "lock", showAt: 5 },
      { from: "lock", to: "db", showAt: 5 }
    ],
    steps: [
      {
        title: "Cache-aside hit path",
        text: "Shoppers hit Spring. @Cacheable looks up product:42 in Redis and returns. Postgres is idle. This is the path you wanted when you added the cache.",
        highlight: ["u1", "lb", "s1", "redis", "n_aside"],
        flows: [
          { from: "u1", to: "lb", color: "#4ade80", label: "GET" },
          { from: "lb", to: "s1", color: "#4ade80", label: "MVC" },
          { from: "s1", to: "redis", color: "#60a5fa", label: "HIT" }
        ]
      },
      {
        title: "Miss fills from Postgres",
        text: "Cold key: Spring loads the row, SET with TTL, returns. Database is still source of truth. A write must evict or the next HIT is stale.",
        highlight: ["s1", "redis", "db", "n_aside"],
        flows: [
          { from: "s1", to: "redis", color: "#fb923c", label: "MISS" },
          { from: "s1", to: "db", color: "#60a5fa", label: "SQL" },
          { from: "s1", to: "redis", color: "#4ade80", label: "SET" }
        ]
      },
      {
        title: "CDN is aside at the edge",
        text: "Public GET /product/42 can also hit CloudFront. Purge on publish is @CacheEvict for the edge. Private checkout responses do not belong here.",
        highlight: ["u1", "cdn", "s1", "redis"],
        flows: [
          { from: "u1", to: "cdn", color: "#60a5fa", label: "GET" },
          { from: "cdn", to: "s1", color: "#fb923c", label: "edge miss" }
        ]
      },
      {
        title: "TTL birthday: everyone misses",
        text: "The key expires. Shopper 1, 2, and 3 on two pods all miss in the same millisecond. Three identical SQLs hit Postgres. That is a stampede.",
        highlight: ["u1", "u2", "u3", "s1", "s2", "redis", "db", "n_ttl"],
        flows: [
          { from: "s1", to: "db", color: "#f87171", label: "miss" },
          { from: "s2", to: "db", color: "#f87171", label: "miss" },
          { from: "s1", to: "redis", color: "#f87171", label: "empty" }
        ]
      },
      {
        title: "Origin looks down; it is unloved",
        text: "Multiply by 20 pods and a celebrity SKU. Hikari pool exhausts. Redis is fine. The cache just synchronized a herd onto one query.",
        highlight: ["db", "s1", "s2", "n_ttl"],
        fail: ["db"],
        flows: [
          { from: "s1", to: "db", color: "#f87171", label: "pool" },
          { from: "s2", to: "db", color: "#f87171", label: "pool" }
        ]
      },
      {
        title: "One loader: SET NX + singleflight",
        text: "A Redis lock (SET NX PX) lets one pod query. Others wait or serve. @Cacheable(sync=true) coalesces inside a JVM. Jitter TTLs so the next expiry is not a choir.",
        highlight: ["lock", "s1", "db", "redis", "s2"],
        flows: [
          { from: "s1", to: "lock", color: "#4ade80", label: "NX" },
          { from: "lock", to: "db", color: "#60a5fa", label: "one SQL" },
          { from: "s1", to: "redis", color: "#4ade80", label: "SET" }
        ]
      },
      {
        title: "Stale-while-revalidate",
        text: "Serve the just-expired JSON immediately, refresh in a worker. p99 stays flat. You admit the shopper might see a slightly old price for one extra TTL grace window.",
        highlight: ["redis", "s1", "u1", "n_swr", "db"],
        flows: [
          { from: "redis", to: "s1", color: "#60a5fa", label: "stale" },
          { from: "s1", to: "u1", color: "#60a5fa", label: "now" },
          { from: "s1", to: "db", color: "#c084fc", label: "bg refresh" }
        ]
      },
      {
        title: "Poison and fail-open with a bulkhead",
        text: "A bug cached truncated JSON — flush that key, version the cache name. If Redis dies, fail-open to Postgres through a bounded bulkhead and a circuit breaker, or you stampede the origin on purpose.",
        highlight: ["redis", "db", "s1", "n_pois"],
        fail: ["redis"],
        flows: [
          { from: "s1", to: "redis", color: "#f87171", label: "down" },
          { from: "s1", to: "db", color: "#fb923c", label: "bulkhead" }
        ]
      }
    ]
  }
});
