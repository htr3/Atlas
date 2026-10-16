window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 32,
  title: "Ledgers, Double-Entry Bookkeeping, and Reconciliation",
  video: "",
  category: "Advanced Systems",
  tagline: "Every rupee is a debit and a credit. Balances are views. Reconciliation is the product.",
  summary: "Wallet and payments interviews die on a mutable balance column. A ledger treats money as journal lines: every posting has equal debits and credits, balances are the sum of those lines, and a second system (the bank, the card network, the partner) is assumed to disagree until a recon job proves otherwise. This lesson covers chart of accounts, idempotent posting, immutability, and the daily recon file — the parts that survive an audit, not just a demo transfer API.",

  theory: [
    {
      heading: "A balance column is not a source of truth",
      body: "UPDATE wallets SET amount = amount - 100 WHERE id = ? looks like a transfer. It is a race, a lost update, and an audit dead-end. You cannot answer \"why is this 100 missing?\" six months later. A <b>ledger</b> never overwrites money. It <b>appends postings</b>. The displayed balance is SUM(credits) − SUM(debits) for that account, or a materialized snapshot you can rebuild from the log. Event sourcing lectures (append-only logs) are the same instinct; here the schema is accounting, not a video status field.",
      bullets: [
        "Reads may hit a cached balance. Writes always append journal lines.",
        "If two rows disagree, the journal wins. The cache is guilty until rebuilt.",
        "Do not put \"available\" and \"pending\" as two magic numbers with no lines behind them."
      ]
    },
    {
      heading: "Double-entry: every rupee has two homes",
      body: "A transfer of ₹100 from Alice to a merchant is not one row. It is at least two: debit Alice's wallet, credit the merchant's wallet. If you collect a fee, add a third line to a fee income account. Debits equal credits in the same journal entry, in the same currency, in the same transaction. That invariant is the whole safety net: you cannot \"lose\" money inside the ledger without the books going out of balance. Chart of accounts is small at first: user wallets, merchant wallets, cash/clearing, fees, chargebacks. You grow accounts; you do not grow UPDATE statements.",
      bullets: [
        "One JournalEntry has many JournalLines. The entry hashes to an idempotency key.",
        "Clearing/suspense accounts exist so money can sit while the bank is still unknown.",
        "Multi-currency: never mix INR and USD in one entry. Convert via an FX account."
      ]
    },
    {
      heading: "Posting in Spring: one transaction, two lines",
      body: "A <code>LedgerService.post(JournalEntry)</code> method is <code>@Transactional</code>. It inserts the entry (unique on <code>idempotencyKey</code>), inserts lines, checks SUM(debit)=SUM(credit), then bumps a versioned balance snapshot if you keep one. Isolation: Serializable or a unique constraint plus row locks on the two account heads, or you double-spend. Optimistic <code>@Version</code> on a balance projection is fine if conflicts retry the whole post. Do not call the bank inside this transaction. Call the bank from a worker after the journal is durable — outbox pattern — so a timeout does not roll back money you already promised internally.",
      bullets: [
        "Idempotency key is the client transfer id. A retry returns the original entry id.",
        "Unique(account_id, entry_id) on lines so a replay cannot add a third line.",
        "Available balance = posted − holds. Holds are their own accounts or pending lines, not a silent subtraction."
      ]
    },
    {
      heading: "Holds, captures, and chargebacks",
      body: "Ticket holds and card authorizations need a two-phase story inside the ledger. Authorize: debit available, credit a holds account (or post a pending entry). Capture: reverse the hold and credit the merchant. Expire: reverse the hold back to available. Chargeback: debit merchant, credit user, maybe debit a reserve. Each of those is a new journal entry that points at the original with <code>reversesEntryId</code>. You never edit the first entry. That is how an auditor walks the tape.",
      bullets: [
        "Pending vs posted is a state on the entry, or a pair of accounts. Pick one and keep it.",
        "Partial capture is a smaller second entry, not an UPDATE of the first amount.",
        "A hold that never expires is a leaked lock on customer funds."
      ]
    },
    {
      heading: "Reconciliation is a product feature",
      body: "Your ledger and the bank will disagree. Cards settle T+1, UPI has timeouts, webhooks duplicate. A <b>recon job</b> loads the partner settlement file (or API pages), matches on end-to-end id / UTR / ARN, and produces three buckets: matched, on-us-only, on-them-only. Unmatched rows become tickets, not silent balance patches. Automatic repair is allowed only as a new journal entry (\"recon adjustment\") with a reason code. Run recon at least daily; for wallets, near-time. Metrics: unmatched count, unmatched rupees, aging. If unmatched grows, posting is wrong or the partner file is late — treat both as incidents.",
      bullets: [
        "Match keys must be unique. Amount+time is not a match key.",
        "Store the raw settlement file in object storage. Re-run recon, do not trust a one-shot script.",
        "Never \"fix\" by editing a historical line. Always append an adjusting entry."
      ]
    },
    {
      heading: "What you scale, and what you do not",
      body: "Append-only lines shard by account-id. Hot wallets (a popular merchant) get their own shard or a queued poster so one row lock does not stall the site. Reads of balance hit a projection (Redis or a balances table) updated in the same DB transaction or via CDC. You do not need a distributed transaction with the card network; you need a clearing account and recon. Interview trap: proposing 2PC with Visa. Real design: journal first, partner async, recon closes the loop. Snapshot isolation for reports: run SUM from lines as of a snapshot id, not from a live cache.",
      bullets: [
        "Hot account: serialize posts through a per-account queue. Throughput becomes that worker's commit rate.",
        "Reporting clones (read replicas, warehouse) may lag. Finance uses the journal, not the replica.",
        "Immutability makes GDPR painful: you mask PII on accounts, you do not delete lines that moved money."
      ]
    }
  ],

  keyTerms: [
    { term: "Journal entry", def: "An immutable bundle of lines posted together; debits must equal credits." },
    { term: "Ledger line", def: "One debit or credit against one account, belonging to exactly one entry." },
    { term: "Chart of accounts", def: "The named buckets: user wallets, merchants, cash/clearing, fees, chargebacks." },
    { term: "Idempotent posting", def: "The same client key inserts the entry once; retries return that entry." },
    { term: "Hold", def: "Funds moved to a pending/holds account until capture, expiry, or reverse." },
    { term: "Clearing account", def: "Internal bucket for money in flight with a bank or network." },
    { term: "Reconciliation", def: "Matching your journal to a partner's settlement file and explaining every unmatched rupee." },
    { term: "Adjusting entry", def: "A new journal entry that repairs a mismatch. History is never edited." }
  ],

  tradeoffs: [
    { pro: "Append-only lines give a full audit trail and a rebuildable balance.", con: "Reads need a projection; SUM(lines) on a hot account will not survive peak QPS." },
    { pro: "Double-entry makes internal money conservation a database invariant.", con: "You still disagree with the bank until recon. The invariant is on-us only." },
    { pro: "Holds as accounts make authorize/capture explicit.", con: "More accounts and more entries per user click. Ops must know the chart." },
    { pro: "Per-account posting queues protect hot merchants from row-lock storms.", con: "That merchant's throughput is now one worker's commit rate." },
    { pro: "Daily recon files catch silent drift.", con: "Until the file lands, your UI can show a balance the bank would not honor." }
  ],

  interviewTips: [
    "Refuse a single mutable balance column. Draw JournalEntry + lines with debit=credit.",
    "Name the accounts: user, merchant, clearing, fees. A transfer is at least two lines.",
    "Idempotency key on the entry. @Transactional around insert+balance bump, not around the bank HTTP call.",
    "Authorize/capture/expire as new entries that reverse, never as UPDATEs of the first amount.",
    "Recon: match on UTR/ARN, three buckets, adjusting entries only. Store the raw file.",
    "Hot wallet: serialize posts. Do not propose 2PC with the card network."
  ],

  scene: {
    nodes: [
      { id: "alice", label: "Alice", type: "phone", pos: [-11, 0, -3] },
      { id: "merch", label: "Merchant", type: "user", pos: [-11, 0, 3], showAt: 2 },
      { id: "gw", label: "Payments API", type: "gateway", pos: [-7, 0, 0] },
      { id: "led", label: "Ledger svc", type: "service", pos: [-3, 0, 0] },
      { id: "jdb", label: "Journal DB", type: "db", pos: [1.5, 0, 0], showAt: 1 },
      { id: "bal", label: "Balance cache", type: "cache", pos: [1.5, 0, -3.5], showAt: 1 },
      { id: "outbox", label: "Outbox", type: "queue", pos: [-3, 0, 3.5], showAt: 3 },
      { id: "bank", label: "Bank / UPI", type: "server", pos: [6, 0, 3.5], showAt: 3 },
      { id: "clear", label: "Clearing acct", type: "db", pos: [6, 0, 0], showAt: 2 },
      { id: "recon", label: "Recon worker", type: "worker", pos: [6, 0, -3.5], showAt: 6 },
      { id: "file", label: "Settlement file", type: "storage", pos: [10, 0, -3.5], showAt: 6 },
      { id: "hold", label: "Holds acct", type: "db", pos: [1.5, 0, 3.5], showAt: 5 },
      { id: "n0", label: "No UPDATE balance", type: "note", pos: [-7, 0, -6.8] },
      { id: "n1", label: "Debit = credit", type: "note", pos: [1.5, 0, -6.8], showAt: 2 },
      { id: "n2", label: "Match on UTR, not amount", type: "note", pos: [10, 0, 6.8], showAt: 7 }
    ],
    edges: [
      { from: "alice", to: "gw", label: "pay ₹100" },
      { from: "gw", to: "led" },
      { from: "led", to: "jdb", showAt: 1 },
      { from: "led", to: "bal", showAt: 1, dashed: true },
      { from: "led", to: "clear", showAt: 2 },
      { from: "led", to: "outbox", showAt: 3 },
      { from: "outbox", to: "bank", showAt: 3 },
      { from: "merch", to: "gw", showAt: 2, dashed: true },
      { from: "led", to: "hold", showAt: 5 },
      { from: "bank", to: "file", showAt: 6, dashed: true },
      { from: "file", to: "recon", showAt: 6 },
      { from: "recon", to: "jdb", showAt: 7, dashed: true }
    ],
    steps: [
      {
        title: "A balance UPDATE is not an audit trail",
        text: "Alice taps pay ₹100. If you only decrement a wallets.amount column, a lost update can double-spend and you cannot explain the missing rupees later. The ledger will append lines instead.",
        highlight: ["alice", "gw", "led", "n0"],
        hide: ["jdb", "bal", "outbox", "bank", "clear", "recon", "file", "hold", "merch", "n1", "n2"],
        flows: [{ from: "alice", to: "gw", color: "#4ade80", label: "pay" }]
      },
      {
        title: "Insert the journal, then project the balance",
        text: "LedgerService.post is @Transactional: unique idempotency key, insert entry + lines, bump a versioned snapshot. The Redis/table balance is a view. If it disagrees, rebuild from lines.",
        highlight: ["led", "jdb", "bal"],
        hide: ["outbox", "bank", "clear", "recon", "file", "hold", "merch", "n1", "n2"],
        flows: [
          { from: "gw", to: "led", color: "#4ade80" },
          { from: "led", to: "jdb", color: "#c084fc", label: "append" },
          { from: "led", to: "bal", color: "#facc15", label: "project" }
        ]
      },
      {
        title: "Double-entry: Alice, merchant, maybe fees",
        text: "₹100 is debit Alice, credit merchant. A 2% fee adds a line to fee income. Debits equal credits in one entry, one currency. Clearing sits in the middle when the bank has not yet moved cash.",
        highlight: ["alice", "merch", "led", "jdb", "clear", "n1"],
        hide: ["outbox", "bank", "recon", "file", "hold", "n2"],
        flows: [
          { from: "led", to: "jdb", color: "#c084fc", label: "Dr Alice" },
          { from: "led", to: "clear", color: "#c084fc", label: "Cr clearing" }
        ]
      },
      {
        title: "Bank call is after commit, via outbox",
        text: "Do not HTTP the bank inside the DB transaction. Write an outbox row with the journal. A worker talks to UPI/cards. A timeout retries the partner, not the posting — the idempotency key already saved us.",
        highlight: ["led", "outbox", "bank", "jdb"],
        hide: ["recon", "file", "hold", "n0", "n2"],
        flows: [
          { from: "led", to: "outbox", color: "#fb923c", label: "event" },
          { from: "outbox", to: "bank", color: "#fb923c", label: "payout" }
        ]
      },
      {
        title: "The bank is slow; money sits in clearing",
        text: "Until the partner acks, funds live in the clearing account. The merchant UI can show pending. Available vs pending is two accounts (or pending lines), not a silent subtraction on Alice's row.",
        highlight: ["clear", "bank", "merch", "bal"],
        hide: ["recon", "file", "hold", "n0", "n2"],
        flows: [{ from: "bank", to: "clear", color: "#60a5fa", label: "ack?" }]
      },
      {
        title: "Authorize is a hold entry, not an edit",
        text: "Card auth or a ticket hold: debit available, credit holds. Capture posts a second entry that reverses the hold and credits the merchant. Expiry reverses back. The first entry is never UPDATEd.",
        highlight: ["hold", "led", "jdb", "alice"],
        hide: ["recon", "file", "n0", "n2", "bank"],
        flows: [
          { from: "led", to: "hold", color: "#fb923c", label: "Dr hold" },
          { from: "led", to: "jdb", color: "#c084fc", label: "entry 2" }
        ]
      },
      {
        title: "Settlement file lands",
        text: "T+1 the bank drops a file (or you page an API). Store the raw bytes in object storage so recon is replayable. The recon worker will match, not trust a one-shot script.",
        highlight: ["bank", "file", "recon"],
        hide: ["hold", "n0", "n1", "n2", "alice"],
        flows: [
          { from: "bank", to: "file", color: "#22d3ee", label: "T+1" },
          { from: "file", to: "recon", color: "#fb923c", label: "rows" }
        ]
      },
      {
        title: "Match on UTR: three buckets",
        text: "Matched, on-us-only, on-them-only. Amount+time is not a key. Unmatched rupees become tickets. Automatic repair is a new adjusting journal entry with a reason code — never an edit of yesterday's line.",
        highlight: ["recon", "jdb", "file", "n2"],
        hide: ["hold", "n0", "n1", "outbox"],
        flows: [
          { from: "recon", to: "jdb", color: "#c084fc", label: "adjust" },
          { from: "recon", to: "file", color: "#60a5fa", label: "unmatched" }
        ]
      },
      {
        title: "Hot merchant: serialize posts",
        text: "A popular account cannot take every request as a row lock on one balance snapshot. Queue posts per accountId. Reporting reads a replica; finance still sums the journal. The books close when unmatched aging is at zero, not when the API returned 200.",
        highlight: ["merch", "led", "jdb", "bal", "recon"],
        hide: ["n0", "n1", "hold", "file"],
        flows: [
          { from: "merch", to: "gw", color: "#4ade80", label: "peak" },
          { from: "led", to: "jdb", color: "#c084fc", label: "serial" }
        ]
      }
    ]
  }
});
