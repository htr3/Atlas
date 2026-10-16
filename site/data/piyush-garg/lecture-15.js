window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 15,
  title: "Apache Kafka Crash Course | What is Kafka?",
  video: "https://www.youtube.com/watch?v=ZJJHm_bd9Zo",
  category: "Piyush Garg",
  tagline: "Databases have low throughput; Kafka has high throughput. Use them together: absorb the firehose, then bulk insert.",
  summary: "Live rider tracking (Zomato), Uber driver feeds and a 57k-member Discord server all produce data every second. Writing each event straight into a database overloads its operations per second and adds insert latency. Kafka is built for very high throughput but keeps data only temporarily and can't be queried like a database, so it sits in front of the database rather than replacing it. Producers write to topics, topics split into indexed partitions, and consumers read, process, and bulk insert. Within a consumer group, Kafka auto-balances partitions across consumers. A partition goes to only one consumer per group, so extra consumers sit idle. Separate groups each get every message, so the same cluster can act as a queue or as pub/sub. Zookeeper coordinates the broker, and kafkajs provides the admin, producer and consumer clients.",

  theory: [
    {
      heading: "The problem: database throughput",
      body: "In the Zomato live-tracking case, the rider's phone reads its location every second and sends it to the server. The server inserts <code>(time, location)</code> into the database, for later analytics such as total delivery time, and pushes the update to the customer. That's fine for one rider. Across India there are hundreds of thousands of riders, each sending an update every second. <b>Throughput</b> is how many operations a system can pass per unit of time, and a database's is low. Push 100+ inserts per second into one SQL database and it falls over. Discord has the same issue: with 57k people online in one server, every message is inserted and then broadcast. Each insert also costs time (around 200 ms, say), so delivery is no longer real time. For Uber, 1,000 drivers feeding 3 services (fare, analytics, customer view) is already 3,000 operations per second.",
      bullets: [
        "Many writes per second can take the database down.",
        "Insert latency on the hot path breaks real time.",
        "The problem multiplies when several services each consume the same feed."
      ]
    },
    {
      heading: "Kafka vs a database: not alternatives",
      body: "Kafka has <b>very high throughput</b>: it can move millions of records in and out without falling over. But its <b>storage is temporary and low</b>. It doesn't hold data for long, and you can't query it the way you query a database with B-tree indexes. A database is the opposite: low throughput, but huge durable storage (billions of rows) and fast indexed queries. Kafka alone would lose the data, and a database alone can't take the write rate. So they are <b>plugged together</b>. Kafka absorbs the firehose, and the database keeps the durable, queryable copy."
    },
    {
      heading: "Producers, consumers and bulk inserts",
      body: "Things that write into Kafka are <b>producers</b>: 1 lakh (100,000) cars emitting speed and location every second, or a rider's app. Things that read are <b>consumers</b>: a fare service, an analytics service, a customer-facing service. Even the customer screen showing live location is a consumer. A consumer pulls a batch, does its calculation, and writes the result in <b>one bulk insert</b>. 100,000 records produced in a second become one transaction. Even if that bulk insert takes 2 seconds, it's fine, because the database sees one operation instead of 100,000."
    },
    {
      heading: "Topics and partitions",
      body: "A <b>topic</b> is a logical partitioning of messages, like separate WhatsApp groups for family and for sales. Zomato might have <code>rider-updates</code> and <code>hotel-updates</code>. The producer names the topic for each message, and consumers subscribe to topics. A busy topic is split further into <b>partitions</b>, indexed 0, 1, 2, 3, just as you would shard a database. The split key is your choice: region (North / South India), user name, and so on. Choose a key that spreads load at all times. Don't split by time of day, or one partition takes all the morning traffic. The producer holds the logic, for example north goes to partition 0 and south to partition 1."
    },
    {
      heading: "Consumer auto-balancing",
      body: "Kafka assigns partitions to consumers automatically. With 4 partitions and 1 consumer, that consumer reads all 4. Add a second, and it rebalances to 2 each. With 3, it's 2/1/1. With 4, each gets 1. Add a <b>5th</b> and it sits <b>idle</b>, because there are only 4 partitions. The rule is that one consumer can read many partitions, but <b>one partition can't be read by two consumers in the same group</b>.",
      bullets: [
        "You can't scale consumers beyond the partition count. Plan the partition count up front.",
        "Rebalancing is automatic and outside your control."
      ]
    },
    {
      heading: "Consumer groups: queue and pub/sub in one",
      body: "Every consumer belongs to a <b>group</b>, and balancing happens <b>per group</b>. If group 1 has 4 consumers on 4 partitions and group 2 has 1 consumer, group 1 splits them 1:1 while group 2's single consumer still receives all 4 partitions. A <b>queue</b> (FIFO, like RabbitMQ or SQS) delivers each message to one consumer. <b>Pub/sub</b> delivers one message to many subscribers, like a channel and its subscribers. Kafka can do both. Set the consumers in one group equal to the partition count and you get queue semantics. Add more groups and every group receives each message, which is pub/sub."
    },
    {
      heading: "Running it: Zookeeper, broker, kafkajs",
      body: "Kafka uses <b>Zookeeper</b> internally to coordinate partitions, replicas and consumer rebalancing. Start it with <code>docker run -p 2181:2181 zookeeper</code>. Then start Kafka (the <b>broker</b>) on <code>9092</code> using the <code>confluentinc/cp-kafka</code> image. Set <code>KAFKA_ZOOKEEPER_CONNECT=&lt;your-ip&gt;:2181</code>, <code>KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://&lt;your-ip&gt;:9092</code> and <code>KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1</code>. In Node, <code>kafkajs</code> provides three roles:",
      bullets: [
        "<b>Admin</b> (infra setup): <code>kafka.admin()</code>, then <code>connect()</code> and <code>createTopics({ topics: [{ topic: 'rider-updates', numPartitions: 2 }] })</code>.",
        "<b>Producer</b>: <code>producer.send({ topic, messages: [{ key: 'location-update', value: JSON.stringify({ name, loc }), partition: loc === 'north' ? 0 : 1 }] })</code>.",
        "<b>Consumer</b>: <code>kafka.consumer({ groupId })</code>, then <code>subscribe({ topic, fromBeginning: true })</code> and <code>run({ eachMessage })</code>. The value is a Buffer, so call <code>message.value.toString()</code>."
      ]
    }
  ],

  keyTerms: [
    { term: "Throughput", def: "How many operations or how much data a system can pass per unit of time." },
    { term: "Broker", def: "A running Kafka server (default port 9092) that stores topics and serves clients." },
    { term: "Producer", def: "A client that writes messages to a topic and can choose the partition." },
    { term: "Consumer", def: "A client that subscribes to topics, processes messages and often bulk-writes to a database." },
    { term: "Topic", def: "A named logical stream of messages, e.g. rider-updates." },
    { term: "Partition", def: "An indexed (0, 1, 2…) split of a topic, chosen by a key such as region." },
    { term: "Consumer group", def: "A set of consumers that share a topic's partitions. Balancing happens per group." },
    { term: "Rebalancing", def: "Kafka automatically reassigning partitions when consumers join or leave a group." },
    { term: "Zookeeper", def: "A coordination service (port 2181) that Kafka uses to manage partitions, replicas and groups." },
    { term: "fromBeginning", def: "A consumer option to read a topic from the start instead of only new messages." }
  ],

  tradeoffs: [
    { pro: "Kafka absorbs huge write rates without falling over.", con: "Short retention and no rich queries, so you still need a database." },
    { pro: "Bulk inserts turn thousands of writes into one transaction.", con: "The database lags slightly behind the live stream." },
    { pro: "Partitions spread load and allow parallel consumers.", con: "Consumers beyond the partition count sit idle." },
    { pro: "Consumer groups provide both queue and pub/sub semantics.", con: "Requires understanding group-level balancing rules." },
    { pro: "Automatic rebalancing when consumers join or leave.", con: "Assignment is out of your control, and a bad partition key creates hot partitions." }
  ],

  interviewTips: [
    "For live-location or chat feeds, explain why per-event database inserts fail (operations per second and latency) before you introduce Kafka.",
    "Say clearly that Kafka is not a database replacement: it is high throughput with temporary storage, so pair it with a durable store.",
    "Justify your partition key (region, user id) and warn against time-based keys that create hot partitions.",
    "State the group rule: one partition goes to only one consumer per group, so the maximum parallelism equals the partition count.",
    "Show how groups give queue semantics (one group) or pub/sub (many groups) on the same topic."
  ],

  scene: {
    nodes: [
      { id: "rider", label: "Rider phone (producer)", type: "phone", pos: [-12, 0, -1] },
      { id: "app", label: "Zomato server", type: "server", pos: [-6, 0, -6.5] },
      { id: "db", label: "Postgres", type: "db", pos: [11.8, 0, -6.5] },
      { id: "nOps", label: "1 insert / rider / sec", type: "note", pos: [11.8, 0, -8.8] },

      { id: "kafka", label: "Kafka broker :9092", type: "zone", pos: [-1, 0, 2.5], size: [8, 12], showAt: 2 },
      { id: "nTopic", label: "topic: rider-updates", type: "note", pos: [-1, 0, -2.6], showAt: 2 },
      { id: "p0", label: "P0 · North", type: "queue", pos: [-1, 0, -1], showAt: 2, color: "#fb923c" },
      { id: "p1", label: "P1 · South", type: "queue", pos: [-1, 0, 1.5], showAt: 2, color: "#fb923c" },
      { id: "p2", label: "P2 · East", type: "queue", pos: [-1, 0, 4], showAt: 4, color: "#fb923c" },
      { id: "p3", label: "P3 · West", type: "queue", pos: [-1, 0, 6.5], showAt: 4, color: "#fb923c" },
      { id: "nKafka", label: "high throughput, short retention", type: "note", pos: [-1, 0, 9.4], showAt: 2 },

      { id: "g1", label: "Group 1", type: "zone", pos: [6.5, 0, 3.6], size: [4.5, 12.4], showAt: 8 },
      { id: "c1", label: "Consumer 1", type: "worker", pos: [6.5, 0, -1], showAt: 3 },
      { id: "c2", label: "Consumer 2", type: "worker", pos: [6.5, 0, 1.5], showAt: 6 },
      { id: "c3", label: "Consumer 3", type: "worker", pos: [6.5, 0, 4], showAt: 6 },
      { id: "c4", label: "Consumer 4", type: "worker", pos: [6.5, 0, 6.5], showAt: 6 },
      { id: "c5", label: "Consumer 5 (idle)", type: "worker", pos: [6.5, 0, 8.6], showAt: 7 },
      { id: "nIdle", label: "1 partition → 1 consumer per group", type: "note", pos: [11.8, 0, 8.6], showAt: 7 },

      { id: "g2", label: "Group 2", type: "zone", pos: [11.8, 0, 2.75], size: [4, 4], showAt: 8 },
      { id: "c6", label: "Consumer (all 4)", type: "worker", pos: [11.8, 0, 2.75], showAt: 8 },

      { id: "zk", label: "Zookeeper :2181", type: "service", pos: [-1, 0, -7.5], showAt: 9, color: "#a3e635" },
      { id: "nCode", label: "admin · producer · consumer (kafkajs)", type: "note", pos: [-7.5, 0, -9] , showAt: 9 }
    ],
    edges: [
      { from: "rider", to: "app" },
      { from: "app", to: "db", label: "insert every sec" },
      { from: "c1", to: "db", label: "bulk insert", showAt: 3 },
      { from: "zk", to: "p0", dashed: true, label: "coordinates", showAt: 9 }
    ],
    steps: [
      {
        title: "Naive live tracking",
        text: "Every second the rider's phone sends its location to the Zomato server. The server inserts it into the database for analytics, then pushes it to the customer. This is simple and works for one rider.",
        highlight: ["rider", "app", "db"],
        flows: [
          { from: "rider", to: "app", color: "#60a5fa", label: "location / sec" },
          { from: "app", to: "db", color: "#60a5fa", label: "INSERT" }
        ]
      },
      {
        title: "Database throughput collapses",
        text: "Hundreds of thousands of riders each insert every second. The database has low throughput: its operations per second spike and it goes down. Insert latency (around 200 ms) also stops the feed being real time. Discord chat and Uber's 3-services-per-driver feed hit the same wall.",
        fail: ["db"],
        highlight: ["nOps", "app"],
        flows: [{ from: "app", to: "db", color: "#f87171", label: "100k+ ops/s" }]
      },
      {
        title: "Put Kafka in front",
        text: "Kafka has very high throughput, so the firehose goes into it instead. It holds data only temporarily and can't be queried like a database. It works alongside the database, not as a replacement.",
        highlight: ["kafka", "nKafka", "p0", "p1"],
        hide: ["app"],
        flows: [{ from: "rider", to: "p0", color: "#fb923c", label: "produce" }]
      },
      {
        title: "Consumers bulk insert",
        text: "A consumer pulls a batch from Kafka, processes it, and writes it in one bulk insert. 100k records become one transaction. Even if it takes 2 seconds, the database is happy.",
        highlight: ["c1", "db"],
        hide: ["app"],
        flows: [
          { from: "p0", to: "c1", color: "#fb923c" },
          { from: "c1", to: "db", color: "#4ade80", label: "1 bulk insert" }
        ]
      },
      {
        title: "Topics split into partitions",
        text: "A topic like rider-updates is a logical stream. It splits into indexed partitions 0–3 by a key you choose, here region. The producer decides: north goes to P0, south to P1. Avoid time-based keys that send all morning traffic to one partition.",
        highlight: ["nTopic", "p0", "p1", "p2", "p3"],
        hide: ["app"],
        flows: [
          { from: "rider", to: "p0", color: "#fb923c", label: "north" },
          { from: "rider", to: "p1", color: "#facc15", label: "south" }
        ]
      },
      {
        title: "One consumer reads everything",
        text: "With a single consumer, Kafka auto-balances by giving it all four partitions. One consumer can read many partitions.",
        highlight: ["c1", "p0", "p1", "p2", "p3"],
        hide: ["app"],
        flows: [
          { from: "p0", to: "c1", color: "#fb923c" },
          { from: "p1", to: "c1", color: "#fb923c" },
          { from: "p2", to: "c1", color: "#fb923c" },
          { from: "p3", to: "c1", color: "#fb923c" }
        ]
      },
      {
        title: "Add consumers, Kafka rebalances",
        text: "Add a second consumer and it splits 2/2. A third gives 2/1/1, and with four consumers each gets exactly one partition. Rebalancing is automatic.",
        highlight: ["c1", "c2", "c3", "c4"],
        hide: ["app"],
        flows: [
          { from: "p0", to: "c1", color: "#fb923c" },
          { from: "p1", to: "c2", color: "#fb923c" },
          { from: "p2", to: "c3", color: "#fb923c" },
          { from: "p3", to: "c4", color: "#fb923c" }
        ]
      },
      {
        title: "A 5th consumer sits idle",
        text: "There are only 4 partitions. A partition can't be shared by two consumers in the same group, so consumer 5 gets nothing. Maximum parallelism equals the partition count.",
        fail: ["c5"],
        highlight: ["nIdle"],
        hide: ["app"],
        flows: [
          { from: "p0", to: "c1", color: "#fb923c" },
          { from: "p3", to: "c4", color: "#fb923c" }
        ]
      },
      {
        title: "Consumer groups: queue + pub/sub",
        text: "Balancing happens per group. Group 1 splits partitions 1:1, which gives queue semantics. Group 2's single consumer still receives all four, so every group gets every message, which is pub/sub. The same cluster can act as either.",
        highlight: ["g1", "g2", "c6"],
        hide: ["app"],
        flows: [
          { from: "p0", to: "c1", color: "#fb923c" },
          { from: "p1", to: "c2", color: "#fb923c" },
          { from: "p0", to: "c6", color: "#c084fc" },
          { from: "p1", to: "c6", color: "#c084fc" },
          { from: "p2", to: "c6", color: "#c084fc" },
          { from: "p3", to: "c6", color: "#c084fc" }
        ]
      },
      {
        title: "Run it: Zookeeper + kafkajs",
        text: "Zookeeper (port 2181) coordinates partitions, replicas and rebalancing. The broker runs on 9092 via Docker. In kafkajs, admin creates rider-updates with 2 partitions, the producer sends with a partition chosen by region, and consumers join a groupId and subscribe with fromBeginning.",
        highlight: ["zk", "kafka", "nCode"],
        hide: ["app", "c5", "nIdle"],
        flows: [
          { from: "rider", to: "p1", color: "#facc15", label: "producer.send" },
          { from: "p1", to: "c2", color: "#fb923c", label: "eachMessage" }
        ]
      }
    ]
  }
});
