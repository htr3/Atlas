const abdulBariMissing = new Set([24, 28, 29, 31, 49, 52, 62]);
const abdulBariIds = Array.from({ length: 84 }, (_, index) => index + 1)
  .filter((id) => !abdulBariMissing.has(id));
const piyushGargIds = Array.from({ length: 15 }, (_, index) => index + 1);
const roadmapIds = Array.from({ length: 40 }, (_, index) => index + 1);
await Promise.all([
  ...abdulBariIds.map((id) => import(`../data/abdul-bari/lecture-${id}.js`)),
  ...piyushGargIds.map((id) => import(`../data/piyush-garg/lecture-${id}.js`)),
  ...roadmapIds.map((id) => import(`../data/sd-roadmap/lecture-${id}.js`))
]);

const seenLessons = new Set();
const lectures = (window.LECTURES || [])
  .map((lecture) => ({ ...lecture, course: lecture.course || "system-design" }))
  .filter((lecture) => {
    const key = `${lecture.course}/${lecture.id}`;
    if (seenLessons.has(key)) return false;
    seenLessons.add(key);
    return true;
  })
  .sort((a, b) => a.course.localeCompare(b.course) || a.id - b.id);
const courses = [
  { id: "system-design", label: "System Design", note: "Original 26" },
  { id: "concepts", label: "New Concepts", note: "Not covered before" },
  { id: "lld", label: "Low-Level Design", note: "10 new lessons" },
  { id: "marvel", label: "Design Marvel", note: "11 paper lessons" },
  { id: "interview", label: "Interview Prep", note: "13 algorithm lessons" },
  { id: "competitive", label: "Competitive", note: "CP algorithms" },
  { id: "abdul-bari", label: "Abdul Bari", note: "77 algorithm lessons" },
  { id: "piyush-garg", label: "Piyush Garg", note: "15 system design lessons" },
  { id: "sd-roadmap", label: "SD Roadmap", note: "40 missing-topic lessons" }
];
const categoryOrder = [
  "Fundamentals", "Building Blocks", "Data & Storage", "Communication",
  "Case Studies", "Interview Prep", "Advanced Concepts", "Service Patterns", "Kafka", "Low-Level Design", "Paper Walkthroughs",
  "Competitive Programming",
  "Algorithm Foundations", "Divide & Conquer", "Greedy Algorithms",
  "Dynamic Programming", "Graphs & Backtracking", "Branch, Bound & Complexity",
  "Strings, Trees & Arrays", "Piyush Garg",
  "Roadmap Foundations", "Networking", "Data Modeling", "Caching and Scale",
  "Messaging", "Distributed Systems", "Reliability and Security",
  "Cloud and Architecture", "Operations", "Advanced Systems",
  "Design Principles", "Interview Method", "Roadmap Case Studies"
];
const $ = (selector) => document.querySelector(selector);
const el = {
  list: $("#lectureList"),
  search: $("#lectureSearch"),
  breadcrumb: $("#breadcrumbTitle"),
  number: $("#lessonNumber"),
  category: $("#categoryChip"),
  title: $("#lectureTitle"),
  tagline: $("#lectureTagline"),
  video: $("#videoLink"),
  summary: $("#lectureSummary"),
  sections: $("#theorySections"),
  terms: $("#keyTerms"),
  tradeoffs: $("#tradeoffs"),
  tradeoffsCard: $("#tradeoffsCard"),
  tips: $("#interviewTips"),
  stepCounter: $("#stepCounter"),
  stepDots: $("#stepDots"),
  stepTitle: $("#stepTitle"),
  stepText: $("#stepText"),
  prevStep: $("#prevStep"),
  nextStep: $("#nextStep"),
  play: $("#playSteps"),
  complete: $("#completeLesson"),
  completeBox: $(".lesson-complete"),
  prevLecture: $("#prevLecture"),
  nextLecture: $("#nextLecture"),
  prevLectureTitle: $("#prevLectureTitle"),
  nextLectureTitle: $("#nextLectureTitle"),
  progressText: $("#progressText"),
  progressBar: $("#progressBar"),
  canvasWrap: $("#canvasWrap"),
  loading: $("#loadingState")
};

