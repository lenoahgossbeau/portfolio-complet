import { Subscription } from "./types";

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 1,
    profile_id: 1,
    start_date: "2025-08-16",
    end_date: "2026-08-16",
    type: "Standard",
    payment_method: "Orange Money",
    amount: 100,
  },
  {
    id: 2,
    profile_id: 2,
    start_date: "2025-08-16",
    end_date: "2026-08-16",
    type: "Premium",
    payment_method: "MTN Money",
    amount: 100,
  },
];