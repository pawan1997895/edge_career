import type { Lesson } from "@/types/curriculum";

/** Full lesson content. Other lessons get a generated placeholder (see src/data/lessons.ts). */
export const lessonDetails: Record<string, Omit<Lesson, "status">> = {
  "lesson-consistent-hashing": {
    id: "lesson-consistent-hashing",
    moduleId: "system-design",
    topicId: "sd-blocks",
    title: "Consistent hashing",
    summary:
      "Why `hash(key) % N` falls apart when servers come and go, how a hash ring moves only a small share of keys, and how virtual nodes keep load even. Ends with where you will meet it in real systems and interviews.",
    durationSec: 1320,
    instructor: "Neha Kulkarni, Staff Engineer",
    chapters: [
      { title: "Why modulo hashing breaks", startSec: 0 },
      { title: "The hash ring", startSec: 250 },
      { title: "Adding and removing nodes", startSec: 540 },
      { title: "Virtual nodes and balance", startSec: 830 },
      { title: "Where it is used", startSec: 1110 },
    ],
    transcript: [
      { startSec: 0, endSec: 58, text: "Imagine you run a cache cluster with four servers. To decide where a key lives, the simplest idea is to hash the key and take the result modulo four." },
      { startSec: 58, endSec: 121, text: "That works perfectly until the cluster changes size. Add a fifth server and almost every key now maps to a different server, because modulo five gives different answers than modulo four." },
      { startSec: 121, endSec: 190, text: "For a cache, that means a sudden wave of misses. Every request falls through to the database at the same moment. Teams call this a cache stampede, and it can take a database down." },
      { startSec: 190, endSec: 250, text: "So the real question is: can we spread keys across servers in a way where adding or removing one server only moves a small share of keys? That is exactly what consistent hashing gives us." },
      { startSec: 250, endSec: 318, text: "Picture the output range of the hash function bent into a circle, from zero all the way round to the maximum value. We call this the hash ring." },
      { startSec: 318, endSec: 372, text: "We hash each server's identifier, for example its IP address, and place the server at that point on the ring. Four servers give us four points." },
      { startSec: 372, endSec: 436, text: "To find the owner of a key, hash the key, land on the ring, and walk clockwise until you meet the first server. That server owns the key." },
      { startSec: 436, endSec: 494, text: "In code, the ring is usually a sorted list of server positions. Finding the owner is a binary search for the first position greater than or equal to the key's hash, wrapping round to the start." },
      { startSec: 494, endSec: 540, text: "That lookup is O(log n) in the number of positions on the ring, which is fast enough to run on every single request." },
      { startSec: 540, endSec: 610, text: "Now add a fifth server. It lands somewhere on the ring, between two existing servers. Only the keys between its predecessor and its own position move to it." },
      { startSec: 610, endSec: 676, text: "Every other key stays exactly where it was. On average only one fifth of the keys move, instead of almost all of them with modulo hashing." },
      { startSec: 676, endSec: 752, text: "Removing a server works the same way in reverse. Its keys move to the next server clockwise, and nothing else is disturbed. That is the property interviewers want you to state clearly." },
      { startSec: 752, endSec: 830, text: "But there is a catch. With only a few points on the ring, the gaps between servers are uneven. One server can end up owning a much larger arc, and so a much larger share of the traffic." },
      { startSec: 830, endSec: 902, text: "The fix is virtual nodes. Instead of placing each server once, we place it many times, say one hundred to two hundred points per server, each with a different hash." },
      { startSec: 902, endSec: 968, text: "With many points per server, the arcs average out and each server owns roughly the same share of keys. When a server leaves, its load spreads across many servers instead of landing on one neighbour." },
      { startSec: 968, endSec: 1040, text: "Virtual nodes also let you handle servers of different sizes. A machine with twice the memory simply gets twice as many points on the ring." },
      { startSec: 1040, endSec: 1110, text: "The cost is a bigger ring to store and search, but even thousands of positions fit easily in memory, and the binary search stays fast." },
      { startSec: 1110, endSec: 1178, text: "You will meet consistent hashing in distributed caches like Memcached client libraries, in databases like Cassandra and DynamoDB for partitioning data, and in load balancers that need sticky routing." },
      { startSec: 1178, endSec: 1250, text: "In an interview, bring it up when the design must scale a stateful tier horizontally. Explain the ring, the clockwise lookup, how little data moves on resize, and why you need virtual nodes." },
      { startSec: 1250, endSec: 1320, text: "In the next lesson we will connect this to replication: storing each key on the next two or three servers clockwise, so the system survives a server failure without losing data." },
    ],
    resources: [
      { title: "Lesson notes: consistent hashing", kind: "notes" },
      { title: "Slides (PDF)", kind: "slides" },
      { title: "Hash ring implementation in Python and Java", kind: "code" },
      { title: "Dynamo paper, section 4.2", kind: "link" },
    ],
    watchedSec: 372,
  },
};
