window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 9,
  title: "Choosing the Right Data Store",
  video: "",
  category: "Data Modeling",
  tagline: "Access pattern first, then Postgres, Redis, Kafka, search, or blob — not a logo.",
  summary: "The right store is the one whose access pattern, consistency, and failure model match the use case. Relational (Postgres) owns constraints and multi-row transactions. A KV/cache (Redis) owns hot keys with TTL. A log (Kafka) owns ordered events many consumers can replay. Search (OpenSearch) owns inverted indexes. Object storage owns blobs. Document DBs own flexible JSON when you rarely join. A Spring app is allowed to use several — that is polyglot persistence — but each extra system is an ops and consistency bill. Start from queries, not from a vendor slide.",

  theory: [
    {
      heading: "Write the queries on the whiteboard",
      body: "Before naming a database, write: 'get order by id', 'list a user's last 20 orders', 'decrement SKU if qty>0', 'full-text search products', 'store invoice PDF', 'notify three downstreams of payment.' Those sentences pick the store. Spring Data offers JPA, Redis, Mongo, Elasticsearch, Kafka templates — none of them decide for you. If two queries want opposite shapes (transactional inventory vs fuzzy search), you want two stores plus a sync path, not one compromised engine.",
      bullets: [
        "QPS, item size, retention, and consistency (read-your-write?) are the next four numbers.",
        "If you need a foreign key, you probably need SQL.",
        "If you need fan-out with replay, you probably need a log, not a table (lecture on antipatterns)."
      ]
    },
    {
      heading: "Relational: default for money and joins",
      body: "Postgres (via Hikari + JPA or jOOQ) is the default for orders, payments, users, and inventory. You buy ACID, FKs, indexes, and SQL flexibility. You pay for a primary's write ceiling and for schema migrations (lecture 5). Do not put session blobs, video, or unbounded event history here. Read replicas and partitioning stretch it far; they do not turn it into a search engine.",
      bullets: [
        "Use it when a constraint must hold even if the app has a bug.",
        "JSON columns are a safety valve for optional attributes, not a Mongo replacement."
      ]
    },
    {
      heading: "KV, cache, and session",
      body: "Redis is a data structure server: strings, hashes, ZSETs, streams. Spring Data Redis and @Cacheable sit on top. It is the right store for rate limits, ephemeral sessions, leaderboards, and hot GET /product/{id}. It is the wrong source of truth for a paid order. Persistence (AOF/RDB) is best-effort compared with Postgres WAL. Eviction is a feature — design for keys that vanish.",
      bullets: [
        "TTL is part of the data model.",
        "Hot-key + single shard is a hidden single point of load.",
        "Use it as a cache in lecture 10's patterns, or as a primary KV if loss is acceptable."
      ]
    },
    {
      heading: "Documents, search, and blobs",
      body: "Mongo/DocumentDB: hierarchical JSON, easy schema evolution, weak multi-document ACID (unless you opt into it). Good for CMS-like payloads. OpenSearch/Elastic: inverted index, relevance, aggregations — feed it from CDC, do not take checkout writes. S3/GCS: invoices, images, backups; store the URL in Postgres. HDFS-style lakes are for analytics, not the request path. Spring's S3 client and RestClients belong at the edge of the use case, not inside @Transactional.",
      bullets: [
        "Search indexes lie after a delay; the SQL row is truth.",
        "Never scan S3 as if it were a table."
      ]
    },
    {
      heading: "Logs and streams",
      body: "Kafka (or Pulsar, Kinesis) is an append-only partitioned log. Producers write payment events; many consumer groups replay independently. This is the backbone for outbox, CQRS projections, and analytics. Throughput is outstanding; you do not query it like SQL (unless you add a table engine). Spring Kafka vs Reactor Kafka is a client choice. Ordering is per partition key — pick orderId if you need per-order sequence.",
      bullets: [
        "A queue (SQS, Rabbit) is competing consumers; a log is replayable history.",
        "Do not use Kafka as the order database you later need to mutably update."
      ]
    },
    {
      heading: "Polyglot rules for a Spring shop",
      body: "One bounded context, one source of truth. Other stores are projections (search, cache, warehouse) filled by CDC/outbox. Transactions do not span Redis and Postgres without an outbox. Operational cost is linear in the number of engines you cannot restore. Interview move: pick Postgres for the core, Redis for the hot path, Kafka for fan-out, S3 for blobs, search if they asked for typeahead — and say what you refused (Neo4j for a tree of five categories, Cassandra for 100 QPS).",
      bullets: [
        "Graph DBs when the query is a variable-depth walk you cannot precompute.",
        "Wide-column when you have huge time-series write volume and known key access.",
        "Time-series (Timescale, Prometheus) when the primary operation is append + range aggregate."
      ]
    }
  ],

  keyTerms: [
    { term: "Access pattern", def: "The actual reads and writes (keys, ranges, joins, scans) that must be fast." },
    { term: "Source of truth", def: "The store you restore after a disaster and that constraints are enforced in." },
    { term: "Projection", def: "A derived copy (search index, cache, warehouse) that can be rebuilt from truth." },
    { term: "Polyglot persistence", def: "Multiple engines in one product, each for a matching pattern." },
    { term: "Inverted index", def: "Term → document ids. What search engines are, and what Postgres btree is not." },
    { term: "Partition key", def: "The Kafka (or Cassandra) key that defines ordering and shard placement." },
    { term: "Object URL", def: "Pointer in SQL to a blob in object storage; the row is not the file." },
    { term: "TTL", def: "Expiry on a KV key. If the product cannot tolerate expiry, Redis is not the source of truth." }
  ],

  tradeoffs: [
    { pro: "Postgres gives constraints and joins that keep money honest.", con: "It is a poor search engine and a worse object store at scale." },
    { pro: "Redis makes hot reads and rate limits cheap.", con: "Eviction and weaker durability disqualify it as order truth." },
    { pro: "Kafka lets many teams consume the same payment event on their own clock.", con: "You cannot UPDATE a message; mutable entities still need a database." },
    { pro: "Polyglot lets each query be fast.", con: "Each engine is a backup, a pager, and a consistency story you now own." }
  ],

  interviewTips: [
    "Start with three queries and QPS. Name the store after, never before.",
    "Say source of truth vs projection. Search and cache are projections of Postgres.",
    "Refuse one fashionable store out loud (Cassandra at 100 QPS) to show judgment.",
    "If they want typeahead plus checkout, draw SQL + search + CDC, not 'Mongo can do both.'",
    "Blobs: S3 + URL column. Do not BYTEA a PDF in the orders table.",
    "Kafka for fan-out; Rabbit/SQS for competing workers. Know which you drew."
  ],

  scene: {
    nodes: [
      { id: "phone", label: "Checkout UI", type: "phone", pos: [-11, 0, 0] },
      { id: "gw", label: "API gateway", type: "gateway", pos: [-7, 0, 0] },
      { id: "app", label: "Spring app", type: "server", pos: [-3, 0, 0] },
      { id: "pg", label: "Postgres", type: "db", pos: [2, 0, 0] },
      { id: "n_q", label: "Queries pick the store", type: "note", pos: [-7, 3.4, -7] },
      { id: "redis", label: "Redis hot GET", type: "cache", pos: [2, 0, -5], showAt: 2 },
      { id: "kafka", label: "Kafka payments", type: "queue", pos: [7, 0, 0], showAt: 3 },
      { id: "mail", label: "Email worker", type: "worker", pos: [11, 0, -3], showAt: 3 },
      { id: "wh", label: "Warehouse", type: "worker", pos: [11, 0, 3], showAt: 3 },
      { id: "os", label: "Search index", type: "service", pos: [2, 0, 5], showAt: 4 },
      { id: "s3", label: "Invoice PDF", type: "storage", pos: [7, 0, 5], showAt: 5 },
      { id: "n_poly", label: "One truth, four projections", type: "note", pos: [7, 3.4, -7], showAt: 6 },
      { id: "n_no", label: "No Cassandra at 100 QPS", type: "note", pos: [7, 3.4, 7.5], showAt: 7 },
      { id: "core", label: "Checkout core", type: "zone", pos: [-0.5, 0, 0], size: [7, 4], showAt: 1 }
    ],
    edges: [
      { from: "phone", to: "gw" },
      { from: "gw", to: "app" },
      { from: "app", to: "pg", label: "JPA" },
      { from: "app", to: "redis", showAt: 2 },
      { from: "redis", to: "pg", label: "miss", showAt: 2, dashed: true },
      { from: "app", to: "kafka", label: "outbox", showAt: 3 },
      { from: "kafka", to: "mail", showAt: 3 },
      { from: "kafka", to: "wh", showAt: 3 },
      { from: "pg", to: "os", label: "CDC", showAt: 4, dashed: true },
      { from: "app", to: "s3", showAt: 5 },
      { from: "s3", to: "pg", label: "URL", showAt: 5, dashed: true }
    ],
    steps: [
      {
        title: "Write the queries first",
        text: "get order by id, decrement SKU if qty>0, list last 20, typeahead products, store PDF, email+warehouse on pay. Those sentences — not logos — drive the rest of the diagram.",
        highlight: ["phone", "gw", "app", "n_q"],
        flows: [
          { from: "phone", to: "gw", color: "#4ade80", label: "checkout" },
          { from: "gw", to: "app", color: "#4ade80", label: "API" }
        ]
      },
      {
        title: "Postgres is source of truth",
        text: "Orders, inventory, and the qty>0 constraint live in Postgres. @Transactional decrement belongs here. This zone is what you PITR.",
        highlight: ["app", "pg", "core"],
        flows: [
          { from: "app", to: "pg", color: "#4ade80", label: "ACID write" }
        ]
      },
      {
        title: "Redis for the hot GET",
        text: "GET /product/42 is a cache or a KV with TTL. Miss fills from Postgres. A paid order is never only in Redis — eviction is a feature.",
        highlight: ["app", "redis", "pg"],
        flows: [
          { from: "app", to: "redis", color: "#60a5fa", label: "GET" },
          { from: "redis", to: "pg", color: "#fb923c", label: "miss" }
        ]
      },
      {
        title: "Kafka fans out the payment",
        text: "The outbox publishes paid. Email and warehouse consume independently and can replay. This is a log, not a second orders table.",
        highlight: ["app", "kafka", "mail", "wh"],
        flows: [
          { from: "app", to: "kafka", color: "#fb923c", label: "paid" },
          { from: "kafka", to: "mail", color: "#c084fc", label: "group 1" },
          { from: "kafka", to: "wh", color: "#c084fc", label: "group 2" }
        ]
      },
      {
        title: "Search is a projection",
        text: "Typeahead hits OpenSearch. CDC from Postgres fills it. If the index lags, checkout is still correct; search is allowed to be a second stale.",
        highlight: ["pg", "os", "phone"],
        flows: [
          { from: "pg", to: "os", color: "#c084fc", label: "CDC" },
          { from: "phone", to: "os", color: "#60a5fa", label: "typeahead" }
        ]
      },
      {
        title: "PDFs live in object storage",
        text: "The invoice file goes to S3. Postgres stores the URL. Scanning buckets is not a query plan. Spring uploads after commit, not inside the tx.",
        highlight: ["app", "s3", "pg"],
        flows: [
          { from: "app", to: "s3", color: "#4ade80", label: "PUT" },
          { from: "s3", to: "pg", color: "#60a5fa", label: "url" }
        ]
      },
      {
        title: "Polyglot, one truth",
        text: "Four engines, one source of truth. Cache, log, search, and blobs are projections or side paths. Restoring Postgres restores the business.",
        highlight: ["pg", "redis", "kafka", "os", "s3", "n_poly"],
        flows: [
          { from: "app", to: "pg", color: "#4ade80", label: "truth" }
        ]
      },
      {
        title: "Refuse the fashionable mismatch",
        text: "100 QPS checkout does not need Cassandra. A five-level category tree does not need Neo4j. Choosing the right store includes saying no.",
        highlight: ["pg", "n_no", "app"],
        flows: [
          { from: "app", to: "pg", color: "#4ade80", label: "still SQL" }
        ]
      }
    ]
  }
});
