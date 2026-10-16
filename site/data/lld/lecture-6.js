window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "lld",
  id: 6,
  title: "Google low level system design question - Part 1 - Implement a logger",
  video: "https://www.youtube.com/watch?v=FKA2KgkkcqY",
  category: "Low-Level Design",
  tagline: "Poll prints the oldest-started process — but only after it ends, in O(log n).",
  summary: "A Google LLD: LogClient with start(id), end(id), and poll(). Poll must print the earliest-started process that has finished, and must wait if that process is still running — even if a newer one already ended. Part 1 is the algorithm: a Process object, a HashMap for O(1) end, and a TreeMap (or heap) keyed by start time so start and poll stay O(log n). Concurrency is the sequel.",

  theory: [
    {
      heading: "The three methods and the example",
      body: "Implement a log class that is really an aggregator. <code>start(processId)</code> and <code>end(processId)</code> are listeners. <code>poll()</code> looks at the <b>earliest started</b> process and prints it only once that process has an end time. Until then poll blocks (or returns without printing). Example: process 3 starts at 7, 2 at 8, 1 at 12. Ends: 3 at 19, 2 at 12, 1 at 15. First successful poll prints \"3 started at 7 ended at 19\", then 2, then 1. A short job that started later does not jump the queue.",
      bullets: [
        "Output is a print to stdout (void), not a returned string.",
        "Start times in the lecture are injected, not always System.currentTimeMillis.",
        "Google-style: a small API with a lot of room to deepen (concurrency, tests) later."
      ]
    },
    {
      heading: "Process and LogClient",
      body: "<code>Process</code>: final String id, final long startTime, long endTime (sentinel <code>-1</code> until end). Constructed on start. <code>LogClient</code> is the interface; <code>LoggerImplementation</code> implements start, end, poll. Pass startTime in so tests can inject a <b>Timer</b> instead of the wall clock — dependency injection mentioned even while they temporarily hard-code millis under interview pressure.",
      bullets: [
        "id and startTime never change; endTime is set once.",
        "Processes may be called tasks in some statements of the problem.",
        "Initialize endTime to -1 or poll thinks every new process is already done (they hit this NPE/bug live)."
      ]
    },
    {
      heading: "Why one structure is never enough",
      body: "A <b>List</b>: start is append, end is a linear scan. A <b>HashMap&lt;id, Process&gt;</b>: start/end O(1), poll is O(n) because a hashmap has no order. A <b>TreeMap on id</b>: firstEntry is the smallest id, not the oldest start (3 started before 1). A <b>heap alone</b>: poll of the minimum start is fast, end cannot find an id without O(n). You want all three of start, end, poll at worst O(log n).",
      bullets: [
        "TreeMap is a red-black tree: every op is O(log n), not O(1) just because it is named Map.",
        "Process must be ordered by startTime, so the TreeMap key is the timestamp (or a comparator), not the id string.",
        "A heap + map is the same idea; they used TreeMap as a sorted queue for convenience."
      ]
    },
    {
      heading: "HashMap plus a start-time queue",
      body: "Keep <code>Map&lt;String, Process&gt; processes</code> and a <code>TreeMap&lt;Long, Process&gt;</code> (or PriorityQueue) ordered by start time. <b>start:</b> create Process with the same timestamp, put in the hashmap, put in the queue — O(log n). <b>end:</b> hashmap get, setEndTime. You do <i>not</i> re-insert into the queue: both structures hold the <b>same object reference</b>, so the queue already sees the new end time. <b>poll:</b> peek the first entry; if endTime is set, print, remove from both; if not, leave it in memory (\"no completed tasks\"); if the queue is empty, return. Never poll a completed-but-younger process while an older one is still running.",
      bullets: [
        "Chat split 50/50 on \"must end update the queue?\" — no, because of shared references.",
        "A process started 10 hours ago still blocks a 1-hour job that already finished.",
        "Guard empty queue or firstEntry is null and you NPE."
      ]
    },
    {
      heading: "Complexities and what part 1 refuses to solve",
      body: "start O(log n) (tree insert), end O(1) (hashmap set), poll O(log n) (tree delete). That is ~60% of the Google question for a fresher: the algorithmic design. Remaining: <b>concurrency</b> (start/end/poll mutate the same map and tree; a class-wide mutex is just single-threaded; wait/notify so poll does not spin) and <b>tests</b> (mock Timer). Part 2 is aimed at SD2/SD3. Mention the holes even if you lack time to code them. LLD here is algorithms + engineering + a bit of HLD, which is why they call it the hardest round. You do code — not only boxes — and a machine-coding slot may expect a happy path that compiles.",
      bullets: [
        "Global lock: correct, kills parallelism.",
        "No lock: the current classes will break under races.",
        "poll blocking without wasting CPU is a mutex/condition question, not a TreeMap question."
      ]
    }
  ],

  keyTerms: [
    { term: "LogClient", def: "Interface with start, end, and poll; poll prints rather than returning a value." },
    { term: "Process", def: "id, immutable startTime, endTime defaulting to -1 until end()." },
    { term: "Earliest started", def: "Poll order is start time, not end time; later finishing jobs still wait their turn." },
    { term: "HashMap + TreeMap", def: "O(1) id lookup plus a sorted queue of start times; heap + map is equivalent." },
    { term: "Shared reference", def: "end() mutates the Process object both map and queue already point at." },
    { term: "Timer injection", def: "Pass clocks in so tests do not sleep on System.currentTimeMillis." },
    { term: "O(log n) budget", def: "Target complexity for start and poll; end stays O(1) by skipping the tree." },
    { term: "Part 2", def: "Concurrency and tests for this logger, aimed at SD2/SD3." }
  ],

  tradeoffs: [
    { pro: "List: trivial start.", con: "end is O(n); interviewers will not accept that." },
    { pro: "HashMap only: O(1) end.", con: "poll scans everything; no notion of earliest start." },
    { pro: "TreeMap on id: ordered map you already know.", con: "Orders by process id, so 1 prints before 3 even if 3 started first." },
    { pro: "Heap + map, or TreeMap + map: all three ops ≤ O(log n).", con: "Two structures to keep in sync; empty-queue and -1 sentinels are easy bugs." },
    { pro: "Skip queue update on end: one less write, still correct via aliases.", con: "If you ever copied Process by value, poll would spin forever on endTime = -1." }
  ],

  interviewTips: [
    "Restate poll: print the oldest start among completed processes; block if that one is still live.",
    "Kill list, hashmap-only, tree-on-id, and heap-only out loud before you code two structures.",
    "Inject time; do not hide System.currentTimeMillis inside Process if you want tests.",
    "Set endTime = -1. They crashed live when 0 looked like a real end.",
    "Say complexities: start log n, end O(1), poll log n — then flag races for part 2.",
    "Google docs hate formatting; if you get HackerRank, format anyway because humans like clean code."
  ],

  scene: {
    nodes: [
      { id: "caller", label: "Caller", type: "user", pos: [-10.5, 0, 0] },
      { id: "api", label: "LogClient", type: "gateway", pos: [-7, 0, 0] },
      { id: "impl", label: "Logger impl", type: "service", pos: [-3.5, 0, 0] },
      { id: "proc", label: "Process", type: "worker", pos: [0, 0, 3], showAt: 1 },
      { id: "hmap", label: "HashMap", type: "cache", pos: [0, 0, 0], showAt: 2 },
      { id: "q", label: "Start-time Q", type: "queue", pos: [0, 0, -3], showAt: 4 },
      { id: "p3", label: "P3 @ 7", type: "point", pos: [3.5, 0, -3], showAt: 5 },
      { id: "p2", label: "P2 @ 8", type: "point", pos: [7, 0, -3], showAt: 5 },
      { id: "p1", label: "P1 @ 12", type: "point", pos: [10.5, 0, -3], showAt: 5 },
      { id: "out", label: "Stdout", type: "storage", pos: [3.5, 0, 3], showAt: 6 },
      { id: "timer", label: "Timer", type: "note", pos: [-3.5, 0, 6], showAt: 1 },
      { id: "note0", label: "start, end, poll", type: "note", pos: [-7, 0, 6] },
      { id: "note1", label: "List/heap/id-tree fail", type: "note", pos: [3.5, 0, 6], showAt: 3 },
      { id: "note2", label: "Same object in both", type: "note", pos: [-3.5, 0, -6], showAt: 4 },
      { id: "note3", label: "Wait on oldest start", type: "note", pos: [7, 0, 3], showAt: 6 },
      { id: "note4", label: "log n / O(1) / log n", type: "note", pos: [7, 0, 0], showAt: 7 }
    ],
    edges: [
      { from: "caller", to: "api", label: "start/end/poll" },
      { from: "api", to: "impl" },
      { from: "impl", to: "proc", showAt: 1 },
      { from: "impl", to: "hmap", label: "id→proc", showAt: 2 },
      { from: "impl", to: "q", label: "by start", showAt: 4 },
      { from: "hmap", to: "proc", showAt: 2 },
      { from: "q", to: "p3", showAt: 5 },
      { from: "p3", to: "p2", showAt: 5 },
      { from: "p2", to: "p1", showAt: 5 },
      { from: "impl", to: "out", label: "print", showAt: 6 },
      { from: "timer", to: "proc", showAt: 1, dashed: true }
    ],
    steps: [
      {
        title: "A logger that waits in start order",
        text: "start and end are listeners. poll must print the process that started first, but only after it has ended. Until then it blocks. This was asked at Google.",
        highlight: ["caller", "api", "note0"]
      },
      {
        title: "Process plus an injectable clock",
        text: "Process holds final id, final startTime, and endTime. Pass the clock in so tests can mock Timer instead of sleeping on the OS clock. LoggerImplementation implements LogClient.",
        highlight: ["impl", "proc", "timer"],
        flows: [
          { from: "caller", to: "api", color: "#4ade80", label: "start(3)" },
          { from: "timer", to: "proc", color: "#c084fc", label: "t=7" }
        ]
      },
      {
        title: "HashMap makes end O(1)",
        text: "A list makes end a scan. Map id → Process so end is a get and a setter. Poll on a hashmap is still O(n): there is no earliest-start pointer.",
        highlight: ["impl", "hmap", "proc"],
        flows: [
          { from: "impl", to: "hmap", color: "#4ade80", label: "put 3" },
          { from: "hmap", to: "proc", color: "#60a5fa", label: "get" }
        ]
      },
      {
        title: "One structure always loses",
        text: "TreeMap on process id prints 1 before 3. A heap cannot find id on end. You need map speed for end and ordered-queue speed for poll. Merge them.",
        highlight: ["hmap", "q", "note1"]
      },
      {
        title: "Map plus start-time queue",
        text: "TreeMap or heap ordered by startTime sits beside the hashmap. start writes both with the same timestamp. A heap-plus-map answer from chat is the same design.",
        highlight: ["impl", "hmap", "q", "note2"],
        flows: [
          { from: "impl", to: "hmap", color: "#4ade80", label: "put" },
          { from: "impl", to: "q", color: "#4ade80", label: "insert t" }
        ]
      },
      {
        title: "P3, then P2, then P1",
        text: "Queue order is start time: 3 @ 7, 2 @ 8, 1 @ 12. Ending 1 first does not print 1. The head is still 3 with endTime = -1, so poll says no completed tasks.",
        highlight: ["p3", "p2", "p1", "q"],
        flows: [
          { from: "caller", to: "api", color: "#4ade80", label: "end(1)" },
          { from: "q", to: "p3", color: "#fb923c", label: "head still 3" }
        ]
      },
      {
        title: "end mutates the shared object",
        text: "end looks up the hashmap and sets endTime. The queue is not rewritten. Both hold the same Process, so the next poll sees 3 is finished, prints it, and removes it from map and tree.",
        highlight: ["hmap", "q", "p3", "out", "note3"],
        flows: [
          { from: "caller", to: "api", color: "#fb923c", label: "end(3)" },
          { from: "impl", to: "out", color: "#4ade80", label: "print 3" }
        ]
      },
      {
        title: "Complexities, then concurrency",
        text: "start log n, end O(1), poll log n. That is the fresher bar. Part 2: races on the two structures, and a lock so poll waits without spinning. Mention those holes even if the clock runs out.",
        highlight: ["impl", "hmap", "q", "note4"],
        flows: [
          { from: "caller", to: "api", color: "#60a5fa", label: "poll" },
          { from: "impl", to: "out", color: "#60a5fa", label: "print 2, 1" }
        ]
      }
    ]
  }
});
