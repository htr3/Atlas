window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 31,
  title: "Vector Search and a RAG Request Path",
  video: "",
  category: "Advanced Systems",
  tagline: "Embed chunks, ANN-search nearest neighbors, then ground the LLM on those passages.",
  summary: "Keyword indexes match tokens. RAG needs meaning: a query and a document chunk that share no words can still be close in embedding space. This lesson walks the production path — chunk and embed documents, store vectors in an ANN index, retrieve top-k with metadata filters, then prompt a model with those passages. The interview is not \"use Pinecone.\" It is latency, recall, freshness, and what you do when the nearest neighbors are still the wrong answer.",

  theory: [
    {
      heading: "Why inverted indexes miss the question",
      body: "A search engine inverted index is excellent at <code>\"timeout on Redis GET\"</code>. It is poor at <code>\"why is the cache hanging?\"</code> if the runbook never used those words. <b>Retrieval-augmented generation</b> exists because an LLM will invent citations unless you stuff the prompt with passages you actually own. Those passages are found by <b>vector similarity</b>, not by BM25 alone. In an interview, start here: RAG is search plus a generator, and the search is the part you can design, measure, and fail closed.",
      bullets: [
        "The generator is untrusted. Grounding text is the product.",
        "Lexical search still helps exact IDs, error codes, and names. Hybrid is the default, not a luxury.",
        "If you cannot name a freshness SLA for the index, you do not have a RAG system — you have a demo."
      ]
    },
    {
      heading: "Embeddings are coordinates, not magic",
      body: "An embedding model maps text to a float vector of fixed width (384, 768, 1536). Cosine similarity or inner product ranks \"how aligned are these two directions.\" You do not store one vector per PDF. You <b>chunk</b>: 300–800 tokens with overlap so a sentence is not split from its heading. Metadata rides along — <code>docId</code>, <code>section</code>, <code>acl</code>, <code>updatedAt</code> — because nearest-neighbor without a tenant filter is a data leak. In Spring, a worker calls the embed API with <code>WebClient</code>, then upserts <code>{id, vector, metadata}</code>. The HTTP handler on the query path should not embed 200 chunks inline; that is ingest work.",
      bullets: [
        "Chunk size is a recall/precision knob. Tiny chunks lose context; huge chunks dilute the vector.",
        "The same model must embed queries and documents. Mixing models is a silent quality bug.",
        "Normalize vectors if you plan to use cosine; some stores expect you to do it client-side."
      ]
    },
    {
      heading: "ANN so you do not scan 50 million rows",
      body: "Exact k-NN is a linear scan. At tens of millions of vectors that is a timeout. <b>Approximate nearest neighbor</b> (HNSW graphs, IVF lists, product quantization) trades a little recall for milliseconds. HNSW is the interview default: a layered graph, greedy walk from a coarse layer down to a fine one. IVF partitions space into coarse centroids, then scans only the closest lists. Product quantization compresses vectors so more of the index fits in RAM. You must say what happens on a cold start: building HNSW is CPU-heavy; you snapshot the graph, you do not rebuild on every pod boot.",
      bullets: [
        "Tune <code>efSearch</code> / probes: higher recall, higher latency. Put the number on the board.",
        "Filtered ANN is the hard part. Pre-filter by tenant in the posting lists, or over-fetch and drop unauthorized hits.",
        "Sharding by tenant or by collection beats one giant graph that every query walks."
      ]
    },
    {
      heading: "Ingest path: parse, chunk, embed, upsert",
      body: "Documents land in object storage. A queue fans out parse jobs (PDF, HTML, tickets). A chunker writes rows to a document store (the text you will later cite) and enqueue embed batches. The embed worker is the bottleneck: GPU or a hosted model, batch size 32–128, backoff on 429. Upsert is idempotent on <code>chunkId</code> so a retry does not duplicate neighbors. Deletes and ACL changes are first-class: a tombstone in metadata, or a rebuild of that document's chunks. Spring: <code>@KafkaListener</code> on <code>doc.ingested</code>, transactional outbox so \"parse succeeded\" and \"embed queued\" do not diverge.",
      bullets: [
        "Store the raw text separately from the vector. The LLM needs the passage, not the floats.",
        "Re-embed on model upgrade. Version the index (<code>embed_v3</code>) and dual-write until cutover.",
        "A poison PDF goes to a DLQ; it must not stall the whole tenant's corpus."
      ]
    },
    {
      heading: "Query path: embed, retrieve, rerank, generate",
      body: "The user question hits an API gateway. A query service embeds the question (one vector, cacheable for popular FAQs), ANN-searches top 50, applies metadata filters, optionally reranks with a cross-encoder, then builds a prompt: system policy + retrieved passages + question. The LLM call is the tail latency. Streaming tokens back to the phone hides TTFB. Grounding rule: if top-k similarity is below a threshold, refuse rather than hallucinate. Cite chunk ids so a UI can show the source PDF page. Spring sketch: <code>RagService</code> injects <code>EmbeddingClient</code>, <code>VectorIndex</code>, and <code>ChatClient</code>; the controller returns <code>Flux&lt;String&gt;</code> for SSE.",
      bullets: [
        "Cache FAQ embeddings and even FAQ answers. Do not cache personalized ACL results without the tenant in the key.",
        "Timeouts: embed 50 ms, ANN 30–80 ms, rerank 50 ms, LLM seconds. Budget them separately.",
        "The failure mode is a fluent wrong answer. Measure groundedness, not only p99."
      ]
    },
    {
      heading: "Hybrid search, filters, and what you say about scale",
      body: "Production RAG is rarely vectors alone. BM25 catches SKUs and error codes; vectors catch paraphrase. Reciprocal rank fusion merges the two lists. Numeric filters (date, price, region) belong in the index metadata, not in the prompt. Scale numbers to throw: 10 M chunks × 1536 dims × 4 bytes ≈ 60 GB raw; HNSW overhead can 2–4× that, so you shard or quantize. Query QPS is usually modest compared with a feed; the cost spike is embed-on-ingest and LLM tokens. Multi-region: replicate the text store and the vector shards; do not embed twice in two regions unless you must.",
      bullets: [
        "Isolating tenants: separate collections, or a mandatory <code>tenantId</code> filter that the query planner cannot skip.",
        "PII: chunks inherit the source ACL. Retrieval is an authorization check.",
        "Interview close: name the two SLAs — ingest lag (minutes) and query p95 (hundreds of ms plus the model)."
      ]
    }
  ],

  keyTerms: [
    { term: "Embedding", def: "A fixed-width float vector that places text in a space where cosine distance tracks meaning." },
    { term: "Chunk", def: "A passage of a source document, stored as text plus one vector, with overlap so context survives splits." },
    { term: "ANN", def: "Approximate nearest neighbor search (HNSW, IVF) that avoids a full scan of every vector." },
    { term: "HNSW", def: "Hierarchical navigable small-world graph. Greedy walk from coarse layers to fine neighbors." },
    { term: "RAG", def: "Retrieve passages first, then generate an answer conditioned on those passages." },
    { term: "Reranker", def: "A slower model that reorders the ANN shortlist using the query and each passage together." },
    { term: "Hybrid search", def: "Blend BM25/keyword hits with vector hits, often via reciprocal rank fusion." },
    { term: "Grounding", def: "Forcing the model to cite retrieved text, and refusing when neighbors are too far." }
  ],

  tradeoffs: [
    { pro: "Vectors recall paraphrases that keyword search never sees.", con: "You pay embed cost on every ingest and you must re-embed when the model changes." },
    { pro: "HNSW is fast in RAM and simple to explain.", con: "Graph build is expensive; filtered search can destroy recall if you only post-filter." },
    { pro: "Large chunks give the LLM more context per hit.", con: "The vector averages too much and ranking gets mushy." },
    { pro: "Hybrid BM25 + ANN catches SKUs and meaning together.", con: "Two indexes to keep in sync, and fusion weights become another knob." },
    { pro: "Thresholding similarity reduces fluent hallucinations.", con: "You will refuse some good answers on out-of-distribution wording." }
  ],

  interviewTips: [
    "Draw two paths: ingest (parse → chunk → embed → upsert) and query (embed → ANN → filter → rerank → LLM).",
    "Say why you chunk, pick a size, and store raw text separately from the vector.",
    "Name HNSW or IVF, then the recall/latency knob. Do not stop at \"a vector database.\"",
    "Put ACL/tenant filters in the index. Nearest neighbor is not an authorization layer.",
    "Budget latency: embed and ANN are tens of milliseconds; the LLM is the long pole.",
    "Close with failure: low similarity → refuse; poison docs → DLQ; model upgrade → dual index."
  ],

  scene: {
    nodes: [
      { id: "user", label: "Analyst", type: "user", pos: [-11, 0, 0] },
      { id: "gw", label: "API gateway", type: "gateway", pos: [-7, 0, 0] },
      { id: "rag", label: "RAG service", type: "service", pos: [-3, 0, 0], showAt: 4 },
      { id: "embed", label: "Embed model", type: "worker", pos: [1, 0, -3], showAt: 2 },
      { id: "ann", label: "HNSW index", type: "db", pos: [5, 0, 0], showAt: 3 },
      { id: "docs", label: "Passage store", type: "db", pos: [5, 0, 3.5], showAt: 1 },
      { id: "llm", label: "LLM", type: "server", pos: [9, 0, 0], showAt: 6 },
      { id: "obj", label: "PDF bucket", type: "storage", pos: [-7, 0, 4.5], showAt: 1 },
      { id: "q", label: "Ingest queue", type: "queue", pos: [-3, 0, 4.5], showAt: 1 },
      { id: "chunk", label: "Chunker", type: "worker", pos: [1, 0, 4.5], showAt: 1 },
      { id: "rerank", label: "Reranker", type: "service", pos: [5, 0, -3.5], showAt: 5 },
      { id: "cache", label: "FAQ cache", type: "cache", pos: [-3, 0, -3.5], showAt: 7 },
      { id: "zidx", label: "Retrieval", type: "zone", pos: [5, 0, 0], size: [8, 9], showAt: 3 },
      { id: "n1", label: "Keywords miss paraphrase", type: "note", pos: [-7, 0, -6.5] },
      { id: "n2", label: "300-800 token chunks", type: "note", pos: [1, 0, 7.2], showAt: 1 },
      { id: "n3", label: "efSearch trades recall", type: "note", pos: [9, 0, -6.5], showAt: 3 },
      { id: "n4", label: "Low sim → refuse", type: "note", pos: [9, 0, 6.8], showAt: 8 }
    ],
    edges: [
      { from: "obj", to: "q", showAt: 1 },
      { from: "q", to: "chunk", showAt: 1 },
      { from: "chunk", to: "docs", showAt: 1 },
      { from: "chunk", to: "embed", showAt: 2 },
      { from: "embed", to: "ann", showAt: 3 },
      { from: "user", to: "gw", label: "ask" },
      { from: "gw", to: "rag", showAt: 4 },
      { from: "rag", to: "embed", showAt: 4 },
      { from: "rag", to: "ann", showAt: 4 },
      { from: "ann", to: "docs", showAt: 4, dashed: true },
      { from: "rag", to: "rerank", showAt: 5 },
      { from: "rag", to: "llm", showAt: 6 },
      { from: "rag", to: "cache", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "The question is not in the runbook wording",
        text: "Keyword search wants the same tokens. RAG exists because an analyst asks \"why is the cache hanging?\" and the runbook titled the incident \"Redis GET timeout.\" You will retrieve by meaning, then ground a model on passages you own.",
        highlight: ["user", "gw", "n1"],
        hide: ["obj", "q", "chunk", "docs", "embed", "ann", "rag", "llm", "rerank", "cache", "zidx", "n2", "n3", "n4"],
        flows: [{ from: "user", to: "gw", color: "#4ade80", label: "ask" }]
      },
      {
        title: "Ingest: parse, chunk, store text",
        text: "PDFs land in object storage. A queue fans out parse jobs. The chunker cuts 300–800 token windows with overlap and writes the raw passages to a document store. Vectors come next; the LLM will need this text, not the floats.",
        highlight: ["obj", "q", "chunk", "docs", "n2"],
        hide: ["embed", "ann", "rag", "llm", "rerank", "cache", "zidx", "n3", "n4", "n1"],
        flows: [
          { from: "obj", to: "q", color: "#fb923c", label: "PDF" },
          { from: "q", to: "chunk", color: "#fb923c", label: "job" },
          { from: "chunk", to: "docs", color: "#4ade80", label: "passages" }
        ]
      },
      {
        title: "Embed batches, then upsert",
        text: "The embed worker calls the same model you will use at query time, in batches. Spring WebClient posts the batch, then upserts {chunkId, vector, tenant, acl}. Retries are idempotent on chunkId so the graph does not grow twins.",
        highlight: ["chunk", "embed", "docs"],
        hide: ["ann", "rag", "llm", "rerank", "cache", "zidx", "n3", "n4", "n1"],
        flows: [
          { from: "chunk", to: "embed", color: "#c084fc", label: "batch" },
          { from: "embed", to: "docs", color: "#c084fc", label: "attach" }
        ]
      },
      {
        title: "HNSW so you do not scan 50M rows",
        text: "Vectors land in an ANN index. HNSW walks a layered graph; IVF would scan a few coarse lists. efSearch is the recall/latency knob. Build is snapshot-restored on boot — you do not rebuild the graph every time a pod starts.",
        highlight: ["ann", "embed", "zidx", "n3"],
        hide: ["rag", "llm", "rerank", "cache", "n4", "n1", "n2"],
        flows: [{ from: "embed", to: "ann", color: "#c084fc", label: "upsert" }]
      },
      {
        title: "Query: embed once, then ANN + ACL",
        text: "The RAG service embeds the question, searches top 50, and drops hits that fail tenant/ACL metadata filters. Filtered ANN is the real design: pre-filter in the lists, or over-fetch and discard. Nearest neighbor is not authorization.",
        highlight: ["user", "gw", "rag", "embed", "ann", "docs"],
        hide: ["llm", "rerank", "cache", "n1", "n2", "n4"],
        flows: [
          { from: "user", to: "gw", color: "#4ade80", label: "q" },
          { from: "gw", to: "rag", color: "#4ade80" },
          { from: "rag", to: "embed", color: "#c084fc", label: "1 vector" },
          { from: "rag", to: "ann", color: "#60a5fa", label: "top-50" }
        ]
      },
      {
        title: "Rerank the shortlist",
        text: "A cross-encoder looks at the query and each passage together and reorders the ANN shortlist. It is slower than HNSW, so it only sees 50 hits, not 50 million. Hybrid BM25 can merge into this list before rerank.",
        highlight: ["rag", "rerank", "ann"],
        hide: ["llm", "cache", "n1", "n2", "n4"],
        flows: [{ from: "rag", to: "rerank", color: "#fb923c", label: "50 hits" }]
      },
      {
        title: "Ground the LLM, stream the answer",
        text: "Prompt = policy + cited passages + question. Tokens stream back through the gateway. If max similarity is below threshold, refuse. The model is the tail latency; embed+ANN should already be tens of milliseconds.",
        highlight: ["rag", "llm", "docs", "user"],
        hide: ["cache", "n1", "n2", "n3"],
        flows: [
          { from: "docs", to: "rag", color: "#60a5fa", label: "text" },
          { from: "rag", to: "llm", color: "#4ade80", label: "prompt" },
          { from: "llm", to: "user", color: "#60a5fa", label: "SSE" }
        ]
      },
      {
        title: "Cache FAQs, not ACL-personalized hits",
        text: "Popular questions reuse the query embedding and even a canned answer. Cache keys include tenant. Personalized retrieval is not a global Redis key. Ingest lag is a separate SLA from query p95.",
        highlight: ["cache", "rag", "gw", "user"],
        hide: ["n1", "n2", "n4", "chunk", "q", "obj"],
        flows: [
          { from: "gw", to: "cache", color: "#facc15", label: "FAQ" },
          { from: "cache", to: "rag", color: "#facc15", label: "hit" }
        ]
      },
      {
        title: "Refuse, DLQ, dual-index on upgrade",
        text: "Low similarity returns a refusal, not a fluent guess. Poison PDFs go to a DLQ so one tenant cannot stall ingest. A new embed model means a new index version and dual-write until cutover. That is the production story, not the notebook demo.",
        highlight: ["ann", "llm", "q", "n4", "docs"],
        fail: ["llm"],
        hide: ["n1", "n2", "n3", "cache", "rerank"],
        flows: [
          { from: "rag", to: "llm", color: "#f87171", label: "refuse" },
          { from: "q", to: "chunk", color: "#f87171", label: "DLQ" }
        ]
      }
    ]
  }
});
