import { AxiosResponse } from "axios";

export default interface BaseApi<T> {
  update: (...params: any) => Promise<AxiosResponse<T>>;
  add: (...params: any) => Promise<AxiosResponse<T>>;
  delete: (...params: any) => Promise<AxiosResponse<T>>;
}