import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
export class BlogWebShare extends DataModule<WebShare>{

    categorie = '';
    msg = '';
    state = 0;
    id = '';
    index = '';
    create_at = '';
    update_at = '';

}
export interface WebShare {
    imgUrl: string
    site: string
    title: string
    describe: string
    id?: string
    classname: string
}

class BlogWebShareApi {

    public addBlogWebShare(WebShare: WebShare): Promise<AxiosResponse<BlogWebShare>> {
        return getAxios().post('/blog/post/webshare', { param: WebShare });
    }

    public getBlogWebShare(limit: number, size: number): Promise<AxiosResponse<BlogWebShare>> {
        limit = typeof limit === 'number' ? limit : 1; //默认加载第一页
        size = typeof size === 'number' ? size : 10; //默认10
        return getAxios().get(`/blog/get/webshare?limit=${limit}&size=${size}`);
    }

    public updateBlogWebShare(edit: WebShare): Promise<AxiosResponse<BlogWebShare>> {
        return getAxios().put('/blog/put/webshare', { edit });
    }

    public deleteBlogWebShare(id: string): Promise<AxiosResponse<BlogWebShare>> {
        return getAxios().delete(`/blog/delete/webshare?id=${id}`);
    }

    public getClientWebShare(search?: Record<string, any>): Promise<AxiosResponse<BlogWebShare>> {
        return getAxios().get(`/blog/get/client/webshare?search=${JSON.stringify(search)}`);
    }
}

export default new BlogWebShareApi();