
export interface RateCheckInput{
  pick_code:string | null;
  pick_state:string | null;
  pick_country:string | null;
  send_code:string | null;
  send_state:string | null;
  send_country:string | null;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  date_coll: Date | null;
}
