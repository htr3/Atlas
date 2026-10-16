window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 22,
  title: "Docker and Kubernetes Architecture",
  video: "",
  category: "Cloud and Architecture",
  tagline: "A container is a packaged process. Kubernetes is the control plane that keeps the right number of those processes alive.",
  summary: "Docker turns a Spring Boot jar plus a JRE into an image: layers you can ship. A container is that image running with isolated files and ports, not a tiny VM. Kubernetes schedules pods onto nodes, keeps a replica count, exposes them with Services, and takes traffic through Ingress. The control plane (API server, etcd, scheduler, controllers) is the brain; kubelet is the hands. JVM heap must fit inside the container memory limit or the node OOM-kills a healthy Java process.",

  theory: [
    {
      heading: "A container is a process with a filesystem, not a VM",
      body: "A VM virtualizes hardware and boots a guest kernel. A <b>container</b> shares the host kernel and isolates with namespaces (pid, net, mount) and cgroups (CPU, memory). That is why a container starts in seconds and why <code>FROM eclipse-temurin:21-jre</code> plus your jar is enough. Docker builds an <b>image</b> as stacked layers: base JRE, copied jar, entrypoint. Changing the jar invalidates only the top layers, so deploys stay small. The running instance is a container. Do not store user uploads in the container filesystem; that disk dies with the pod.",
      bullets: [
        "Image = immutable layers. Container = a running writable layer on top.",
        "One process per container is the contract Kubernetes health checks assume.",
        "A fat jar still needs a base OS userspace (glibc, certs). Distroless or JRE-slim is the usual Spring choice."
      ]
    },
    {
      heading: "Dockerfile choices that matter for Java",
      body: "Copy the jar last so dependency layers cache. Run as a non-root user. Set <code>JAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=75</code> so the heap tracks the cgroup, not the node's 64 GB. A container limit of 512 MiB with <code>-Xmx2g</code> is a pagefile of death: the JVM thinks it has RAM, Linux OOM-kills it, and Kubernetes restarts a \"healthy\" app forever. Liveness should hit a cheap actuator path; readiness should fail while Hibernate is still connecting. Mixing them makes rolling deploys flap.",
      bullets: [
        "Multi-stage builds: compile in a JDK image, run in a JRE image.",
        "Never bake secrets into an image layer. They survive in the history.",
        "Pin digests in production. <code>latest</code> is not a version."
      ]
    },
    {
      heading: "Kubernetes objects: pod, replica, service, ingress",
      body: "A <b>pod</b> is the smallest schedule unit: one or more containers that share a network namespace (localhost between a sidecar and the app). A <b>Deployment</b> says \"keep three replicas of this pod template\" and owns a ReplicaSet. A <b>Service</b> is a stable virtual IP plus kube-proxy (or IPVS) rules that send traffic to ready pods. ClusterIP is internal. NodePort and LoadBalancer are how you leave the cluster. <b>Ingress</b> (or a Gateway API) terminates HTTP at the edge and routes by host and path. Spring still sees a normal HTTP request; the mesh is someone else's hop.",
      bullets: [
        "Pods are cattle. Their IPs change. Clients talk to the Service DNS name.",
        "A Deployment rolling update creates new pods, waits for readiness, then kills old ones.",
        "ConfigMaps and Secrets mount as files or env. Restart the pod to pick up most env changes."
      ]
    },
    {
      heading: "Control plane versus the node",
      body: "The <b>control plane</b> is kube-apiserver (every kubectl call), etcd (desired and reported state), the scheduler (binds a pod to a node), and controllers (Deployment, Endpoint, Node). You never talk to etcd from the app. On each <b>node</b>, kubelet watches the API and asks the container runtime (containerd) to start what was bound there. kube-proxy programs packet rules for Services. If the control plane is down, running pods usually keep serving; you cannot deploy, scale, or replace a dead pod. That is why the control plane is replicated and why etcd snapshots matter.",
      bullets: [
        "Desired state lives in etcd. Controllers reconcile until reality matches.",
        "A node drain marks pods to move before you patch the machine.",
        "RBAC on the API server is how a CI ServiceAccount can apply only one namespace."
      ]
    },
    {
      heading: "Probes, resources, and why Java looks broken",
      body: "Kubernetes does not know your Spring context is still starting. A <b>readinessProbe</b> on <code>/actuator/health/readiness</code> keeps the Service from sending traffic until datasources are up. A <b>livenessProbe</b> on <code>/actuator/health/liveness</code> should only fail when a restart will help (deadlock), not when the database is slow — that restart storm makes the outage worse. Requests and limits: CPU request is for scheduling; memory limit is a hard cgroup cap. Set both. Horizontal Pod Autoscaler watches CPU or a custom Micrometer metric, not your feelings about Friday traffic.",
      bullets: [
        "startupProbe gives a slow JVM a longer first window without killing it.",
        "HPA on CPU fights a JVM that sits at 70% compiling. Prefer QPS or latency SLOs.",
        "PodDisruptionBudget stops a voluntary drain from taking every replica at once."
      ]
    },
    {
      heading: "What Docker does not solve",
      body: "Containers do not make an app stateless. A local disk, an in-memory session, and a scheduled thread on one replica are still single-instance bugs. Kubernetes does not replace a load balancer's TLS or a database. It is an orchestrator for compute. StatefulSets exist for brokers and databases that need stable names and disks; most Spring APIs should be Deployments plus an external RDS. \"We moved to Kubernetes\" is not a reliability story unless probes, limits, and disruption budgets are part of the design you draw.",
      bullets: [
        "Sidecars (mesh, log tail) share the pod's fate and its memory budget.",
        "Jobs and CronJobs are for finite work. Do not run a web server as a Job.",
        "NetworkPolicy is a firewall between pods. Default-allow is the usual hole."
      ]
    }
  ],

  keyTerms: [
    { term: "Image", def: "Immutable layered filesystem plus a start command, built by Docker and stored in a registry." },
    { term: "Container", def: "A running image isolated by namespaces and cgroups, sharing the host kernel." },
    { term: "Pod", def: "Kubernetes' atom: one or more containers that share network and optional volumes." },
    { term: "Deployment", def: "A controller that keeps N replica pods of a template and rolls them out." },
    { term: "Service", def: "A stable DNS name and virtual IP in front of ready pod IPs." },
    { term: "Ingress", def: "HTTP routing at the cluster edge, usually with TLS termination." },
    { term: "Control plane", def: "API server, etcd, scheduler, and controllers that store and reconcile desired state." },
    { term: "kubelet", def: "The node agent that starts the containers the scheduler bound to that machine." },
    { term: "Readiness probe", def: "A check that must pass before the Service sends the pod traffic." }
  ],

  tradeoffs: [
    { pro: "Images make the same Spring jar run in CI, staging, and prod.", con: "A fat image with a leftover secret in an old layer is a durable leak." },
    { pro: "Deployments roll pods without a maintenance window.", con: "Bad readiness probes either drop traffic too early or never take a sick pod out." },
    { pro: "Resource limits stop one leak from eating the node.", con: "A JVM that cannot see the cgroup limit gets OOM-killed while 'using little heap.'" },
    { pro: "The control plane lets you declare replica counts and forget machines.", con: "etcd and the API server become a new high-severity dependency for change, not for serving." }
  ],

  interviewTips: [
    "Say a container shares a kernel; a VM does not. Then say a pod is the unit Kubernetes schedules.",
    "Draw Deployment → ReplicaSet → Pods → Service → Ingress. Do not put a database inside a random pod disk.",
    "Call out JVM heap versus memory limit. Interviewers listen for MaxRAMPercentage or an equivalent.",
    "Split liveness and readiness. Liveness restarts; readiness only removes traffic.",
    "Control plane down: existing pods serve. You cannot schedule new ones. That distinction is the architecture answer."
  ],

  scene: {
    nodes: [
      { id: "dev", label: "Developer", type: "user", pos: [-11, 0, -2] },
      { id: "ci", label: "CI builder", type: "worker", pos: [-7, 0, -2] },
      { id: "reg", label: "Image registry", type: "storage", pos: [-3, 0, -2], showAt: 1 },
      { id: "plane", label: "Control plane", type: "zone", pos: [3.5, 0, -5], size: [10, 4], showAt: 2 },
      { id: "api", label: "API server", type: "gateway", pos: [0.5, 0, -5], showAt: 2 },
      { id: "etcd", label: "etcd", type: "db", pos: [4, 0, -5], showAt: 2 },
      { id: "sched", label: "Scheduler", type: "service", pos: [7.5, 0, -5], showAt: 2 },
      { id: "nodez", label: "Worker node", type: "zone", pos: [3.5, 0, 2.2], size: [11, 7], showAt: 3 },
      { id: "kubelet", label: "kubelet", type: "worker", pos: [-0.5, 0, 4.5], showAt: 3 },
      { id: "p1", label: "Pod A", type: "server", pos: [2.5, 0, 1.2], showAt: 3 },
      { id: "p2", label: "Pod B", type: "server", pos: [5.5, 0, 1.2], showAt: 4 },
      { id: "p3", label: "Pod C new", type: "server", pos: [8.2, 0, 1.2], showAt: 6 },
      { id: "svc", label: "ClusterIP svc", type: "lb", pos: [4, 0, 4.6], showAt: 4 },
      { id: "ing", label: "Ingress", type: "cdn", pos: [-7, 0, 2.5], showAt: 5 },
      { id: "user", label: "Browser", type: "user", pos: [-11, 0, 2.5], showAt: 5 },
      { id: "n0", label: "Image = layers + entrypoint", type: "note", pos: [-7, 0, -6.5] },
      { id: "n1", label: "Heap must fit the cgroup", type: "note", pos: [3.5, 0, 7], showAt: 7 }
    ],
    edges: [
      { from: "dev", to: "ci", label: "push" },
      { from: "ci", to: "reg", label: "docker push", showAt: 1 },
      { from: "api", to: "etcd", showAt: 2 },
      { from: "sched", to: "api", showAt: 2, dashed: true },
      { from: "kubelet", to: "api", showAt: 3, dashed: true },
      { from: "kubelet", to: "p1", showAt: 3 },
      { from: "p1", to: "svc", showAt: 4 },
      { from: "p2", to: "svc", showAt: 4 },
      { from: "ing", to: "svc", showAt: 5 },
      { from: "user", to: "ing", showAt: 5 },
      { from: "p3", to: "svc", showAt: 6 }
    ],
    steps: [
      {
        title: "Build an image",
        text: "CI runs docker build. The JRE base layer is cached. The Spring jar is the last layer. The result is an image, not a running app. Secrets must not be COPY'd into a layer.",
        highlight: ["dev", "ci", "n0"],
        flows: [{ from: "dev", to: "ci", color: "#4ade80", label: "Dockerfile" }]
      },
      {
        title: "Push the registry",
        text: "The tagged image lands in the registry. Kubernetes will pull by digest. latest is not a release. Prod deploys a sha256, not a moving tag.",
        highlight: ["ci", "reg"],
        flows: [{ from: "ci", to: "reg", color: "#c084fc", label: "image" }]
      },
      {
        title: "Desired state in etcd",
        text: "kubectl apply hits the API server. A Deployment object is stored in etcd: three replicas of that image. The scheduler has not placed anything yet. The control plane holds intent.",
        highlight: ["api", "etcd", "sched", "plane"],
        flows: [
          { from: "api", to: "etcd", color: "#c084fc", label: "Deployment" },
          { from: "sched", to: "api", color: "#60a5fa", label: "watch" }
        ]
      },
      {
        title: "kubelet starts a pod",
        text: "The scheduler binds a pod to a node. kubelet pulls the image and asks containerd to run it. The Spring process is a container inside a pod, sharing the host kernel.",
        highlight: ["kubelet", "p1", "nodez", "sched"],
        flows: [
          { from: "api", to: "kubelet", color: "#fb923c", label: "bind" },
          { from: "kubelet", to: "p1", color: "#4ade80", label: "run" }
        ]
      },
      {
        title: "Service fronts ready pods",
        text: "A second replica comes up. The ClusterIP Service only includes pods whose readiness probe passed. Clients use the DNS name, never a pod IP that will vanish.",
        highlight: ["p1", "p2", "svc"],
        flows: [
          { from: "p1", to: "svc", color: "#60a5fa", label: "ready" },
          { from: "p2", to: "svc", color: "#60a5fa", label: "ready" }
        ]
      },
      {
        title: "Ingress takes HTTP",
        text: "A browser hits the Ingress. TLS can terminate here. The Ingress sends the request to the Service, which spreads across ready pods. The Spring app sees ordinary HTTP.",
        highlight: ["user", "ing", "svc", "p1", "p2"],
        flows: [
          { from: "user", to: "ing", color: "#4ade80", label: "HTTPS" },
          { from: "ing", to: "svc", color: "#4ade80", label: "HTTP" }
        ]
      },
      {
        title: "Rolling update",
        text: "A new image rolls out. Pod C starts, becomes ready, then an old pod is terminated. If readiness is wrong, users see 502s. If liveness is tied to the database, a DB blip restarts every JVM.",
        highlight: ["p3", "p1", "svc", "reg"],
        flows: [
          { from: "reg", to: "p3", color: "#c084fc", label: "new image" },
          { from: "p3", to: "svc", color: "#4ade80", label: "ready" }
        ]
      },
      {
        title: "Fit the JVM in the cgroup",
        text: "Memory limit is 512 MiB. MaxRAMPercentage keeps the heap inside it. -Xmx2g on that pod would look fine in logs and then get OOMKilled. Probes, limits, and replica count are the Kubernetes part of the Spring design.",
        highlight: ["p1", "p2", "p3", "n1", "nodez"],
        fail: ["p1"],
        flows: [{ from: "kubelet", to: "p1", color: "#f87171", label: "OOMKill" }]
      }
    ]
  }
});
