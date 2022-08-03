import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
class Qiniu extends DataModule<Qiniu>{

    username = '';
    userpsd = '';
    nickname = '';
    userphone = '';
    sex = '';
    imgUrl = '';
    update_time = '';
    create_time = '';
    u_token = '';
}

class QiniuApi {

    /**
     * @returns 用户信息
     */
    public qiniuAuth(): Promise<AxiosResponse<Qiniu>> {
        return getAxios().get(`/qiniu/upoad`);
    }


}

export default new QiniuApi();