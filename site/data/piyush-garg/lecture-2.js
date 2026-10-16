window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 2,
  title: "System Design Crash Course - Part 2",
  video: "https://www.youtube.com/watch?v=YuB3OuF3MUE",
  category: "Piyush Garg",
  tagline: "Netflix can pre-warm; YouTube and Hotstar cricket cannot — then Lambda vs containers vs Kubernetes.",
  summary: "Part 2 argues that YouTube, Netflix, and Hotstar are all video products with incompatible designs because their traffic shapes differ. Netflix pre-scales 10→30 boxes before a dated movie launch and seeds the first 10 minutes on the CDN. YouTube cannot forecast a MrBeast live. Hotstar cricket spikes at toss and Kohli, and the Back button slams the movies API with the same 24-crore crowd. Serverless (Lambda) hides servers but brings cold start, a 15s cap, vendor lock-in, and Mongo connection storms. Containers strip the guest OS from a VM so ffmpeg matches prod; Kubernetes (rewritten from Borg, donated to CNCF) is the brain that scales, heals, and rolling-updates those containers.",

  theory: [
    {
      heading: "Same product category, three traffic shapes",
      body: "Copying YouTube's design onto Netflix inflates Netflix's bill. Copying Netflix onto YouTube (or Hotstar) crashes the target. All three stream video. Design is not a template you finish in a course; it evolves with <b>your</b> traffic and a cost-vs-crash balance. Autoscale is not magic: you write a policy such as \"if the last 15 minutes exceeded 1000 requests, or CPU/memory average 70%, add a server.\" Gradual growth is easy — 3 boxes become 4, then 5. A cliff-shaped spike outruns the average, so you still have 4 boxes while traffic is already 10×, then the graph dips because the fleet died.",
      bullets: [
        "Policy is on a sliding average. Cliffs beat the average.",
        "YouTube / Netflix / Hotstar need different capacity stories, not one video architecture."
      ]
    },
    {
      heading: "Netflix: the spike has a calendar date",
      body: "A title does not appear by surprise. Trailers go out; the launch day is known. Historical data says launch day spikes. If 10 servers run today and the movie drops tomorrow, <b>pre-warm 30 servers</b> (the lecture's 3×) 24 hours ahead. If the title flops, scale back to 10. You also push the <b>first 10 minutes</b> of the file onto every CDN edge before launch so the origin is not hit by the opening credits. Netflix employees control the publish button, so they can pre-scale. That is why Netflix looks \"easy\" in this video.",
      bullets: [
        "Pre-scale 10 → 30 before launch day. Scale in if the spike never comes.",
        "Cache the opening 10 minutes on CDN edges before the title is live."
      ]
    },
    {
      heading: "YouTube: MrBeast does not book a ticket with SRE",
      body: "Creators publish. A huge live, or every news desk going live after an unpredicted world event, multiplies traffic with no calendar. Monthly seasonality exists (exam months high, Diwali low) but <b>sudden spikes cannot be forecast</b>. Autoscale on 70% CPU adds <i>one</i> box while traffic jumped 10×. Physical VMs also boot, install packages, take an IP, and register on a balancer — too slow, and the operator is now an infra babysitter instead of an application owner.",
      bullets: [
        "ML can guess a month, not a surprise live.",
        "VM autoscale adds one replica after an average trips; a 10× cliff needs ten."
      ]
    },
    {
      heading: "Hotstar cricket, and the Back-button trap",
      body: "Catalog (movies) and live cricket are different services. On a quiet day, shrink live. Before India vs a big side, grow live 10 → 200 boxes an hour or two before toss, and shrink movies. Toss spikes; people leave until first ball; a wicket or Dhoni/Kohli walking out spikes again. After a dull period, <b>do not autoscale down</b> — you cannot tell a dip from a crash, and the next ball may explode. Bear four hours of 200-box cost. The trap: 24 crore people watch live. Almost nobody is in movies (~1 lakh). When the favorite is out they press <b>Back</b>, land on the home catalog, and 24 crore GET the movies API. Every live dip is a movies spike. Next match, keep movies warm too. Simulate yesterday's load with a 24-hour stress test before a real match.",
      bullets: [
        "Turn autoscale off for the match window; keep 200 live boxes hot.",
        "Back from live = movies homepage. Scale the catalog, not only live."
      ]
    },
    {
      heading: "Lambda: you do not manage the server",
      body: "<b>Serverless</b> means AWS runs the machines. You hand over a .js file; they give you <code>https://abc.com/...</code>. Each request can invoke its own function; idle functions disappear. No Ubuntu-vs-Debian, no CPU/RAM picker, no autoscale group. Pricing in the lecture: 1 million invocations/month free, then about <code>$0.20</code> per extra million, plus a large free compute-second tier. You pay per use, not per idle VM-hour. Tradeoffs called out: <b>cold start</b> (first visitor after a dead night waits ~2s while code is pulled; later invokes ~0.5s if warm), API Gateway <b>15 second</b> cap, unbounded scale during DDoS, <b>vendor lock-in</b> (Lambda pulls in SQS, API Gateway, Route 53, S3, CloudWatch, Step Functions — cheap compute, expensive orbit), no OS-level knobs, always <b>stateless</b> (the instance dies after the request), and a <b>Mongo connection storm</b> that forces a stateful connection-pool proxy (an EC2) which then becomes the bottleneck you tried to avoid.",
      bullets: [
        "One Lambda per request. Zero when idle. First request after idle is a cold start.",
        "The cheap function is how AWS sells you the rest of the account."
      ]
    },
    {
      heading: "\"Works on my machine\": ffmpeg, VMs, then containers",
      body: "A new VM for a spike must <code>apt-get install ffmpeg</code> (the CLI used for transcode) before your code runs. By then the two live boxes have melted. Local Windows/Mac with ffmpeg 0.4.2 is not Ubuntu with some other version — 30–40 libraries must match. A full guest VM ships the OS + packages + code, so it runs anywhere, but you now run two operating systems on one host (4–5 GB image, slow boot, fat RAM). <b>Containerization</b> is a lightweight VM: drop the guest OS, reuse the host kernel, keep packages + code (~250 MB instead of 4 GB + 200 MB + 50 MB). One host runs many isolated containers; when it fills, add a second host. ffmpeg inside the image is the ffmpeg you tested.",
      bullets: [
        "VM image = whole OS. Container image = packages + code, host kernel.",
        "15 containers on two billed machines beat 15 full VMs for a burst."
      ]
    },
    {
      heading: "Kubernetes is the donated rewrite of Borg",
      body: "Fifty containers need a brain: create more on load, delete on idle, replace a red (crashed) one, rolling-update old pods for new code so there is no downtime, blue-green, and so on. That job is <b>container orchestration</b> across a cluster (the lecture draws three servers). Google's internal brain was <b>Borg</b>. The Borg team rewrote it from scratch as Project X, open-sourced it as <b>Kubernetes</b>, and donated it to the CNCF. K8s automates deploy, scale, and heal, with its own reverse proxy, ingress, kubelet, kube-proxy, scheduler, etcd, and control plane (covered in Piyush's dedicated K8s video). Modern default: containers + Kubernetes rather than Lambda-as-the-whole-product or raw VMs with ffmpeg install scripts.",
      bullets: [
        "Orchestration = the brain you do not want to write.",
        "Kubernetes = Borg's lessons, rewritten, given to CNCF."
      ]
    }
  ],

  keyTerms: [
    { term: "Traffic pattern", def: "The shape of load over time. Netflix launch-day, YouTube surprise lives, and Hotstar wickets are different shapes." },
    { term: "Pre-scale / pre-warm", def: "Start extra Netflix boxes (10→30) and CDN opening-credits before a known movie drop." },
    { term: "Autoscale policy", def: "A rule on averages (15-min request count, 70% CPU). Cliffs outrun it." },
    { term: "Serverless", def: "You do not manage OS, IP, or autoscale groups. AWS invokes your function per request." },
    { term: "Cold start", def: "First Lambda after idle must pull code (~2s). Warm invokes are faster (~0.5s in the talk)." },
    { term: "Vendor lock-in", def: "Lambda pulls API Gateway, SQS, S3, CloudWatch, Step Functions; leaving AWS means a rewrite." },
    { term: "Container", def: "Lightweight VM without a guest OS. Packages + code share the host kernel (~250 MB)." },
    { term: "Kubernetes", def: "Open-source orchestrator from Borg learnings. Scales, heals, and rolling-updates containers." }
  ],

  tradeoffs: [
    { pro: "Netflix can pre-warm 30 boxes and CDN the first 10 minutes because launch day is on a calendar.", con: "The same playbook on YouTube wastes money every hour there is no MrBeast live, and still misses the live." },
    { pro: "Leaving Hotstar live at 200 boxes for a 4-hour match survives toss and Kohli spikes.", con: "You pay for idle capacity, and movies still dies if Back-button traffic was not pre-scaled." },
    { pro: "Lambda: no server babysitting, pay per invoke, 1M free, ~$0.20/million after.", con: "Cold start, 15s cap, DDoS-scale bills, statelessness, Mongo storms, AWS gravity well." },
    { pro: "Containers make ffmpeg match prod and boot far faster than a guest OS VM.", con: "You now own orchestration: who restarts the red container among fifty." },
    { pro: "Kubernetes gives rolling updates, self-heal, and cluster autoscaling out of the box.", con: "Control-plane complexity (etcd, scheduler, kubelet) is its own course." }
  ],

  interviewTips: [
    "Do not paste one video architecture onto YouTube, Netflix, and Hotstar. Ask what the traffic graph looks like.",
    "Netflix: named launch day → pre-scale 10→30 and CDN the first 10 minutes.",
    "YouTube: creator lives are not in your calendar. Autoscale on 70% CPU adds one VM after a 10× cliff.",
    "Hotstar: keep live at 200 for the match, and scale movies because Back from live is the catalog API (24 crore).",
    "Serverless ≠ no servers. It means you do not manage them. Name cold start, 15s, lock-in, and connection storms.",
    "\"Works on my machine\" + ffmpeg → container. Fifty containers → Kubernetes (Borg → CNCF), not a homegrown brain."
  ],

  scene: {
    nodes: [
      { id: "yt", label: "YouTube", type: "service", pos: [-8, 0, -5] },
      { id: "nf", label: "Netflix", type: "service", pos: [0, 0, -5] },
      { id: "hs", label: "Hotstar", type: "service", pos: [8, 0, -5] },
      { id: "n_same", label: "All stream video; traffic differs", type: "note", pos: [0, 0, -7.4] },
      { id: "slope", label: "Slow ramp 3→8 boxes", type: "server", pos: [-8, 0, -1], showAt: 1 },
      { id: "cliff", label: "Cliff: still 4 boxes", type: "server", pos: [0, 0, -1], showAt: 1 },
      { id: "crash", label: "Fleet died", type: "server", pos: [8, 0, -1], showAt: 1 },
      { id: "n_pol", label: "Policy: 15min>1000 or CPU 70%", type: "note", pos: [0, 0, 1.2], showAt: 1 },
      { id: "nf10", label: "10 boxes today", type: "server", pos: [-4, 0, 4], showAt: 2 },
      { id: "nf30", label: "30 pre-warm", type: "server", pos: [0, 0, 4], showAt: 2 },
      { id: "cdn10", label: "CDN first 10 min", type: "cdn", pos: [4, 0, 4], showAt: 2 },
      { id: "n_cal", label: "Launch is on a calendar", type: "note", pos: [0, 0, 6.4], showAt: 2 },
      { id: "beast", label: "MrBeast live", type: "user", pos: [-8, 0, 4], showAt: 3 },
      { id: "news", label: "News desks live", type: "user", pos: [-4.5, 0, 4], showAt: 3 },
      { id: "n_yt", label: "No ticket with SRE", type: "note", pos: [-6, 0, 6.4], showAt: 3 },
      { id: "liveSvc", label: "Live 10→200", type: "service", pos: [3, 0, 3.5], showAt: 4 },
      { id: "movSvc", label: "Movies catalog", type: "service", pos: [8, 0, 3.5], showAt: 4 },
      { id: "toss", label: "Toss spike", type: "point", pos: [3, 0, 1], showAt: 4 },
      { id: "kohli", label: "Kohli spike", type: "point", pos: [5.5, 0, 1], showAt: 4 },
      { id: "crowd", label: "24 crore live", type: "user", pos: [3, 0, 6.2], showAt: 5 },
      { id: "back", label: "Back button", type: "phone", pos: [5.5, 0, 6.2], showAt: 5 },
      { id: "n_back", label: "24cr GET movies homepage", type: "note", pos: [8, 0, 6.4], showAt: 5 },
      { id: "fn", label: "index.js", type: "worker", pos: [-8, 0, 2], showAt: 6 },
      { id: "lam1", label: "Lambda 1", type: "service", pos: [-4, 0, 0.5], showAt: 6 },
      { id: "lam2", label: "Lambda 2", type: "service", pos: [-1, 0, 0.5], showAt: 6 },
      { id: "lam3", label: "Lambda 3", type: "service", pos: [2, 0, 0.5], showAt: 6 },
      { id: "url", label: "https://abc.com", type: "gateway", pos: [-4, 0, 3.5], showAt: 6 },
      { id: "n_pay", label: "1M free then ~$0.20/M", type: "note", pos: [2, 0, 3.5], showAt: 6 },
      { id: "cold", label: "Cold start ~2s", type: "note", pos: [-4, 0, -2.2], showAt: 7 },
      { id: "mongo", label: "Mongo", type: "db", pos: [6, 0, 0.5], showAt: 7 },
      { id: "lock", label: "GW+SQS+S3+CW+Steps", type: "storage", pos: [6, 0, 3.5], showAt: 7 },
      { id: "dev", label: "Win ffmpeg 0.4.2", type: "user", pos: [-8, 0, -2], showAt: 8 },
      { id: "vm", label: "Ubuntu VM+OS", type: "server", pos: [-3, 0, -2], showAt: 8 },
      { id: "ctr", label: "Container 250MB", type: "worker", pos: [3, 0, -2], showAt: 8 },
      { id: "n_ff", label: "apt-get ffmpeg too slow", type: "note", pos: [-3, 0, 0.6], showAt: 8 },
      { id: "hostA", label: "Host A", type: "zone", pos: [-4, 0, 4], size: [7, 4], showAt: 9 },
      { id: "c1", label: "Pod", type: "worker", pos: [-6, 0, 3.2], showAt: 9 },
      { id: "c2", label: "Pod", type: "worker", pos: [-4, 0, 3.2], showAt: 9 },
      { id: "c3", label: "Red pod", type: "worker", pos: [-2, 0, 3.2], showAt: 9 },
      { id: "k8s", label: "Kubernetes", type: "lb", pos: [3, 0, 4], showAt: 9 },
      { id: "n_borg", label: "Borg rewrite → CNCF K8s", type: "note", pos: [3, 0, 6.4], showAt: 9 }
    ],
    edges: [
      { from: "slope", to: "cliff", showAt: 1, dashed: true },
      { from: "cliff", to: "crash", showAt: 1, dashed: true },
      { from: "nf10", to: "nf30", label: "24h pre-warm", showAt: 2 },
      { from: "nf30", to: "cdn10", label: "seed 10 min", showAt: 2 },
      { from: "beast", to: "yt", showAt: 3 },
      { from: "news", to: "yt", showAt: 3 },
      { from: "toss", to: "liveSvc", showAt: 4 },
      { from: "kohli", to: "liveSvc", showAt: 4 },
      { from: "crowd", to: "liveSvc", showAt: 5 },
      { from: "back", to: "movSvc", label: "Back", showAt: 5 },
      { from: "fn", to: "url", showAt: 6 },
      { from: "url", to: "lam1", showAt: 6 },
      { from: "url", to: "lam2", showAt: 6 },
      { from: "url", to: "lam3", showAt: 6 },
      { from: "lam1", to: "mongo", showAt: 7 },
      { from: "lam2", to: "mongo", showAt: 7 },
      { from: "lam3", to: "mongo", showAt: 7 },
      { from: "lam1", to: "lock", showAt: 7, dashed: true },
      { from: "dev", to: "vm", label: "deploy", showAt: 8 },
      { from: "dev", to: "ctr", label: "same image", showAt: 8 },
      { from: "c1", to: "k8s", showAt: 9 },
      { from: "c2", to: "k8s", showAt: 9 },
      { from: "c3", to: "k8s", showAt: 9 },
      { from: "k8s", to: "c3", label: "replace", showAt: 9, dashed: true }
    ],
    steps: [
      {
        title: "Three video apps, not one design",
        text: "YouTube, Netflix, and Hotstar all stream video. Paste YouTube's stack onto Netflix and the bill explodes. Paste Netflix onto YouTube or Hotstar and the target falls over. Traffic shape is the requirement.",
        highlight: ["yt", "nf", "hs", "n_same"]
      },
      {
        title: "Averages lose to a cliff",
        text: "Autoscale is a policy (15-minute request count, 70% CPU). A slow ramp grows 3→4→8 boxes in time. A cliff still shows ~4 boxes on the average while traffic is already 10× — then the fleet dies and the graph dips.",
        highlight: ["slope", "cliff", "crash", "n_pol"],
        fail: ["crash"],
        flows: [{ from: "cliff", to: "crash", color: "#f87171", label: "10x" }]
      },
      {
        title: "Netflix pre-warms 10 → 30 plus CDN",
        text: "Launch day is on a calendar. Twenty-four hours ahead, grow 10 servers to 30. Push the first 10 minutes of the file to every CDN edge so opening-credits traffic never hits origin. If the title flops, scale back to 10.",
        highlight: ["nf", "nf10", "nf30", "cdn10", "n_cal"],
        hide: ["slope", "cliff", "crash", "n_pol"],
        flows: [
          { from: "nf10", to: "nf30", color: "#4ade80", label: "pre-warm" },
          { from: "nf30", to: "cdn10", color: "#22d3ee", label: "10 min" }
        ]
      },
      {
        title: "YouTube cannot book MrBeast",
        text: "A huge creator goes live without paging SRE. News desks pile on after an unpredicted world event. Monthly seasonality (exams vs Diwali) does not save you. The live is not in your calendar.",
        highlight: ["yt", "beast", "news", "n_yt"],
        hide: ["slope", "cliff", "crash", "n_pol", "nf10", "nf30", "cdn10", "n_cal"],
        flows: [
          { from: "beast", to: "yt", color: "#f87171", label: "live" },
          { from: "news", to: "yt", color: "#f87171", label: "live" }
        ]
      },
      {
        title: "Cricket: toss, Kohli, do not scale in",
        text: "Grow live 10→200 before toss; shrink movies. Toss spikes, then a lull, then a wicket or Kohli. Autoscale would scale in during the lull and miss the next ball. Pay for four hours of 200 boxes.",
        highlight: ["hs", "liveSvc", "movSvc", "toss", "kohli"],
        hide: ["slope", "cliff", "crash", "n_pol", "nf10", "nf30", "cdn10", "n_cal", "beast", "news", "n_yt"],
        flows: [
          { from: "toss", to: "liveSvc", color: "#fb923c", label: "toss" },
          { from: "kohli", to: "liveSvc", color: "#fb923c", label: "Kohli" }
        ]
      },
      {
        title: "Back button is 24 crore movies GETs",
        text: "24 crore on live, ~1 lakh on movies. Favorite out → Back → home catalog. That catalog is the movies API. Every live dip is a movies spike. Next match, keep movies warm too.",
        highlight: ["crowd", "back", "liveSvc", "movSvc", "n_back"],
        hide: ["slope", "cliff", "crash", "n_pol", "nf10", "nf30", "cdn10", "n_cal", "beast", "news", "n_yt", "toss", "kohli"],
        flows: [
          { from: "crowd", to: "liveSvc", color: "#4ade80", label: "watch" },
          { from: "back", to: "movSvc", color: "#f87171", label: "Back" }
        ]
      },
      {
        title: "Hand AWS a .js, get a URL",
        text: "Serverless: you do not pick Ubuntu, CPU, or an autoscale group. Upload index.js, receive https://abc.com. Each request can be its own Lambda. Idle functions vanish. 1M invokes free, then about $0.20 per million.",
        highlight: ["fn", "url", "lam1", "lam2", "lam3", "n_pay"],
        hide: ["yt", "nf", "hs", "n_same", "slope", "cliff", "crash", "n_pol", "nf10", "nf30", "cdn10", "n_cal", "beast", "news", "n_yt", "liveSvc", "movSvc", "toss", "kohli", "crowd", "back", "n_back"],
        flows: [
          { from: "fn", to: "url", color: "#60a5fa", label: "upload" },
          { from: "url", to: "lam1", color: "#4ade80", label: "req" },
          { from: "url", to: "lam2", color: "#4ade80", label: "req" }
        ]
      },
      {
        title: "Cold start, Mongo storm, AWS orbit",
        text: "After a dead night the first user waits ~2s while code is pulled. Each Lambda opens Mongo, so a burst exhausts connections and you add a stateful pool proxy — the VM you tried to leave. Lambda also drags in API Gateway, SQS, S3, CloudWatch, Step Functions.",
        highlight: ["lam1", "lam2", "lam3", "cold", "mongo", "lock"],
        hide: ["yt", "nf", "hs", "n_same", "slope", "cliff", "crash", "n_pol", "nf10", "nf30", "cdn10", "n_cal", "beast", "news", "n_yt", "liveSvc", "movSvc", "toss", "kohli", "crowd", "back", "n_back"],
        fail: ["mongo"],
        flows: [
          { from: "lam1", to: "mongo", color: "#f87171", label: "conn" },
          { from: "lam2", to: "mongo", color: "#f87171", label: "conn" },
          { from: "lam3", to: "mongo", color: "#f87171", label: "conn" }
        ]
      },
      {
        title: "ffmpeg: VM OS vs 250 MB container",
        text: "A burst VM that apt-gets ffmpeg loses the race. Local Windows ffmpeg 0.4.2 is not Ubuntu. A guest VM ships a whole OS (4–5 GB) so it works everywhere but boots slowly. A container drops the guest OS, keeps packages + code (~250 MB), and is the image you tested.",
        highlight: ["dev", "vm", "ctr", "n_ff"],
        hide: ["yt", "nf", "hs", "n_same", "slope", "cliff", "crash", "n_pol", "nf10", "nf30", "cdn10", "n_cal", "beast", "news", "n_yt", "liveSvc", "movSvc", "toss", "kohli", "crowd", "back", "n_back", "fn", "lam1", "lam2", "lam3", "url", "n_pay", "cold", "mongo", "lock"],
        flows: [
          { from: "dev", to: "vm", color: "#fb923c", label: "too heavy" },
          { from: "dev", to: "ctr", color: "#4ade80", label: "same bits" }
        ]
      },
      {
        title: "Kubernetes replaces the red pod",
        text: "Fifty containers need a brain: scale, delete idle, replace a crashed (red) pod, rolling-update without downtime. Google's Borg team rewrote that brain as Kubernetes and donated it to CNCF. That is the modern default this video lands on.",
        highlight: ["hostA", "c1", "c2", "c3", "k8s", "n_borg"],
        hide: ["yt", "nf", "hs", "n_same", "slope", "cliff", "crash", "n_pol", "nf10", "nf30", "cdn10", "n_cal", "beast", "news", "n_yt", "liveSvc", "movSvc", "toss", "kohli", "crowd", "back", "n_back", "fn", "lam1", "lam2", "lam3", "url", "n_pay", "cold", "mongo", "lock", "dev", "vm", "ctr", "n_ff"],
        fail: ["c3"],
        flows: [
          { from: "c3", to: "k8s", color: "#f87171", label: "red" },
          { from: "k8s", to: "c3", color: "#4ade80", label: "new pod" }
        ]
      }
    ]
  }
});
