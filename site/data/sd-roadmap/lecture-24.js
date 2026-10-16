window.LECTURES = window.LECTURES || [];
window.LECTURES.push({
  course: "sd-roadmap",
  id: 24,
  title: "Clean Architecture and Domain-Driven Design",
  video: "",
  category: "Cloud and Architecture",
  tagline: "Domain code has no Spring imports. Adapters talk to the world. Bounded contexts keep teams from sharing one god model.",
  summary: "Clean architecture (hexagonal, ports and adapters) puts business rules in the middle and I/O at the edge. Domain-driven design names those rules: entities, value objects, aggregates, repositories, and bounded contexts. In Spring this means controllers and JPA entities are adapters, use cases live in application services, and the domain package does not import org.springframework. A bounded context is a model with a boundary, not a microservice stamp.",

  theory: [
    {
      heading: "The domain does not know HTTP exists",
      body: "A typical Spring anti-pattern is a controller that calls a JpaRepository, maps an entity to JSON, and hides a price rule in an <code>if</code> next to <code>@PostMapping</code>. Change the database or the API and the rule moves, or worse, duplicates. <b>Clean architecture</b> inverts that. The domain expresses \"an order cannot be submitted empty.\" Application services (use cases) load aggregates, call domain methods, and save. Adapters implement ports: a JPA adapter for <code>OrderRepository</code>, a Kafka adapter for <code>OrderEvents</code>, a Web adapter for HTTP. Dependencies point inward. <code>com.shop.domain</code> must compile without Spring, without Hibernate, without Jackson.",
      bullets: [
        "Inner circle: entities and domain services. Outer: controllers, JPA, queues.",
        "A port is a Java interface the domain or application defines. An adapter implements it.",
        "If a unit test needs @SpringBootTest to price an order, the rule is in the wrong layer."
      ]
    },
    {
      heading: "Entities, values, and aggregates",
      body: "An <b>entity</b> has identity that outlives its attributes (Order 1842 is still that order after the address changes). A <b>value object</b> is defined by its values (Money 10 USD, an email address) and is immutable. An <b>aggregate</b> is a cluster with one root that is the only entry for writes. You load the Order root, add a line, and persist the whole consistency boundary. You do not reach into OrderLine from a second service and update it. That is how you get two totals. In code, the aggregate root's method enforces invariants: <code>order.addItem(sku, qty)</code> rejects qty &lt; 1. A public setter on every field is not a domain model; it is a struct.",
      bullets: [
        "Identity versus value is the first DDD question on the board.",
        "Keep aggregates small. A 'Company' aggregate that includes every employee will lock the world.",
        "IDs of other aggregates are references, not object graphs loaded in one Hibernate session."
      ]
    },
    {
      heading: "Repositories are collection-shaped ports",
      body: "A <b>repository</b> looks like an in-memory collection: <code>orders.save(order)</code>, <code>orders.findById(id)</code>. The domain does not know it is SQL. Spring Data JPA can implement the interface in the infrastructure package, mapping to <code>@Entity</code> tables that may not match the domain class one-to-one. If you leak <code>Pageable</code> and <code>Specification</code> into the domain, you have not built a port; you have dragged Spring Data inward. Queries that are screens (search, admin grids) often skip the aggregate and hit a read model. That is allowed. Do not pretend every SELECT is a domain write.",
      bullets: [
        "Write path: load aggregate, mutate, save. One transaction around that use case.",
        "Read path: query a projection. CQRS-lite, not a second company.",
        "@Transactional belongs on the application service, not on the entity."
      ]
    },
    {
      heading: "Bounded contexts stop the one true User table",
      body: "Sales, billing, and support all say \"customer\" and mean different fields and lifecycles. A <b>bounded context</b> is a model with an explicit boundary and a ubiquitous language inside it. Billing's Customer is a payer. Support's Customer is a ticket author. They share an id, not a class. Mapping between contexts is a published event or an anti-corruption layer, not a shared JAR of entities. Microservices are one way to deploy a context, not the definition. Two modules in one Spring Boot app with no cross-imports can be two contexts. One \"common\" package of 80 entities is how the bounded context dies.",
      bullets: [
        "Name the language: Order in checkout is not Order in warehouse.",
        "Context map: who is upstream, who is downstream, what event is the contract.",
        "Duplicating a name is cheaper than a shared mutable schema."
      ]
    },
    {
      heading: "A Spring package layout that survives contact with production",
      body: "A workable map: <code>domain</code> (aggregates, value objects, domain events, repository interfaces), <code>application</code> (use cases, <code>@Service</code>, DTOs for commands), <code>adapters.web</code> (controllers, request records), <code>adapters.persistence</code> (JPA entities, Spring Data, mappers), <code>adapters.messaging</code> (consumers). Tests in domain are plain JUnit. Application tests can use a fake repository. Adapter tests use @DataJpaTest or MockMvc. The moment a controller autowires a JpaRepository, the diagram is a lie. Refactor toward ports when the use case is painful, not as a religion on a three-class CRUD app.",
      bullets: [
        "Start with a modular monolith. Split processes when a context needs a different SLO or data store.",
        "Domain events are facts that happened. They are not a remote procedure call.",
        "Map JPA entities at the edge. Hibernate lazy graphs are not aggregates."
      ]
    }
  ],

  keyTerms: [
    { term: "Port", def: "An interface the inner layers own. Adapters implement it for HTTP, SQL, or a broker." },
    { term: "Adapter", def: "The outer code that talks to a framework or vendor and translates into the port." },
    { term: "Entity", def: "An object with a stable identity. Changing a field does not make it a different thing." },
    { term: "Value object", def: "Equality by value, usually immutable. Money, SKU, email." },
    { term: "Aggregate", def: "A consistency boundary with one root that other code must go through for writes." },
    { term: "Repository", def: "A collection-like port for loading and saving an aggregate." },
    { term: "Bounded context", def: "A model and language with a boundary. The same word can mean something else next door." },
    { term: "Anti-corruption layer", def: "An adapter that translates another context's model so it does not leak in." }
  ],

  tradeoffs: [
    { pro: "Domain tests run without Spring and stay fast.", con: "You write mappers between domain objects and JPA entities." },
    { pro: "Aggregates protect invariants in one place.", con: "Oversized aggregates become lock and performance problems." },
    { pro: "Bounded contexts let teams evolve schemas independently.", con: "You will duplicate some data and must map identities across events." },
    { pro: "A modular monolith can express DDD without a mesh.", con: "Process boundaries are easier to cheat with a cross-package import." }
  ],

  interviewTips: [
    "Draw concentric circles: domain in, adapters out. Arrows point inward.",
    "Define aggregate as the write boundary. Mention that reads can use a projection.",
    "Say the domain package has no Spring imports. That is the interview test.",
    "Bounded context ≠ microservice. One boot app can host several contexts as modules.",
    "Give a language clash: billing Customer versus support Customer, same id, different model."
  ],

  scene: {
    nodes: [
      { id: "user", label: "Client", type: "user", pos: [-11, 0, 0] },
      { id: "webz", label: "Adapters", type: "zone", pos: [-6, 0, 0], size: [5, 10], showAt: 1 },
      { id: "ctrl", label: "Controller", type: "gateway", pos: [-6, 0, -3] },
      { id: "jpa", label: "JPA adapter", type: "db", pos: [-6, 0, 3], showAt: 4 },
      { id: "mq", label: "Kafka adapter", type: "queue", pos: [-6, 0, 6], showAt: 6 },
      { id: "appz", label: "Application", type: "zone", pos: [0.5, 0, 0], size: [5, 8], showAt: 2 },
      { id: "uc", label: "SubmitOrder", type: "service", pos: [0.5, 0, 0], showAt: 2 },
      { id: "domz", label: "Domain", type: "zone", pos: [7.5, 0, 0], size: [6, 8], showAt: 3 },
      { id: "agg", label: "Order aggregate", type: "server", pos: [7.5, 0, -2], showAt: 3 },
      { id: "repo", label: "OrderRepository", type: "storage", pos: [7.5, 0, 2.5], showAt: 3 },
      { id: "db", label: "Postgres", type: "db", pos: [-6, 0, -6.5], showAt: 4 },
      { id: "bill", label: "Billing context", type: "service", pos: [7.5, 0, 6], showAt: 7 },
      { id: "n0", label: "No Spring in domain", type: "note", pos: [7.5, 0, -6.5], showAt: 3 },
      { id: "n1", label: "Port is an interface", type: "note", pos: [0.5, 0, -6.5], showAt: 4 }
    ],
    edges: [
      { from: "user", to: "ctrl", showAt: 1 },
      { from: "ctrl", to: "uc", showAt: 2 },
      { from: "uc", to: "agg", showAt: 3 },
      { from: "uc", to: "repo", showAt: 3 },
      { from: "repo", to: "jpa", showAt: 4, dashed: true },
      { from: "jpa", to: "db", showAt: 4 },
      { from: "uc", to: "mq", showAt: 6 },
      { from: "mq", to: "bill", showAt: 7 }
    ],
    steps: [
      {
        title: "A client only sees HTTP",
        text: "The user posts a submit-order JSON. That is an adapter concern. The business rule is not in the controller. If it is, every new entry point (CLI, Kafka) will copy it wrong.",
        highlight: ["user"],
        flows: [{ from: "user", to: "ctrl", color: "#4ade80", label: "POST" }]
      },
      {
        title: "Web adapter in, not business",
        text: "The controller validates HTTP shape, maps to a command object, and calls SubmitOrder. It does not autowire a JpaRepository. Spring Web lives in adapters.web.",
        highlight: ["ctrl", "webz", "user"],
        flows: [{ from: "user", to: "ctrl", color: "#4ade80", label: "command" }]
      },
      {
        title: "The use case is the application layer",
        text: "SubmitOrder loads the cart, calls the domain, and saves. @Transactional sits here. This layer knows when a transaction starts and which ports to call. It still does not know SQL.",
        highlight: ["uc", "appz", "ctrl"],
        flows: [{ from: "ctrl", to: "uc", color: "#60a5fa", label: "SubmitOrder" }]
      },
      {
        title: "Invariants live on the aggregate",
        text: "Order.addItem rejects empty SKUs and keeps the total consistent. Money is a value object. The domain package has no org.springframework import. Tests are plain JUnit.",
        highlight: ["agg", "repo", "domz", "n0"],
        flows: [{ from: "uc", to: "agg", color: "#c084fc", label: "addItem" }]
      },
      {
        title: "Repository port, JPA adapter",
        text: "OrderRepository is an interface in domain. The JPA adapter implements it, maps to @Entity tables, and talks to Postgres. Pageable stays in the adapter, not in the aggregate.",
        highlight: ["repo", "jpa", "db", "n1"],
        flows: [
          { from: "uc", to: "repo", color: "#4ade80", label: "save" },
          { from: "jpa", to: "db", color: "#4ade80", label: "SQL" }
        ]
      },
      {
        title: "Reads can skip the aggregate",
        text: "An admin grid is a query, not a write invariant. The web adapter may hit a projection query. Forcing every SELECT through Order.addItem is ceremony, not DDD.",
        highlight: ["ctrl", "jpa", "db"],
        flows: [{ from: "ctrl", to: "jpa", color: "#60a5fa", label: "projection" }]
      },
      {
        title: "Domain events leave through a port",
        text: "After commit, the use case publishes OrderSubmitted through an events port. The Kafka adapter is another outer circle. The domain still does not import Spring Kafka.",
        highlight: ["uc", "mq", "agg"],
        flows: [{ from: "uc", to: "mq", color: "#fb923c", label: "OrderSubmitted" }]
      },
      {
        title: "Billing is another bounded context",
        text: "Billing consumes the event and has its own Customer and Invoice model. It does not import Order.class from checkout. Same person, different language, mapped at the boundary.",
        highlight: ["bill", "mq", "domz"],
        flows: [{ from: "mq", to: "bill", color: "#fb923c", label: "consume" }]
      }
    ]
  }
});
