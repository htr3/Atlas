window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "piyush-garg",
  id: 11,
  title: "System Design Behind Multi-Conference Video Calls - WebRTC vs SFU vs MCU",
  video: "https://www.youtube.com/watch?v=Zaz6hYVm-WE",
  category: "Piyush Garg",
  tagline: "Two peers can talk over WebRTC. A meeting of twelve needs a pipe, not a mixer.",
  summary: "A two-person call is a WebRTC peer-to-peer pipe over UDP with no media server. Mesh extends that idea by opening a P2P link to every other person, which collapses once a fourth, tenth, or twelfth peer joins. A forwarding unit keeps each client on a single WebRTC connection. MCU mixes every audio and video stream into one combined picture — the same trick as a multi-guest YouTube live — and burns CPU. SFU is a pass-through: it forwards raw streams so Google Meet can pin, mute, or ignore one tile locally. Production meetings run on SFU; mediasoup is the open-source unit you would host.",

  theory: [
    {
      heading: "Multi-conference means more than two",
      body: "Zoom and Google Meet are <b>multi-conference</b> apps: more than two people share audio and video at once. That is a real-time problem. You are not posting a file; you are pushing live streams. Two architectural facts collide. First, latency has to stay small. Second, every extra person multiplies who must send and who must receive. The lecture's design path is the industry's path: start with two peers, then mesh, then a server that mixes, then a server that only forwards.",
      bullets: [
        "A peer is any participant. You are a peer. The person on the other laptop is a peer.",
        "Audio is a stream. Video is a stream. The words stay useful when the topology changes.",
        "Two people is a solved case. The hard case starts at three."
      ]
    },
    {
      heading: "WebRTC is a two-peer UDP pipe",
      body: "<b>WebRTC</b> (Web Real-Time Communication) was built so two browsers can talk <b>peer to peer</b> with no media server in the middle. The transport is <b>UDP</b> (User Datagram Protocol) because a late packet is worse than a dropped one. Peer 1 ships its camera and mic to peer 2; peer 2 ships back. There is no box you pay for to mix those bits, so the call is almost free — you only pay your own internet. WebRTC's contract is still \"one peer, one other peer.\" That is a feature for a 1:1 call and a wall for a meeting.",
      bullets: [
        "No server in the media path. Signaling may still exist; the lecture's point is the media path.",
        "UDP over TCP: speed and a direct socket beat reliable retransmission of stale frames.",
        "Technically you can stretch P2P past two people. The protocol was not made for that."
      ]
    },
    {
      heading: "Mesh: every peer opens WebRTC with every peer",
      body: "When a third person walks in, two-person WebRTC has nowhere to put them. <b>Mesh P2P</b> is the workaround: every peer opens a direct WebRTC connection to every other peer. Three people make a triangle. Each still sends its own streams, and each still receives everyone else's, with no server. It works. It is also the last time the graph looks simple. The rule is complete: if you want a multi-conference app and you insist on WebRTC P2P, you are building a mesh.",
      bullets: [
        "Peer 1 connects to 2 and to 3. Peer 2 connects to 3. That is the whole meeting.",
        "Each link is still legal WebRTC. You did not invent a new protocol; you multiplied sockets.",
        "There is still no server cost. The cost moved onto every laptop."
      ]
    },
    {
      heading: "A fourth peer rewires the whole room",
      body: "The new person must consume everyone's stream, so they open a P2P link to each existing peer, and every existing peer opens a link back. All connections get re-established. Four people already look tangled. At <b>10 to 12</b> people the mesh is a complete graph: each laptop holds a dozen live WebRTC sessions, uploads its video a dozen times, and downloads a dozen videos. It is not scalable, not fault tolerant, hard to debug, and it crashes often. One overloaded peer takes a slice of everyone else's call with it. Industry stopped treating mesh as a meeting architecture.",
      bullets: [
        "Adding one peer is O(n) new links, not one join.",
        "Upload copies of your own video grow with the room size. That is the laptop's tax.",
        "Meet and Zoom are not meshes. The lecture is explicit about that."
      ]
    },
    {
      heading: "A forwarding unit: one WebRTC hop to a server",
      body: "The next move is to put a server in the middle and still obey WebRTC's \"only P2P\" rule. WebRTC allows a client to be a peer with a server. So every participant — five people in the drawing — opens <b>one</b> WebRTC connection to a fixed host, something like <code>forwarding-unit.piyush.xyz</code>. The server is large enough to hold many of those sockets. Each client sends its audio and video to that one place. Compared with mesh, the client's job collapsed from \"talk to n people\" to \"talk to the box.\" What the box does with those streams is the fork between MCU and SFU.",
      bullets: [
        "The protocol did not change. The other end of the P2P link became a server.",
        "Clients no longer rewire when a sixth person joins. They already have their one hop.",
        "You now pay for a server. You buy topology that a laptop mesh cannot give you."
      ]
    },
    {
      heading: "MCU mixes everyone into one combined stream",
      body: "An <b>MCU</b> (Multipoint Control Unit) takes every incoming audio and video signal and <b>integrates them into a single stream</b>. Four guests become one picture with four faces and mixed audio. That combined stream goes back down the same WebRTC connection to each peer. You see this on a multi-guest <b>YouTube live</b>: Piyush, Hitesh, Manupal, Anirudh are each connected to a server; viewers get one combined live, not four independent tiles they can rearrange. Mixing on the fly is a CPU-heavy real-time encode. A small lag appears. Server cost jumps. It works — and it is the wrong default for an interactive meeting.",
      bullets: [
        "Each peer still sends one stream and still receives one stream. The server ate the combinatorics.",
        "You cannot locally mute one guest. Their voice is already baked into the mix.",
        "You cannot pin one face full-screen for only yourself. There is only the combined frame."
      ]
    },
    {
      heading: "SFU forwards raw streams and lets the client choose",
      body: "An <b>SFU</b> (Selective Forwarding Unit) is the same star topology with a different server job. Every peer still uploads its stream. The SFU <b>does not mix</b>. It is a pass-through, a tunnel, a pipe. Peer 1 sent one stream and gets three raw streams back: 2, 3, and 4, labeled. Peer 2 gets 1, 3, and 4. The CPU that would have composited video is gone. Because the streams stay separate, the client decides how to render them. Google Meet's tile grow/shrink is this: you received peer 4 as its own stream, so you can put it full-screen for yourself. If peer 1 does not want to hear peer 3, it stops consuming that stream. Nobody else is muted. The \"selective\" in the name also means room isolation — your Meet's streams must not leak into mine.",
      bullets: [
        "Upload once. Download n-1. The server copies packets; it does not re-encode a mosaic.",
        "Mute, pin, and layout are client decisions because the bits were never flattened.",
        "This is what production Meet and Zoom actually run."
      ]
    },
    {
      heading: "Mediasoup is the SFU you would host",
      body: "If you build your own SFU, the lecture's pointer is <b>mediasoup</b>: a low-level selective forwarding unit you drop into a Node server. The interesting design is workers, transports, and routers — not a single process that copies UDP forever. The library is not a toy; the lecture's aside is a 2021 GitHub issue that was closed with \"open source doesn't work like this.\" You do not have to write an SFU to pass the interview. You do have to say: two people get WebRTC P2P, a mesh is the naive n-person version, MCU mixes at high CPU, SFU forwards and lets the client select.",
      bullets: [
        "P2P: two peers, UDP, no media server.",
        "Mesh: n peers, n(n-1)/2 links, does not scale.",
        "MCU: mix to one stream. SFU: forward as separate streams. Ship SFU."
      ]
    }
  ],

  keyTerms: [
    { term: "Peer", def: "Any participant in the call. WebRTC's unit of connection is peer-to-peer, even when the other peer is a server." },
    { term: "WebRTC", def: "Browser real-time stack for a direct media path, typically over UDP. Designed for two parties." },
    { term: "Mesh P2P", def: "Every peer opens a WebRTC link to every other peer so a meeting can exist without a media server." },
    { term: "MCU", def: "Multipoint Control Unit. A server that mixes many audio/video signals into one combined stream and sends that stream back." },
    { term: "SFU", def: "Selective Forwarding Unit. A server that copies raw streams to the right rooms and peers without mixing them." },
    { term: "Forwarding unit", def: "The central WebRTC peer all clients connect to. MCU and SFU are two jobs that unit can do." },
    { term: "Mediasoup", def: "Open-source SFU built from workers, transports, and routers that you can run in your own Node process." }
  ],

  tradeoffs: [
    { pro: "P2P WebRTC has no media-server bill and the lowest possible hop count for two people.", con: "The protocol does not give you a meeting. Stretching it is mesh." },
    { pro: "Mesh still has no server and uses only legal WebRTC links.", con: "A new peer rewires everyone. At 10–12 people laptops crash and debugging is ugly." },
    { pro: "MCU: one connection per client, one stream back, simple receivers, works for a combined YouTube live.", con: "Real-time mixing is CPU-expensive, adds lag, and kills per-person mute and pin." },
    { pro: "SFU: server is a pipe, clients layout tiles, Meet/Zoom-style control, cheaper CPU than mixing.", con: "Each client downloads n-1 streams, and the SFU must still select the right room's packets." },
    { pro: "One WebRTC hop to a hosted SFU (mediasoup) is how you actually ship a conference.", con: "You now operate a real-time server. P2P's \"almost free\" property is gone." }
  ],

  interviewTips: [
    "Start at two peers. WebRTC over UDP, no media server, each side sends its streams. Then ask what happens at three.",
    "Mesh is complete P2P. Adding the nth person creates n-1 new links. Say 10–12 people and the graph falls over.",
    "MCU mixes to one combined stream. Quote the YouTube live: guests uplink separately, viewers see one picture they cannot split.",
    "SFU does not mix. It forwards raw streams. That is why you can mute one person or enlarge one tile for only yourself.",
    "Selective also means rooms: do not forward meeting A's packets into meeting B.",
    "Name mediasoup if they ask what you would run. Name Meet/Zoom if they ask what production uses."
  ],

  scene: {
    nodes: [
      { id: "p1", label: "Peer 1", type: "user", pos: [-8, 0, -3] },
      { id: "p2", label: "Peer 2", type: "user", pos: [8, 0, -3] },
      { id: "p3", label: "Peer 3", type: "user", pos: [-8, 0, 4], showAt: 1 },
      { id: "p4", label: "Peer 4", type: "user", pos: [8, 0, 4], showAt: 3 },
      { id: "n0", label: "WebRTC UDP, no server", type: "note", pos: [0, 0, -7] },
      { id: "nMesh", label: "Mesh: every peer to every peer", type: "note", pos: [0, 0, -7], showAt: 2 },
      { id: "mcu", label: "MCU mixer", type: "server", pos: [0, 0, 0.5], showAt: 4 },
      { id: "mix", label: "Combined stream", type: "cdn", pos: [0, 0, 6.5], showAt: 5 },
      { id: "nCpu", label: "On-the-go mix is CPU + lag", type: "note", pos: [-7, 0, 7], showAt: 6 },
      { id: "sfu", label: "SFU pipe", type: "lb", pos: [0, 0, 0.5], showAt: 7 },
      { id: "nSel", label: "Mute 3 / pin 4 locally", type: "note", pos: [7, 0, 7], showAt: 8 }
    ],
    edges: [
      { from: "p1", to: "mcu", showAt: 4 },
      { from: "p2", to: "mcu", showAt: 4 },
      { from: "p3", to: "mcu", showAt: 4 },
      { from: "p4", to: "mcu", showAt: 4 },
      { from: "mcu", to: "mix", showAt: 5 },
      { from: "p1", to: "sfu", showAt: 7 },
      { from: "p2", to: "sfu", showAt: 7 },
      { from: "p3", to: "sfu", showAt: 7 },
      { from: "p4", to: "sfu", showAt: 7 }
    ],
    steps: [
      {
        title: "Two peers, one WebRTC pipe",
        text: "Peer 1 and peer 2 exchange audio and video over UDP. There is no media server. WebRTC was built for this 1:1 path, so the call is almost free besides bandwidth.",
        highlight: ["p1", "p2", "n0"],
        hide: ["nMesh"],
        flows: [
          { from: "p1", to: "p2", color: "#4ade80", label: "A/V" },
          { from: "p2", to: "p1", color: "#60a5fa", label: "A/V" }
        ]
      },
      {
        title: "A third peer has nowhere to sit",
        text: "Peer 3 wants in. WebRTC still only pairs two endpoints. A direct link between 1 and 2 does not give 3 their streams. This is the moment multi-conference stops being a two-person protocol.",
        highlight: ["p3", "p1", "p2", "n0"],
        hide: ["nMesh"],
        flows: [
          { from: "p1", to: "p2", color: "#4ade80", label: "still 1:1" }
        ]
      },
      {
        title: "Mesh: every peer talks to every peer",
        text: "Each pair opens its own WebRTC session. 1-2, 1-3, 2-3. Still no server. This is how you force a meeting onto P2P, and it is already a complete graph.",
        highlight: ["p1", "p2", "p3", "nMesh"],
        hide: ["n0"],
        flows: [
          { from: "p1", to: "p2", color: "#4ade80", label: "P2P" },
          { from: "p1", to: "p3", color: "#4ade80", label: "P2P" },
          { from: "p2", to: "p3", color: "#60a5fa", label: "P2P" }
        ]
      },
      {
        title: "Fourth peer rewires everyone",
        text: "Peer 4 must connect to 1, 2, and 3, and they all connect back. One join rebuilds the mesh. At 10–12 people each laptop holds a dozen live sessions. Not scalable, not fault tolerant, crashes.",
        highlight: ["p1", "p2", "p3", "p4", "nMesh"],
        hide: ["n0"],
        flows: [
          { from: "p4", to: "p1", color: "#fb923c", label: "new" },
          { from: "p4", to: "p2", color: "#fb923c", label: "new" },
          { from: "p4", to: "p3", color: "#fb923c", label: "new" },
          { from: "p1", to: "p2", color: "#60a5fa", label: "mesh" }
        ]
      },
      {
        title: "One hop to a forwarding unit",
        text: "Keep WebRTC, change the other peer. Each client opens a single connection to a central server. Five people would still be five sockets on the box, not a mesh on the laptops.",
        highlight: ["p1", "p2", "p3", "p4", "mcu"],
        hide: ["n0", "nMesh", "sfu"],
        flows: [
          { from: "p1", to: "mcu", color: "#4ade80", label: "uplink" },
          { from: "p2", to: "mcu", color: "#4ade80", label: "uplink" },
          { from: "p3", to: "mcu", color: "#4ade80", label: "uplink" },
          { from: "p4", to: "mcu", color: "#4ade80", label: "uplink" }
        ]
      },
      {
        title: "MCU mixes into one combined stream",
        text: "The mixer composites four faces and four mics into one picture and sends that single stream back. Same idea as a multi-guest YouTube live: you cannot split the guests apart on the receiving side.",
        highlight: ["mcu", "mix", "p1", "p2", "p3", "p4"],
        hide: ["n0", "nMesh", "sfu"],
        flows: [
          { from: "p1", to: "mcu", color: "#4ade80", label: "raw" },
          { from: "mcu", to: "mix", color: "#c084fc", label: "mix" },
          { from: "mix", to: "p1", color: "#60a5fa", label: "one stream" },
          { from: "mix", to: "p2", color: "#60a5fa", label: "one stream" }
        ]
      },
      {
        title: "Mixing is CPU, lag, and a stuck layout",
        text: "Compositing on the go is expensive. A little lag shows up and the bill rises. You also cannot mute one guest locally — their audio is already in the mix — and you cannot pin one tile just for yourself.",
        highlight: ["mcu", "mix", "nCpu", "p3"],
        hide: ["n0", "nMesh", "sfu"],
        fail: ["mcu"],
        flows: [
          { from: "mcu", to: "mix", color: "#f87171", label: "CPU mix" },
          { from: "mix", to: "p1", color: "#fb923c", label: "baked A/V" }
        ]
      },
      {
        title: "SFU is a pipe, not a mixer",
        text: "Same star, no composite. Each peer uploads once. The SFU forwards everyone else's raw streams as separate feeds. The server is a tunnel. Google Meet and Zoom run this.",
        highlight: ["sfu", "p1", "p2", "p3", "p4"],
        hide: ["n0", "nMesh", "mcu", "mix", "nCpu"],
        flows: [
          { from: "p1", to: "sfu", color: "#4ade80", label: "upload 1" },
          { from: "sfu", to: "p2", color: "#60a5fa", label: "1" },
          { from: "sfu", to: "p3", color: "#60a5fa", label: "1" },
          { from: "sfu", to: "p4", color: "#60a5fa", label: "1" }
        ]
      },
      {
        title: "Select: ignore 3, pin 4",
        text: "Peer 1 can stop consuming peer 3 and enlarge peer 4 because those streams arrived unmixed. Selective also means rooms: only forward the meeting you belong to. That is the production multi-conference design.",
        highlight: ["sfu", "p1", "p4", "nSel"],
        hide: ["n0", "nMesh", "mcu", "mix", "nCpu"],
        fail: ["p3"],
        flows: [
          { from: "sfu", to: "p1", color: "#60a5fa", label: "2" },
          { from: "sfu", to: "p1", color: "#c084fc", label: "4 pin" },
          { from: "p3", to: "sfu", color: "#f87171", label: "ignored" }
        ]
      }
    ]
  }
});
