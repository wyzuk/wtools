export type ToolCategory =
  | "network"
  | "domain"
  | "web"
  | "security"
  | "phone"
  | "geo"
  | "developer";

export interface ToolDefinition {
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  longDescription: string;
  icon: string; // Lucide icon identifier
  keywords: string[];
  popular?: boolean;
  featured?: boolean;
  apiSource?: {
    name: string;
    url: string;
    type: "public-api" | "standard-protocol" | "client-side" | "server-probe";
  };
}

export interface CategoryDefinition {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
}
