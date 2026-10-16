window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 40,
  title: "Design Multi-Region Object Storage",
  video: "",
  category: "Roadmap Case Studies",
  tagline: "Metadata vs bytes, quorum PUT, async CRR, then fence the old home on failover.",
  summary: "S3-style storage is not a CDN lecture and not a single disk. P0: PUT/GET/DELETE objects, list a prefix, multipart for large files, durability across disks and AZs, a story for a second region. Metadata (bucket, key, etag, ACL, size) is a strongly consistent index. Bytes live on erasure-coded or replicated data nodes. Cross-region is asynchronous by default; dual-write PUT that must not fork needs a home region. Failures are bitrot, lost AZs, split-brain listings, and a GET that raced a DELETE.",

  theory: [
    {
      heading: "Requirements: buckets of blobs, not a filesystem",
      body: "P0: create bucket, PUT object (key → bytes), GET, DELETE, LIST prefix, multipart upload, pre-signed URLs. P1: object versioning, lifecycle to cold class, event notifications, SQL-over-objects. NFRs: eleven nines durability is a marketing line you translate into \"erasure code + extra AZ + background scrub.\" Availability of GET is AP-ish with cached metadata; PUT that overwrites the same key is the CP fight. Scale: billions of objects, multi-GB objects, 10 k PUTs/s, many more GETs. Consistency: after a successful PUT, a GET in the same region should see it (read-after-write on the key). LIST may lag. Cross-region replica may lag seconds to minutes unless they pay for sync.",
      bullets: [
        "Objects are immutable blobs plus replace-by-key. You do not mmap a 5 GB video as a POSIX file.",
        "ACL/IAM on bucket and key. Pre-signed URL is a capability token with expiry.",
        "Success: lost-object rate, GET p95, PUT ack durability, replica lag histogram."
      ]
    },
    {
      heading: "Split control plane from data plane",
      body: "Metadata service: bucket, key, version, etag (hash), size, ACL, location of data extents, upload state. This is a strongly consistent store (spanner-like, or Raft per key-range). Data nodes: cheap disks, the bytes. PUT: (1) authenticate, (2) allocate blocks, (3) write N chunks to data nodes, (4) commit the metadata pointer. If (4) never happens, a GC reclaims orphan chunks. GET: metadata lookup → fetch chunks → reassemble → stream. Spring: a <code>PutController</code> streams <code>InputStream</code> to a <code>BlockWriter</code>; it does not buffer 5 GB on heap. etag is MD5/CRC of the bytes so GET can checksum. List is a prefix scan on the metadata index, not a walk of disks.",
      bullets: [
        "Never store the blob in the metadata DB. That is the TikTok lesson applied to all files.",
        "Key = bucket + name. Partition metadata by bucket hash, then key range.",
        "A 0-byte PUT still commits metadata; it is a valid object."
      ]
    },
    {
      heading: "Durability inside a region: replica vs erasure code",
      body: "Three full copies in three AZs is simple and write-expensive (3×). Erasure coding (e.g. 6+3) stores ~1.5× bytes and still survives 3 disk losses, at the cost of CPU on PUT/GET and a harder repair. Small objects (< 1 MB) often just replicate; large objects erasure-code. Scrubber workers read chunks, verify checksums, repair from parity — bitrot is a real failure. PUT ack policy: wait for a quorum of chunks durable (like Kafka acks=all) before metadata commit. If you ack on one disk, you will lie after an AZ fire. Java: bounded write pools per data node; slow disk is a bulkhead, not a global stall.",
      bullets: [
        "Repair traffic after a disk death can drown GETs. Throttle rebuilds.",
        "Placement: no two parity pieces of the same object in one AZ.",
        "Cold class: move extents to denser/slower nodes, keep metadata hot."
      ]
    },
    {
      heading: "Multipart and large PUTs",
      body: "A 5 GB video cannot be one HTTP request you hope survives. Multipart: INIT → N PART PUTs (each part its own etag) → COMPLETE that lists part etags in order. COMPLETE is the metadata commit that makes the key visible. Aborted or expired uploads GC their parts. Parts can land in parallel on different nodes. Idempotent COMPLETE with the same uploadId. This is the encoder-pipeline cousin from video lectures, but you are the storage. Range GET uses part maps so a player can seek. Concurrent PUT on the same key: last COMPLETE wins, or versioning keeps both — ask.",
      bullets: [
        "Minimum part size exists so you do not have a million 1 KB parts.",
        "COMPLETE must be atomic in metadata: the key flips in one Raft commit.",
        "Checksum of checksums: COMPLETE verifies the concatenated etag list."
      ]
    },
    {
      heading: "Multi-region: async replicate, home region for writes",
      body: "Bytes replicate via a queue of committed keys (metadata changelog). Destination region pulls extents, then writes its own metadata. GET can be served from the closest region if replica lag is acceptable (CDN is a cache of this). Conflict: two regions PUT the same key without a home — last-writer-wins by wall clock is how you lose data. Design: a bucket has a home region for PUTs; other regions proxy writes or reject. Failover: promote a replica, fence the old home (tokens, or the metadata Raft). Versioning makes failover safer: you keep both writes as versions. Cross-region sync PUT (wait for 2 regions) is a rare, slow option for \"this key must not be lost in a regional flood.\"",
      bullets: [
        "This is not the CDN lecture. Edges cache popular GETs; they are not durable stores.",
        "Delete replication: a tombstone with a version so a late PUT from the old home cannot resurrect.",
        "List in region B may miss a PUT that region A just acked. Say it."
      ]
    },
    {
      heading: "Failure matrix and recap",
      body: "Disk death: repair from replica/parity, throttle. AZ death: remaining AZs still quorum. Region death: promote, fence, accept replica lag as lost-unreplicated PUTs (the RPO). GET vs DELETE race: metadata version — GET a stale version is OK if you document it; GET a deleted key should 404 after metadata commit. Metadata Raft loss is worse than a data node: you cannot find the bytes. Back it like a database, not like a disk. Notifications (S3 events) are an outbox from the metadata commit, not from the data node. Recap: metadata CP, bytes quorum, multipart COMPLETE is the publish, async CRR with a home region, fence on promote. Metric: repair backlog, replica lag, 404-after-PUT (should be ~0 in home).",
      bullets: [
        "Pre-signed PUT still goes through the same durability path; the token only skips IAM round-trips.",
        "Lifecycle: a worker lists prefixes and issues deletes/transitions; it is a client of your own API.",
        "Compared with ticket holds: the uniqueness key is (bucket, key, version), the payload is opaque bytes."
      ]
    }
  ],

  keyTerms: [
    { term: "Metadata index", def: "Strongly consistent map of key → etag, ACL, size, and pointers to data extents." },
    { term: "Data node", def: "Disk-heavy server that stores chunks; unaware of bucket ACL except via the control plane." },
    { term: "Erasure coding", def: "Split an object into k data + m parity chunks so you survive m losses without 3× copies." },
    { term: "ETag", def: "Content hash used as identity, If-Match, and multipart part verification." },
    { term: "Multipart COMPLETE", def: "Atomic metadata commit that publishes a key assembled from uploaded parts." },
    { term: "Home region", def: "The region allowed to accept PUTs for a bucket, to avoid split-brain overwrites." },
    { term: "CRR", def: "Cross-region replication from the metadata changelog, usually asynchronous." },
    { term: "Fence", def: "On failover, stop the old home from committing so a zombie PUT cannot win later." },
    { term: "Scrubber", def: "Background worker that checksums chunks and repairs bitrot from parity/replicas." }
  ],

  tradeoffs: [
    { pro: "3× replication is operationally simple.", con: "You pay 3× disk and 3× WAN if you also copy regions." },
    { pro: "Erasure coding cuts capacity cost on large objects.", con: "CPU, repair complexity, and small-object overhead go up." },
    { pro: "Async CRR keeps PUT latency in one region.", con: "RPO is minutes; a regional flood loses unreplicated keys." },
    { pro: "Sync dual-region PUT shrinks RPO.", con: "PUT latency includes the ocean; availability drops if the second region is sick." },
    { pro: "Versioning saves you in split-brain and overwrite races.", con: "List and storage costs multiply; GC of old versions needs lifecycle." }
  ],

  interviewTips: [
    "Split metadata (CP, Raft) from bytes (quorum/erasure). PUT is durable only after metadata commit.",
    "Quorum acks before the 200. Orphan chunks GC if commit never happens.",
    "Multipart: INIT, parts, atomic COMPLETE. That COMPLETE is the publish.",
    "Home region for writes. Async CRR from the changelog. Fence on promote.",
    "LIST may lag; same-region GET after PUT should not. Say both.",
    "CDN is a cache. Scrubbers fight bitrot. Metric: replica lag and repair backlog."
  ],

  scene: {
    nodes: [
      { id: "app", label: "Uploader", type: "phone", pos: [-11, 0, 0] },
      { id: "gw", label: "S3 API GW", type: "gateway", pos: [-7, 0, 0] },
      { id: "meta", label: "Metadata Raft", type: "db", pos: [-3, 0, -3.2], showAt: 1 },
      { id: "d1", label: "Data AZ1", type: "storage", pos: [1.5, 0, -3.2], showAt: 2 },
      { id: "d2", label: "Data AZ2", type: "storage", pos: [1.5, 0, 0], showAt: 2 },
      { id: "d3", label: "Data AZ3", type: "storage", pos: [1.5, 0, 3.2], showAt: 2 },
      { id: "zhome", label: "Home region", type: "zone", pos: [-1, 0, 0], size: [14, 10] },
      { id: "mp", label: "Multipart", type: "service", pos: [-3, 0, 3.2], showAt: 4 },
      { id: "crr", label: "CRR queue", type: "queue", pos: [6, 0, 0], showAt: 6 },
      { id: "zdr", label: "DR region", type: "zone", pos: [9.5, 0, 0], size: [6, 9], showAt: 6 },
      { id: "mdest", label: "DR metadata", type: "db", pos: [9.5, 0, -3.2], showAt: 6 },
      { id: "ddest", label: "DR bytes", type: "storage", pos: [9.5, 0, 3.2], showAt: 6 },
      { id: "cdn", label: "CDN edge", type: "cdn", pos: [-7, 0, -3.2], showAt: 5 },
      { id: "scrub", label: "Scrubber", type: "worker", pos: [6, 0, 3.2], showAt: 3 },
      { id: "n0", label: "Bytes ≠ metadata", type: "note", pos: [-7, 0, -6.8] },
      { id: "n1", label: "Ack after quorum", type: "note", pos: [1.5, 0, -6.8], showAt: 2 },
      { id: "n2", label: "COMPLETE publishes key", type: "note", pos: [-3, 0, 6.8], showAt: 4 },
      { id: "n3", label: "Fence old home", type: "note", pos: [9.5, 0, 6.8], showAt: 8 }
    ],
    edges: [
      { from: "app", to: "gw" },
      { from: "gw", to: "meta", showAt: 1 },
      { from: "gw", to: "d1", showAt: 2 },
      { from: "gw", to: "d2", showAt: 2 },
      { from: "gw", to: "d3", showAt: 2 },
      { from: "scrub", to: "d1", showAt: 3, dashed: true },
      { from: "gw", to: "mp", showAt: 4 },
      { from: "mp", to: "d1", showAt: 4 },
      { from: "app", to: "cdn", showAt: 5, dashed: true },
      { from: "meta", to: "crr", showAt: 6 },
      { from: "crr", to: "mdest", showAt: 6 },
      { from: "crr", to: "ddest", showAt: 6 }
    ],
    steps: [
      {
        title: "Buckets of blobs, not a filesystem",
        text: "PUT/GET/DELETE/LIST and multipart. Durability is disks + AZs + scrub. Same-region GET after PUT should see the object. LIST and the other region may lag. You will not mmap 5 GB as POSIX.",
        highlight: ["app", "gw", "n0", "zhome"],
        hide: ["meta", "d1", "d2", "d3", "mp", "crr", "zdr", "mdest", "ddest", "cdn", "scrub", "n1", "n2", "n3"],
        flows: [{ from: "app", to: "gw", color: "#4ade80", label: "PUT" }]
      },
      {
        title: "Metadata is Raft; bytes are elsewhere",
        text: "The control plane stores key, etag, ACL, size, pointers. Partition by bucket then key. The blob never sits in this DB. A 0-byte object is still a metadata commit. List is a prefix scan here, not a disk walk.",
        highlight: ["gw", "meta", "n0"],
        hide: ["d1", "d2", "d3", "mp", "crr", "zdr", "mdest", "ddest", "cdn", "scrub", "n1", "n2", "n3"],
        flows: [{ from: "gw", to: "meta", color: "#c084fc", label: "plan" }]
      },
      {
        title: "Write chunks, quorum, then commit pointers",
        text: "Stream bytes to three AZs (or 6+3 erasure). Ack only when a quorum is durable, then commit metadata. If commit never happens, GC orphans. Spring streams the InputStream; it does not buffer 5 GB.",
        highlight: ["gw", "d1", "d2", "d3", "meta", "n1"],
        hide: ["mp", "crr", "zdr", "mdest", "ddest", "cdn", "scrub", "n2", "n3", "n0"],
        flows: [
          { from: "gw", to: "d1", color: "#4ade80", label: "chunk" },
          { from: "gw", to: "d2", color: "#4ade80" },
          { from: "gw", to: "d3", color: "#4ade80" },
          { from: "gw", to: "meta", color: "#c084fc", label: "commit" }
        ]
      },
      {
        title: "Scrubbers fight bitrot",
        text: "Background workers checksum chunks and repair from parity or replicas. Rebuild after a disk death is throttled so repair does not drown GET. Placement: two pieces of one object do not share an AZ.",
        highlight: ["scrub", "d1", "d2", "d3"],
        hide: ["mp", "crr", "zdr", "mdest", "ddest", "cdn", "n2", "n3", "n0", "n1"],
        flows: [{ from: "scrub", to: "d1", color: "#fb923c", label: "crc" }]
      },
      {
        title: "Multipart COMPLETE is the publish",
        text: "INIT, parallel PART PUTs, COMPLETE with the etag list. The key becomes visible in one metadata Raft commit. Abort GC's parts. Concurrent PUT: last COMPLETE wins, or versioning keeps both.",
        highlight: ["mp", "meta", "d1", "n2", "app"],
        hide: ["crr", "zdr", "mdest", "ddest", "cdn", "scrub", "n3", "n0", "n1"],
        flows: [
          { from: "app", to: "mp", color: "#4ade80", label: "parts" },
          { from: "mp", to: "meta", color: "#c084fc", label: "COMPLETE" }
        ]
      },
      {
        title: "CDN caches GET; it is not durable",
        text: "Popular objects sit on edges. A cache hit is not a durability replica. Invalidation on DELETE/PUT follows the metadata version. Pre-signed GET is a timed capability, same data path.",
        highlight: ["cdn", "app", "d2"],
        hide: ["crr", "zdr", "mdest", "ddest", "scrub", "n3", "n0", "n1", "n2", "mp"],
        flows: [{ from: "app", to: "cdn", color: "#22d3ee", label: "GET" }]
      },
      {
        title: "CRR: changelog, then DR bytes+meta",
        text: "Committed keys enqueue. The DR region pulls extents, writes its metadata. LIST there may lag. Bucket home region owns PUTs so two DCs do not last-writer-win with wall clocks.",
        highlight: ["meta", "crr", "mdest", "ddest", "zdr"],
        hide: ["cdn", "scrub", "n3", "n0", "n1", "n2", "mp"],
        flows: [
          { from: "meta", to: "crr", color: "#c084fc", label: "key" },
          { from: "crr", to: "ddest", color: "#4ade80", label: "bytes" },
          { from: "crr", to: "mdest", color: "#c084fc", label: "ptr" }
        ]
      },
      {
        title: "AZ fire: quorum still holds",
        text: "One AZ gone: remaining chunks still meet k of n. Repair throttled. Metadata Raft still has a majority. PUT acks continue if quorum is defined across the living AZs.",
        highlight: ["d1", "d2", "d3", "meta"],
        fail: ["d3"],
        hide: ["cdn", "n3", "n0", "n1", "n2", "mp", "zdr", "mdest", "ddest", "crr"],
        flows: [{ from: "gw", to: "d1", color: "#4ade80", label: "still quorum" }]
      },
      {
        title: "Region death: promote and fence",
        text: "RPO is unreplicated PUTs. Promote DR, fence the old home so a zombie COMPLETE cannot win. Versioning keeps both writes if you must. Recap: metadata CP, quorum bytes, COMPLETE publishes, async CRR, fence. Metric: replica lag.",
        highlight: ["zdr", "mdest", "ddest", "n3", "meta"],
        fail: ["meta"],
        hide: ["cdn", "n0", "n1", "n2", "mp", "scrub", "d3"],
        flows: [{ from: "crr", to: "mdest", color: "#f87171", label: "promote" }]
      }
    ]
  }
});