function lessonKey(lecture) {
  return `${lecture.course}/${lecture.id}`;
}

function courseLectures(courseId = activeCourse) {
  return lectures.filter((lecture) => lecture.course === courseId);
}

function indexFromHash() {
  const raw = decodeURIComponent(location.hash.slice(1));
  if (!raw) return Math.max(0, lectures.findIndex((lecture) => lecture.course === "system-design" && lecture.id === 1));
  const [course, idText] = raw.includes("/") ? raw.split("/") : ["system-design", raw];
  const index = lectures.findIndex((lecture) => lecture.course === course && lecture.id === Number(idText));
  return index >= 0 ? index : Math.max(0, lectures.findIndex((lecture) => lecture.course === "system-design" && lecture.id === 1));
}

let lectureIndex = indexFromHash();
let activeCourse = lectures[lectureIndex]?.course || "system-design";
let stepIndex = 0;
let playTimer = null;
let completed = new Set(JSON.parse(localStorage.getItem("sd-atlas-complete") || "[]").map((item) => (
  typeof item === "number" ? `system-design/${item}` : item
)));

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"
  }[character]));
}

function saveProgress() {
  localStorage.setItem("sd-atlas-complete", JSON.stringify([...completed]));
  const current = courseLectures();
  const count = current.filter((lecture) => completed.has(lessonKey(lecture))).length;
  el.progressText.textContent = `${count} / ${current.length}`;
  el.progressBar.style.width = `${current.length ? (count / current.length) * 100 : 0}%`;
  $("#courseCount").textContent = `${current.length} lessons`;
}

function renderCourseSwitch() {
  $("#courseSwitch").innerHTML = courses.map((course) => `
    <button class="${course.id === activeCourse ? "active" : ""}" data-course="${course.id}" role="tab" aria-selected="${course.id === activeCourse}">
      ${course.label}
      <small>${course.note} · ${courseLectures(course.id).length}</small>
    </button>
  `).join("");
  $("#courseSwitch").querySelectorAll("[data-course]").forEach((button) => {
    button.addEventListener("click", () => {
      const first = lectures.findIndex((lecture) => lecture.course === button.dataset.course);
      if (first >= 0) selectLecture(first);
    });
  });
}

function renderLectureList(query = "") {
  const needle = query.trim().toLowerCase();
  const filtered = courseLectures().filter((lecture) =>
    `${lecture.title} ${lecture.category} ${lecture.tagline}`.toLowerCase().includes(needle)
  );

  if (!filtered.length) {
    el.list.innerHTML = `<p class="no-results">No lecture matches “${escapeHtml(query)}”.</p>`;
    return;
  }

  el.list.innerHTML = categoryOrder.map((category) => {
    const items = filtered.filter((lecture) => lecture.category === category);
    if (!items.length) return "";
    return `
      <div class="category-label">${category}</div>
      ${items.map((lecture) => `
        <button class="lecture-item ${lessonKey(lecture) === lessonKey(lectures[lectureIndex]) ? "active" : ""} ${completed.has(lessonKey(lecture)) ? "complete" : ""}" data-course="${lecture.course}" data-lecture="${lecture.id}">
          <span class="lecture-name">${escapeHtml(lecture.title)}</span>
          <i class="complete-dot"></i>
        </button>
      `).join("")}
    `;
  }).join("");

  el.list.querySelectorAll("[data-lecture]").forEach((button) => {
    button.addEventListener("click", () => {
      selectLecture(lectures.findIndex((lecture) => lecture.course === button.dataset.course && lecture.id === Number(button.dataset.lecture)));
      document.body.classList.remove("sidebar-open");
    });
  });
}

