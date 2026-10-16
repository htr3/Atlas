window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "concepts",
  id: 36,
  title: "Schema Registry",
  category: "Kafka",
  tagline: "The bytes on the topic are not the contract. A registry checks the schema before a new field breaks every consumer.",
  summary: "Producers and consumers in different repos drift. A schema registry stores the versioned contract (Avro, Protobuf, or JSON Schema) and rejects a publish that is incompatible with what readers expect. The record on Kafka carries a schema id, not the whole schema, and the consumer looks the id up. Backward compatibility means new code can read old data, so consumers ship first. Forward compatibility means old code can read new data, so producers ship first. You pick one and enforce it, or the topic becomes a private encoding.",

  theory: [
    {
      heading: "JSON in the topic is a rumor",
      body: "A producer adds a field, renames one, or changes a number to a string. Consumers written last quarter throw, or worse, silently drop the message. The topic has no idea. A <b>schema</b> is the agreed shape: field names, types, and which fields may be missing. The registry is the service that stores those schemas and answers \"is this new version allowed?\" Putting the contract in a wiki does not stop the publish.",
      bullets: [
        "Avro, Protobuf, and JSON Schema are the usual languages. The registry idea is the same.",
        "The subject is typically the topic name, plus a suffix for the key or the value.",
        "Producers fail the send if registration or the compatibility check fails. That failure is the feature."
      ]
    },
    {
      heading: "Store an id, not the schema, on every record",
      body: "The producer registers the schema (or reuses one) and receives a numeric <b>schema id</b>. The bytes written to Kafka are the id plus the payload. Consumers cache id → schema. You are not repeating a full Avro document on every order, and a reader can still decode a record written last year if that id is still in the registry. The registry is now on the critical path for a cold consumer. Run it like one: more than one instance, and a backup of its topic or database.",
      bullets: [
        "The log stays compact. The registry holds the text of the schema.",
        "An unknown id is a consumer error, not a cue to guess the JSON.",
        "Key and value can have different schemas. Do not assume the key is a raw string once you have evolved it."
      ]
    },
    {
      heading: "Compatibility is the actual rule",
      body: "Compatibility is a rule about deploy order, and the names are easy to swap. <b>BACKWARD</b> means a consumer on the new schema can still read bytes written by the old one. You may add a field that has a default, and you may remove a field. Deploy consumers first, then producers. <b>FORWARD</b> means a consumer still on the old schema can read bytes written by the new one. You may add a field, and you may remove a field only if the old schema can live without it. Deploy producers first. <b>FULL</b> is both, and it is the mode to pick when you do not control which side ships first. If you cannot say the order, you do not have a compatibility mode yet.",
      bullets: [
        "BACKWARD: upgrade consumers before producers. New readers tolerate old bytes.",
        "FORWARD: upgrade producers before consumers. Old readers tolerate new bytes.",
        "FULL: either order. The strictest, and the one to use when you do not control deploy order."
      ]
    },
    {
      heading: "What the registry will not do",
      body: "It will not make a database migration for you, and it will not stop a consumer that ignores the schema and parses bytes by hand. It will not version your REST API. It checks the records that pass through it. A breaking change you need anyway is a new topic (orders-v2), not a forced incompatible update on the live subject. Dual-publish during the move, then retire the old topic once its retention and its consumers are done."
    }
  ],

  keyTerms: [
    { term: "Schema registry", def: "A service that stores versioned schemas and rejects incompatible updates for a subject." },
    { term: "Schema id", def: "The integer written with the Kafka record. Consumers resolve it to the full schema." },
    { term: "Backward compatibility", def: "New consumers can read data produced by the previous schema. Deploy readers first." },
    { term: "Forward compatibility", def: "Old consumers can read data produced by the new schema. Deploy writers first." },
    { term: "Subject", def: "The named stream of schema versions, usually tied to a topic's key or value." }
  ],

  tradeoffs: [
    { pro: "A breaking field fails at publish time, in the producer, not in every consumer at 2 a.m.", con: "The registry is another dependency, and a down registry blocks new producers that must register." },
    { pro: "Schema ids keep payloads small and decodable later.", con: "Lose the registry's storage and the bytes on the topic are opaque." },
    { pro: "BACKWARD lets you roll consumers, then producers, without a flag day.", con: "Teams who memorize the rule backwards will ship the producer first and still break readers." },
    { pro: "A new topic is a clean break when compatibility cannot hold.", con: "Dual-publishing costs double the write path until you finish the move." }
  ],

  interviewTips: [
    "The record carries a schema id. The registry carries the schema.",
    "Define BACKWARD as new code reading old data, and say consumers deploy first.",
    "FORWARD is old code reading new data, producers first. FULL is both.",
    "An incompatible change gets a new topic, not a forced overwrite.",
    "The registry must be highly available and backed up, or the log cannot be decoded."
  ],

  scene: {
    nodes: [
      { id: "prod", label: "Producer", type: "service", pos: [-9, 0, 0] },
      { id: "reg", label: "Registry", type: "db", pos: [-4, 0, -3.2] },
      { id: "log", label: "Topic", type: "queue", pos: [-1, 0, 1.5] },
      { id: "cons", label: "Consumer", type: "worker", pos: [4.5, 0, 1.5], showAt: 3 },
      { id: "n0", label: "Check, then append", type: "note", pos: [-4, 0, -7] },
      { id: "n1", label: "Consumers first", type: "note", pos: [6, 0, -6], showAt: 2 }
    ],
    edges: [
      { from: "prod", to: "reg", label: "schema?" },
      { from: "prod", to: "log", label: "id + bytes", showAt: 1 },
      { from: "cons", to: "reg", label: "lookup id", showAt: 3 },
      { from: "log", to: "cons", showAt: 3 }
    ],
    steps: [
      {
        title: "Ask before you publish",
        text: "The producer submits its schema. The registry checks it against the subject's compatibility. An illegal change fails here, and nothing is written to the topic.",
        highlight: ["prod", "reg", "n0"],
        flows: [{ from: "prod", to: "reg", color: "#facc15", label: "check" }]
      },
      {
        title: "Write the id, not the document",
        text: "The registry returns a schema id. The producer appends that id plus the payload. Later readers do not need the schema repeated on every record.",
        highlight: ["prod", "reg", "log"],
        flows: [{ from: "prod", to: "log", color: "#4ade80", label: "id+bytes" }]
      },
      {
        title: "Backward means readers go first",
        text: "Under BACKWARD compatibility, deploy consumers that understand the new schema before producers start writing it. New readers can still decode the old bytes already on the log.",
        highlight: ["cons", "reg", "n1"],
        flows: [{ from: "cons", to: "reg", color: "#60a5fa", label: "new reader" }]
      },
      {
        title: "The consumer resolves the id",
        text: "It reads the record, looks up the id (and caches it), and decodes. An unknown id is a hard error. Guessing the JSON is how the registry got bypassed.",
        highlight: ["log", "cons", "reg"],
        flows: [
          { from: "log", to: "cons", color: "#c084fc", label: "fetch" },
          { from: "cons", to: "reg", color: "#60a5fa", label: "id" }
        ]
      },
      {
        title: "A real break is a new topic",
        text: "If you must change a field in a way no mode allows, publish orders-v2 alongside the old topic. Do not force an incompatible schema onto the live subject.",
        highlight: ["prod", "log", "reg"],
        flows: [{ from: "prod", to: "log", color: "#fb923c", label: "v2" }]
      }
    ]
  }
});
