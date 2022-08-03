import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
class BlogBanners extends DataModule<BlogBanners>{
    msg = '';
    state = 0;
    id = '';
    index = '';
    create_at = '';
    update_at = '';
    avatar = '';
}

class BlogBannersApi {

    public addBlogBanners(value: Record<string, any>): Promise<AxiosResponse<BlogBanners>> {
        return getAxios().post('/blog/post/banner', { param: value });
    }

    public getBlogBanners(): Promise<AxiosResponse<BlogBanners>> {
        return getAxios().get('/blog/get/banner');
    }

    public updateBlogBanners(_id: string, value: Record<string, any>): Promise<AxiosResponse<BlogBanners>> {
        return getAxios().put('/blog/put/banner', { _id, value });
    }

    public deleteBlogBanners(_id: string): Promise<AxiosResponse<BlogBanners>> {
        return getAxios().delete('/blog/delete/banner', { params: { _id: _id } });
    }
}

export default new BlogBannersApi();