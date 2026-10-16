window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 23,
  title: "Data Consistency and Tradeoffs in Distributed Systems",
  video: "https://www.youtube.com/watch?v=m4q7VkgDWrM",
  category: "Data & Storage",
  tagline: "Copies must agree — but waiting for agreement can make the system disappear.",
  summary: "Starting from early Facebook on a single Harvard server, this lecture shows why extra copies of data fix single points of failure, vertical-scale limits, and cross-continent latency — and then create a consistency problem. It walks through TCP acknowledgements, the Two Generals Problem, leader-follower replication, two-phase commit, and why strongly consistent systems pay in availability.",

  theory: [
    {
      heading: "What \"consistent\" actually means",
      body: "In this lecture, consistency is about <b>copies of the same data agreeing</b>. If profile C exists in two regions, both should show the same C. You will hear the same letter in CAP (linearizability / single-copy appearance) and in ACID (constraints and valid state after a transaction). The shared intuition: readers should not observe two different truths for one logical record.",
      bullets: [
        "One copy is trivially consistent: there is nothing to disagree with.",
        "The moment you replicate, you must decide when a write is \"done\" on every copy.",
        "Banks can lag a statement by days; a social feed usually cannot."
      ]
    },
    {
      heading: "The Harvard-only Facebook",
      body: "Picture campus Facebook with <b>one server and one copy</b> of profiles. Student A creates a profile; student B asks for it; the server looks it up and returns it. That read is always right. The design still fails three ways: the box is a <b>single point of failure</b> (power loss, network, \"tsunami\"), <b>vertical scaling</b> hits a price wall long before supercomputer-class hardware, and a student at Oxford pays ~<code>100ms</code> of transatlantic hops that physics will not shrink to <code>10ms</code>."
    },
    {
      heading: "Split campuses, then cache, then replicate",
      body: "Facebook's early practical move was a Harvard box and an Oxford box with <b>no cross-talk</b> — each campus only saw local students. That kills the product's point (sharing) and still leaves Oxford as a SPOF for Oxford data. Next idea: keep ownership in the home region, but <b>cache hot Oxford profiles</b> at Harvard after the first fetch. Latency drops on hits; misses, evictions, and staleness remain. The only complete fix for SPOF plus latency is <b>full replicas</b>: store A, B, C in the US <i>and</i> in Europe. Reads and local writes become fast. Now the copies can drift.",
      bullets: [
        "Isolated shards by campus: low local latency, no global product.",
        "Remote-on-demand: still a SPOF and still a 100ms cross-ocean read.",
        "Cache: first user pays the RTT; the next user does not — until replacement.",
        "Full replica: crash one region, fail over; updates must fan out."
      ]
    },
    {
      heading: "Propagating C → C++ and the Two Generals Problem",
      body: "A US write turns C into <code>C++</code>. Europe still has C until a message arrives. Infrequent products (paper ledgers, bank statements) can reconcile later. Facebook-class apps need a network protocol. <b>TCP</b> is attractive because it is reliable and ordered — but the peer still has to <b>ACK</b>. If the ACK is missing, retry. How many times? Forever, or give up and live with divergence. The deeper trap: whoever <b>commits first</b> cannot know the other side committed, and an ACK-of-ACK never ends. That is the <b>Two Generals Problem</b>: over an unreliable network you cannot get simultaneous certainty with messages alone."
    },
    {
      heading: "Leader writes, follower reads, CAP in one picture",
      body: "Give the US server a <b>leader</b> role: all writes go there; Europe is a <b>follower</b> that applies a stream of updates and serves reads. If the replica message is delayed, a European GET is a <b>dirty read</b>. If the leader <i>waits</i> for the follower before answering the writer, the system looks <b>down</b> — no response is indistinguishable from failure. Pure consistency costs availability; availability admits windows of inconsistency. That is the CAP tension the lecture is driving at (partition-prone networks are the default, not the exception).",
      bullets: [
        "Clients must not write the follower; one commit point simplifies ordering.",
        "Async replication: low write latency, stale reads.",
        "Sync replication: no dirty reads, higher tail latency / unavailability."
      ]
    },
    {
      heading: "Two-phase commit (prepare, then commit)",
      body: "When one logical write must land on many followers (or on a profile service, a session service, a document service, or even <b>Kafka</b> plus databases), <b>2PC</b> is the strict protocol. Phase 1: the leader sends <b>PREPARE</b>. Each follower <code>BEGIN</code>s a transaction, writes statements 1..N, and <b>does not COMMIT</b> — it ACKs \"ready\". If any ACK is missing or negative, the leader broadcasts <b>ROLLBACK</b>. Followers must not time out and roll back on their own after they promised; only the leader decides. Phase 2: the leader commits locally, then sends <b>COMMIT</b> (\"Ctrl+S\" so the new value is visible). Followers commit and ACK.",
      bullets: [
        "PREPARE = do the work, hold locks, wait for the go-ahead.",
        "Missing PREPARE ACK → leader aborts everyone; copies stay on old C.",
        "COMMIT is retried with a <b>transaction id</b> so duplicates are idempotent.",
        "A follower that already committed just ACKs again; it does not re-apply."
      ]
    },
    {
      heading: "The bill for perfect agreement",
      body: "If a COMMIT message is lost, one replica might already show <code>C++</code> while another still has C — unless you <b>block GETs</b> on that row until every COMMIT is acknowledged. Locks make the system consistent and <b>not available</b>. Followers are \"brain-dead\" about abort: they wait for the leader's rollback. Retries must be infinite (or until a human) for the committed transaction. Financial ledgers often pay this cost. A newsfeed usually should not. The lecture closes on <b>eventual consistency</b>: allow a short disagreement window, keep serving, and reconcile in the background. Isolation and read/write guarantees are the next layer of that story."
    }
  ],

  keyTerms: [
    { term: "Data consistency", def: "All replicas of a logical record present the same value to readers, or a defined window until they do." },
    { term: "Single point of failure", def: "One server or region whose outage takes the whole product down and can lose the only copy." },
    { term: "Replication", def: "Keeping extra copies (e.g. US and Europe) so reads are local and a crash is survivable." },
    { term: "Two Generals Problem", def: "No finite ACK protocol over an unreliable network can give both sides simultaneous certainty that the other committed." },
    { term: "Leader / follower", def: "Only the leader accepts writes; followers apply a replica stream and typically serve reads." },
    { term: "Dirty read", def: "Reading a replica that has not yet applied a committed leader write (C instead of C++)." },
    { term: "Two-phase commit", def: "PREPARE (work + ready ACK) then COMMIT/ROLLBACK, driven only by the leader, with idempotent retries." },
    { term: "Idempotent commit", def: "Re-sending COMMIT for the same transaction id is safe; the follower ACKs without double-applying." },
    { term: "Eventual consistency", def: "Replicas may diverge briefly after a write but are guaranteed to converge if updates keep flowing." }
  ],

  tradeoffs: [
    { pro: "Single copy: every read is the latest write; no replica protocol.", con: "SPOF, vertical-scale ceiling, and ~100ms ocean RTT for remote campuses." },
    { pro: "Per-campus isolated servers: local students are fast and cheap to host.", con: "No sharing (the product dies) and each campus is still a SPOF for its data." },
    { pro: "Caching remote profiles: hits cut latency without owning a full replica.", con: "Misses, evictions, and stale cached documents remain." },
    { pro: "Leader + 2PC: all copies commit the same C++ or all roll back to C.", con: "Row locks, blocked GETs, retries, and the system looks down during uncertainty." },
    { pro: "Eventual consistency: writes return fast; the product stays up during partitions.", con: "Readers can see C and C++ at the same time until catch-up." }
  ],

  interviewTips: [
    "Ask how stale a read may be (bank ledger vs Facebook profile) before proposing 2PC.",
    "Walk Harvard → isolated Oxford → cache → full replica so the interviewer sees why consistency appears.",
    "Name the Two Generals trap: committing locally then hoping the ACK arrives is not a protocol.",
    "If you pick 2PC, mention blocked reads, leader-driven rollback, and idempotent COMMIT retries.",
    "Say CAP in operational terms: wait for the follower = unavailable; don't wait = dirty read.",
    "Banks can reconcile in days; a social GET that waits on locks is a failed design for that product."
  ],

  scene: {
    nodes: [
      { id: "zh", label: "Harvard Campus", type: "zone", pos: [-6, 0, 0], size: [10, 8] },
      { id: "zo", label: "Oxford Campus", type: "zone", pos: [6, 0, 0], size: [10, 8], showAt: 1 },

      { id: "ua", label: "Student A", type: "user", pos: [-10, 0, -3] },
      { id: "ub", label: "Student B", type: "user", pos: [-10, 0, 3] },
      { id: "uo", label: "Oxford student", type: "user", pos: [10, 0, 0], showAt: 1 },

      { id: "hs", label: "Harvard server", type: "server", pos: [-7, 0, 0] },
      { id: "hdb", label: "Profiles A,B,C", type: "db", pos: [-4, 0, 0] },
      { id: "cache", label: "Oxford cache", type: "cache", pos: [-4, 0, -3], showAt: 3 },

      { id: "os", label: "Oxford server", type: "server", pos: [7, 0, 0], showAt: 2 },
      { id: "odb", label: "Profiles A,B,C", type: "db", pos: [4, 0, 0], showAt: 2 },

      { id: "kq", label: "Kafka log", type: "queue", pos: [0, 0, 0], showAt: 8 },
      { id: "fc", label: "Profile svc", type: "service", pos: [0, 0, 5], showAt: 8 },
      { id: "fd", label: "Session svc", type: "service", pos: [0, 0, -5], showAt: 8 },

      { id: "n0", label: "One copy = consistent", type: "note", pos: [0, 4, -7] },
      { id: "n1", label: "SPOF + scale + 100ms", type: "note", pos: [0, 4, 7], showAt: 1 },
      { id: "n2", label: "No cross-campus share", type: "note", pos: [3.5, 4, 7], showAt: 2 },
      { id: "n3", label: "C vs C++ diverge", type: "note", pos: [0, 4, -7], showAt: 5 },
      { id: "n4", label: "Two Generals: never sure", type: "note", pos: [0, 4, 7], showAt: 6 },
      { id: "n5", label: "Leader writes only", type: "note", pos: [-7, 3.5, 4], showAt: 7 },
      { id: "n6", label: "PREPARE then COMMIT", type: "note", pos: [0, 4, 7], showAt: 8 },
      { id: "n7", label: "Row C locked — no GET", type: "note", pos: [0, 3.5, 3], showAt: 10 },
      { id: "n8", label: "Eventual consistency", type: "note", pos: [0, 4, -7], showAt: 11 }
    ],
    edges: [
      { from: "ua", to: "hs", label: "create" },
      { from: "ub", to: "hs", label: "GET A" },
      { from: "hs", to: "hdb" },
      { from: "uo", to: "hs", label: "~100ms", showAt: 1, dashed: true },
      { from: "uo", to: "os", label: "local", showAt: 2 },
      { from: "os", to: "odb", showAt: 2 },
      { from: "hs", to: "cache", showAt: 3 },
      { from: "hs", to: "os", label: "fetch Oxford", showAt: 3, dashed: true },
      { from: "hs", to: "os", label: "replicate", showAt: 4 },
      { from: "hs", to: "os", label: "C → C++", showAt: 5 },
      { from: "os", to: "hs", label: "ACK?", showAt: 6, dashed: true },
      { from: "hs", to: "os", label: "replica stream", showAt: 7 },
      { from: "hs", to: "fc", label: "PREPARE", showAt: 8 },
      { from: "hs", to: "fd", label: "PREPARE", showAt: 8 },
      { from: "hs", to: "kq", label: "PREPARE", showAt: 8 },
      { from: "fc", to: "hs", label: "ready", showAt: 8, dashed: true },
      { from: "fd", to: "hs", label: "ready", showAt: 8, dashed: true },
      { from: "kq", to: "hs", label: "ready", showAt: 8, dashed: true }
    ],
    steps: [
      {
        title: "One campus, one copy",
        text: "Early Facebook lives on a Harvard box. Student A writes a profile into the only database; student B reads it back. With a single copy there is nothing to disagree about — every GET is the latest write.",
        highlight: ["zh", "hs", "hdb", "ua", "ub", "n0"],
        hide: ["n3", "n8"],
        flows: [
          { from: "ua", to: "hs", color: "#4ade80", label: "create A" },
          { from: "hs", to: "hdb", color: "#4ade80", label: "put" },
          { from: "ub", to: "hs", color: "#60a5fa", label: "GET A" },
          { from: "hs", to: "ub", color: "#60a5fa", label: "profile" }
        ]
      },
      {
        title: "Why the single box dies",
        text: "That server is a single point of failure (power, network, disaster). Vertical scaling races toward supercomputer prices and still caps out. An Oxford student crossing the ocean pays about 100ms — physics will not make it 10ms.",
        highlight: ["hs", "uo", "n1"],
        fail: ["hs"],
        hide: ["n3", "n4", "n8"],
        flows: [
          { from: "uo", to: "hs", color: "#f87171", label: "100ms GET" }
        ]
      },
      {
        title: "Harvard and Oxford, no sharing",
        text: "Add a second server on the other campus with no replication. Local students are fast, but a Harvard login cannot see Oxford profiles. Facebook without sharing is just two campus notice boards, and Oxford is still a SPOF for Oxford data.",
        highlight: ["zh", "zo", "hs", "os", "n2"],
        hide: ["n4", "n6"],
        flows: [
          { from: "ua", to: "hs", color: "#4ade80", label: "local" },
          { from: "uo", to: "os", color: "#4ade80", label: "local" }
        ]
      },
      {
        title: "Cache hot Oxford profiles",
        text: "Keep ownership in Oxford, but stash popular remote profiles in a Harvard cache. The first GET misses, crosses the ocean, and fills the cache; later campus reads are cheap. Eviction or a cold key still pays the RTT, and cached bytes can go stale.",
        highlight: ["hs", "cache", "os"],
        hide: ["n4", "n6"],
        flows: [
          { from: "ub", to: "hs", color: "#60a5fa", label: "GET Oxford" },
          { from: "hs", to: "os", color: "#fb923c", label: "miss" },
          { from: "os", to: "hs", color: "#60a5fa", label: "profile" },
          { from: "hs", to: "cache", color: "#c084fc", label: "store" }
        ]
      },
      {
        title: "Full replicas in both regions",
        text: "Store A, B, and C in the US and in Europe. A regional crash is no longer fatal, and a Harvard student reads Oxford data locally. Writes can acknowledge as soon as the nearby copy updates — which is exactly when copies can disagree.",
        highlight: ["hdb", "odb", "hs", "os"],
        hide: ["n0", "n4", "n6", "n8"],
        flows: [
          { from: "hs", to: "os", color: "#c084fc", label: "copy ABC" },
          { from: "hdb", to: "odb", color: "#c084fc", label: "replica" }
        ]
      },
      {
        title: "The consistency monster: C vs C++",
        text: "A US write turns C into C++. Europe still has C until an update message arrives. A bank can note the ledger and print a statement days later. A social app cannot wait that long — so it must push C++ over the network.",
        highlight: ["hdb", "odb", "n3"],
        hide: ["n0", "n8"],
        flows: [
          { from: "ua", to: "hs", color: "#4ade80", label: "C++" },
          { from: "hs", to: "hdb", color: "#4ade80", label: "commit" },
          { from: "hs", to: "os", color: "#fb923c", label: "update C" }
        ]
      },
      {
        title: "TCP, ACKs, and Two Generals",
        text: "Send C→C++ with reliable, ordered TCP and wait for an ACK. No ACK? Retry every few seconds, or give up and accept drift. Whoever commits first cannot know the ACK of that commit arrived — ACK-of-ACK never terminates. Over a lossy network, simultaneous certainty is impossible.",
        highlight: ["hs", "os", "n4"],
        fail: ["os"],
        hide: ["n1", "n2", "n6"],
        flows: [
          { from: "hs", to: "os", color: "#4ade80", label: "C→C++" },
          { from: "os", to: "hs", color: "#f87171", label: "ACK lost" }
        ]
      },
      {
        title: "Leader writes, follower reads",
        text: "Only the US leader may commit. Oxford becomes a follower that applies a replica stream and serves GETs. If the leader returns before the stream lands, Europe reads dirty C. If the leader waits for Oxford, writers see a dead system. Consistency and availability trade blows.",
        highlight: ["hs", "os", "n5"],
        hide: ["n0", "n3", "n8", "n6"],
        flows: [
          { from: "ua", to: "hs", color: "#4ade80", label: "write" },
          { from: "hs", to: "os", color: "#c084fc", label: "stream" },
          { from: "uo", to: "os", color: "#60a5fa", label: "GET" }
        ]
      },
      {
        title: "2PC phase 1 — PREPARE",
        text: "A leader coordinates many participants (followers, a profile service, a session service, even Kafka). It sends PREPARE: each begins a transaction, writes statements 1..N, and ACKs ready without committing. Any timeout or NACK and the leader will abort.",
        highlight: ["hs", "os", "fc", "fd", "kq", "n6"],
        hide: ["n1", "n2", "n4"],
        flows: [
          { from: "hs", to: "os", color: "#fb923c", label: "PREPARE" },
          { from: "hs", to: "fc", color: "#fb923c", label: "PREPARE" },
          { from: "hs", to: "fd", color: "#fb923c", label: "PREPARE" },
          { from: "hs", to: "kq", color: "#fb923c", label: "PREPARE" },
          { from: "fc", to: "hs", color: "#4ade80", label: "ready" }
        ]
      },
      {
        title: "Abort is leader-driven",
        text: "If a PREPARE ACK never returns, the leader broadcasts ROLLBACK so every copy stays on C. Followers must not self-timeout and revert after they promised — only the coordinator decides. That keeps the world uniform on the old value.",
        highlight: ["hs", "os", "fc"],
        fail: ["os"],
        hide: ["n1", "n2", "n4"],
        flows: [
          { from: "hs", to: "os", color: "#f87171", label: "PREPARE" },
          { from: "hs", to: "fc", color: "#f87171", label: "ROLLBACK" },
          { from: "hs", to: "fd", color: "#f87171", label: "ROLLBACK" },
          { from: "hs", to: "kq", color: "#f87171", label: "ROLLBACK" }
        ]
      },
      {
        title: "2PC phase 2 — lock, COMMIT, retry",
        text: "On full ready, the leader commits locally, then sends COMMIT and retries with a transaction id (idempotent). Until every ACK lands, GETs on row C are blocked — consistent, not available. A lost COMMIT without a lock would show C++ here and C there.",
        highlight: ["hs", "hdb", "os", "odb", "n7"],
        hide: ["n0", "n3", "n8", "n4"],
        flows: [
          { from: "hs", to: "os", color: "#4ade80", label: "COMMIT" },
          { from: "hs", to: "fc", color: "#4ade80", label: "COMMIT" },
          { from: "hs", to: "fd", color: "#4ade80", label: "COMMIT" },
          { from: "ub", to: "hs", color: "#f87171", label: "GET blocked" }
        ]
      },
      {
        title: "Pay for agreement, or choose eventual",
        text: "Absolute consistency buys locked rows, extra machines, and worse tail latency — fine for money movement. A feed can admit a short C vs C++ window, keep serving, and catch up in the background. That is eventual consistency: the practical default once you have replicas.",
        highlight: ["hs", "os", "hdb", "odb", "n8"],
        hide: ["n0", "n3", "n7"],
        flows: [
          { from: "hs", to: "os", color: "#c084fc", label: "async C++" },
          { from: "uo", to: "os", color: "#60a5fa", label: "GET" },
          { from: "os", to: "uo", color: "#60a5fa", label: "soon C++" }
        ]
      }
    ]
  }
});
