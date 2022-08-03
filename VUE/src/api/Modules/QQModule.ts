import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
export class QQModule extends DataModule<QQApiResponse>{

}
export interface QQApiResponse {
    qq: string
    name: string
    avatar: string
}

class QQApi {
    public getQQUserInfo(qq: string): Promise<AxiosResponse<QQModule>> {
        return getAxios().get(`https://api.usuuu.com/qq/${qq}?time=${new Date().getTime()}`);
    }
}

export default new QQApi();