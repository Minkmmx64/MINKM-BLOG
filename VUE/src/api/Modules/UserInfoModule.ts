import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
export class UserInfo extends DataModule<UserInfo>{
    username = '';
    userpsd = '';
    nickname = '';
    userphone = '';
    sex = false;
    imgUrl = '';
    update_time = '';
    create_time = '';
    u_token = '';
    browse = 0;
    comment = 0;
    article = 0;
    like = 0;
    dislike = 0;
    phone = '';
}

class UserInfoApi {

    /**
     * @returns 用户信息
     */
    public userInfo(limit: number, current: number): Promise<AxiosResponse<UserInfo>> {
        return getAxios().get(`/user/info?limit=${limit}&current=${current}`);
    }

    /**
     * 首页信息
     */
    public adminInfo(): Promise<AxiosResponse<UserInfo>> {
        return getAxios().get(`/front/admin/info`);
    }

    /**
     * 修改用户信息
     * @param SearchFrom 
     * @returns {Promise}
     */
    public UpdateUserInfo(SearchFrom: UserInfo): Promise<AxiosResponse<UserInfo>>{
        return getAxios().put("/user/info", SearchFrom);
    }

}

export default new UserInfoApi();