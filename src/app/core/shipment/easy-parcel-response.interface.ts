import {Result} from "./rate-checking-result.interface";

export interface EasyParcelResponse<T>{
  api_status:string;
  error_code:string;
  error_remark:string;
  result: Result<T>[];
}
