window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "system-design",
  id: 18,
  title: "How Netflix Onboards New Content: Video Processing at Scale",
  video: "https://www.youtube.com/watch?v=x9Hrn0oNmJM",
  category: "Case Studies",
  tagline: "Chunk by scene, encode F×R ways, then park copies in ISP boxes.",
  summary: "Netflix does not serve one file. A title is split into scene-aligned chunks, each encoded across formats and resolutions, then stored as cheap immutable objects. Open Connect appliances inside ISPs absorb about 90% of playback so viewers in India are not pulling video from a US origin on every request.",

  theory: [
    {
      heading: "One movie is many files",
      body: "Uploading a series or film is not 'put an MP4 in a folder'. Viewers have different last-mile speeds and screens. A codec is a compression recipe: more lossy means a smaller file and more artifacts. Resolution is a separate axis — a phone does not need the same pixel grid as a TV. If you have <code>F</code> formats (MP4, AVI, …) and <code>R</code> resolutions, you materialize about <b>F × R</b> deliverable versions of the same title.<br><br>When a new encoder lands that turns a 6 GB encode into 1 GB at similar quality, you want to re-run the catalog. That job is slow and a single machine can die halfway, so the pipeline has to be restartable and parallel — which is why the rest of the lecture is about chunks, not whole files."
    },
    {
      heading: "A task is one chunk × one codec × one resolution",
      body: "Cut the master into pieces and hand each piece to a worker. One unit of work is: this chunk, this format, this resolution. Failures stay small (re-encode four seconds, not two hours) and you can pack thousands of workers around a title. Outputs land as objects you can fetch independently for adaptive playback.",
      bullets: [
        "Never pin a full-title encode on one box — time and crash risk.",
        "Re-encoding the back catalog is the same pipeline as a new ingest, just more of it."
      ]
    },
    {
      heading: "Do not cut on a wall-clock boundary",
      body: "The first approach was equal slices, about three minutes each. That looks 'fair' for processors, but video is not uniform. Picture an action beat: the villain's car is about to overtake the hero, and the arbitrary 3-minute knife falls in the middle. When the player requests the next slice, you pay another fetch at the worst possible moment and the viewer sees a stall.<br><br>The fix is to detect <b>shots</b> (the lecture uses ~4 second shots) and collate them into <b>scenes</b> — the whole car chase is one fetchable block. Seeking to 'that scene' then pulls a coherent bundle instead of a random time window. This is also closer to how editors and recommendation systems think about a film.",
      bullets: [
        "Equal-time chunks optimize worker accounting, not playback.",
        "Scene-aligned chunks optimize the moment the user actually cares about."
      ]
    },
    {
      heading: "Sparse vs dense watching",
      body: "After you have scene chunks, prefetch policy can depend on how people watch that title. If viewers hop around (a 'sparse' title), assume the next click is not the next second of film — send what they asked for and do not flood the buffer. If they sit through it linearly (a 'dense' title), it is cheap to predict the next scene and push it to the device before they need it. Same files, different fetch strategy.",
      bullets: [
        "Sparse: on-demand, small buffers, less wasted bandwidth.",
        "Dense: predictive prefetch along the timeline."
      ]
    },
    {
      heading: "S3 for the bits, not a database",
      body: "Encoded chunks barely change. They are written once (or rewritten by a later encoder) and read many times. A general-purpose database pays for updates, transactions, and row-level guarantees you do not need. Object storage (the lecture's 'Amazon S3 / Google Drive for engineers') is the cheap place for large immutable blobs. Metadata (title, rights, which object keys belong to which scene) can live elsewhere; the pixels should not."
    },
    {
      heading: "Open Connect: cache inside the ISP",
      body: "A DNS lookup for netflix.com eventually points at machines that, for a long time, clustered in the US. A viewer in India then pays a long, fat round trip for every chunk. Caching is the usual answer; Netflix's twist is to put the cache <b>inside the ISP</b> as an Open Connect appliance — a big disk box filled with titles that region actually watches (Bollywood in India, different fills in Britain or the US).<br><br>On a hit, the ISP never hauls the movie across the ocean. That saves Netflix origin capacity, saves the ISP transit, and makes the ISP look fast. The lecture's headline: on the order of <b>90% of Netflix traffic</b> is served from these boxes (YouTube-style ISP caches follow the same idea). Fill them when the box is idle — around 4am — by pushing newly processed chunks from origin. Ingest path: register the title → chunk and encode → replicate the objects onto the relevant Open Connect fleet."
    }
  ],

  keyTerms: [
    { term: "Codec", def: "Compression method for video. More lossy usually means smaller files and more visual damage." },
    { term: "F × R ladder", def: "Every format/resolution pair is a separate encoded artifact of the same title." },
    { term: "Chunk / shot / scene", def: "Chunk is the encode unit; a ~4s shot is a camera take; shots group into a scene you want to fetch together." },
    { term: "Sparse title", def: "People jump around; fetch only the requested scene instead of speculating." },
    { term: "Dense title", def: "People watch linearly; prefetch the next scenes into the player buffer." },
    { term: "Object storage (S3)", def: "Cheap blob store for immutable video objects; not a transactional database." },
    { term: "Open Connect", def: "Netflix cache appliance colocated at ISPs, filled off-peak, aiming to serve most hits locally." },
    { term: "Adaptive bitrate", def: "Player picks among the F×R ladder as bandwidth changes; needs many encodings of each chunk." }
  ],

  tradeoffs: [
    { pro: "Time-sliced chunks are simple and load-balance evenly.", con: "Cuts can land mid-action and cause a visible stall on the next fetch." },
    { pro: "Scene-aligned shots make seeks and highlights feel instant.", con: "Scene detection is extra compute and scenes are uneven, so workers are less 'fair'." },
    { pro: "Prefetch on dense titles hides latency.", con: "On sparse titles you throw away bandwidth the user will never watch." },
    { pro: "S3-style storage is cheap for huge immutable files.", con: "You give up rich queries and in-place updates; metadata must live in another system." },
    { pro: "Open Connect kills ocean hops and ~90% of origin traffic.", con: "You now operate a hardware fleet inside someone else's network and must push fills off-peak." }
  ],

  interviewTips: [
    "Lead with 'one title becomes F×R encodings of scene chunks', not with microservices.",
    "Call out why equal 3-minute slices fail — use the car-chase stall.",
    "Separate storage (S3 objects) from serving (ISP caches). Do not put video bytes in a SQL table.",
    "Name Open Connect and the 4am fill; 'we will use a CDN' is true but weaker than 'cache inside the ISP'.",
    "Mention sparse vs dense prefetch if they ask about buffering or recommendation-driven playback.",
    "Re-encode of old catalog = same chunk pipeline, just a bulk job, so it must be idempotent per chunk."
  ],

  scene: {
    nodes: [
      { id: "farm", label: "Encode farm", type: "zone", pos: [0, 0, 0], size: [12, 14] },
      { id: "india", label: "India ISP", type: "zone", pos: [10.5, 0, -5], size: [4, 4], showAt: 8 },
      { id: "studio", label: "Studio", type: "user", pos: [-11, 0, -3] },
      { id: "master", label: "Master file", type: "storage", pos: [-7, 0, -3], showAt: 1 },
      { id: "splitter", label: "Shot splitter", type: "worker", pos: [-3, 0, 0], showAt: 2 },
      { id: "w720", label: "720p MP4", type: "worker", pos: [2, 0, -6], showAt: 2 },
      { id: "w480", label: "480p AVI", type: "worker", pos: [2, 0, -2], showAt: 2 },
      { id: "w360", label: "360p", type: "worker", pos: [2, 0, 2], showAt: 2 },
      { id: "w144", label: "144p", type: "worker", pos: [2, 0, 6], showAt: 2 },
      { id: "s3", label: "Amazon S3", type: "storage", pos: [6.5, 0, 0], showAt: 5 },
      { id: "oc_in", label: "OC India", type: "cdn", pos: [10.5, 0, -5], showAt: 8 },
      { id: "oc_uk", label: "OC Britain", type: "cdn", pos: [10.5, 0, 0], showAt: 8 },
      { id: "oc_us", label: "OC US", type: "cdn", pos: [10.5, 0, 5], showAt: 8 },
      { id: "viewer", label: "India viewer", type: "user", pos: [-11, 0, 4], showAt: 7 },
      { id: "isp", label: "Local ISP", type: "lb", pos: [-7, 0, 4], showAt: 7 },
      { id: "n_fxr", label: "F formats x R resolutions", type: "note", pos: [2, 3.3, 0], showAt: 1 },
      { id: "n_task", label: "1 chunk x 1 codec x 1 res", type: "note", pos: [-3, 3.3, 3], showAt: 2 },
      { id: "n_chase", label: "3-min cut mid car chase", type: "note", pos: [-3, 3.3, -4], showAt: 3 },
      { id: "n_scene", label: "4s shots → one scene", type: "note", pos: [2, 3.3, -6], showAt: 4 },
      { id: "n_watch", label: "sparse fetch / dense prefetch", type: "note", pos: [6.5, 3.3, 3], showAt: 5 },
      { id: "n_90", label: "~90% served from OC", type: "note", pos: [10.5, 3.3, -2], showAt: 8 },
      { id: "n_4am", label: "fill boxes around 4am", type: "note", pos: [10.5, 3.3, 3], showAt: 9 }
    ],
    edges: [
      { from: "studio", to: "master", label: "upload", showAt: 1 },
      { from: "master", to: "splitter", showAt: 2 },
      { from: "splitter", to: "w720", showAt: 2 },
      { from: "splitter", to: "w480", showAt: 2 },
      { from: "splitter", to: "w360", showAt: 2 },
      { from: "splitter", to: "w144", showAt: 2 },
      { from: "w720", to: "s3", showAt: 6 },
      { from: "w480", to: "s3", showAt: 6 },
      { from: "w360", to: "s3", showAt: 6 },
      { from: "w144", to: "s3", showAt: 6 },
      { from: "viewer", to: "isp", showAt: 7 },
      { from: "isp", to: "s3", label: "miss", showAt: 7, dashed: true },
      { from: "s3", to: "oc_in", showAt: 9, dashed: true },
      { from: "s3", to: "oc_uk", showAt: 9, dashed: true },
      { from: "s3", to: "oc_us", showAt: 9, dashed: true },
      { from: "isp", to: "oc_in", label: "hit", showAt: 8 }
    ],
    steps: [
      {
        title: "A studio hands over a master",
        text: "Legal issues aside, the engineering problem starts here: one huge file that cannot be the file every phone and TV streams.",
        highlight: ["studio", "master"],
        flows: [
          { from: "studio", to: "master", color: "#4ade80", label: "mezzanine" }
        ]
      },
      {
        title: "Codecs and resolutions multiply",
        text: "Different last-mile speeds want different codecs; phones want fewer pixels than TVs. F formats times R resolutions is how many encoded siblings you will produce — and later re-produce when a better encoder shrinks 6 GB to 1 GB.",
        highlight: ["master", "n_fxr", "w720", "w480", "w360", "w144"],
        flows: []
      },
      {
        title: "Split the work",
        text: "Do not encode the whole title on one computer (slow, and a reboot loses the job). Cut the master into chunks. One task = one chunk × one format × one resolution, farmed out to workers.",
        highlight: ["splitter", "n_task", "w720", "w480", "w360", "w144"],
        flows: [
          { from: "master", to: "splitter", color: "#fb923c", label: "cut" },
          { from: "splitter", to: "w720", color: "#4ade80", label: "task" },
          { from: "splitter", to: "w480", color: "#4ade80", label: "task" },
          { from: "splitter", to: "w360", color: "#4ade80", label: "task" },
          { from: "splitter", to: "w144", color: "#4ade80", label: "task" }
        ]
      },
      {
        title: "Equal 3-minute slices stall",
        text: "Clock-aligned chunks look fair to processors. They are rude to viewers: if the knife falls while two cars overlap, the next API fetch lands on the climax and the picture hiccups.",
        highlight: ["splitter", "n_chase"],
        fail: ["n_chase"],
        flows: [
          { from: "splitter", to: "w720", color: "#f87171", label: "cut here" }
        ]
      },
      {
        title: "Chunk on shots, collate scenes",
        text: "Detect ~4 second shots and glue them into the car-chase scene. A seek or a 'play this scene' call now pulls one coherent block instead of a random three-minute window.",
        highlight: ["splitter", "n_scene"],
        hide: ["n_chase"],
        flows: [
          { from: "master", to: "splitter", color: "#4ade80", label: "shots" }
        ]
      },
      {
        title: "Sparse vs dense prefetch",
        text: "If people skip around, treat the title as sparse and send only the scene they asked for. If they watch straight through, prefetch the next scenes into the buffer so the ocean RTT never shows up.",
        highlight: ["n_watch", "w720", "s3"],
        hide: ["n_chase"],
        flows: [
          { from: "w720", to: "s3", color: "#60a5fa", label: "scene block" }
        ]
      },
      {
        title: "Park the bits on S3",
        text: "Chunks are static. Object storage is far cheaper than a database because you do not need updates or row locks — just durable blobs the player can GET by key.",
        highlight: ["s3", "w720", "w480", "w360", "w144"],
        hide: ["n_chase"],
        flows: [
          { from: "w720", to: "s3", color: "#c084fc", label: "put" },
          { from: "w480", to: "s3", color: "#c084fc", label: "put" },
          { from: "w360", to: "s3", color: "#c084fc", label: "put" },
          { from: "w144", to: "s3", color: "#c084fc", label: "put" }
        ]
      },
      {
        title: "India is far from a US origin",
        text: "The viewer asks their ISP, which looks up Netflix and historically talked to machines concentrated in the US. Video is huge, so that RTT and bandwidth tax is the product.",
        highlight: ["viewer", "isp", "s3"],
        hide: ["n_chase"],
        flows: [
          { from: "viewer", to: "isp", color: "#4ade80", label: "play" },
          { from: "isp", to: "s3", color: "#f87171", label: "cross ocean" }
        ]
      },
      {
        title: "Open Connect sits in the ISP",
        text: "Netflix ships disk boxes into ISP POPs, filled with local demand (Bollywood here, different catalogs in Britain or the US). A hit never leaves the ISP. About 90% of Netflix traffic is claimed by these appliances.",
        highlight: ["oc_in", "oc_uk", "oc_us", "n_90", "india"],
        hide: ["n_chase"],
        flows: [
          { from: "viewer", to: "isp", color: "#4ade80", label: "play" },
          { from: "isp", to: "oc_in", color: "#60a5fa", label: "hit" },
          { from: "oc_in", to: "viewer", color: "#60a5fa", label: "chunks" }
        ]
      },
      {
        title: "Fill the boxes at 4am",
        text: "When overnight load is lowest, origin pushes newly processed chunks onto the appliances. Register → encode scenes → replicate to the right ISP boxes. Serving innovation plus processing innovation is what keeps Netflix cheap at scale.",
        highlight: ["s3", "oc_in", "oc_uk", "oc_us", "n_4am"],
        hide: ["n_chase"],
        flows: [
          { from: "s3", to: "oc_in", color: "#c084fc", label: "4am fill" },
          { from: "s3", to: "oc_uk", color: "#c084fc", label: "4am fill" },
          { from: "s3", to: "oc_us", color: "#c084fc", label: "4am fill" }
        ]
      }
    ]
  }
});