function renderTheory(lecture) {
  el.summary.textContent = lecture.summary;
  el.sections.innerHTML = lecture.theory.map((section, index) => `
    <section class="theory-section" data-index="${String(index + 1).padStart(2, "0")}">
      <h3>${escapeHtml(section.heading)}</h3>
      <p>${section.body}</p>
      ${section.bullets?.length ? `<ul>${section.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>` : ""}
    </section>
  `).join("");

  el.terms.innerHTML = lecture.keyTerms.map(({ term, def }) =>
    `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(def)}</dd>`
  ).join("");

  el.tradeoffsCard.hidden = !lecture.tradeoffs?.length;
  el.tradeoffs.innerHTML = (lecture.tradeoffs || []).map(({ pro, con }) => `
    <div class="tradeoff pro"><i>+</i><span>${escapeHtml(pro)}</span></div>
    <div class="tradeoff con"><i>−</i><span>${escapeHtml(con)}</span></div>
  `).join("");

  el.tips.innerHTML = lecture.interviewTips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("");
}

function renderLessonNav() {
  const current = lectures[lectureIndex];
  const list = courseLectures(current.course);
  const at = list.findIndex((lecture) => lecture.id === current.id);
  const previous = list[at - 1];
  const next = list[at + 1];
  el.prevLecture.disabled = !previous;
  el.nextLecture.disabled = !next;
  el.prevLectureTitle.textContent = previous ? previous.title : "Start of course";
  el.nextLectureTitle.textContent = next ? next.title : "Course complete";
}

function renderComplete() {
  const done = completed.has(lessonKey(lectures[lectureIndex]));
  el.completeBox.classList.toggle("done", done);
  el.complete.textContent = done ? "Completed ✓" : "Mark as complete";
}

function selectLecture(index, updateHash = true) {
  lectureIndex = Math.max(0, Math.min(lectures.length - 1, index));
  stepIndex = 0;
  stopPlayback();
  const lecture = lectures[lectureIndex];

  activeCourse = lecture.course;
  if (updateHash) history.replaceState(null, "", `#${lessonKey(lecture)}`);
  document.title = `${lecture.title} — System Design Atlas`;
  el.breadcrumb.textContent = lecture.title;
  el.number.textContent = courses.find((course) => course.id === lecture.course)?.label.toUpperCase() || "COURSE";
  el.category.textContent = lecture.category;
  el.title.textContent = lecture.title;
  el.tagline.textContent = lecture.tagline;
  el.video.hidden = !lecture.video;
  if (lecture.video) el.video.href = lecture.video;
  renderTheory(lecture);
  renderCourseSwitch();
  renderLectureList(el.search.value);
  renderLessonNav();
  renderComplete();
  renderSteps();

  el.loading.classList.remove("hidden");
  requestAnimationFrame(() => {
    buildScene(lecture.scene);
    setTimeout(() => el.loading.classList.add("hidden"), 180);
  });
}

function renderSteps() {
  const steps = lectures[lectureIndex].scene.steps;
  const step = steps[stepIndex];
  el.stepCounter.textContent = `${String(stepIndex + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
  el.stepTitle.textContent = step.title;
  el.stepText.textContent = step.text;
  el.prevStep.disabled = stepIndex === 0;
  el.nextStep.disabled = stepIndex === steps.length - 1;
  el.stepDots.innerHTML = steps.map((_, index) =>
    `<button class="${index === stepIndex ? "active" : ""}" data-step="${index}" aria-label="Go to step ${index + 1}"></button>`
  ).join("");
  el.stepDots.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => setStep(Number(button.dataset.step)));
  });
  applyStep(stepIndex);
}

function setStep(index) {
  const max = lectures[lectureIndex].scene.steps.length - 1;
  stepIndex = Math.max(0, Math.min(max, index));
  renderSteps();
}

function stopPlayback() {
  clearInterval(playTimer);
  playTimer = null;
  el.play.innerHTML = "<span>▶</span>";
}

function togglePlayback() {
  if (playTimer) {
    stopPlayback();
    return;
  }
  el.play.innerHTML = "<span>Ⅱ</span>";
  playTimer = setInterval(() => {
    const last = lectures[lectureIndex].scene.steps.length - 1;
    if (stepIndex >= last) {
      stopPlayback();
      return;
    }
    setStep(stepIndex + 1);
  }, 4300);
}

// --- 2D architecture visualizer --------------------------------------------

const svg = $("#sceneCanvas");
const viewport = $("#diagramViewport");
const typeColors = {
  user: "#5eead4", phone: "#5eead4", server: "#60a5fa", service: "#818cf8",
  lb: "#ff6a3d", gateway: "#fb923c", db: "#c084fc", cache: "#facc15",
  queue: "#fb923c", cdn: "#22d3ee", storage: "#a78bfa", worker: "#4ade80",
  point: "#e2e8f0", zone: "#64748b", note: "#ff8a66"
};
let currentScene = null;
let diagramTransform = { x: 0, y: 0, scale: 1 };
let dragState = null;

function pointFor(node) {
  return { x: node.pos[0], y: node.pos[2] };
}

function visibleNodes(sceneSpec, step, index) {
  const hidden = new Set(step.hide || []);
  return new Map(sceneSpec.nodes
    .filter((node) => index >= (node.showAt || 0) && !hidden.has(node.id))
    .map((node) => [node.id, node]));
}

function shapeFor(node) {
  switch (node.type) {
    case "zone": {
      const width = node.size?.[0] || 5;
      const height = node.size?.[1] || 4;
      return `<rect class="node-shape" x="${-width / 2}" y="${-height / 2}" width="${width}" height="${height}" rx=".3"></rect>
        <text class="node-label" x="${-width / 2 + .25}" y="${-height / 2 + .45}">${escapeHtml(node.label)}</text>`;
    }
    case "note": {
      const width = Math.min(7.2, Math.max(2.4, (node.label || "").length * .19));
      return `<rect class="note-box" x="${-width / 2}" y="-.42" width="${width}" height=".84" rx=".18"></rect>
        <text class="node-label" y=".1">${escapeHtml(node.label)}</text>`;
    }
    case "db":
      return `<path class="node-shape" d="M-1-.48 C-1-.82 1-.82 1-.48 V.55 C1 .9-1 .9-1 .55Z"></path>
        <ellipse class="node-detail" cx="0" cy="-.48" rx="1" ry=".34"></ellipse>
        <path class="node-detail" d="M-1 .03 C-1 .37 1 .37 1 .03 M-1 .42 C-1 .76 1 .76 1 .42"></path>`;
    case "user":
      return `<circle class="node-shape" cx="0" cy="-.45" r=".42"></circle>
        <path class="node-shape" d="M-.7 .72 C-.65.05.65.05.7.72Z"></path>`;
    case "phone":
      return `<rect class="node-shape" x="-.48" y="-.82" width=".96" height="1.64" rx=".16"></rect>
        <path class="node-detail" d="M-.28-.58 H.28 M-.16.6 H.16"></path>`;
    case "lb":
    case "gateway":
      return `<path class="node-shape" d="M0-.9 L1 0 0 .9 -1 0Z"></path>
        <path class="node-detail" d="M-.48 0 H.48 M.2-.26 L.48 0 .2.26"></path>`;
    case "queue":
      return `<rect class="node-shape" x="-1.05" y="-.6" width="2.1" height="1.2" rx=".18"></rect>
        <rect class="node-detail" x="-.78" y="-.27" width=".36" height=".54" rx=".05"></rect>
        <rect class="node-detail" x="-.18" y="-.27" width=".36" height=".54" rx=".05"></rect>
        <rect class="node-detail" x=".42" y="-.27" width=".36" height=".54" rx=".05"></rect>`;
    case "cache":
      return `<rect class="node-shape" x="-.9" y="-.55" width="1.8" height="1.1" rx=".14"></rect>
        <path class="node-detail" d="M-.65-.2 H.65 M-.65.18 H.65"></path>`;
    case "storage":
      return `<path class="node-shape" d="M-1-.55 H-.25 L.05-.3 H1 V.68 H-1Z"></path>
        <path class="node-detail" d="M-.72.03 H.72 M-.72.35 H.35"></path>`;
    case "cdn":
      return `<path class="node-shape" d="M-.8-.56 L0-.9 .8-.56 .9.35 0 .88-.9.35Z"></path>
        <path class="node-detail" d="M-.58-.2 H.58 M-.58.15 H.58"></path>`;
    case "worker":
      return `<circle class="node-shape" r=".82"></circle>
        <path class="node-detail" d="M-.36.08 L-.08.35 .42-.34 M0-.82 V-.62 M0 .62 V.82 M-.82 0 H-.62 M.62 0 H.82"></path>`;
    case "point":
      return `<circle class="node-shape" r=".25"></circle>`;
    default:
      return `<rect class="node-shape" x="-.9" y="-.65" width="1.8" height="1.3" rx=".2"></rect>
        <path class="node-detail" d="M-.55-.25 H.55 M-.55.08 H.35 M-.55.4 H.12"></path>`;
  }
}

function nodeMarkup(node, highlighted, failed) {
  const { x, y } = pointFor(node);
  const classes = [
    "diagram-node", `${node.type}-node`,
    highlighted.has(node.id) ? "highlighted" : "",
    failed.has(node.id) ? "failed" : ""
  ].filter(Boolean).join(" ");
  const labelBelow = !["zone", "note"].includes(node.type) && node.label;
  return `<g class="${classes}" transform="translate(${x} ${y})" style="--node-color:${node.color || typeColors[node.type] || "#60a5fa"}">
    ${shapeFor(node)}
    ${labelBelow ? `<text class="node-label" y="1.25">${escapeHtml(node.label)}</text>
      <text class="node-type" y="1.58">${escapeHtml(node.type)}</text>` : ""}
    ${failed.has(node.id) && node.type !== "zone" ? `<path d="M-.55-.55 L.55.55 M.55-.55 L-.55.55" stroke="#f87171" stroke-width=".11"></path>` : ""}
  </g>`;
}

function edgePath(from, to) {
  const a = pointFor(from);
  const b = pointFor(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  const insetA = from.type === "point" ? .3 : .88;
  const insetB = to.type === "point" ? .3 : .98;
  const x1 = a.x + dx / length * insetA;
  const y1 = a.y + dy / length * insetA;
  const x2 = b.x - dx / length * insetB;
  const y2 = b.y - dy / length * insetB;
  return { d: `M${x1} ${y1} L${x2} ${y2}`, x1, y1, x2, y2 };
}

function edgeMarkup(edge, nodes) {
  const path = edgePath(nodes.get(edge.from), nodes.get(edge.to));
  const midX = (path.x1 + path.x2) / 2;
  const midY = (path.y1 + path.y2) / 2 - .16;
  return `<g>
    <path class="diagram-edge ${edge.dashed ? "dashed" : ""}" d="${path.d}"></path>
    ${edge.label ? `<text class="edge-label" x="${midX}" y="${midY}" text-anchor="middle">${escapeHtml(edge.label)}</text>` : ""}
  </g>`;
}

function flowMarkup(flow, nodes, index) {
  const from = nodes.get(flow.from);
  const to = nodes.get(flow.to);
  if (!from || !to) return "";
  const path = edgePath(from, to);
  const color = flow.color || "#4ade80";
  const midX = (path.x1 + path.x2) / 2;
  const midY = (path.y1 + path.y2) / 2 - .28;
  return `<g>
    <path class="flow-path" d="${path.d}" stroke="${color}"></path>
    <circle class="flow-packet" r=".13" fill="${color}">
      <animateMotion dur="${1.7 + index * .12}s" begin="${index * -.35}s" repeatCount="indefinite" path="${path.d}"></animateMotion>
    </circle>
    ${flow.label ? `<text class="flow-label" x="${midX}" y="${midY}" fill="${color}">${escapeHtml(flow.label)}</text>` : ""}
  </g>`;
}

function updateDiagramTransform() {
  viewport.setAttribute("transform", `translate(${diagramTransform.x} ${diagramTransform.y}) scale(${diagramTransform.scale})`);
}

function resetDiagramView() {
  diagramTransform = { x: 0, y: 0, scale: 1 };
  updateDiagramTransform();
}

function renderDiagram(index) {
  if (!currentScene) return;
  const step = currentScene.steps[index];
  if (!step) return;
  const nodes = visibleNodes(currentScene, step, index);
  const highlighted = new Set(step.highlight || []);
  const failed = new Set(step.fail || []);
  const zones = [...nodes.values()].filter((node) => node.type === "zone");
  const regular = [...nodes.values()].filter((node) => node.type !== "zone");
  const edges = currentScene.edges.filter((edge) =>
    index >= (edge.showAt || 0) && nodes.has(edge.from) && nodes.has(edge.to)
  );

  viewport.innerHTML = [
    zones.map((node) => nodeMarkup(node, highlighted, failed)).join(""),
    edges.map((edge) => edgeMarkup(edge, nodes)).join(""),
    (step.flows || []).map((flow, flowIndex) => flowMarkup(flow, nodes, flowIndex)).join(""),
    regular.map((node) => nodeMarkup(node, highlighted, failed)).join("")
  ].join("");
  updateDiagramTransform();
}

function buildScene(sceneSpec) {
  currentScene = sceneSpec;
  resetDiagramView();
  renderDiagram(0);
}

function applyStep(index) {
  renderDiagram(index);
}

svg.addEventListener("wheel", (event) => {
  event.preventDefault();
  const direction = event.deltaY > 0 ? .9 : 1.1;
  diagramTransform.scale = Math.min(2.5, Math.max(.55, diagramTransform.scale * direction));
  updateDiagramTransform();
}, { passive: false });

svg.addEventListener("pointerdown", (event) => {
  dragState = { x: event.clientX, y: event.clientY, startX: diagramTransform.x, startY: diagramTransform.y };
  svg.setPointerCapture(event.pointerId);
  svg.classList.add("dragging");
});
svg.addEventListener("pointermove", (event) => {
  if (!dragState) return;
  const rect = svg.getBoundingClientRect();
  diagramTransform.x = dragState.startX + (event.clientX - dragState.x) * 28 / rect.width;
  diagramTransform.y = dragState.startY + (event.clientY - dragState.y) * 20 / rect.height;
  updateDiagramTransform();
});
svg.addEventListener("pointerup", () => {
  dragState = null;
  svg.classList.remove("dragging");
});
svg.addEventListener("dblclick", resetDiagramView);

// --- Interface events ------------------------------------------------------

el.search.addEventListener("input", (event) => renderLectureList(event.target.value));
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== el.search) {
    event.preventDefault();
    el.search.focus();
  }
  if (event.target.matches("input")) return;
  if (event.key === "ArrowRight") setStep(stepIndex + 1);
  if (event.key === "ArrowLeft") setStep(stepIndex - 1);
  if (event.key === " ") {
    event.preventDefault();
    togglePlayback();
  }
});

el.prevStep.addEventListener("click", () => setStep(stepIndex - 1));
el.nextStep.addEventListener("click", () => setStep(stepIndex + 1));
el.play.addEventListener("click", togglePlayback);
function selectRelativeLecture(offset) {
  const current = lectures[lectureIndex];
  const list = courseLectures(current.course);
  const target = list[list.findIndex((lecture) => lecture.id === current.id) + offset];
  if (!target) return;
  selectLecture(lectures.findIndex((lecture) => lessonKey(lecture) === lessonKey(target)));
}
el.prevLecture.addEventListener("click", () => selectRelativeLecture(-1));
el.nextLecture.addEventListener("click", () => selectRelativeLecture(1));

el.complete.addEventListener("click", () => {
  const key = lessonKey(lectures[lectureIndex]);
  completed.has(key) ? completed.delete(key) : completed.add(key);
  saveProgress();
  renderComplete();
  renderLectureList(el.search.value);
});

$("#resetProgress").addEventListener("click", () => {
  if (!confirm("Clear all completed-lecture progress?")) return;
  completed.clear();
  saveProgress();
  renderComplete();
  renderLectureList(el.search.value);
});

$("#theoryToggle").addEventListener("click", () => {
  $("#theoryPanel").scrollIntoView({ behavior: "smooth" });
});
$("#closeTheory").addEventListener("click", () => {
  $(".visual-stage").scrollIntoView({ behavior: "smooth" });
});
$("#resetCamera").addEventListener("click", resetDiagramView);
$("#fullscreen").addEventListener("click", async () => {
  if (!document.fullscreenElement) await el.canvasWrap.requestFullscreen();
  else await document.exitFullscreen();
});

function toggleSidebar(open) {
  document.body.classList.toggle("sidebar-open", open);
}
$("#openSidebar").addEventListener("click", () => toggleSidebar(true));
$("#closeSidebar").addEventListener("click", () => toggleSidebar(false));
$("#mobileScrim").addEventListener("click", () => toggleSidebar(false));

window.addEventListener("hashchange", () => {
  const index = indexFromHash();
  if (index !== lectureIndex) selectLecture(index, false);
});

saveProgress();
selectLecture(lectureIndex, !location.hash);
