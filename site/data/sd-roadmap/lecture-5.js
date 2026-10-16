window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 5,
  title: "Relational Modeling and Database Migrations",
  video: "",
  category: "Data Modeling",
  tagline: "Normalize the schema, then change it with expand-contract Flyway, not a weekend DROP.",
  summary: "Relational modeling is tables, keys, and constraints that match the domain: a customer, many orders, many items. Normalization removes update anomalies; denormalization is a later, measured sin. Hibernate/JPA maps objects onto that schema and will happily generate a mess if you let ddl-auto run in production. Schema change is a product: Flyway or Liquibase versioned scripts, expand-contract so old and new Spring pods can coexist, and never a blocking rewrite on a Friday deploy.",

  theory: [
    {
      heading: "Start from relationships, not from screens",
      body: "An order belongs to a customer (many-to-one). An order has items (one-to-many). Items point at SKUs. Primary keys are stable (UUID or bigint identity). Foreign keys are the integrity the application will otherwise reimplement with bugs. In Spring Data JPA, <code>@ManyToOne(fetch = LAZY)</code> and an <code>order_id</code> column are that relationship. Unique constraints encode 'one open cart per user' better than a synchronized Java method.",
      bullets: [
        "If you cannot say the cardinality, you are not ready to pick a store.",
        "Natural keys (email) change; surrogate keys do not.",
        "Check constraints and NOT NULL are cheaper than validating only in the controller."
      ]
    },
    {
      heading: "Normalization, then the denormalized exception",
      body: "Third normal form: non-key columns depend on the key. Customer address is not copied onto every order row — until fulfillment needs a frozen snapshot of where that package went. That snapshot is denormalization with a reason: history. A 'total' column on orders is denormalization for read speed; it must be updated in the same transaction as items or it will lie. Do not star-schema your OLTP just because analytics wanted it — that is a warehouse later.",
      bullets: [
        "Update anomalies (change address in 12 rows, miss 1) are why we normalize.",
        "Read-time joins are the cost. Indexes and good keys keep that cost honest.",
        "Derived columns need a single writer — usually the same @Transactional service method."
      ]
    },
    {
      heading: "JPA is a mapper, not a designer",
      body: "<code>spring.jpa.hibernate.ddl-auto=update</code> will mutate production in ways you cannot review. Map explicitly: table names, column names, fetch types. Bidirectional <code>@OneToMany</code> plus <code>@ManyToOne</code> without a owning side creates extra join tables. Equals/hashCode on entities must not use generated ids before persist. The schema lives in SQL (or a modeling tool); JPA follows it. hibernate.id.new_generator_mappings and identity vs sequence matter for insert batching.",
      bullets: [
        "Prefer Flyway as source of truth; validate JPA against the live schema on boot.",
        "EAGER fetch on collections is how a list endpoint loads the entire database.",
        "Embeddables and JSON columns are fine for value objects, not for relationships you will query."
      ]
    },
    {
      heading: "Migrations are versioned code",
      body: "Flyway (or Liquibase) ships <code>V20261017__add_order_status.sql</code> next to the Spring jar. On boot, the tool acquires a lock, applies pending versions, and records them in <code>flyway_schema_history</code>. CI should run migrate against a throwaway Postgres. Never edit a version that already ran in prod; add a new file. Backfills of millions of rows do not belong in the same transaction as a metadata change — they belong in a batched job with a progress column.",
      bullets: [
        "Expand-contract: add the new column nullable, dual-write, backfill, then NOT NULL.",
        "Rename is drop-in-place only on empty tables; otherwise add, copy, switch reads.",
        "Lock timeouts (Postgres lock_timeout) stop a migration from queueing every checkout."
      ]
    },
    {
      heading: "Zero-downtime with a mixed fleet",
      body: "During a rolling deploy, old pods and new pods share the database. The schema must be compatible with both. That is why you add a column before the code that requires it, and you delete a column only after the last old pod is gone (two deploys). Spring profiles can dual-read if you must rename. Feature flags plus migrations are safer than one giant 'cutover' script. Blue/green the app, not the schema — the schema is the long-lived contract.",
      bullets: [
        "Deploy N: schema expand. Deploy N+1: code uses new column. Deploy N+2: contract old column.",
        "Triggers for dual-write are last resorts; application dual-write is easier to reason about.",
        "Take a backup (or confirm PITR window) before a destructive migrate even if you 'tested on staging.'"
      ]
    },
    {
      heading: "What not to put in Postgres",
      body: "Huge blobs, unbounded event logs, and search corpora will fit until they do not. Put objects in object storage and a URL in the row. Put events on a log. Put search in a search engine. The relational model stays the source of truth for money, inventory, and constraints. Lecture 9 is the catalog; this lecture's rule is: if you need a foreign key and a transaction, start here."
    }
  ],

  keyTerms: [
    { term: "Primary key", def: "Stable unique identity of a row. Prefer surrogate UUID/bigint over mutable emails." },
    { term: "Foreign key", def: "A database-enforced pointer to another table. Integrity the app cannot forget." },
    { term: "Normalization", def: "Each fact stored once so updates cannot diverge." },
    { term: "Owning side", def: "The JPA association that owns the foreign-key column and writes it." },
    { term: "Flyway version", def: "An ordered SQL (or Java) migration applied once and recorded in schema history." },
    { term: "Expand-contract", def: "Add compatible schema first, switch code, remove the old shape later." },
    { term: "ddl-auto", def: "Hibernate schema generation. Fine for a testcontainer; not a production process." },
    { term: "Dual-write", def: "Application writes old and new columns during a rolling migration window." }
  ],

  tradeoffs: [
    { pro: "Normalized OLTP plus FKs makes money and inventory hard to corrupt.", con: "List screens pay for joins until you add read models or careful indexes." },
    { pro: "JPA speeds CRUD and dirty checking.", con: "LazyInitializationException, N+1, and mystery schemas if ddl-auto leads." },
    { pro: "Flyway in CI makes schema reviewable like Java.", con: "A blocking ALTER on a hot table still takes checkout down if you skip expand-contract." },
    { pro: "Denormalized snapshot columns speed fulfillment reads.", con: "Every extra copy is another writer you must keep in the same transaction." }
  ],

  interviewTips: [
    "Draw tables and cardinalities before you say 'we'll use Postgres.' That is the modeling.",
    "Name expand-contract in three deploys. Interviewers listen for mixed-fleet compatibility.",
    "Never propose hibernate.ddl-auto=update in prod. Say Flyway/Liquibase.",
    "If you denormalize a total, say it is updated in the same @Transactional method as the items.",
    "Mention lock_timeout / not rewriting 20M rows in the migrate transaction.",
    "UUID vs sequence: UUIDs scatter B-tree inserts; sequences are sequential. Have a reason."
  ],

  scene: {
    nodes: [
      { id: "dev", label: "Spring app", type: "server", pos: [-7, 0, 0] },
      { id: "cust", label: "customers", type: "db", pos: [2, 0, -5] },
      { id: "ord", label: "orders", type: "db", pos: [2, 0, 0] },
      { id: "item", label: "order_items", type: "db", pos: [2, 0, 5] },
      { id: "n_er", label: "1 customer : N orders", type: "note", pos: [2, 3.4, -7.5] },
      { id: "n_den", label: "orders.total snapshot", type: "note", pos: [7, 3.4, -7.5], showAt: 1 },
      { id: "jpa", label: "JPA mapper", type: "service", pos: [-7, 0, -5], showAt: 2 },
      { id: "n_ddl", label: "ddl-auto ≠ prod", type: "note", pos: [-7, 3.4, 6.5], showAt: 2 },
      { id: "fly", label: "Flyway", type: "worker", pos: [-7, 0, 5], showAt: 3 },
      { id: "hist", label: "schema_history", type: "storage", pos: [8, 0, 5], showAt: 3 },
      { id: "oldP", label: "Pod vN", type: "server", pos: [8, 0, -5], showAt: 5 },
      { id: "newP", label: "Pod vN+1", type: "server", pos: [8, 0, 0], showAt: 5 },
      { id: "n_exp", label: "Add column nullable first", type: "note", pos: [8, 3.4, 7.5], showAt: 4 },
      { id: "n_mix", label: "Old+new pods share DB", type: "note", pos: [-7, 3.4, -7.5], showAt: 5 },
      { id: "oltp", label: "OLTP schema", type: "zone", pos: [2, 0, 0], size: [5.5, 12] }
    ],
    edges: [
      { from: "cust", to: "ord", label: "FK" },
      { from: "ord", to: "item", label: "FK" },
      { from: "dev", to: "ord", label: "JDBC" },
      { from: "jpa", to: "ord", showAt: 2, dashed: true },
      { from: "fly", to: "ord", label: "ALTER", showAt: 3 },
      { from: "fly", to: "hist", showAt: 3 },
      { from: "oldP", to: "ord", showAt: 5 },
      { from: "newP", to: "ord", showAt: 5 }
    ],
    steps: [
      {
        title: "Cardinality on the whiteboard",
        text: "One customer has many orders; one order has many items. Foreign keys, not comments, enforce that. This is the OLTP shape money lives in.",
        highlight: ["cust", "ord", "item", "n_er", "oltp"],
        flows: [
          { from: "cust", to: "ord", color: "#c084fc", label: "1:N" },
          { from: "ord", to: "item", color: "#c084fc", label: "1:N" }
        ]
      },
      {
        title: "A snapshot total is a chosen sin",
        text: "orders.total copies a derived fact so fulfillment does not re-sum items. It is denormalized on purpose and must be written in the same transaction as the line rows.",
        highlight: ["ord", "item", "n_den", "dev"],
        flows: [
          { from: "dev", to: "item", color: "#4ade80", label: "lines" },
          { from: "dev", to: "ord", color: "#4ade80", label: "total" }
        ]
      },
      {
        title: "JPA maps; it does not own the schema",
        text: "Entities follow table names and lazy FKs. ddl-auto=update is banned in prod — it mutates without review. Flyway will be the writer; Hibernate only validates.",
        highlight: ["jpa", "ord", "n_ddl", "dev"],
        flows: [
          { from: "jpa", to: "ord", color: "#fb923c", label: "validate" }
        ]
      },
      {
        title: "Flyway applies V__ scripts",
        text: "On boot Flyway locks, runs pending versions, and records them in schema_history. CI already ran the same files against a throwaway Postgres. Never edit a version that shipped.",
        highlight: ["fly", "ord", "hist", "dev"],
        flows: [
          { from: "fly", to: "ord", color: "#4ade80", label: "V__sql" },
          { from: "fly", to: "hist", color: "#60a5fa", label: "record" }
        ]
      },
      {
        title: "Expand: add a nullable column",
        text: "Need order_status. Add it nullable (or with a default) so old pods still INSERT. Backfill in batches with lock_timeout set. Do not NOT NULL yet.",
        highlight: ["fly", "ord", "n_exp"],
        flows: [
          { from: "fly", to: "ord", color: "#fb923c", label: "ADD COLUMN" }
        ]
      },
      {
        title: "Mixed fleet must both work",
        text: "Rolling deploy: pod vN does not know the new field; pod vN+1 writes it. The schema is the union of both. This is why expand happens before code, and contract happens after the old pod is gone.",
        highlight: ["oldP", "newP", "ord", "n_mix"],
        flows: [
          { from: "oldP", to: "ord", color: "#60a5fa", label: "old INSERT" },
          { from: "newP", to: "ord", color: "#4ade80", label: "new INSERT" }
        ]
      },
      {
        title: "Dual-write, then contract",
        text: "If you rename, write both columns from Spring until reads switch. A later deploy drops the old column. Three deploys beat one Friday DROP COLUMN.",
        highlight: ["newP", "ord", "n_exp", "fly"],
        flows: [
          { from: "newP", to: "ord", color: "#c084fc", label: "dual-write" },
          { from: "fly", to: "ord", color: "#fb923c", label: "DROP later" }
        ]
      },
      {
        title: "Keep OLTP for facts with FKs",
        text: "Blobs, search, and unbounded event logs leave this zone. The relational model stays the source of truth for customers, orders, and items — the diagram you started with.",
        highlight: ["oltp", "cust", "ord", "item", "dev"],
        flows: [
          { from: "dev", to: "ord", color: "#4ade80", label: "checkout" }
        ]
      }
    ]
  }
});
