import type { RecommendationType } from "../types";

export function getTypeLabel(type: RecommendationType) {
  switch (type) {
    case "strategic":
      return "strategiczna";
    case "systemic":
      return "systemowa";
    case "operational":
      return "operacyjna";
    default:
      return type;
  }
}

export function getPriorityLabel(priority: string) {
  switch (priority) {
    case "high":
      return "wysoki priorytet";
    case "medium":
      return "średni priorytet";
    case "low":
      return "niski priorytet";
    default:
      return priority;
  }
}