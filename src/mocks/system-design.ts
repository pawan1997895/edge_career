import type { DesignProblemSummary, HldProblem, LldProblem } from "@/types/system-design";

// Statuses match the Module 4 items in src/mocks/curriculum.ts: parking lot, rate limiter and
// URL shortener passed; news feed submitted and waiting on a human reviewer.

const HLD_RUBRIC = [
  { criterion: "Requirements & scope", weight: 15 },
  { criterion: "Capacity estimates", weight: 10 },
  { criterion: "API design", weight: 15 },
  { criterion: "Architecture & data flow", weight: 25 },
  { criterion: "Scalability", weight: 15 },
  { criterion: "Reliability & availability", weight: 10 },
  { criterion: "Trade-offs", weight: 10 },
];

export const hldProblems: HldProblem[] = [
  {
    id: "hld-url-shortener",
    kind: "hld",
    title: "Design a URL shortener",
    summary: "Short links with custom aliases, expiry and click analytics at 20k redirects per second.",
    difficulty: "medium",
    estimatedMin: 75,
    companies: ["Atlassian", "Razorpay", "Flipkart"],
    status: "passed",
    lastScore: 88,
    required: true,
    readHeavy: true,
    brief: [
      "Design a service like bit.ly. Users paste a long URL and get a short link. Anyone opening the short link is redirected to the original URL.",
      "Links can have a custom alias and an optional expiry. Link owners can see how many times each link was opened.",
    ],
    scaleHints: [
      "100 million new links per month",
      "Reads outnumber writes about 100 to 1",
      "Redirect latency matters more than link creation latency",
      "Links are kept for 5 years",
    ],
    rubric: HLD_RUBRIC,
    nodes: [
      { id: "client", type: "client", label: "Web & mobile clients", x: 0, y: 200 },
      { id: "lb", type: "load_balancer", label: "Load balancer", x: 240, y: 200 },
      { id: "shorten", type: "service", label: "Shortening API", x: 500, y: 80 },
      { id: "redirect", type: "service", label: "Redirect service", x: 500, y: 320 },
      { id: "cache", type: "cache", label: "Redis cache", x: 780, y: 320 },
      { id: "db", type: "database", label: "URL store (Postgres)", x: 780, y: 120 },
      { id: "queue", type: "queue", label: "Click events", x: 780, y: 480 },
      { id: "worker", type: "worker", label: "Analytics worker", x: 1040, y: 480 },
    ],
    edges: [
      { id: "e1", source: "client", target: "lb" },
      { id: "e2", source: "lb", target: "shorten" },
      { id: "e3", source: "lb", target: "redirect" },
      { id: "e4", source: "shorten", target: "db", label: "write" },
      { id: "e5", source: "redirect", target: "cache", label: "read" },
      { id: "e6", source: "redirect", target: "db", label: "cache miss" },
      { id: "e7", source: "redirect", target: "queue", label: "click" },
      { id: "e8", source: "queue", target: "worker" },
    ],
    sections: {
      requirements:
        "Functional\n- Create a short link for a long URL, with optional custom alias and expiry\n- Redirect short links to the original URL (HTTP 302)\n- Show click counts per link to its owner\n\nNon-functional\n- Redirect p99 under 50 ms\n- 99.95% availability for redirects\n- Short codes must not be guessable in sequence",
      estimates:
        "- 100M new links/month → ~40 writes/s (peak ~200/s)\n- Read:write ≈ 100:1 → ~4,000 redirects/s (peak ~20,000/s)\n- Storage: 100M × 12 × 5 years × 500 B ≈ 3 TB\n- Cache the hottest 20% of links: ~70 GB across a Redis cluster",
      apis:
        "POST /api/v1/links\n  body: { url, alias?, expiresAt? }\n  201 → { code, shortUrl }\n\nGET /{code}\n  302 Location: <long url>\n  404 if unknown or expired\n\nGET /api/v1/links/{code}/stats\n  200 → { clicks, lastClickedAt }",
      dataModel:
        "links\n  code        varchar(8)   primary key\n  long_url    text\n  owner_id    bigint\n  created_at  timestamptz\n  expires_at  timestamptz  null\n\nclick_events (append-only, analytics store)\n  code, clicked_at, country, referrer",
      tradeoffs:
        "- Base62 codes from a distributed ID generator instead of hashing: no collision checks, but IDs are shuffled so codes don't reveal creation order.\n- 302 rather than 301 so every click reaches us for analytics, at the cost of more traffic.\n- Click events go through a queue so redirects never wait on analytics writes.",
    },
    lastReview: {
      overall: 88,
      confidence: "high",
      reviewedAt: "2026-10-14T19:10:00+05:30",
      criteria: [
        { criterion: "Requirements & scope", score: 14, max: 15, comment: "Clear functional and non-functional split. Expiry and custom aliases are covered." },
        { criterion: "Capacity estimates", score: 9, max: 10, comment: "Read/write ratio and storage maths are sound. Peak factor is stated." },
        { criterion: "API design", score: 12, max: 15, comment: "Idempotent link creation isn't addressed; a retried POST can create duplicate links." },
        { criterion: "Architecture & data flow", score: 23, max: 25, comment: "Read and write paths are separated well, and analytics is off the redirect path." },
        { criterion: "Scalability", score: 14, max: 15, comment: "Cache sizing is justified. Mention how the cache is partitioned." },
        { criterion: "Reliability & availability", score: 6, max: 10, comment: "The URL store is a single Postgres primary with no replica: a single point of failure for every cache miss." },
        { criterion: "Trade-offs", score: 10, max: 10, comment: "301 vs 302 and ID generation trade-offs are explained with consequences." },
      ],
      strengths: [
        "Redirect path is cache-first with a clear miss path.",
        "Analytics is decoupled with a queue, so redirects stay fast.",
        "Estimates drive the cache size instead of guessing.",
      ],
      improvements: [
        "Add a read replica (or a multi-AZ standby) for the URL store and describe failover.",
        "Make POST /links idempotent with a client-supplied key.",
        "Say how custom aliases are checked for collisions under concurrent requests.",
      ],
    },
  },
  {
    id: "hld-news-feed",
    kind: "hld",
    title: "Design a news feed",
    summary: "A home timeline for 50M daily users with posts, media and celebrity accounts.",
    difficulty: "hard",
    estimatedMin: 75,
    companies: ["Google", "Swiggy", "Uber"],
    status: "in_review",
    required: false,
    readHeavy: true,
    brief: [
      "Design the home feed for a social app. Users follow other users and see their recent posts, newest first.",
      "Some accounts have millions of followers. Posts can include images and short videos.",
    ],
    scaleHints: ["50M daily active users", "Each user opens the feed ~10 times a day", "Average 200 follows per user", "A few thousand accounts have over 1M followers"],
    rubric: HLD_RUBRIC,
    nodes: [
      { id: "client", type: "client", label: "Mobile apps", x: 0, y: 220 },
      { id: "cdn", type: "cdn", label: "CDN", x: 0, y: 420 },
      { id: "gw", type: "api_gateway", label: "API gateway", x: 240, y: 220 },
      { id: "post", type: "service", label: "Post service", x: 500, y: 80 },
      { id: "feed", type: "service", label: "Feed service", x: 500, y: 340 },
      { id: "queue", type: "queue", label: "New posts", x: 760, y: 80 },
      { id: "fanout", type: "worker", label: "Fan-out workers", x: 1010, y: 80 },
      { id: "feedcache", type: "cache", label: "Feed cache (Redis)", x: 760, y: 340 },
      { id: "db", type: "database", label: "Posts DB", x: 1010, y: 260 },
      { id: "replica", type: "replica", label: "Posts read replica", x: 1010, y: 440 },
      { id: "media", type: "object_storage", label: "Media (S3)", x: 240, y: 420 },
    ],
    edges: [
      { id: "e1", source: "client", target: "gw" },
      { id: "e2", source: "gw", target: "post" },
      { id: "e3", source: "gw", target: "feed" },
      { id: "e4", source: "post", target: "queue" },
      { id: "e5", source: "queue", target: "fanout" },
      { id: "e6", source: "fanout", target: "feedcache", label: "push" },
      { id: "e7", source: "post", target: "db" },
      { id: "e8", source: "feed", target: "feedcache" },
      { id: "e9", source: "feed", target: "replica", label: "celebrity pull" },
      { id: "e10", source: "db", target: "replica", label: "replication" },
      { id: "e11", source: "client", target: "cdn" },
      { id: "e12", source: "cdn", target: "media" },
    ],
    sections: {
      requirements:
        "Functional\n- Publish text, image and video posts\n- Home feed of followed accounts, newest first, paginated\n\nNon-functional\n- Feed loads in under 300 ms (p95)\n- New posts appear in followers' feeds within 10 s\n- Eventual consistency is acceptable",
      estimates:
        "- 50M DAU × 10 feed opens = 500M feed reads/day ≈ 6k/s (peak 30k/s)\n- 5M posts/day ≈ 60 writes/s\n- Fan-out on write: 60 × 200 followers = 12k cache writes/s\n- Feed cache: 50M users × 500 post ids × 8 B ≈ 200 GB",
      apis: "POST /v1/posts { text, mediaIds[] } → 201 { postId }\nGET /v1/feed?cursor= → 200 { items[], nextCursor }",
      dataModel: "posts (post_id, author_id, text, media_keys[], created_at)\nfollows (follower_id, followee_id, created_at)\nfeed cache: list per user of post ids (capped at 500)",
      tradeoffs:
        "- Hybrid fan-out: push for normal accounts, pull for accounts with over 1M followers at read time.\n- Feed cache holds ids only; post bodies are hydrated from a post cache.\n- Media served from the CDN, never through the API.",
    },
    lastReview: {
      overall: 81,
      confidence: "low",
      reviewedAt: "2026-10-27T15:52:00+05:30",
      criteria: [
        { criterion: "Requirements & scope", score: 13, max: 15, comment: "Good. Ranking is out of scope and that's stated." },
        { criterion: "Capacity estimates", score: 9, max: 10, comment: "Fan-out write volume is estimated correctly." },
        { criterion: "API design", score: 12, max: 15, comment: "Cursor pagination is right; no API for deleting posts." },
        { criterion: "Architecture & data flow", score: 20, max: 25, comment: "Unsure: the celebrity pull path reads from the replica directly; merging push and pull results isn't shown." },
        { criterion: "Scalability", score: 12, max: 15, comment: "Feed cache sharding isn't described." },
        { criterion: "Reliability & availability", score: 8, max: 10, comment: "Replica present. Fan-out worker retries aren't mentioned." },
        { criterion: "Trade-offs", score: 7, max: 10, comment: "Hybrid fan-out is the right call, but the follower threshold isn't justified." },
      ],
      strengths: ["Hybrid fan-out handles celebrity accounts.", "Media is kept off the API path via the CDN."],
      improvements: ["Show where push and pull results are merged and ranked.", "Describe how the feed cache is sharded and rebuilt after a node loss."],
      humanReview: {
        reason: "The AI grader's confidence was low on the merge step of the hybrid fan-out, so a human reviewer will confirm the score before it counts.",
        submittedAt: "2026-10-27T15:52:00+05:30",
        expectedBy: "2026-10-28T15:52:00+05:30",
      },
    },
  },
  {
    id: "hld-chat-system",
    kind: "hld",
    title: "Design a chat system",
    summary: "One-to-one and group messaging with delivery receipts and online presence.",
    difficulty: "hard",
    estimatedMin: 75,
    companies: ["PhonePe", "Microsoft"],
    status: "not_started",
    required: false,
    readHeavy: false,
    brief: [
      "Design a messaging app like WhatsApp. Users send messages to individuals and groups of up to 500 people.",
      "Show sent, delivered and read receipts, and whether a contact is online.",
    ],
    scaleHints: ["20M daily active users", "40 messages per user per day", "Messages must be delivered in order within a conversation"],
    rubric: HLD_RUBRIC,
    nodes: [],
    edges: [],
    sections: { requirements: "", estimates: "", apis: "", dataModel: "", tradeoffs: "" },
  },
  {
    id: "hld-ride-hailing",
    kind: "hld",
    title: "Design a ride-hailing service",
    summary: "Match riders to nearby drivers with live location updates and surge pricing.",
    difficulty: "hard",
    estimatedMin: 90,
    companies: ["Uber", "Zomato"],
    status: "in_progress",
    required: false,
    readHeavy: true,
    brief: [
      "Design the core of a ride-hailing app. Riders request a ride; the system finds a nearby available driver and tracks the trip.",
      "Drivers send their location every 4 seconds while online.",
    ],
    scaleHints: ["1M drivers online at peak", "Location updates every 4 s → 250k writes/s", "Matching should finish within 3 s"],
    rubric: HLD_RUBRIC,
    nodes: [
      { id: "rider", type: "client", label: "Rider app", x: 0, y: 120 },
      { id: "driver", type: "client", label: "Driver app", x: 0, y: 320 },
      { id: "rides", type: "service", label: "Ride service", x: 260, y: 120 },
      { id: "location", type: "service", label: "Location service", x: 260, y: 320 },
      { id: "trips", type: "database", label: "Trips DB", x: 520, y: 120 },
      { id: "geo", type: "search", label: "Geo index", x: 520, y: 420 },
    ],
    edges: [
      { id: "e1", source: "rider", target: "rides" },
      { id: "e2", source: "driver", target: "location" },
      { id: "e3", source: "rides", target: "trips" },
    ],
    sections: {
      requirements: "Functional\n- Request a ride and get matched with a nearby driver\n- Live driver location during the trip\n\nNon-functional\n- Match within 3 s",
      estimates: "- 250k location writes/s at peak",
      apis: "",
      dataModel: "",
      tradeoffs: "",
    },
  },
];

