import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
export class Upload extends DataModule<Upload>{
    article_id;
    avatar;
    comment;
    comment_dislike;
    comment_like;
    like;
    parent_id;
    username;
    _id;
}

export class UploadApi {
    public UploadChatHeadImage(formData: FormData): Promise<AxiosResponse<Upload>> {
        return getAxios().post('/chat/upload/img/head', formData);
    }
}

export default new UploadApi();