export interface Result<T>{
  REQ_ID:string;
  status:string;
  remarks:string;
  rates: T[];
}