const PARKING_LOT_README = `# Design a parking lot

Requirements
- Multiple levels, each with compact, regular and large spots
- Vehicles: motorcycle, car and truck. A vehicle parks in the smallest spot that fits
- Issue a ticket on entry and compute the fee on exit
- Pricing must be swappable (hourly now, a flat weekend rate later)
- Show free spots per level

Hidden tests call the public methods of ParkingLot. Keep their signatures.
`;

const RATE_LIMITER_README = `# Design a rate limiter

Requirements
- Limit each API key to N requests per time window
- Support token bucket and sliding window algorithms, chosen per endpoint
- Thread-safe: many request threads call allow() at once
- The clock must be injectable so tests can control time
`;

const ELEVATOR_README = `# Design an elevator system

Requirements
- A building with N floors and M elevators
- Hall calls (up/down buttons) and car calls (floor buttons inside the elevator)
- A scheduler assigns each hall call to the best elevator
- The scheduling algorithm must be swappable (nearest car, SCAN)
- Report each elevator's floor, direction and door state
`;

export const lldProblems: LldProblem[] = [
  {
    id: "lld-parking-lot",
    kind: "lld",
    title: "Design a parking lot",
    summary: "Multi-level lot with spot sizes, tickets and swappable pricing.",
    difficulty: "medium",
    estimatedMin: 60,
    companies: ["Amazon", "Flipkart", "Swiggy"],
    status: "passed",
    lastScore: 90,
    required: true,
    brief: [
      "Model a multi-level parking lot. Vehicles park in the smallest spot that fits, get a ticket on entry, and pay on exit.",
      "Pricing rules change often, so they must be swappable without editing the lot itself.",
    ],
    files: {
      java: [
        { id: "readme", name: "README.md", content: PARKING_LOT_README, readOnly: true },
        {
          id: "lot",
          name: "ParkingLot.java",
          content: `import java.util.*;

public class ParkingLot {
    private final List<Level> levels;
    private final PricingStrategy pricing;
    private final Map<String, Ticket> activeTickets = new HashMap<>();

    public ParkingLot(List<Level> levels, PricingStrategy pricing) {
        this.levels = levels;
        this.pricing = pricing;
    }

    public Optional<Ticket> park(Vehicle vehicle, long entryTime) {
        for (Level level : levels) {
            Optional<ParkingSpot> spot = level.findSpotFor(vehicle);
            if (spot.isPresent()) {
                spot.get().assign(vehicle);
                Ticket ticket = new Ticket(UUID.randomUUID().toString(), vehicle, spot.get(), entryTime);
                activeTickets.put(ticket.getId(), ticket);
                return Optional.of(ticket);
            }
        }
        return Optional.empty();
    }

    public long exit(String ticketId, long exitTime) {
        Ticket ticket = activeTickets.remove(ticketId);
        if (ticket == null) {
            throw new IllegalArgumentException("Unknown ticket: " + ticketId);
        }
        ticket.getSpot().release();
        return pricing.calculateFee(ticket, exitTime);
    }

    public Map<Integer, Integer> freeSpotsByLevel() {
        Map<Integer, Integer> free = new LinkedHashMap<>();
        for (Level level : levels) {
            free.put(level.getNumber(), level.freeSpotCount());
        }
        return free;
    }
}
`,
        },
        {
          id: "level",
          name: "Level.java",
          content: `import java.util.*;

public class Level {
    private final int number;
    private final List<ParkingSpot> spots;

    public Level(int number, List<ParkingSpot> spots) {
        this.number = number;
        this.spots = spots;
    }

    public Optional<ParkingSpot> findSpotFor(Vehicle vehicle) {
        return spots.stream()
            .filter(ParkingSpot::isFree)
            .filter(spot -> spot.fits(vehicle))
            .min(Comparator.comparing(ParkingSpot::getSize));
    }

    public int freeSpotCount() {
        return (int) spots.stream().filter(ParkingSpot::isFree).count();
    }

    public int getNumber() {
        return number;
    }
}
`,
        },
        {
          id: "spot",
          name: "ParkingSpot.java",
          content: `public class ParkingSpot {
    public enum Size { COMPACT, REGULAR, LARGE }

    private final String id;
    private final Size size;
    private Vehicle parked;

    public ParkingSpot(String id, Size size) {
        this.id = id;
        this.size = size;
    }

    public boolean fits(Vehicle vehicle) {
        return vehicle.getRequiredSize().ordinal() <= size.ordinal();
    }

    public boolean isFree() {
        return parked == null;
    }

    public void assign(Vehicle vehicle) {
        this.parked = vehicle;
    }

    public void release() {
        this.parked = null;
    }

    public Size getSize() {
        return size;
    }

    public String getId() {
        return id;
    }
}
`,
        },
        {
          id: "vehicle",
          name: "Vehicle.java",
          content: `public abstract class Vehicle {
    private final String plate;

    protected Vehicle(String plate) {
        this.plate = plate;
    }

    public abstract ParkingSpot.Size getRequiredSize();

    public String getPlate() {
        return plate;
    }

    public static Vehicle of(String type, String plate) {
        switch (type) {
            case "MOTORCYCLE": return new Motorcycle(plate);
            case "CAR": return new Car(plate);
            case "TRUCK": return new Truck(plate);
            default: throw new IllegalArgumentException("Unknown vehicle type: " + type);
        }
    }
}

class Motorcycle extends Vehicle {
    Motorcycle(String plate) { super(plate); }
    public ParkingSpot.Size getRequiredSize() { return ParkingSpot.Size.COMPACT; }
}

class Car extends Vehicle {
    Car(String plate) { super(plate); }
    public ParkingSpot.Size getRequiredSize() { return ParkingSpot.Size.REGULAR; }
}

class Truck extends Vehicle {
    Truck(String plate) { super(plate); }
    public ParkingSpot.Size getRequiredSize() { return ParkingSpot.Size.LARGE; }
}
`,
        },
        {
          id: "ticket",
          name: "Ticket.java",
          content: `public class Ticket {
    private final String id;
    private final Vehicle vehicle;
    private final ParkingSpot spot;
    private final long entryTime;

    public Ticket(String id, Vehicle vehicle, ParkingSpot spot, long entryTime) {
        this.id = id;
        this.vehicle = vehicle;
        this.spot = spot;
        this.entryTime = entryTime;
    }

    public String getId() { return id; }
    public Vehicle getVehicle() { return vehicle; }
    public ParkingSpot getSpot() { return spot; }
    public long getEntryTime() { return entryTime; }
}
`,
        },
        {
          id: "pricing",
          name: "PricingStrategy.java",
          content: `public interface PricingStrategy {
    long calculateFee(Ticket ticket, long exitTime);
}

class HourlyPricing implements PricingStrategy {
    private static final long MILLIS_PER_HOUR = 3_600_000L;
    private final long ratePerHour;

    HourlyPricing(long ratePerHour) {
        this.ratePerHour = ratePerHour;
    }

    @Override
    public long calculateFee(Ticket ticket, long exitTime) {
        long millis = exitTime - ticket.getEntryTime();
        long hours = (millis + MILLIS_PER_HOUR - 1) / MILLIS_PER_HOUR;
        return Math.max(1, hours) * ratePerHour;
    }
}
`,
        },
      ],
      python: [
        { id: "readme", name: "README.md", content: PARKING_LOT_README.replace("ParkingLot", "parking_lot.ParkingLot"), readOnly: true },
        {
          id: "lot",
          name: "parking_lot.py",
          content: `import uuid
from level import Level
from pricing import PricingStrategy
from ticket import Ticket
from vehicle import Vehicle


class ParkingLot:
    def __init__(self, levels: list[Level], pricing: PricingStrategy):
        self._levels = levels
        self._pricing = pricing
        self._active: dict[str, Ticket] = {}

    def park(self, vehicle: Vehicle, entry_time: int) -> Ticket | None:
        for level in self._levels:
            spot = level.find_spot_for(vehicle)
            if spot:
                spot.assign(vehicle)
                ticket = Ticket(str(uuid.uuid4()), vehicle, spot, entry_time)
                self._active[ticket.id] = ticket
                return ticket
        return None

    def exit(self, ticket_id: str, exit_time: int) -> int:
        ticket = self._active.pop(ticket_id, None)
        if ticket is None:
            raise ValueError(f"Unknown ticket: {ticket_id}")
        ticket.spot.release()
        return self._pricing.calculate_fee(ticket, exit_time)

    def free_spots_by_level(self) -> dict[int, int]:
        return {level.number: level.free_spot_count() for level in self._levels}
`,
        },
        {
          id: "level",
          name: "level.py",
          content: `from parking_spot import ParkingSpot
from vehicle import Vehicle


class Level:
    def __init__(self, number: int, spots: list[ParkingSpot]):
        self.number = number
        self._spots = spots

    def find_spot_for(self, vehicle: Vehicle) -> ParkingSpot | None:
        candidates = [s for s in self._spots if s.is_free() and s.fits(vehicle)]
        return min(candidates, key=lambda s: s.size.value, default=None)

    def free_spot_count(self) -> int:
        return sum(1 for s in self._spots if s.is_free())
`,
        },
        {
          id: "spot",
          name: "parking_spot.py",
          content: `from enum import Enum


class SpotSize(Enum):
    COMPACT = 1
    REGULAR = 2
    LARGE = 3


class ParkingSpot:
    def __init__(self, spot_id: str, size: SpotSize):
        self.id = spot_id
        self.size = size
        self._parked = None

    def fits(self, vehicle) -> bool:
        return vehicle.required_size.value <= self.size.value

    def is_free(self) -> bool:
        return self._parked is None

    def assign(self, vehicle) -> None:
        self._parked = vehicle

    def release(self) -> None:
        self._parked = None
`,
        },
        {
          id: "vehicle",
          name: "vehicle.py",
          content: `from dataclasses import dataclass
from parking_spot import SpotSize


@dataclass(frozen=True)
class Vehicle:
    plate: str
    required_size: SpotSize


def motorcycle(plate: str) -> Vehicle:
    return Vehicle(plate, SpotSize.COMPACT)


def car(plate: str) -> Vehicle:
    return Vehicle(plate, SpotSize.REGULAR)


def truck(plate: str) -> Vehicle:
    return Vehicle(plate, SpotSize.LARGE)
`,
        },
        {
          id: "ticket",
          name: "ticket.py",
          content: `from dataclasses import dataclass


@dataclass
class Ticket:
    id: str
    vehicle: object
    spot: object
    entry_time: int
`,
        },
        {
          id: "pricing",
          name: "pricing.py",
          content: `import math
from abc import ABC, abstractmethod

MILLIS_PER_HOUR = 3_600_000


class PricingStrategy(ABC):
    @abstractmethod
    def calculate_fee(self, ticket, exit_time: int) -> int: ...


class HourlyPricing(PricingStrategy):
    def __init__(self, rate_per_hour: int):
        self._rate = rate_per_hour

    def calculate_fee(self, ticket, exit_time: int) -> int:
        hours = math.ceil((exit_time - ticket.entry_time) / MILLIS_PER_HOUR)
        return max(1, hours) * self._rate
`,
        },
      ],
    },
    tests: [
      { name: "parks_car_in_smallest_fitting_spot", passed: true, durationMs: 4 },
      { name: "motorcycle_uses_compact_spot", passed: true, durationMs: 3 },
      { name: "truck_requires_large_spot", passed: true, durationMs: 3 },
      { name: "returns_empty_when_lot_is_full", passed: true, durationMs: 6 },
      { name: "issues_unique_ticket_ids", passed: true, durationMs: 9 },
      { name: "exit_releases_spot", passed: true, durationMs: 4 },
      { name: "exit_with_unknown_ticket_throws", passed: true, durationMs: 2 },
      { name: "hourly_pricing_rounds_up_partial_hours", passed: true, durationMs: 2 },
      {
        name: "weekend_flat_rate_applied",
        passed: false,
        durationMs: 5,
        message: "Expected fee 200 but was 240. Pricing is fixed when ParkingLot is constructed, so the weekend strategy is never used.",
      },
      { name: "free_spots_by_level_is_accurate", passed: true, durationMs: 3 },
      {
        name: "concurrent_parking_does_not_double_assign",
        passed: false,
        durationMs: 212,
        message: "Two vehicles were assigned spot L1-C03. findSpotFor() and assign() are not atomic.",
      },
      { name: "levels_are_searched_in_order", passed: true, durationMs: 3 },
      { name: "ticket_stores_entry_time", passed: true, durationMs: 1 },
    ],
    rubric: [
      { criterion: "Single responsibility", score: 4, max: 5, comment: "ParkingLot both allocates spots and keeps ticket records. A TicketService would separate them." },
      { criterion: "Open/closed", score: 5, max: 5, comment: "New pricing rules plug in through PricingStrategy without editing ParkingLot." },
      { criterion: "Liskov substitution", score: 4, max: 5, comment: "Vehicle subclasses differ only by required size; an enum on Vehicle would be simpler." },
      { criterion: "Interface segregation", score: 5, max: 5, comment: "PricingStrategy is small and focused." },
      { criterion: "Dependency inversion", score: 4, max: 5, comment: "Ticket ids come from UUID directly. Inject an id generator to make tests deterministic." },
      { criterion: "Design patterns", score: 4, max: 5, comment: "Strategy is used well. The Vehicle.of switch will grow with every new type." },
      { criterion: "Extensibility", score: 4, max: 5, comment: "Adding an EV spot type needs changes in three classes." },
      { criterion: "Naming & readability", score: 5, max: 5, comment: "Names match the domain and methods are short." },
    ],
    patternsDetected: [
      { name: "Strategy", where: "PricingStrategy → HourlyPricing", verdict: "good" },
      { name: "Factory method", where: "Vehicle.of(type, plate)", verdict: "questionable" },
    ],
  },
  {
    id: "lld-rate-limiter",
    kind: "lld",
    title: "Design a rate limiter",
    summary: "Token bucket and sliding window limiters behind one interface, safe under concurrency.",
    difficulty: "medium",
    estimatedMin: 50,
    companies: ["Razorpay", "Atlassian"],
    status: "passed",
    lastScore: 86,
    required: true,
    brief: [
      "Build an in-process rate limiter library. Each endpoint chooses an algorithm; each API key gets its own limit.",
      "Tests control time through an injectable clock and call allow() from many threads.",
    ],
    files: {
      java: [
        { id: "readme", name: "README.md", content: RATE_LIMITER_README, readOnly: true },
        {
          id: "iface",
          name: "RateLimiter.java",
          content: `public interface RateLimiter {
    /** Returns true if the request for this key may proceed. */
    boolean allow(String key);
}
`,
        },
        {
          id: "bucket",
          name: "TokenBucketLimiter.java",
          content: `import java.util.concurrent.ConcurrentHashMap;

public class TokenBucketLimiter implements RateLimiter {
    private final long capacity;
    private final double refillPerMilli;
    private final Clock clock;
    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public TokenBucketLimiter(long capacity, long refillPerSecond, Clock clock) {
        this.capacity = capacity;
        this.refillPerMilli = refillPerSecond / 1000.0;
        this.clock = clock;
    }

    @Override
    public boolean allow(String key) {
        Bucket bucket = buckets.computeIfAbsent(key, k -> new Bucket(capacity, clock.nowMillis()));
        synchronized (bucket) {
            long now = clock.nowMillis();
            bucket.tokens = Math.min(capacity, bucket.tokens + (now - bucket.lastRefill) * refillPerMilli);
            bucket.lastRefill = now;
            if (bucket.tokens >= 1) {
                bucket.tokens -= 1;
                return true;
            }
            return false;
        }
    }

    private static final class Bucket {
        double tokens;
        long lastRefill;

        Bucket(double tokens, long lastRefill) {
            this.tokens = tokens;
            this.lastRefill = lastRefill;
        }
    }
}
`,
        },
        {
          id: "window",
          name: "SlidingWindowLimiter.java",
          content: `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

public class SlidingWindowLimiter implements RateLimiter {
    private final int limit;
    private final long windowMillis;
    private final Clock clock;
    private final ConcurrentHashMap<String, Deque<Long>> log = new ConcurrentHashMap<>();

    public SlidingWindowLimiter(int limit, long windowMillis, Clock clock) {
        this.limit = limit;
        this.windowMillis = windowMillis;
        this.clock = clock;
    }

    @Override
    public boolean allow(String key) {
        Deque<Long> times = log.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (times) {
            long now = clock.nowMillis();
            while (!times.isEmpty() && now - times.peekFirst() >= windowMillis) {
                times.pollFirst();
            }
            if (times.size() < limit) {
                times.addLast(now);
                return true;
            }
            return false;
        }
    }
}
`,
        },
        {
          id: "factory",
          name: "RateLimiterFactory.java",
          content: `public final class RateLimiterFactory {
    private RateLimiterFactory() {}

    public static RateLimiter create(String algorithm, int limit, long windowMillis, Clock clock) {
        return switch (algorithm) {
            case "token_bucket" -> new TokenBucketLimiter(limit, limit * 1000L / windowMillis, clock);
            case "sliding_window" -> new SlidingWindowLimiter(limit, windowMillis, clock);
            default -> throw new IllegalArgumentException("Unknown algorithm: " + algorithm);
        };
    }
}
`,
        },
        {
          id: "clock",
          name: "Clock.java",
          content: `public interface Clock {
    long nowMillis();

    Clock SYSTEM = System::currentTimeMillis;
}
`,
        },
      ],
      python: [
        { id: "readme", name: "README.md", content: RATE_LIMITER_README, readOnly: true },
        {
          id: "iface",
          name: "rate_limiter.py",
          content: `from abc import ABC, abstractmethod


class RateLimiter(ABC):
    @abstractmethod
    def allow(self, key: str) -> bool: ...
`,
        },
        {
          id: "bucket",
          name: "token_bucket.py",
          content: `import threading
from rate_limiter import RateLimiter


class TokenBucketLimiter(RateLimiter):
    def __init__(self, capacity: int, refill_per_second: float, clock):
        self._capacity = capacity
        self._rate = refill_per_second / 1000
        self._clock = clock
        self._buckets: dict[str, list[float]] = {}
        self._lock = threading.Lock()

    def allow(self, key: str) -> bool:
        with self._lock:
            now = self._clock()
            tokens, last = self._buckets.get(key, [self._capacity, now])
            tokens = min(self._capacity, tokens + (now - last) * self._rate)
            allowed = tokens >= 1
            self._buckets[key] = [tokens - 1 if allowed else tokens, now]
            return allowed
`,
        },
        {
          id: "window",
          name: "sliding_window.py",
          content: `import threading
from collections import deque
from rate_limiter import RateLimiter


class SlidingWindowLimiter(RateLimiter):
    def __init__(self, limit: int, window_ms: int, clock):
        self._limit = limit
        self._window = window_ms
        self._clock = clock
        self._log: dict[str, deque] = {}
        self._lock = threading.Lock()

    def allow(self, key: str) -> bool:
        with self._lock:
            now = self._clock()
            times = self._log.setdefault(key, deque())
            while times and now - times[0] >= self._window:
                times.popleft()
            if len(times) < self._limit:
                times.append(now)
                return True
            return False
`,
        },
      ],
    },
    tests: [
      { name: "token_bucket_allows_burst_up_to_capacity", passed: true, durationMs: 3 },
      { name: "token_bucket_refills_over_time", passed: true, durationMs: 2 },
      { name: "token_bucket_never_exceeds_capacity", passed: true, durationMs: 2 },
      { name: "sliding_window_blocks_after_limit", passed: true, durationMs: 2 },
      { name: "sliding_window_allows_after_window_passes", passed: true, durationMs: 3 },
      { name: "keys_are_limited_independently", passed: true, durationMs: 4 },
      { name: "factory_creates_requested_algorithm", passed: true, durationMs: 1 },
      { name: "factory_rejects_unknown_algorithm", passed: true, durationMs: 1 },
      { name: "concurrent_allow_respects_limit", passed: true, durationMs: 340 },
      {
        name: "idle_keys_are_evicted",
        passed: false,
        durationMs: 18,
        message: "Expected at most 1,000 tracked keys after 1M idle keys; found 1,000,000. Buckets are never removed.",
      },
    ],
    rubric: [
      { criterion: "Single responsibility", score: 5, max: 5, comment: "Each limiter owns one algorithm." },
      { criterion: "Open/closed", score: 4, max: 5, comment: "Adding an algorithm means editing the factory switch." },
      { criterion: "Liskov substitution", score: 5, max: 5, comment: "Both limiters honour the RateLimiter contract." },
      { criterion: "Interface segregation", score: 5, max: 5, comment: "One-method interface." },
      { criterion: "Dependency inversion", score: 5, max: 5, comment: "Clock is injected; tests control time." },
      { criterion: "Design patterns", score: 4, max: 5, comment: "Strategy and a static factory. A registry would avoid the switch." },
      { criterion: "Extensibility", score: 3, max: 5, comment: "No memory bound on tracked keys; add eviction for idle keys." },
      { criterion: "Naming & readability", score: 5, max: 5, comment: "Clear names and short methods." },
    ],
    patternsDetected: [
      { name: "Strategy", where: "RateLimiter → TokenBucketLimiter, SlidingWindowLimiter", verdict: "good" },
      { name: "Static factory", where: "RateLimiterFactory.create", verdict: "good" },
    ],
  },
  {
    id: "lld-elevator",
    kind: "lld",
    title: "Design an elevator system",
    summary: "Schedule hall and car calls across several elevators with a swappable algorithm.",
    difficulty: "hard",
    estimatedMin: 55,
    companies: ["Microsoft", "Adobe"],
    status: "not_started",
    required: false,
    brief: [
      "Model a bank of elevators in a building. Passengers press hall buttons (up or down) and floor buttons inside the car.",
      "A scheduler assigns each hall call to an elevator. The algorithm must be replaceable.",
    ],
    files: {
      java: [
        { id: "readme", name: "README.md", content: ELEVATOR_README, readOnly: true },
        {
          id: "system",
          name: "ElevatorSystem.java",
          content: `import java.util.List;

public class ElevatorSystem {
    private final List<Elevator> elevators;
    private final SchedulingStrategy strategy;

    public ElevatorSystem(List<Elevator> elevators, SchedulingStrategy strategy) {
        this.elevators = elevators;
        this.strategy = strategy;
    }

    public void hallCall(int floor, Direction direction) {
        // TODO: pick an elevator with the strategy and add the stop
    }

    public void carCall(int elevatorId, int floor) {
        // TODO
    }

    public void step() {
        // TODO: advance every elevator by one tick
    }
}
`,
        },
        {
          id: "elevator",
          name: "Elevator.java",
          content: `public class Elevator {
    private final int id;
    private int floor;
    private Direction direction = Direction.IDLE;

    public Elevator(int id, int startFloor) {
        this.id = id;
        this.floor = startFloor;
    }

    public int getId() { return id; }
    public int getFloor() { return floor; }
    public Direction getDirection() { return direction; }
}
`,
        },
        { id: "direction", name: "Direction.java", content: "public enum Direction { UP, DOWN, IDLE }\n" },
        {
          id: "strategy",
          name: "SchedulingStrategy.java",
          content: `import java.util.List;

public interface SchedulingStrategy {
    Elevator choose(List<Elevator> elevators, int floor, Direction direction);
}
`,
        },
      ],
      python: [
        { id: "readme", name: "README.md", content: ELEVATOR_README, readOnly: true },
        {
          id: "system",
          name: "elevator_system.py",
          content: `from enum import Enum


class Direction(Enum):
    UP = 1
    DOWN = -1
    IDLE = 0


class ElevatorSystem:
    def __init__(self, elevators, strategy):
        self._elevators = elevators
        self._strategy = strategy

    def hall_call(self, floor: int, direction: Direction) -> None:
        raise NotImplementedError

    def car_call(self, elevator_id: int, floor: int) -> None:
        raise NotImplementedError

    def step(self) -> None:
        raise NotImplementedError
`,
        },
      ],
    },
    tests: [
      { name: "idle_elevator_answers_hall_call", passed: false, durationMs: 2, message: "Elevator 1 stayed on floor 0; expected floor 5 after 5 steps." },
      { name: "car_call_adds_stop", passed: false, durationMs: 1, message: "carCall() has no effect." },
      { name: "elevators_report_state", passed: true, durationMs: 1 },
      { name: "nearest_car_strategy_picks_closest", passed: false, durationMs: 2, message: "No strategy implementation found." },
      { name: "scan_strategy_serves_in_direction", passed: false, durationMs: 2, message: "No strategy implementation found." },
      { name: "doors_open_at_requested_floor", passed: false, durationMs: 1, message: "Door state is not modelled." },
      { name: "direction_changes_only_when_no_stops_ahead", passed: false, durationMs: 1, message: "step() is not implemented." },
      { name: "rejects_floor_outside_building", passed: true, durationMs: 1 },
    ],
    rubric: [
      { criterion: "Single responsibility", score: 3, max: 5, comment: "Not enough code yet to judge responsibilities." },
      { criterion: "Open/closed", score: 4, max: 5, comment: "SchedulingStrategy is the right extension point." },
      { criterion: "Liskov substitution", score: 3, max: 5, comment: "No implementations to evaluate." },
      { criterion: "Interface segregation", score: 4, max: 5, comment: "Strategy interface is focused." },
      { criterion: "Dependency inversion", score: 4, max: 5, comment: "ElevatorSystem depends on the strategy abstraction." },
      { criterion: "Design patterns", score: 2, max: 5, comment: "Strategy declared but not implemented; consider State for door and motion." },
      { criterion: "Extensibility", score: 2, max: 5, comment: "Request objects are missing, so priorities can't be added later." },
      { criterion: "Naming & readability", score: 4, max: 5, comment: "Names are clear." },
    ],
    patternsDetected: [{ name: "Strategy", where: "SchedulingStrategy (no implementations yet)", verdict: "questionable" }],
  },
];

export const designProblems: DesignProblemSummary[] = [...hldProblems, ...lldProblems].map(
  ({ id, kind, title, summary, difficulty, estimatedMin, companies, status, lastScore, required }) => ({
    id,
    kind,
    title,
    summary,
    difficulty,
    estimatedMin,
    companies,
    status,
    lastScore,
    required,
  }),
);
