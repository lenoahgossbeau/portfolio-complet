export interface Subscription {
  id: number;
  profile_id: number;
  start_date: string;
  end_date: string;
  type: string;
  payment_method: string;
}