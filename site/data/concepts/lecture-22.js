window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 22,
  title: "Search with Elasticsearch",
  category: "Service Patterns",
  tagline: "The database keeps the truth. The index answers \"which documents mention this?\"",
  summary: "Search is an inverted index: each term points at the documents that contain it, not the other way around. Elasticsearch shards that index, replicates it, and scores matches. It is a derived store. The source of truth stays in the primary database, and a queue feeds the indexer. Using the search cluster as the only copy of the product catalog is how you lose writes the index was never built to own.",

  theory: [
    {
      heading: "An inverted index, not a table scan",
      body: "A catalog row stores a product, and a search for \"red shoes\" would otherwise read every row. An <b>inverted index</b> flips that. The term <code>red</code> maps to document ids 4 and 9; <code>shoes</code> maps to 9 and 12; the intersection is 9. Analysis — lowercasing, splitting on spaces, dropping \"the\" — happens when you index, so the query uses the same tokens. That structure is what Elasticsearch, OpenSearch, and Lucene are.",
      bullets: [
        "A document is the thing you search: a product, a ticket, a log line.",
        "Fields can be indexed differently: exact keyword for a SKU, analyzed text for a title.",
        "Filters (in stock, category) are cheap; relevance scoring is the extra work."
      ]
    },
    {
      heading: "Shards hold slices, replicas hold copies",
      body: "One index is split into <b>shards</b>. A query goes to every shard and the coordinator merges the hits. A shard has <b>replicas</b> on other nodes so a dead machine does not take those terms with it. You add nodes to spread shards. You do not \"join products to orders\" inside this cluster and call it a relational database — cross-document joins are the thing this model is bad at.",
      bullets: [
        "More shards help parallelism until each shard is too small to matter.",
        "A replica can serve reads. The primary of that shard still orders the writes.",
        "Refresh makes recent writes searchable; it is not the same as a database commit."
      ]
    },
    {
      heading: "Index off to the side",
      body: "The product service commits the row in its database. It then publishes \"product 9 changed.\" An indexer reads the event and <b>upserts</b> the search document. Search can lag by seconds. That is acceptable for a catalog and unacceptable if you pretended the index was the order ledger. Rebuilds exist: replay the database (or the log) into a new index and swap an alias when it catches up.",
      bullets: [
        "The database is the source of truth.",
        "A failed indexer retries the event; the upsert is idempotent on document id.",
        "Delete in the database must delete, or tombstone, the document."
      ]
    },
    {
      heading: "What to say when they ask \"why not SQL LIKE\"",
      body: "<code>LIKE '%shoe%'</code> cannot use a normal B-tree and gets worse as the table grows. The inverted index answers token queries in roughly the cost of the posting lists, then ranks. Elasticsearch is still the wrong tool for \"update this bank balance\" or \"this foreign key must exist.\" Logs and product search are the usual yes. The system of record is the usual no."
    }
  ],

  keyTerms: [
    { term: "Inverted index", def: "A map from term to the list of documents containing it. Queries intersect those lists." },
    { term: "Shard", def: "A slice of an index. A search runs on every shard, then results are merged." },
    { term: "Replica", def: "A copy of a shard for failover and extra read capacity." },
    { term: "Relevance", def: "A score, often based on how rare a term is and how often it appears, used to sort hits." },
    { term: "Derived index", def: "A search copy built from the source of truth. It can be dropped and rebuilt." }
  ],

  tradeoffs: [
    { pro: "Token search stays fast as the catalog grows.", con: "You now run a cluster that can lag, split-brain its own way, and be reindexed wrong." },
    { pro: "Replicas keep search up when a node dies.", con: "A write is not searchable until refresh, so the UI can miss a product you just saved." },
    { pro: "Rebuilding from the database fixes a corrupt index.", con: "During the rebuild you pay for two copies and a careful alias swap." },
    { pro: "Filters plus text in one query are what the engine is for.", con: "Transactions, constraints, and balances belong in the primary database." }
  ],

  interviewTips: [
    "Draw the inverted index with two terms and an intersection before you name a vendor.",
    "Keep the primary database. Feed Elasticsearch from a queue. Say the lag out loud.",
    "Mention shards for scale and replicas for loss of a node.",
    "Upsert by document id so a retried event does not create duplicates.",
    "Refuse to make the search cluster the only copy of orders or payments."
  ],

  scene: {
    nodes: [
      { id: "db", label: "Product DB", type: "db", pos: [-8, 0, 0] },
      { id: "q", label: "Change queue", type: "queue", pos: [-3.5, 0, 0] },
      { id: "idx", label: "Indexer", type: "worker", pos: [1, 0, 0] },
      { id: "es", label: "Search shards", type: "storage", pos: [5.5, 0, -1.5], showAt: 2 },
      { id: "user", label: "Shopper", type: "user", pos: [5.5, 0, 3.5], showAt: 4 },
      { id: "n0", label: "DB is the truth", type: "note", pos: [-6, 0, -6] },
      { id: "n1", label: "term → doc ids", type: "note", pos: [6, 0, -6], showAt: 3 }
    ],
    edges: [
      { from: "db", to: "q", label: "product 9" },
      { from: "q", to: "idx" },
      { from: "idx", to: "es", label: "upsert", showAt: 2 },
      { from: "user", to: "es", label: "red shoes", showAt: 4 }
    ],
    steps: [
      {
        title: "Commit the product first",
        text: "The catalog row lands in the primary database. Search has not heard about it yet. That is deliberate: the database can commit without the index being up.",
        highlight: ["db", "n0"],
        flows: []
      },
      {
        title: "Publish the change",
        text: "The product service emits \"product 9 changed\" onto a queue. If the indexer is down, the event waits. The shopper's write already succeeded.",
        highlight: ["db", "q"],
        flows: [{ from: "db", to: "q", color: "#fb923c", label: "event" }]
      },
      {
        title: "Upsert the document",
        text: "The indexer writes document 9 into the search cluster. The same event retried overwrites the same id. It does not insert a second product.",
        highlight: ["q", "idx", "es"],
        flows: [
          { from: "q", to: "idx", color: "#fb923c", label: "pull" },
          { from: "idx", to: "es", color: "#4ade80", label: "upsert" }
        ]
      },
      {
        title: "Terms point at documents",
        text: "After analysis, red points at 4 and 9, shoes points at 9 and 12. The query intersects the lists. Shards each hold part of those lists; replicas copy them.",
        highlight: ["es", "n1"],
        flows: []
      },
      {
        title: "Search the copy, not the ledger",
        text: "The shopper queries the index. A product saved a second ago might be missing until refresh. Orders and payments never use this cluster as their only store.",
        highlight: ["user", "es", "db"],
        flows: [{ from: "user", to: "es", color: "#60a5fa", label: "query" }]
      }
    ]
  }
});
