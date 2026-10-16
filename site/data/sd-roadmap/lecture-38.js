window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 38,
  title: "Design a Search Engine",
  video: "",
  category: "Roadmap Case Studies",
  tagline: "Ingest, analyze, invert, rank — scatter/gather queries, not SQL LIKE.",
  summary: "Web search and in-app product search share a pipeline: acquire documents, analyze text, build an inverted index, retrieve postings, rank, and snippet. This is not the vector/RAG lesson and not a single Elasticsearch logo. P0: ingest, index, query with ranking, freshness. The write path is a document queue into analyzers and shard indexers. The read path is a query planner that fans out to index shards and merges top-k. Failures are lag, hot terms, and split-brain analyzers that tokenize queries unlike documents.",

  theory: [
    {
      heading: "What you are actually designing",
      body: "Clarify corpus: open web (crawler + robots) vs private catalog (product ingest from checkout's catalog). P0: add/update/delete docs, query a string, return ranked hits with snippets. P1: images, personalization, ads, spellcorrect. NFRs: query p95 100–200 ms, ingest lag (web: minutes to hours; catalog: seconds to a minute), availability of query over freshness, index size from estimates. Scale sketch: 1 B docs × 5 KB, 10 k QPS query, 100 updates/s. Consistency: search is AP — a just-added product may miss for a minute. Unique docId. Do not start with \"we'll use Solr\" until you drew invert + rank.",
      bullets: [
        "LIKE %term% on MySQL is the anti-pattern you name and drop.",
        "RAG vectors are a second index for paraphrase; this lecture is lexical unless they pull you.",
        "Success: recall@10 on a labeled set, p95, lag, and zero analyzer mismatch incidents."
      ]
    },
    {
      heading: "Acquire and analyze",
      body: "Web: URL frontier (priority queue), crawlers with politeness (per-host QPS), fetch to object storage, extract text. Catalog: CDC or events from the product service (outbox). Both land on a <code>docs</code> topic keyed by docId. Analyzer: lowercase, tokenize, stopwords, stem/lemmatize, maybe n-grams for SKUs and CJK. <b>The query must use the same analyzer.</b> Store the raw doc for snippets separately from the index. Spring: <code>@KafkaListener</code> IndexWorker receives a ProductUpdated, runs a Lucene <code>Analyzer</code>, writes to the shard. Deletes are tombstones with a version so a late crawl cannot resurrect a removed URL.",
      bullets: [
        "Version every doc. Last-writer-wins on docId+version, not wall clock from two crawlers.",
        "Politeness and robots.txt are why a crawler is not a while-loop of GETs.",
        "SKU \"MX-4400\" needs a keyword token plus n-grams or it is unfindable."
      ]
    },
    {
      heading: "Inverted index and sharding",
      body: "Term → postings list of (docId, tf, positions). Positions enable phrases and snippets. Shards: by docId hash so a query hits every shard (scatter/gather), or by term (worse: hot term \"nike\" lives on one box). Replica each shard. Segment files are immutable (Lucene): a writer flushes a new segment, a searcher refreshes, a merge worker compacts — same LSM intuition as the log-structured storage lecture, different payload. RAM holds hot terms and a field cache for ranking features (page rank, price, stock). You do not UPDATE a posting in place.",
      bullets: [
        "docId-hash shards make query fan-out N, N = shard count. Cap N or you pay tail latency.",
        "Routing a tenant's corpus to its own index avoids noisy neighbors.",
        "A full rebuild is allowed for analyzer changes; dual-index like the embed_v3 trick."
      ]
    },
    {
      heading: "Query path: parse, retrieve, rank, snippet",
      body: "Gateway → QueryService: parse (AND/OR, phrases, filters), analyze tokens, plan. Scatter to shard replicas (hedged requests if p99 is scary). Each shard returns local top-k with scores. Coordinator merges, then may rerank with a slower model (learning-to-rank) on the union. Fetch stored fields and snippet the raw text using positions. Filters (in-stock, city, price) belong in the index as doc values / bitsets, not as a post-SQL. Cache: the exact query string + filter set is a good Redis key for popular head queries; do not cache personalized results without the user in the key. Spring: WebClient fan-out with a 50 ms timeout per shard and a partial-results flag.",
      bullets: [
        "BM25 is the interview default scorer. Say tf, idf, document length.",
        "Boolean retrieve then score is why you need skip lists / impact-ordered postings.",
        "If 2 of 64 shards are down, return 97% with a warning rather than 500 — unless they demand completeness."
      ]
    },
    {
      heading: "Hot terms, lag, and failure",
      body: "Stopwords would have billion-long postings; you dropped them. Remaining hot terms (\"phone\") still dominate — cache those lists, or cut off AND with a selective term first. Update lag: a flash SKU that is sold out must either push a doc-value flip (in-stock bit) on a fast path or you will sell air from search. That is a dedicated stock field with near-real-time refresh, not a full reindex. Crawler poison: a malformed PDF goes to DLQ. Split-brain analyzers (query stemmer ≠ index stemmer) are a silent empty-result incident — version the analyzer in the index name. Multi-region: query local replica; ingest to the nearest then replicate segments, or rebuild from the doc log.",
      bullets: [
        "NRT (near real time) refresh every 1 s for catalog; web can wait for bigger segments.",
        "Spellcorrect and typeahead are prefix indexes / edge n-grams — P1 unless they are the product.",
        "Security: ACL filters in the query (same as RAG). A public shard must not hold private docs."
      ]
    },
    {
      heading: "Recap vs RAG and vs SQL",
      body: "Lexical search is inverted postings + BM25 + scatter/gather. Vector search is ANN on embeddings. A modern product search is hybrid (lesson 31). SQL is the source of truth for checkout stock; search is a derived index with lag. Metrics: p95, lag histogram, zero-result rate, analyzer version, shard refresh time. Recap: ingest via log, same analyzer, doc-hash shards, hedge tail, NRT bit for stock, cache the head queries.",
      bullets: [
        "If they only want site search, skip the crawler and start at the product topic.",
        "If they want the web, the frontier and politeness become P0.",
        "Do not draw one giant Elasticsearch box without shards, replicas, and a query coordinator."
      ]
    }
  ],

  keyTerms: [
    { term: "Inverted index", def: "Map from term to postings (docId, tf, positions) used to retrieve candidates." },
    { term: "Analyzer", def: "Tokenize/normalize pipeline. Queries and documents must share the same one." },
    { term: "Postings", def: "The sorted list of documents containing a term, often with skip lists." },
    { term: "BM25", def: "Default ranking: term frequency, inverse document frequency, length normalization." },
    { term: "Scatter/gather", def: "Fan the query to all doc-shards, merge local top-k at a coordinator." },
    { term: "NRT refresh", def: "Making a newly flushed segment visible to searchers within about a second." },
    { term: "Frontier", def: "Prioritized URL queue a crawler drains under per-host politeness caps." },
    { term: "Hedged request", def: "A second replica call if the first shard is slow, to cut tail latency." }
  ],

  tradeoffs: [
    { pro: "Doc-hash shards balance storage and keep queries correct (every shard sees the query).", con: "Fan-out N means p99 is the slowest shard; hedging costs extra QPS." },
    { pro: "Immutable segments make searchers simple and crash-safe.", con: "Deletes are tombstones until merge; space and rank can lag." },
    { pro: "NRT is good enough for catalog stock bits.", con: "You still need a fast path or flash-sale search will oversell." },
    { pro: "Caching head queries is a huge win at 10 k QPS.", con: "Personalized or ACL-varying queries cannot use a global key." },
    { pro: "A crawler plus object storage owns the web corpus.", con: "Politeness, duplicates, and legal robots.txt dominate the design clock." }
  ],

  interviewTips: [
    "Kill SELECT LIKE in sentence one. Draw ingest → analyze → invert → scatter/gather.",
    "Same analyzer on both paths. Version it in the index name.",
    "Shard by docId, replica, coordinator merge of BM25 top-k. Hedge the tail.",
    "NRT for catalog; a dedicated in-stock field for flash sales, not a full reindex.",
    "Cache exact head queries. ACL filters in the query. Partial results if a shard dies.",
    "Hybrid with vectors is an add-on (lecture 31), not a replacement for SKUs and error codes."
  ],

  scene: {
    nodes: [
      { id: "user", label: "Searcher", type: "phone", pos: [-11, 0, 0] },
      { id: "gw", label: "Query GW", type: "gateway", pos: [-7, 0, 0] },
      { id: "coord", label: "Coordinator", type: "service", pos: [-3, 0, 0], showAt: 4 },
      { id: "s1", label: "Shard 0", type: "db", pos: [2, 0, -3.5], showAt: 3 },
      { id: "s2", label: "Shard 1", type: "db", pos: [2, 0, 0], showAt: 3 },
      { id: "s3", label: "Shard 2", type: "db", pos: [2, 0, 3.5], showAt: 3 },
      { id: "crawl", label: "Crawler", type: "worker", pos: [-7, 0, 4], showAt: 1 },
      { id: "front", label: "URL frontier", type: "queue", pos: [-3, 0, 4], showAt: 1 },
      { id: "raw", label: "Raw docs", type: "storage", pos: [2, 0, 6.2], showAt: 1 },
      { id: "an", label: "Analyzer", type: "worker", pos: [-3, 0, -3.5], showAt: 2 },
      { id: "cache", label: "Head-q cache", type: "cache", pos: [-7, 0, -3.5], showAt: 6 },
      { id: "rank", label: "LTR rerank", type: "service", pos: [6.5, 0, 0], showAt: 5 },
      { id: "n0", label: "Not SQL LIKE", type: "note", pos: [-7, 0, -6.8] },
      { id: "n1", label: "Same analyzer both ways", type: "note", pos: [-3, 0, -6.8], showAt: 2 },
      { id: "n2", label: "p99 = slowest shard", type: "note", pos: [6.5, 0, -6.8], showAt: 4 }
    ],
    edges: [
      { from: "front", to: "crawl", showAt: 1 },
      { from: "crawl", to: "raw", showAt: 1 },
      { from: "raw", to: "an", showAt: 2 },
      { from: "an", to: "s1", showAt: 3 },
      { from: "an", to: "s2", showAt: 3 },
      { from: "an", to: "s3", showAt: 3 },
      { from: "user", to: "gw" },
      { from: "gw", to: "coord", showAt: 4 },
      { from: "coord", to: "s1", showAt: 4 },
      { from: "coord", to: "s2", showAt: 4 },
      { from: "coord", to: "s3", showAt: 4 },
      { from: "coord", to: "rank", showAt: 5 },
      { from: "gw", to: "cache", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Corpus first: web vs catalog",
        text: "If it is site search, skip the crawler and take product events. If it is the web, you own a frontier. Either way you will invert terms, not LIKE %q%. Query p95 100–200 ms; lag is allowed.",
        highlight: ["user", "gw", "n0"],
        hide: ["coord", "s1", "s2", "s3", "crawl", "front", "raw", "an", "cache", "rank", "n1", "n2"],
        flows: [{ from: "user", to: "gw", color: "#4ade80", label: "q" }]
      },
      {
        title: "Acquire: frontier or CDC, then object store",
        text: "Crawlers drain a prioritized URL queue with per-host politeness, or a product outbox feeds the same pipe. Raw bytes land in storage with docId+version so a late crawl cannot resurrect a delete.",
        highlight: ["front", "crawl", "raw"],
        hide: ["coord", "s1", "s2", "s3", "an", "cache", "rank", "n1", "n2", "n0"],
        flows: [
          { from: "front", to: "crawl", color: "#fb923c", label: "URL" },
          { from: "crawl", to: "raw", color: "#4ade80", label: "fetch" }
        ]
      },
      {
        title: "Analyze with the query's future tokenizer",
        text: "Lowercase, tokenize, stem, n-grams for SKUs. The query path will use this exact analyzer. Mismatch is a silent zero-results outage. Spring IndexWorker is a Kafka consumer, not the query JVM.",
        highlight: ["an", "raw", "n1"],
        hide: ["coord", "s1", "s2", "s3", "cache", "rank", "n2", "n0", "user"],
        flows: [{ from: "raw", to: "an", color: "#c084fc", label: "tokens" }]
      },
      {
        title: "Inverted shards by docId",
        text: "Term → postings (docId, tf, positions). Shard by doc hash so each query hits every shard. Immutable Lucene segments flush, searchers refresh, a merger compacts. Replica each shard. Tenant indexes isolate ACL.",
        highlight: ["an", "s1", "s2", "s3"],
        hide: ["coord", "cache", "rank", "n2", "n0", "n1", "user", "gw"],
        flows: [
          { from: "an", to: "s1", color: "#c084fc" },
          { from: "an", to: "s2", color: "#c084fc" },
          { from: "an", to: "s3", color: "#c084fc" }
        ]
      },
      {
        title: "Scatter/gather BM25",
        text: "Coordinator analyzes the query, fans out, merges local top-k. p99 is the slowest shard — hedge a replica. Filters are doc values, not a SQL pass. Partial hits if a shard is dead, unless they demand completeness.",
        highlight: ["coord", "s1", "s2", "s3", "n2", "user"],
        hide: ["cache", "rank", "n0", "n1", "crawl", "front"],
        flows: [
          { from: "user", to: "gw", color: "#4ade80", label: "q" },
          { from: "gw", to: "coord", color: "#4ade80" },
          { from: "coord", to: "s1", color: "#60a5fa" },
          { from: "coord", to: "s2", color: "#60a5fa" },
          { from: "coord", to: "s3", color: "#60a5fa" }
        ]
      },
      {
        title: "Rerank a shortlist, snippet from raw",
        text: "Union of shard hits can go through a slower LTR model. Snippets use stored positions against the raw doc. This is the same retrieve-then-rerank shape as RAG, with BM25 instead of HNSW.",
        highlight: ["coord", "rank", "raw"],
        hide: ["cache", "n0", "n1", "n2", "crawl", "front", "an"],
        flows: [
          { from: "coord", to: "rank", color: "#fb923c", label: "top 50" },
          { from: "raw", to: "coord", color: "#60a5fa", label: "snippet" }
        ]
      },
      {
        title: "Cache the head, not personalized ACL",
        text: "Popular exact queries + filters sit in Redis. User-personalized or ACL-varying keys must include those dimensions. Typeahead is a prefix index (P1). Stock bits need NRT, not this cache alone.",
        highlight: ["cache", "gw", "coord", "user"],
        hide: ["n0", "n1", "n2", "crawl", "front", "rank", "an"],
        flows: [
          { from: "gw", to: "cache", color: "#facc15", label: "nike" },
          { from: "cache", to: "gw", color: "#facc15", label: "hit" }
        ]
      },
      {
        title: "A shard dies; flash stock must still move",
        text: "Hedged replicas cover a dead box. A sold-out SKU flips an in-stock doc value on a fast path — a full reindex is too slow. Analyzer upgrades dual-index. Recap: invert, same analyzer, scatter/gather, NRT, cache the head.",
        highlight: ["s2", "s1", "coord", "an"],
        fail: ["s2"],
        hide: ["n0", "n1", "cache", "rank", "crawl"],
        flows: [
          { from: "coord", to: "s1", color: "#60a5fa", label: "hedge" },
          { from: "an", to: "s3", color: "#fb923c", label: "NRT bit" }
        ]
      }
    ]
  }
});
