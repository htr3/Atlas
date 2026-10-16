window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "lld",
  id: 7,
  title: "Low level System Design of a Logger Part 2: Solving for concurrency and locking",
  video: "https://www.youtube.com/watch?v=bPkXQszkkpY",
  category: "Low-Level Design",
  tagline: "Blocking poll, reentrant locks, and hashing start/end onto one thread.",
  summary: "Part 2 of Google's logger LLD takes the HashMap-plus-TreeMap client from part 1 and makes start, end, and poll safe under threads. The lecture covers blocking poll with CompletableFuture, a reentrant lock on update/delete, concurrent maps, and hashing a process id onto a single-thread executor so start always finishes before end.",

  theory: [
    {
      heading: "What part 1 already solved",
      body: "The Google phone-screen logger exposes three calls: <code>start(id, timestamp)</code>, <code>end(id)</code>, and <code>poll()</code>. Poll prints a line such as process 1 started at 7 and ended at 19. A plain hashmap makes start and end fast but cannot find the oldest finished process. A list makes poll cheap (head of the queue) but turns end into a linear scan. Part 1 settled on a <b>compound structure</b>: a map from process id to the process object (O(1) start and end) plus a tree map (balanced BST, logarithmic poll by start time). A priority queue is an acceptable stand-in for the tree map.",
      bullets: [
        "Poll must emit completed processes in start-time order, not completion order.",
        "End may omit a timestamp; adding one is not the hard part.",
        "The real fight is making all three calls fast at once."
      ]
    },
    {
      heading: "New requirements: block, then race",
      body: "Poll must no longer return <code>null</code> when nothing is ready. If the ordered map is empty, or the head still has <code>endTime == -1</code>, poll <b>blocks</b> until an end arrives for that head. Meanwhile start, end, and poll may all run in parallel. The client promises that the start <i>request</i> reaches the service before the matching end request. The service still has to make start <i>finish executing</i> before end looks the id up, or you get a null-pointer, a failed end, a process that lives in the map forever, and a poll that never unblocks.",
      bullets: [
        "Interview shortcut: assume start arrives first; you still serialize execution.",
        "Production alternative: buffer an early end until the matching start shows up.",
        "Fresh grads are not expected to go this far; SD2/SD3 and senior loops are."
      ]
    },
    {
      heading: "Push inside a pull API",
      body: "Poll is a pull from the caller's point of view, but waiting is implemented as a <b>push</b>. Each blocked poll enqueues a <code>CompletableFuture</code> (a container, like a JavaScript promise). End, if it just completed the current head, calls <code>pollNow()</code>, removes that future, and <code>complete</code>s it. Poll then <code>get</code>s with a timeout (the lecture uses three seconds) so a hung API fails instead of waiting forever. Returning the future itself would give the caller more control; a network API usually cannot ship the container, so the method stays blocking. Completing a future is the push notification; polling the container would be another pull.",
      bullets: [
        "JavaScript needs an event loop because it is single-threaded; Java can use real threads.",
        "A concurrent hashmap protects one map, not two structures that must stay in lockstep.",
        "<code>CopyOnWriteArrayList</code> is the concurrent list if you need one."
      ]
    },
    {
      heading: "What actually needs a lock",
      body: "Think CRUD on the compound structure. Start is create: appending into concurrent maps is safe. Poll is read-plus-delete of the <i>head of the whole structure</i>, not of one key, so it needs an exclusive lock. End is update (and may trigger pollNow), so it needs the same lock. A <code>ReentrantLock</code> around the logger client is the lecture's choice. If poll is blocked inside <code>future.get()</code> while holding that lock, every other poll and end waits behind it — like blocking the front of the line — which matches a blocking API. Locking every method would collapse the client onto one thread and cancel the point of a concurrent data structure.",
      bullets: [
        "Poll and end never run at the same time; start still can.",
        "This is producer-consumer plus in-place updates, so it is harder than a plain queue.",
        "Futures still matter with a lock: they are the wakeup, not the mutual exclusion."
      ]
    },
    {
      heading: "Arrival order is not execution order",
      body: "Even after the lock, start has no lock. Process 1 can enter start, then end of process 1 can grab the lock and <code>get</code> a missing id — the same null-pointer as before. A thread runs sequentially and cannot be sliced into smaller concurrent pieces; a process can host many threads that share the maps, skip list, future list, and lock. So start and end for one id must run on the <b>same thread</b>. Hash the process id, take it modulo the scheduler size, and submit both runnables to that lane. Ten single-thread executors in one process are enough; one lane would order everything and kill concurrency. TreeMap is not thread-safe, so the ordered side becomes a <code>ConcurrentSkipListMap</code> (expected amortized <code>log n</code>, skip-list analogue of a tree map).",
      bullets: [
        "Process = shared compound (parking lot); thread = private room.",
        "Same id always hashes to the same bucket, so start is always ahead of end on that lane.",
        "A blocking queue would also work; skip list stays closest to the part-1 tree map."
      ]
    },
    {
      heading: "Tests that actually stress blocking and order",
      body: "The blocking test starts processes 1, 2, and 3, ends 3 and 2, then polls twice. Those polls must hang because 1 is still the oldest start. Ending 1 releases 1 and 2; a ten-second sleep then the last poll prints process 3. The concurrency test drives thousands of start/end/poll commands (the lecture shows 5,000 then 10,000) across a 10-thread pool. The <i>test client</i> must never end before start, and must inject an earlier process's start before a later process's end — otherwise poll would print 2 (start 5, end 9) before 1 (start 4, end 12) has even been registered. Multiple polls may block on the same lock. Without the lock and the hashed executor, printed order falls apart. Interview code is not expected to be this strict, but senior candidates must talk about scheduling tests, not just calling methods.",
      bullets: [
        "Prefer returning the log string so tests can assert it; printing is only a demo.",
        "Random polls are fine because completed heads push into waiting futures.",
        "Concurrency in production is exclusivity (locks) plus ordering (thread affinity)."
      ]
    }
  ],

  keyTerms: [
    { term: "Compound structure", def: "Hash map for id lookup plus a tree/skip list ordered by start time, so start, end, and poll are all fast." },
    { term: "Blocking poll", def: "Poll waits until the oldest process has an end time instead of returning null." },
    { term: "CompletableFuture", def: "A fillable container; poll enqueues one, end completes it, get unblocks the caller." },
    { term: "Push vs pull", def: "The public poll API pulls; internally end pushes a completion into the waiting future." },
    { term: "ReentrantLock", def: "Exclusive lock reused on poll and end so the compound head is not read and updated together." },
    { term: "ConcurrentSkipListMap", def: "Thread-safe ordered map replacing TreeMap; expected logarithmic get/put." },
    { term: "Thread affinity", def: "hash(processId) % n sends start and end of one id to the same single-thread executor." },
    { term: "Memory leak race", def: "End before start: get throws, end never removes, start later inserts an immortal process, poll hangs." },
    { term: "Exclusivity vs order", def: "Locks stop overlapping mutation; hashed lanes make start finish before end for the same id." }
  ],

  tradeoffs: [
    { pro: "HashMap + TreeMap: O(1) start/end and O(log n) ordered poll.", con: "Two structures; a concurrent hashmap alone does not keep them consistent." },
    { pro: "Blocking get keeps a simple string/void poll API.", con: "Holding the lock during get serializes every other poll and end behind that waiter." },
    { pro: "Return the Future so callers decide when to wait.", con: "You cannot ship that container across a normal HTTP API." },
    { pro: "Lock only poll and end; start stays parallel on concurrent maps.", con: "Start can still race end unless both run on the same hashed lane." },
    { pro: "Ten hashed single-thread executors keep per-id order and cross-id parallelism.", con: "One global thread is ordered but not concurrent; skipping the hash reopens the NPE." }
  ],

  interviewTips: [
    "State the client contract (start request arrives first) and the server duty (start must finish first).",
    "Name the leak: end-before-start NPE, failed end, immortal map entry, hung poll.",
    "Do not lock every method; say poll is delete and end is update, start is create.",
    "Say why ConcurrentHashMap is not enough for a compound structure, then name SkipListMap.",
    "Describe hash(id) % n onto single-thread executors as the ordering trick.",
    "For tests, mention blocked polls until the oldest start ends, and a client that never ends before start."
  ],

  scene: {
    nodes: [
      { id: "tstart", label: "Caller start", type: "user", pos: [-10, 0, -4] },
      { id: "tend", label: "Caller end", type: "user", pos: [-10, 0, 0] },
      { id: "tpoll", label: "Caller poll", type: "user", pos: [-10, 0, 4] },

      { id: "logger", label: "Logger client", type: "service", pos: [-4, 0, 0] },
      { id: "futures", label: "Future queue", type: "queue", pos: [-4, 0, -4], showAt: 2 },
      { id: "lock", label: "ReentrantLock", type: "cache", pos: [-4, 0, 4], showAt: 3 },

      { id: "hmap", label: "Process map", type: "db", pos: [2, 0, -4] },
      { id: "tmap", label: "SkipListMap", type: "db", pos: [2, 0, 0] },
      { id: "pollnow", label: "pollNow()", type: "worker", pos: [2, 0, 4], showAt: 2 },

      { id: "exec", label: "Task scheduler", type: "lb", pos: [8, 0, 0], showAt: 5 },
      { id: "lane0", label: "Lane 0", type: "server", pos: [8, 0, -4], showAt: 5 },
      { id: "lane1", label: "Lane 1", type: "server", pos: [8, 0, 4], showAt: 5 },

      { id: "n0", label: "Map + ordered map", type: "note", pos: [-1, 0, -7] },
      { id: "n1", label: "end before start: NPE", type: "note", pos: [-1, 0, 7], showAt: 1 },
      { id: "n2", label: "poll blocks on future", type: "note", pos: [5, 0, -7], showAt: 2 },
      { id: "n3", label: "lock poll and end", type: "note", pos: [5, 0, 7], showAt: 3 },
      { id: "n4", label: "start stays parallel", type: "note", pos: [11, 0, -7], showAt: 4 },
      { id: "n5", label: "hash(id) % n same lane", type: "note", pos: [11, 0, 7], showAt: 5 }
    ],
    edges: [
      { from: "tstart", to: "logger", label: "start" },
      { from: "tend", to: "logger", label: "end" },
      { from: "tpoll", to: "logger", label: "poll" },
      { from: "logger", to: "hmap", label: "id lookup" },
      { from: "logger", to: "tmap", label: "by start ts" },
      { from: "tpoll", to: "futures", label: "enqueue", showAt: 2 },
      { from: "tend", to: "pollnow", label: "if head", showAt: 2 },
      { from: "pollnow", to: "futures", label: "complete", showAt: 2, dashed: true },
      { from: "logger", to: "lock", showAt: 3 },
      { from: "logger", to: "exec", label: "submit", showAt: 5 },
      { from: "exec", to: "lane0", label: "id % n = 0", showAt: 5 },
      { from: "exec", to: "lane1", label: "id % n = 1", showAt: 5 }
    ],
    steps: [
      {
        title: "Fast start, end, and poll",
        text: "Part 1 already combined a process-id map with a time-ordered map. Start and end hit the map in constant time; poll takes the oldest start from the tree (or skip list) in logarithmic time.",
        highlight: ["logger", "hmap", "tmap", "n0"],
        hide: ["n1", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "tstart", to: "logger", color: "#4ade80", label: "start" },
          { from: "logger", to: "hmap", color: "#4ade80", label: "put" },
          { from: "logger", to: "tmap", color: "#4ade80", label: "order" },
          { from: "tpoll", to: "logger", color: "#60a5fa", label: "poll" }
        ]
      },
      {
        title: "End racing start",
        text: "If end runs while start has not inserted id 1, get throws, end never completes, start later leaks that process, and poll waits forever. The client may send start first; the JVM still must execute start first.",
        highlight: ["tstart", "tend", "hmap", "n1"],
        fail: ["tend"],
        hide: ["n0", "n2", "n3", "n4", "n5"],
        flows: [
          { from: "tend", to: "logger", color: "#f87171", label: "end 1" },
          { from: "logger", to: "hmap", color: "#f87171", label: "get miss" },
          { from: "tstart", to: "logger", color: "#fb923c", label: "late start" }
        ]
      },
      {
        title: "Blocking poll via futures",
        text: "An empty queue or unfinished head no longer returns null. Poll enqueues a CompletableFuture and get-waits. When end finishes the current head, pollNow prints the line and completes that future — pull API, push wakeup.",
        highlight: ["tpoll", "futures", "pollnow", "n2"],
        hide: ["n0", "n1", "n3", "n4", "n5"],
        flows: [
          { from: "tpoll", to: "futures", color: "#60a5fa", label: "future" },
          { from: "tend", to: "pollnow", color: "#4ade80", label: "head done" },
          { from: "pollnow", to: "futures", color: "#c084fc", label: "complete" }
        ]
      },
      {
        title: "Lock update and delete",
        text: "Poll deletes the structure head; end updates a process and may trigger pollNow. Both take a reentrant lock on the client. Create (start) stays unlocked. Locking every method would be one thread wearing a concurrent costume.",
        highlight: ["lock", "logger", "tpoll", "tend", "n3"],
        hide: ["n0", "n1", "n2", "n4", "n5"],
        flows: [
          { from: "tpoll", to: "lock", color: "#fb923c", label: "acquire" },
          { from: "tend", to: "lock", color: "#f87171", label: "wait" }
        ]
      },
      {
        title: "Concurrent maps, not synchronized methods",
        text: "Swap the process map for ConcurrentHashMap and the tree for ConcurrentSkipListMap so start can insert from many threads. A concurrent map does not order two structures; the lock still covers poll and end together.",
        highlight: ["hmap", "tmap", "tstart", "n4"],
        hide: ["n0", "n1", "n2", "n3", "n5"],
        flows: [
          { from: "tstart", to: "hmap", color: "#4ade80", label: "put" },
          { from: "tstart", to: "tmap", color: "#4ade80", label: "put" }
        ]
      },
      {
        title: "Hash the id onto a lane",
        text: "A task scheduler of about ten single-thread executors lives in the process. hash(processId) % n always picks the same lane, so start and end of id 1 queue on that thread and cannot interleave.",
        highlight: ["exec", "lane0", "lane1", "n5"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "logger", to: "exec", color: "#fb923c", label: "id 1" },
          { from: "exec", to: "lane0", color: "#4ade80", label: "mod n" }
        ]
      },
      {
        title: "Start then end on one thread",
        text: "The client already sent start before end. Both submissions land on the green lane; the second runnable cannot start until the first finishes, so end's get never sees a missing id.",
        highlight: ["lane0", "tstart", "tend", "exec"],
        hide: ["n0", "n1", "n2", "n3", "n4"],
        flows: [
          { from: "tstart", to: "lane0", color: "#4ade80", label: "start 1" },
          { from: "tend", to: "lane0", color: "#fb923c", label: "end 1" }
        ]
      },
      {
        title: "Blocking test",
        text: "Start 1, 2, 3; end 3 and 2; two polls hang because 1 is still the oldest start. End 1 releases 1 and 2; after a pause the third poll prints process 3.",
        highlight: ["tpoll", "futures", "pollnow", "tmap"],
        hide: ["n1", "n3", "n4", "n5"],
        flows: [
          { from: "tpoll", to: "futures", color: "#60a5fa", label: "wait" },
          { from: "tend", to: "pollnow", color: "#4ade80", label: "end 1" },
          { from: "pollnow", to: "tpoll", color: "#c084fc", label: "print 1,2" }
        ]
      },
      {
        title: "Thousands of mixed commands",
        text: "A 10-thread pool fires start, end, and poll. The test client never ends before start and injects earlier starts before later ends, so poll cannot print 2 before 1 exists. Without lock and affinity the order breaks.",
        highlight: ["tstart", "tend", "tpoll", "exec", "lock"],
        hide: ["n0", "n1", "n2"],
        flows: [
          { from: "tstart", to: "exec", color: "#4ade80", label: "start" },
          { from: "tend", to: "exec", color: "#fb923c", label: "end" },
          { from: "tpoll", to: "lock", color: "#60a5fa", label: "poll" }
        ]
      }
    ]
  }
});
