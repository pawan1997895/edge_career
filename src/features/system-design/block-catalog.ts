// The typed blocks learners can place on the HLD canvas.

import {
  Cog,
  Database,
  DatabaseBackup,
  Globe,
  HardDrive,
  ListOrdered,
  Monitor,
  Router,
  Search,
  Server,
  Split,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { BlockType } from "@/types/system-design";

export type BlockCategory = "Entry" | "Traffic" | "Compute" | "Data" | "Messaging";

export interface BlockMeta {
  label: string;
  description: string;
  icon: LucideIcon;
  category: BlockCategory;
  /** Icon tile colours (full class names so Tailwind keeps them). */
  tint: string;
  /** MiniMap fill. */
  color: string;
}

const TINT: Record<BlockCategory, { tint: string; color: string }> = {
  Entry: { tint: "bg-chart-2/12 text-chart-2", color: "var(--chart-2)" },
  Traffic: { tint: "bg-chart-5/12 text-chart-5", color: "var(--chart-5)" },
  Compute: { tint: "bg-chart-1/12 text-chart-1", color: "var(--chart-1)" },
  Data: { tint: "bg-chart-3/15 text-chart-3", color: "var(--chart-3)" },
  Messaging: { tint: "bg-chart-4/12 text-chart-4", color: "var(--chart-4)" },
};

function block(label: string, description: string, icon: LucideIcon, category: BlockCategory): BlockMeta {
  return { label, description, icon, category, ...TINT[category] };
}

export const BLOCKS: Record<BlockType, BlockMeta> = {
  client: block("Client", "Browser, mobile app or another system", Monitor, "Entry"),
  cdn: block("CDN", "Edge cache for static files and media", Globe, "Entry"),
  load_balancer: block("Load balancer", "Spreads traffic across instances", Split, "Traffic"),
  api_gateway: block("API gateway", "Routing, auth and rate limits", Router, "Traffic"),
  service: block("Service", "Stateless application server", Server, "Compute"),
  worker: block("Worker", "Background job consumer", Cog, "Compute"),
  cache: block("Cache", "In-memory store such as Redis", Zap, "Data"),
  database: block("Database", "Primary data store", Database, "Data"),
  replica: block("Read replica", "Copy of a database for reads and failover", DatabaseBackup, "Data"),
  search: block("Search index", "Full-text or geo index", Search, "Data"),
  object_storage: block("Object storage", "Blobs and media, e.g. S3", HardDrive, "Data"),
  queue: block("Queue", "Message queue or event stream", ListOrdered, "Messaging"),
};

export const BLOCK_ORDER: BlockType[] = [
  "client",
  "cdn",
  "load_balancer",
  "api_gateway",
  "service",
  "worker",
  "cache",
  "database",
  "replica",
  "search",
  "object_storage",
  "queue",
];

/** dataTransfer type used when dragging a block from the palette onto the canvas. */
export const BLOCK_DRAG_TYPE = "application/x-edge-block";

export function isBlockType(value: string): value is BlockType {
  return value in BLOCKS;
}
