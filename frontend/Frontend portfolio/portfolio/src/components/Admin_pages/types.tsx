export type Subscription = {
  id: number;
  username: string;
  email: string;
  amount: number;
  startedAt: string;       // ISO date
  nextBillingDate: string; // ISO date
  status: "active" | "expired" | "cancelled";
};
