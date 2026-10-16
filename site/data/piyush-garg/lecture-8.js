window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 8,
  title: "How Video Streaming Works on Scale - System Design",
  video: "https://www.youtube.com/watch?v=-JtjQ-OA7XE",
  category: "Piyush Garg",
  tagline: "A 4–5 GB YouTube file is frames. Encode 480p–4K segments and let the client pick from an m3u8.",
  summary: "A video is a sequence of images. 64 fps is smooth, 20 fps less so, 1 fps is a slideshow, and a short clip can still be 1 GB; this lecture's YouTube file is 4–5 GB. Early 2000s progressive download made you wait for the whole 100 MB. RTMP (Adobe) and RTSP (RealNetworks) chunked the stream so you stopped wasting bandwidth when you closed the tab. Adaptive bitrate — HLS from Apple, MPEG-DASH — encodes the same 4K/4 GB source into 480p, 720p, 1080p, and 4K segments plus an index (m3u8 or MPD). The player starts low, climbs if throughput beats bitrate, and falls back on 3G. A watch face does not need 4K. Building that pipeline yourself is storage, encode cost, and ops; Piyush demos ImageKit + video.js instead.",

  theory: [
    {
      heading: "A video is frames in a hurry",
      body: "Pause the camera and you have one still: a <b>frame</b>. Click that still every second and play the stack, and the brain reads motion. File formats such as MP4 are just containers for that sequence. Frame rate is how many stills you take per second. Piyush's recording example: about <b>64 fps</b> (smooth), <b>20 fps</b> (a bit choppy), <b>1 fps</b> (it stutters). More frames and sharper pixels mean a larger file. A 'small' clip can already be <b>1 GB</b>. The video you are watching is called out as <b>4–5 GB</b>. Playing that smoothly on a phone is an engineering problem, not a <code>&lt;video src&gt;</code> tag. YouTube did something to the encode pipeline so you are not downloading five gigabytes up front. That something is streaming.",
      bullets: [
        "TikTok, Reels, and this YouTube lecture are the same product: frames on a bad network.",
        "Piyush is building Teachyst, so delivery is not a toy topic for him.",
        "Size grows with fps and resolution. 4K/8K made the old download-first model impossible."
      ]
    },
    {
      heading: "Progressive download: wait for 100 MB, then press play",
      body: "Early 2000s: the file lives on a server. The client asks for it. The server sends the <b>entire 100 MB</b>. Until the buffer on disk is complete, you wait. That wait is what people called buffering. On 150–200 Mbps, a 4–5 GB 4K file is still <b>six to seven minutes</b> of download before playback, and you burned the data even if you quit at second ten. Low-end devices and weak networks made the experience famous for stalling. This model has a name: <b>progressive download</b>. There is no streaming yet — just a file transfer that happens to be a movie.",
      bullets: [
        "Close the tab after 10 s of a 100 MB file and you still paid for 100 MB.",
        "Buffering here means 'wait until the whole object is local'.",
        "Fine when files were small and links were fat. Wrong for 4K on a train."
      ]
    },
    {
      heading: "RTMP and RTSP: chunks, live, less waste",
      body: "Specialized streaming protocols arrived so the file could move in <b>chunks</b> while you watched. <b>RTMP</b> (Real Time Messaging Protocol) came from Adobe. <b>RTSP</b> (Real Time Streaming Protocol) came from RealNetworks. Pitch: low latency, live support, and you only pull the chunks you play — leave the platform and the rest of the file stays on the origin. Bandwidth becomes proportional to watch time. You still have a problem the protocols do not solve: a 4K source can make even <b>one chunk 200 MB</b> on a 100 GB master. A fridge screen, a watch face, or a 10–30 Mbps road connection cannot swallow that chunk in time, so you buffer again. Variety of devices (phone, laptop, LED, watch, fridge) is now the bottleneck, not the lack of a streaming protocol.",
      bullets: [
        "Chunking fixes 'download the whole file'. It does not fix 'this chunk is still 4K'.",
        "The user will blame the app, not their watch or their 30 Mbps.",
        "Something has to be 4K for the TV and 480p for the watch, from one upload."
      ]
    },
    {
      heading: "Adaptive bitrate: the client chooses the ladder",
      body: "<b>Adaptive bitrate streaming (ABR)</b> lets the client pick quality from network and screen. On a 4K monitor at 300 Mbps, take 4K. On a phone at 30 Mbps, take 480p — a bit blurry, but it plays. Drive into a tunnel, drop a rung; hit Wi-Fi, climb. A paused 4K stream on a watch is worse than a soft 480p that keeps moving. Two common protocols: <b>HLS</b> (Apple) and <b>MPEG-DASH</b>. Almost every modern platform is ABR. The name is the feature: the bitrate adapts.",
      bullets: [
        "Client decides. The origin offers a ladder, not a single file.",
        "Start at the lowest rung so time-to-first-frame is small, then climb.",
        "The exact switch algorithm varies by player: throughput, screen size, or both."
      ]
    },
    {
      heading: "Encode once into many segment ladders",
      body: "You cannot hand the 4K / 4 GB source to the client — that is progressive download again. Before publish, run a pipeline that cuts the same master into <b>segments</b> at 480p, 720p, 1080p, and 4K. That is why a YouTube upload sits in processing for <b>20–30 minutes</b>: the encoder is building those rungs. Each rung is many small files in order. You now have a forest of segments and a new question: which file is segment 3 of 720p?",
      bullets: [
        "Segments are the chunks ABR actually fetches.",
        "Storage multiplies: four rungs is roughly four copies plus overhead.",
        "The pipeline is the expensive part. Playback is 'GET the next segment'."
      ]
    },
    {
      heading: "The index file: m3u8 for HLS, MPD for DASH",
      body: "HLS's table of contents is <code>index.m3u8</code> (a playlist). It lists which variant is 240p / 360p / 480p / 720p and where each segment lives, in order — you do not want segment 7 before 6. The player loads the master playlist, then a variant playlist, then the <code>.ts</code> (or fMP4) segments. In Piyush's ImageKit network tab: first request is m3u8, then 480p's own m3u8, then segment 1, 2, 3. DASH's equivalent is an <code>.mpd</code>. Same idea, different filename. Append a transform on the original MP4 URL to ask the CDN to build HLS or DASH instead of serving the progressive file.",
      bullets: [
        "Master playlist → variant playlist → media segments.",
        "The player may also fetch 240p if it thinks the link is weak, then step up.",
        "Throttle to 3G in DevTools and watch it fall back. That is ABR, not a bug."
      ]
    },
    {
      heading: "Do not build the encode farm first",
      body: "A custom pipeline needs object storage for every rung, workers to encode, and people to keep it up. Piyush's cost line: it is a very expensive setup. Startups offload to a media CDN (the demo is <b>ImageKit</b> plus <b>video.js</b>): upload the MP4, request <code>ik-master.m3u8</code> with the rungs you want, wait for encode, embed. Opening the raw MP4 still progressive-downloads the whole 72 MB file in one shot. The m3u8 URL is the streaming-friendly one. HLS vs DASH on that platform is which suffix you append. You can build the farm later; the system design is still: master → ladder of segments → manifest → client ABR.",
      bullets: [
        "Progressive URL = one MP4. Streaming URL = manifest that points at segments.",
        "Encode time is why you wait after upload, even on a hosted product.",
        "In an interview, draw the ladder and the playlist before naming a vendor."
      ]
    }
  ],

  keyTerms: [
    { term: "Frame", def: "One still image. A video is those stills played at a frame rate (64 / 20 / 1 fps in the talk)." },
    { term: "Progressive download", def: "Fetch the whole file (100 MB, or 4–5 GB) before or while playing. Early-2000s default." },
    { term: "RTMP / RTSP", def: "Chunked streaming protocols from Adobe and RealNetworks. Low latency, live, stop-when-you-leave." },
    { term: "Adaptive bitrate", def: "Offer several qualities; the client climbs or drops with network and screen." },
    { term: "Segment", def: "A short encoded clip at one resolution (480p, 720p, 1080p, 4K) in playback order." },
    { term: "m3u8", def: "HLS playlist / index that lists variants and segment URLs. DASH uses an MPD." },
    { term: "HLS / DASH", def: "Apple HTTP Live Streaming vs MPEG-DASH. Same ladder idea, different manifest." }
  ],

  tradeoffs: [
    { pro: "Progressive download is one file and a dumb origin.", con: "You wait minutes on 4–5 GB and you pay for bytes you never watch." },
    { pro: "RTMP/RTSP chunk so watch time ≈ bytes, with live and low latency.", con: "A 4K chunk can still be ~200 MB; a watch or 30 Mbps link buffers again." },
    { pro: "ABR matches TV, phone, and fridge from one upload.", con: "You store and encode every rung. YouTube's 20–30 min process is that cost." },
    { pro: "A hosted encoder (ImageKit-style) gives m3u8 without a farm.", con: "You depend on their transform URL, regions, and bill. Custom pipelines are effort plus cash." }
  ],

  interviewTips: [
    "Define video as a sequence of frames. Quote 64 vs 20 vs 1 fps, then the 4–5 GB YouTube file.",
    "Progressive download: whole 100 MB first. Name the 6–7 min wait on 4K at 150–200 Mbps.",
    "RTMP = Adobe, RTSP = RealNetworks. Chunks and live, still one quality.",
    "ABR: encode 480p / 720p / 1080p / 4K segments. Watch and fridge do not need 4K.",
    "Walk the network tab: master m3u8 → variant m3u8 → segments. Start low, climb if throughput > bitrate.",
    "HLS is m3u8, DASH is mpd. Draw the pipeline before naming a CDN vendor."
  ],

  scene: {
    nodes: [
      { id: "creator", label: "Creator", type: "user", pos: [-11, 0, 0] },
      { id: "src", label: "4K 4GB master", type: "storage", pos: [-6.5, 0, 0] },
      { id: "nFrame", label: "Video = frames (64 fps)", type: "note", pos: [-8.5, 0, -6.5] },

      { id: "origin", label: "File server", type: "server", pos: [-1, 0, 0], showAt: 1 },
      { id: "nProg", label: "Wait for 100 MB", type: "note", pos: [-1, 0, -6.5], showAt: 1 },

      { id: "rtmp", label: "RTMP Adobe", type: "gateway", pos: [-1, 0, -3.5], showAt: 2 },
      { id: "rtsp", label: "RTSP Real", type: "gateway", pos: [-1, 0, 3.5], showAt: 2 },

      { id: "enc", label: "Encode pipeline", type: "worker", pos: [-1, 0, 0], showAt: 4 },
      { id: "s480", label: "480p segs", type: "queue", pos: [4.5, 0, -5.5], showAt: 4, color: "#fb923c" },
      { id: "s720", label: "720p segs", type: "queue", pos: [4.5, 0, -1.8], showAt: 4, color: "#facc15" },
      { id: "s1080", label: "1080p segs", type: "queue", pos: [4.5, 0, 1.8], showAt: 4, color: "#60a5fa" },
      { id: "s4k", label: "4K segs", type: "queue", pos: [4.5, 0, 5.5], showAt: 4, color: "#c084fc" },
      { id: "nWait", label: "YouTube waits 20–30 min", type: "note", pos: [-1, 0, 6.8], showAt: 4 },

      { id: "m3u8", label: "index.m3u8", type: "cache", pos: [8.5, 0, 0], showAt: 5 },
      { id: "cdn", label: "CDN", type: "cdn", pos: [8.5, 0, -5.5], showAt: 5 },

      { id: "tv", label: "4K monitor", type: "user", pos: [11.5, 0, -5.5], showAt: 6 },
      { id: "phone", label: "Phone 30Mbps", type: "phone", pos: [11.5, 0, 0], showAt: 1 },
      { id: "watch", label: "Watch face", type: "phone", pos: [11.5, 0, 5.5], showAt: 3, color: "#f87171" },
      { id: "nWatch", label: "No 4K on a watch", type: "note", pos: [8.5, 0, 7.2], showAt: 3 },
      { id: "nAbr", label: "Start low, climb if throughput > bitrate", type: "note", pos: [4.5, 0, 7.4], showAt: 7 }
    ],
    edges: [
      { from: "creator", to: "src", label: "upload" },
      { from: "src", to: "origin", showAt: 1 },
      { from: "origin", to: "phone", label: "100 MB", showAt: 1, dashed: true },
      { from: "src", to: "rtmp", showAt: 2 },
      { from: "src", to: "rtsp", showAt: 2 },
      { from: "src", to: "enc", label: "process", showAt: 4 },
      { from: "enc", to: "s480", showAt: 4 },
      { from: "enc", to: "s720", showAt: 4 },
      { from: "enc", to: "s1080", showAt: 4 },
      { from: "enc", to: "s4k", showAt: 4 },
      { from: "s480", to: "m3u8", showAt: 5 },
      { from: "s720", to: "m3u8", showAt: 5 },
      { from: "s1080", to: "m3u8", showAt: 5 },
      { from: "s4k", to: "m3u8", showAt: 5 },
      { from: "m3u8", to: "cdn", showAt: 5, dashed: true },
      { from: "m3u8", to: "tv", label: "4K", showAt: 6 },
      { from: "m3u8", to: "phone", label: "480p", showAt: 6 },
      { from: "s480", to: "watch", showAt: 6, dashed: true }
    ],
    steps: [
      {
        title: "Frames at 64 fps become gigabytes",
        text: "A video is a sequence of stills. 64 fps is smooth, 20 fps is harsher, 1 fps is a slideshow. Sharp frames make a 1 GB 'short' clip and a 4–5 GB YouTube lecture. Playing that as a raw file is the problem.",
        highlight: ["creator", "src", "nFrame"],
        hide: ["origin", "nProg", "rtmp", "rtsp", "enc", "s480", "s720", "s1080", "s4k", "nWait", "m3u8", "cdn", "tv", "phone", "watch", "nWatch", "nAbr"],
        flows: [
          { from: "creator", to: "src", color: "#4ade80", label: "MP4" }
        ]
      },
      {
        title: "Progressive download: whole 100 MB first",
        text: "Early 2000s: the server hands the entire 100 MB to the client. Playback waits for that buffer. On 4–5 GB at 150–200 Mbps that is 6–7 minutes, and you still paid if you quit. That is progressive download, not streaming.",
        highlight: ["origin", "src", "nProg", "phone"],
        hide: ["rtmp", "rtsp", "enc", "s480", "s720", "s1080", "s4k", "nWait", "m3u8", "cdn", "tv", "watch", "nWatch", "nAbr"],
        flows: [
          { from: "src", to: "origin", color: "#60a5fa", label: "file" },
          { from: "origin", to: "phone", color: "#f87171", label: "wait" }
        ]
      },
      {
        title: "RTMP and RTSP send chunks",
        text: "Adobe RTMP and RealNetworks RTSP stream in chunks: live, low latency, stop downloading when you leave. Watch time ≈ bytes. Specialized protocols, still usually one quality.",
        highlight: ["rtmp", "rtsp", "src", "phone"],
        hide: ["origin", "nProg", "enc", "s480", "s720", "s1080", "s4k", "nWait", "m3u8", "cdn", "tv", "watch", "nWatch", "nAbr"],
        flows: [
          { from: "src", to: "rtmp", color: "#fb923c", label: "chunks" },
          { from: "rtmp", to: "phone", color: "#4ade80", label: "play" }
        ]
      },
      {
        title: "A 4K chunk is still huge on a watch",
        text: "One 4K chunk can be ~200 MB on a 100 GB master. Phone, LED, watch, fridge, and a 10–30 Mbps road link do not want the same rung. The user blames the app. This is why adaptive bitrate exists.",
        highlight: ["watch", "nWatch", "phone", "src"],
        fail: ["watch"],
        hide: ["origin", "nProg", "enc", "s480", "s720", "s1080", "s4k", "nWait", "m3u8", "cdn", "tv", "nAbr"],
        flows: [
          { from: "src", to: "watch", color: "#f87171", label: "4K chunk" }
        ]
      },
      {
        title: "Encode 480p, 720p, 1080p, 4K segments",
        text: "Do not ship the 4 GB master. Run a pipeline that cuts the same source into segments at each rung. YouTube's 20–30 min 'processing' is this encode. Storage multiplies with the ladder.",
        highlight: ["enc", "s480", "s720", "s1080", "s4k", "nWait", "src"],
        hide: ["origin", "nProg", "rtmp", "rtsp", "m3u8", "cdn", "tv", "phone", "watch", "nWatch", "nAbr"],
        flows: [
          { from: "src", to: "enc", color: "#c084fc", label: "encode" },
          { from: "enc", to: "s480", color: "#fb923c", label: "480p" },
          { from: "enc", to: "s720", color: "#facc15", label: "720p" },
          { from: "enc", to: "s1080", color: "#60a5fa", label: "1080p" },
          { from: "enc", to: "s4k", color: "#c084fc", label: "4K" }
        ]
      },
      {
        title: "index.m3u8 is the table of contents",
        text: "HLS writes a master playlist that points at each variant and each segment in order. DASH's file is an MPD. The player reads the index, then fetches. A CDN holds the objects close to the viewer.",
        highlight: ["m3u8", "cdn", "s480", "s4k"],
        hide: ["origin", "nProg", "rtmp", "rtsp", "tv", "phone", "watch", "nWatch", "nAbr"],
        flows: [
          { from: "s480", to: "m3u8", color: "#fb923c" },
          { from: "s4k", to: "m3u8", color: "#c084fc" },
          { from: "m3u8", to: "cdn", color: "#22d3ee", label: "cache" }
        ]
      },
      {
        title: "Client picks: 300 Mbps TV vs 30 Mbps phone",
        text: "A 4K monitor at 300 Mbps asks the index for 4K segments. A phone at 30 Mbps takes 480p. Same upload, two ladders. The watch should never have been offered 4K.",
        highlight: ["tv", "phone", "watch", "m3u8", "s4k", "s480"],
        hide: ["origin", "nProg", "rtmp", "rtsp", "nWatch", "nAbr", "nWait"],
        flows: [
          { from: "m3u8", to: "tv", color: "#c084fc", label: "4K" },
          { from: "m3u8", to: "phone", color: "#fb923c", label: "480p" },
          { from: "s480", to: "watch", color: "#fb923c", label: "low" }
        ]
      },
      {
        title: "Start low, climb, fall back on 3G",
        text: "Players usually start at the bottom rung for a fast first frame. If network throughput beats the segment bitrate, request a higher variant. DevTools 3G: fall back. That switch loop is ABR.",
        highlight: ["phone", "s480", "s720", "s1080", "nAbr", "m3u8"],
        hide: ["origin", "nProg", "rtmp", "rtsp", "watch", "nWatch", "nWait", "tv"],
        flows: [
          { from: "m3u8", to: "phone", color: "#fb923c", label: "240p" },
          { from: "s720", to: "phone", color: "#4ade80", label: "climb" }
        ]
      },
      {
        title: "HLS vs DASH, or a hosted encoder",
        text: "Request m3u8 for HLS, mpd for DASH — same ladder. A custom farm is storage, workers, and money. ImageKit-style: upload MP4, wait for encode, embed video.js on the streaming URL. Opening the raw MP4 is still progressive.",
        highlight: ["cdn", "m3u8", "enc", "src", "phone"],
        hide: ["origin", "nProg", "rtmp", "rtsp", "watch", "nWatch", "nWait", "nAbr"],
        flows: [
          { from: "src", to: "enc", color: "#c084fc", label: "transform" },
          { from: "m3u8", to: "phone", color: "#4ade80", label: "HLS" }
        ]
      }
    ]
  }
});
