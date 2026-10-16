window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 20,
  title: "How databases scale writes: The power of the log",
  video: "https://www.youtube.com/watch?v=_5vrfuwhvlQ",
  category: "Data & Storage",
  tagline: "Append sequentially, sort in batches, merge like merge-sort.",
  summary: "Write-heavy stores avoid random in-place updates. They append into a fast in-memory log, flush sorted chunks to disk, binary-search those chunks, and compact same-sized runs the way merge-sort doubles array sizes. That pipeline is the Log-Structured Merge tree behind Cassandra, RocksDB, and LevelDB.",

  theory: [
    {
      heading: "Why B-trees choke on writes",
      body: "A B+ tree keeps keys ordered so a lookup is a handful of page hops. That is great for reads. A write is not: you must find the leaf, update it in place, and maybe split or rebalance. Those leaf pages are scattered, so the disk does random I/O. Sequential bandwidth on spinning disks (and still on SSDs) dwarfs random writes. If the workload is insert-heavy, the tree is fighting the hardware.",
      bullets: [
        "In-place update = read the page, modify, write it back (often two I/Os).",
        "Page splits and parent updates add more random I/O.",
        "Caching helps hot pages, but a large keyspace still misses."
      ]
    },
    {
      heading: "The log: just append",
      body: "The opposite of a scattered tree is a diary. Every insert is appended to the end of a file. No seeking, no splitting, no rewriting old pages. That structure is a <b>log</b>. Writes become O(1) sequential I/O. The catch is obvious: a read is now a linear scan of everything you ever wrote, and updates leave old versions sitting in the file forever.",
      bullets: [
        "Sequential appends match how disks and SSDs actually like to be used.",
        "Durability is easy: fsync the tail of the log.",
        "Reads and space usage get worse as the log grows unless you reorganize."
      ]
    },
    {
      heading: "Buffer unsorted, persist sorted",
      body: "You do not have to choose between a fast log and a searchable file. Incoming writes land in an in-memory buffer (the <b>memtable</b>) as a cheap append. When the buffer hits a size threshold, sort it once and flush it to disk as an immutable sorted run (an SSTable). Disk never sees random writes: each flush is one sequential dump of already-sorted keys. A write-ahead log on disk covers the memtable so a crash can replay what had not been flushed yet.",
      bullets: [
        "Memtable: mutable, in RAM, newest values win.",
        "Flush: sort, write a frozen sorted chunk, start a new memtable.",
        "WAL: append-only insurance for the memtable, truncated after a successful flush."
      ]
    },
    {
      heading: "Binary search, then too many chunks",
      body: "A sorted chunk of size 6 is searchable in about <code>log2(6) ~ 3</code> probes. That is as good as a tiny B-tree. The problem is you keep flushing. If you have three such chunks and you are looking for record <b>8</b>, you binary-search the first (miss), the second (miss), and the third (hit): roughly 9 probes. Four unmerged chunks cost about 12. Read cost grows with the number of files, not with how clever each file is.",
      bullets: [
        "Newest memtable first, then on-disk runs from new to old, because later writes override earlier ones.",
        "Deletes are tombstones appended like any other write; they are dropped only when old versions are merged away.",
        "Without a merge policy, read amplification tracks the flush count."
      ]
    },
    {
      heading: "Compaction is merge-sort on disk",
      body: "Two already-sorted arrays merge in linear time: walk both pointers, always emit the smaller key, and on a duplicate keep the newer value. The lecture's policy is the same as the merge-sort recurrence. Two blocks of size 6 become one block of size 12 (<code>log2(12) ~ 4</code> probes for that data instead of 3+3). Two blocks of 12 become one of 24 (<code>log2(24) ~ 5</code> versus 12 probes if you had left four size-6 files alone). You keep doubling until a run would be as large as all N inserts. The disk ends up with a few runs of mixed sizes (6, 12, 24, ...) rather than hundreds of tiny files. That background merge is <b>compaction</b>, and the whole family of structures is an <b>LSM tree</b> (log-structured merge tree).",
      bullets: [
        "Merge when two runs of the same size exist; output size doubles.",
        "Old files stay readable until the new file is durable, then they are deleted.",
        "Compaction costs extra write I/O (write amplification) so that future reads touch fewer files."
      ]
    },
    {
      heading: "Skipping files: Bloom filters",
      body: "Even after compaction, a point lookup may still have several runs to consider. Each run can carry a small Bloom filter in RAM: a bitset of hashes that answers \"this key is definitely not here\" or \"maybe.\" Negative answers skip a disk search entirely. False positives only cost an extra binary search. Together, memtable + Bloom + sparse indexes make LSM reads acceptable while the write path never did a random leaf update.",
      bullets: [
        "Bloom filters never false-negative; they may false-positive.",
        "Used by Cassandra, RocksDB, LevelDB, HBase, and similar engines.",
        "Choose LSM when writes dominate; choose B-trees when you need stable, in-place read-optimized pages (classic InnoDB)."
      ]
    }
  ],

  keyTerms: [
    { term: "Log", def: "Append-only sequence of records. Sequential writes, terrible naive reads." },
    { term: "Memtable", def: "In-memory buffer of recent writes. Sorted and flushed when full." },
    { term: "WAL", def: "Write-ahead log on disk so a crashed memtable can be rebuilt." },
    { term: "SSTable / sorted run", def: "Immutable disk file of key-value pairs sorted by key, flushed from a memtable." },
    { term: "Compaction", def: "Background merge of sorted runs, dropping stale versions and tombstones." },
    { term: "LSM tree", def: "Log-structured merge tree: memtable + leveled/size-tiered sorted files + compaction." },
    { term: "Bloom filter", def: "Probabilistic set test used to skip SSTables that cannot contain a key." },
    { term: "Tombstone", def: "A delete marker written as a new log record instead of editing old data in place." },
    { term: "Write amplification", def: "How many times the same key is rewritten as it is compacted up the levels." }
  ],

  tradeoffs: [
    { pro: "Writes are sequential and batched, so throughput stays high under insert load.", con: "Reads may probe several files until compaction and Bloom filters catch up." },
    { pro: "Immutability of SSTables simplifies concurrency: only the memtable is mutable.", con: "Compaction rewrites data (write amplification) and needs spare disk and CPU." },
    { pro: "Latest-version-wins plus tombstones make updates and deletes just more appends.", con: "Space bloats until compaction; a crash-heavy WAL still has to be replayed." },
    { pro: "Levels of doubled run sizes bound how many files a lookup touches.", con: "A B-tree still wins for update-in-place, range-stable, read-mostly relational pages." }
  ],

  interviewTips: [
    "If they ask why Cassandra/RocksDB eat writes, walk memtable -> WAL -> sorted flush -> compaction, not \"NoSQL is fast.\"",
    "Quote the lecture math: binary search a size-6 run in ~3 probes; three such runs ~9; merging to 12 then 24 drops that toward ~5.",
    "Name the merge-sort invariant: compact two equal-sized runs into one double-sized run.",
    "Mention Bloom filters when they push on read latency, and tombstones when they ask how deletes work.",
    "Contrast with B+ trees: one or two random I/Os per write vs blind sequential appends plus later compaction.",
    "State the workload fit: LSM for write-heavy / time-series / ingest; B-tree for update-heavy OLTP with point lookups."
  ],

  scene: {
    nodes: [
      { id: "app", label: "Writer", type: "user", pos: [-11, 0, 0] },

      { id: "btree", label: "B+ Tree", type: "db", pos: [-3, 0, 0] },
      { id: "leaf1", label: "Leaf page", type: "storage", pos: [3, 0, -4] },
      { id: "leaf2", label: "Leaf page", type: "storage", pos: [3, 0, 0] },
      { id: "leaf3", label: "Leaf page", type: "storage", pos: [3, 0, 4] },
      { id: "n_rand", label: "Random in-place writes", type: "note", pos: [-3, 3.2, -5] },

      { id: "wal", label: "Append log", type: "queue", pos: [-4, 0, 0], showAt: 1, color: "#fb923c" },
      { id: "n_seq", label: "O(1) sequential append", type: "note", pos: [-4, 3.2, -5], showAt: 1 },

      { id: "mem", label: "Memtable", type: "cache", pos: [-4, 0, -5], showAt: 3 },
      { id: "n_buf", label: "Unsorted in RAM, then sort", type: "note", pos: [-4, 3.2, 4], showAt: 3 },

      { id: "l0", label: "Level 0  (runs of 6)", type: "zone", pos: [6, 0, -4], size: [10, 6], showAt: 4 },
      { id: "c6a", label: "Sorted 6", type: "storage", pos: [3.5, 0, -5.5], showAt: 4 },
      { id: "c6b", label: "Sorted 6", type: "storage", pos: [8.5, 0, -5.5], showAt: 4 },
      { id: "c6c", label: "Sorted 6", type: "storage", pos: [3.5, 0, -2.5], showAt: 5 },
      { id: "c6d", label: "Sorted 6", type: "storage", pos: [8.5, 0, -2.5], showAt: 7 },
      { id: "n_bs", label: "log2(6) ~ 3 probes / chunk", type: "note", pos: [6, 3.4, -7.5], showAt: 5 },
      { id: "n_nine", label: "Key 8: 3 chunks x 3 ~ 9 ops", type: "note", pos: [-8, 3.2, 4], showAt: 5 },

      { id: "comp", label: "Compactor", type: "worker", pos: [-4, 0, 4], showAt: 6 },

      { id: "l1", label: "Level 1  (runs of 12)", type: "zone", pos: [6, 0, 2], size: [10, 4], showAt: 6 },
      { id: "c12a", label: "Sorted 12", type: "storage", pos: [3.5, 0, 2], showAt: 6 },
      { id: "c12b", label: "Sorted 12", type: "storage", pos: [8.5, 0, 2], showAt: 7 },
      { id: "n_m12", label: "Merge 6+6 -> 12 (~4 probes)", type: "note", pos: [6, 3.2, 0], showAt: 6 },

      { id: "l2", label: "Level 2  (run of 24)", type: "zone", pos: [6, 0, 6.5], size: [10, 3], showAt: 8 },
      { id: "c24", label: "Sorted 24", type: "storage", pos: [6, 0, 6.5], showAt: 8 },
      { id: "n_m24", label: "log2(24)~5 vs 4x3=12 ops", type: "note", pos: [-8, 3.2, 7], showAt: 8 },

      { id: "bloom", label: "Bloom filter", type: "service", pos: [-4, 0, 7], showAt: 9, color: "#c084fc" },
      { id: "n_bloom", label: "Skip files that lack the key", type: "note", pos: [-4, 3.2, 7], showAt: 9 }
    ],
    edges: [
      { from: "app", to: "btree", label: "update", showAt: 0 },
      { from: "btree", to: "leaf1", showAt: 0 },
      { from: "btree", to: "leaf2", showAt: 0 },
      { from: "btree", to: "leaf3", showAt: 0 },
      { from: "app", to: "wal", label: "append", showAt: 1 },
      { from: "app", to: "mem", label: "buffer", showAt: 3 },
      { from: "wal", to: "mem", dashed: true, showAt: 3 },
      { from: "mem", to: "c6a", label: "flush", showAt: 4 },
      { from: "mem", to: "c6b", showAt: 4 },
      { from: "mem", to: "c6c", showAt: 5 },
      { from: "c6a", to: "c12a", label: "merge", showAt: 6, dashed: true },
      { from: "c6b", to: "c12a", showAt: 6, dashed: true },
      { from: "comp", to: "c12a", showAt: 6 },
      { from: "c6c", to: "c12b", showAt: 7, dashed: true },
      { from: "c6d", to: "c12b", showAt: 7, dashed: true },
      { from: "c12a", to: "c24", label: "merge", showAt: 8, dashed: true },
      { from: "c12b", to: "c24", showAt: 8, dashed: true },
      { from: "bloom", to: "c24", label: "maybe?", showAt: 9, dashed: true }
    ],
    steps: [
      {
        title: "Random writes in a B+ tree",
        text: "The app updates a B+ tree. Each insert finds a leaf page and rewrites it in place. Leaves sit on different disk locations, so the hardware does slow random I/O.",
        highlight: ["btree", "leaf1", "leaf2", "leaf3"],
        flows: [
          { from: "app", to: "btree", color: "#4ade80", label: "put" },
          { from: "btree", to: "leaf2", color: "#f87171", label: "seek" }
        ]
      },
      {
        title: "Just append a log",
        text: "Flip the design: every write is appended to a sequential log. No leaf hunt, no page split. Sequential bandwidth is the whole point of \"the power of the log.\"",
        highlight: ["wal"],
        hide: ["btree", "leaf1", "leaf2", "leaf3", "n_rand"],
        flows: [
          { from: "app", to: "wal", color: "#4ade80", label: "append" }
        ]
      },
      {
        title: "A raw log makes reads linear",
        text: "Finding one key now means scanning the diary from the start. Writes are cheap; lookups are O(n). We need order on disk without paying for order on every insert.",
        highlight: ["wal", "n_seq"],
        hide: ["btree", "leaf1", "leaf2", "leaf3", "n_rand"],
        flows: [
          { from: "wal", to: "app", color: "#60a5fa", label: "scan" }
        ]
      },
      {
        title: "Buffer in a memtable",
        text: "Writes still append, but into RAM. The memtable soaks up inserts in arrival order. A WAL on disk covers crash recovery. Nothing is sorted yet.",
        highlight: ["mem", "wal"],
        hide: ["btree", "leaf1", "leaf2", "leaf3", "n_rand"],
        flows: [
          { from: "app", to: "mem", color: "#4ade80", label: "put" },
          { from: "app", to: "wal", color: "#fb923c", label: "WAL" }
        ]
      },
      {
        title: "Flush a sorted run of 6",
        text: "When the buffer fills, sort once and dump an immutable chunk of 6 keys. Disk sees one sequential write. Repeat: a second sorted run of 6 lands beside the first.",
        highlight: ["mem", "c6a", "c6b", "l0"],
        hide: ["btree", "leaf1", "leaf2", "leaf3", "n_rand"],
        flows: [
          { from: "mem", to: "c6a", color: "#4ade80", label: "flush" },
          { from: "mem", to: "c6b", color: "#4ade80", label: "flush" }
        ]
      },
      {
        title: "Search key 8 across chunks",
        text: "Each size-6 run binary-searches in ~3 probes. Three chunks means ~9 operations to find record 8 (miss, miss, hit). More flushes would make this worse.",
        highlight: ["c6a", "c6b", "c6c", "n_bs", "n_nine"],
        hide: ["btree", "leaf1", "leaf2", "leaf3", "n_rand"],
        flows: [
          { from: "app", to: "c6a", color: "#60a5fa", label: "key 8" },
          { from: "app", to: "c6b", color: "#60a5fa", label: "miss" },
          { from: "app", to: "c6c", color: "#4ade80", label: "hit" }
        ]
      },
      {
        title: "Merge two 6s into a 12",
        text: "A background compactor merges two sorted arrays in linear time. One run of 12 binary-searches in ~4 probes. Plus the leftover size-6 file: ~7 operations instead of 9.",
        highlight: ["comp", "c12a", "c6c", "n_m12"],
        hide: ["btree", "leaf1", "leaf2", "leaf3", "n_rand"],
        flows: [
          { from: "c6a", to: "c12a", color: "#c084fc", label: "merge" },
          { from: "c6b", to: "c12a", color: "#c084fc", label: "merge" }
        ]
      },
      {
        title: "Another pair of 6s becomes 12",
        text: "Same rule as merge-sort: whenever two blocks share a size, fuse them. A fourth flush of 6 merges with the leftover 6 into a second run of 12.",
        highlight: ["c6c", "c6d", "c12a", "c12b", "comp"],
        hide: ["btree", "leaf1", "leaf2", "leaf3", "n_rand", "c6a", "c6b"],
        flows: [
          { from: "c6c", to: "c12b", color: "#c084fc", label: "merge" },
          { from: "c6d", to: "c12b", color: "#c084fc", label: "merge" }
        ]
      },
      {
        title: "Two 12s become 24",
        text: "Merge the two size-12 runs. log2(24) is ~5 probes. Four unmerged size-6 files would have cost 12. Doubling all the way toward N is the LSM level strategy.",
        highlight: ["c24", "l2", "n_m24", "comp"],
        hide: ["btree", "leaf1", "leaf2", "leaf3", "n_rand", "c6a", "c6b", "c6c", "c6d"],
        flows: [
          { from: "c12a", to: "c24", color: "#c084fc", label: "merge" },
          { from: "c12b", to: "c24", color: "#c084fc", label: "merge" }
        ]
      },
      {
        title: "Bloom filters skip cold files",
        text: "A RAM Bloom filter asks \"could this key be in that run?\" Definite no means skip the binary search. LSM: append in memory, flush sorted, compact like merge-sort, probe only plausible files.",
        highlight: ["bloom", "c24", "mem", "wal"],
        hide: ["btree", "leaf1", "leaf2", "leaf3", "n_rand", "c6a", "c6b", "c6c", "c6d", "c12a", "c12b"],
        flows: [
          { from: "app", to: "bloom", color: "#60a5fa", label: "key?" },
          { from: "bloom", to: "c24", color: "#60a5fa", label: "maybe" }
        ]
      }
    ]
  }
});
