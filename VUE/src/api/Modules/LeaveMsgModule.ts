import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
export class LeaveMsgModule extends DataModule<LeaveMsgModule>{
  content = "";
  phone = "";
  qqnumber: "";
  email = "";
  side = "";
  user = "";
  avatar = "";
  pid = "";
}

export interface LeaveMsgParams {
  content: string,
  phone?: string,
  qqnumber?: string,
  email?: string,
  side?: string,
  user: string,
  avatar: string,
  pid: string,
  replayuser?: string;
  chileren?: leaveChildrenMsg[]
}

export interface leaveChildrenMsg {
  content: string,
  qqnumber?: string,
  user: string,
  avatar: string,
  pid: string,
}

class LeaveMsgApi {
  public postLeaveMsg(data: LeaveMsgParams): Promise<AxiosResponse<LeaveMsgModule>> {
    return getAxios().post('/blog/leave/msg', data);
  }
  public loadLeaveMsg(pages: number, limit: number, search?: Record<string, any>, query?: Record<string, any>): Promise<AxiosResponse<LeaveMsgModule>> {
    let Q = null;
    if (Object.prototype.toString.call(query) === "[object Object]") Q = JSON.stringify(query);

    return getAxios().get(`/blog/leave/msg?pages=${pages}&limits=${limit}&search=${JSON.stringify(search)}&query=${Q}`);
  }
  public deleteLeaveMsg(id: string, email: string, usercontent: string, content: string): Promise<AxiosResponse<LeaveMsgModule>> {
    return getAxios().delete(`/blog/leave/msg?id=${id}&email=${email}&usercontent=${usercontent}&content=${content}`);
  }
  public putLeaveMsgReply(edit: string): Promise<AxiosResponse<LeaveMsgModule>> {
    return getAxios().put(`/blog/leave/msg?edit=${edit}`);
  }
  public updateLeaveMsg(content: string, id: string): Promise<AxiosResponse<LeaveMsgModule>>{
    return getAxios().put(`/blog/toggle/leave`, { ctx: content, id: id });
  }
}

export default new LeaveMsgApi();