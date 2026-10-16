window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 35,
  title: "Kafka Retention and Compaction",
  category: "Kafka",
  tagline: "Time-based retention forgets old records. Compaction keeps the latest value for each key.",
  summary: "A Kafka log is not a queue that vanishes when you read it. Retention decides how long records stay so other consumers, and you, can replay them. Delete policy drops whole segments older than a time or size. Compact policy keeps the latest record per key and drops older values of that key, which is how a changelog stays bounded. Tombstones are how a compacted topic eventually forgets a key. Replay is safe only if consumers can rebuild from what the log still holds.",

  theory: [
    {
      heading: "The log stays after the consumer moves on",
      body: "A consumer's offset is a bookmark. Advancing it does not delete the record. Another consumer group, or the same group after you reset offsets, can read history until <b>retention</b> removes it. That is why Kafka can feed a database, a search index, and an audit job from one topic. It is also why \"we processed it\" is not \"it is gone.\" Disk fills up if retention is forever and the topic is an event firehose.",
      bullets: [
        "Offsets are readers' progress. Retention is the log's lifetime.",
        "Two groups on one topic do not steal records from each other.",
        "A brand-new consumer starts at the earliest retained offset, or at the latest, depending on auto.offset.reset — not at the beginning of time."
      ]
    },
    {
      heading: "Delete by time or size",
      body: "<code>cleanup.policy=delete</code> removes old <b>segments</b> once they are older than <code>retention.ms</code> or the partition is over <code>retention.bytes</code>. A segment is a file of records, not one record, so deletion is chunky: you do not drop a single message in the middle. Seven days is a common default and a terrible default for a high-volume log you only needed for an hour, or for an audit topic you needed for a year. Set it from the replay story. If a bug lasts three days and retention is one day, you cannot rebuild.",
      bullets: [
        "Shorter retention, less disk, less ability to replay.",
        "Size and time can both be set. Crossing either bound makes segments eligible.",
        "Active consumers do not pin data. A slow consumer can fall off the front of the log and have to skip or reset."
      ]
    },
    {
      heading: "Compaction keeps the latest key",
      body: "<code>cleanup.policy=compact</code> is for data keyed by an id: user 9's current address, the current config, a product snapshot. The cleaner deletes older records whose key has a newer record, and keeps the latest. The topic stays roughly the size of the keyspace, not the size of every change ever. Order of different keys is not a story you should rely on after compaction. Order of updates for one key is: you see the latest, and you may have missed intermediates if they were cleaned before you read them. Use compaction for \"current state.\" Use delete-retention for \"every event.\"",
      bullets: [
        "Keys are required. A null key is not a compacted identity.",
        "Compaction is asynchronous. You will briefly see more than the latest value.",
        "You can combine policies (compact,delete) so tombstones and ancient segments eventually go."
      ]
    },
    {
      heading: "Tombstones and replay",
      body: "To remove a key from a compacted topic you write a record with that key and a <b>null value</b>, a tombstone. After the cleaner runs, the key is gone. Tombstones themselves are retained for <code>delete.retention.ms</code> so consumers that are a bit behind still observe the delete. Replay means \"read what is still in the log and rebuild.\" For a compacted topic, rebuild produces current state, not history. For a deleted topic, rebuild starts at the oldest remaining segment. If your consumer cannot be recreated from that, retention is too short or you compacted a stream you needed whole."
    }
  ],

  keyTerms: [
    { term: "Retention", def: "How long or how much log the brokers keep, independent of consumer offsets." },
    { term: "Segment", def: "A file of records in a partition. Retention deletes old segments, not arbitrary single records." },
    { term: "Compaction", def: "Cleanup that keeps the latest record for each key and drops older records with that key." },
    { term: "Tombstone", def: "A record with a key and a null value, telling a compacted topic to forget that key." },
    { term: "Replay", def: "Reading retained history again, usually by resetting offsets, to rebuild a consumer's state." }
  ],

  tradeoffs: [
    { pro: "Long retention lets you rebuild a buggy consumer from the log.", con: "You pay disk for every byte, and a firehose retained for months is an operations problem." },
    { pro: "Compaction bounds a changelog to the size of the keyspace.", con: "Intermediate updates disappear, so it is the wrong policy for an audit of every change." },
    { pro: "Consumers are decoupled: reading does not delete.", con: "A consumer slower than retention loses its place and skips data." },
    { pro: "Tombstones can delete a key without a second system.", con: "Until the cleaner runs, readers still see the old value and the tombstone is easy to mishandle." }
  ],

  interviewTips: [
    "Separate offset commit from retention. Reading a record does not remove it.",
    "delete drops old segments by time or size. compact keeps the latest record per key.",
    "Use delete for events you may need to replay in full. Use compact for current state.",
    "A null value is a tombstone, not a record you forgot to fill in.",
    "Ask how long a bug can live before you notice. Retention must be longer than that if replay is the repair."
  ],

  scene: {
    nodes: [
      { id: "log", label: "Partition", type: "queue", pos: [-2, 0, 0] },
      { id: "c1", label: "Orders group", type: "worker", pos: [-8, 0, -2.5] },
      { id: "c2", label: "Search group", type: "worker", pos: [-8, 0, 2.5] },
      { id: "old", label: "Old segments", type: "storage", pos: [3.5, 0, -3], showAt: 2 },
      { id: "keys", label: "Latest per key", type: "db", pos: [3.5, 0, 3], showAt: 3 },
      { id: "n0", label: "Read does not delete", type: "note", pos: [0, 0, -6.8] },
      { id: "n1", label: "Null value deletes", type: "note", pos: [8, 0, 0], showAt: 4 }
    ],
    edges: [
      { from: "log", to: "c1", label: "offset 40" },
      { from: "log", to: "c2", label: "offset 12" },
      { from: "log", to: "old", label: "age out", showAt: 2, dashed: true },
      { from: "log", to: "keys", label: "compact", showAt: 3 }
    ],
    steps: [
      {
        title: "Two groups, one log",
        text: "The orders consumer is at offset 40. Search is at 12. Neither read deletes the records. Both are bookmarks on a log that still holds the prefix.",
        highlight: ["log", "c1", "c2", "n0"],
        flows: [
          { from: "log", to: "c1", color: "#4ade80", label: "40" },
          { from: "log", to: "c2", color: "#60a5fa", label: "12" }
        ]
      },
      {
        title: "Restart does not start from zero forever",
        text: "Resetting a group replays whatever retention still holds. auto.offset.reset only matters when the saved offset is gone. The log is the limit, not the consumer.",
        highlight: ["log", "c2"],
        flows: [{ from: "log", to: "c2", color: "#facc15", label: "replay" }]
      },
      {
        title: "Delete drops old segments",
        text: "cleanup.policy=delete removes segments past retention.ms or retention.bytes. A consumer still at offset 12 is in trouble if that segment is the one removed. It has fallen off the log.",
        highlight: ["log", "old", "c2"],
        flows: [{ from: "log", to: "old", color: "#f87171", label: "drop" }]
      },
      {
        title: "Compact keeps the latest key",
        text: "On a compacted topic, older addresses for user 9 are removed once a newer address for user 9 exists. The topic tracks current state. It does not keep every edit.",
        highlight: ["log", "keys"],
        flows: [{ from: "log", to: "keys", color: "#c084fc", label: "latest" }]
      },
      {
        title: "A tombstone forgets the key",
        text: "A record with user 9 and a null value is a delete. After the cleaner and delete.retention.ms, consumers no longer see user 9. Replay of this topic rebuilds a snapshot, not the history.",
        highlight: ["keys", "log", "n1"],
        flows: [{ from: "log", to: "keys", color: "#fb923c", label: "tombstone" }]
      }
    ]
  }
});
