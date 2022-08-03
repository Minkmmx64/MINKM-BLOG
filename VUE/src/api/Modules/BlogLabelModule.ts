import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';

class BlogLabel extends DataModule<BlogLabel>{
    categorie = '';
    msg = '';
    state = 0;
    id = '';
    index = '';
    create_at = '';
    update_at = '';
}

//文章标签增删改查
class BlogLabelApi {

    public addBlogLabel(str: string): Promise<AxiosResponse<BlogLabel>> {
        return getAxios().post('/blog/post/label', { param: str });
    }

    public getLabelOptions(limit: number, pages: number): Promise<AxiosResponse<BlogLabel>> {
        return getAxios().get(`/blog/get/label?limit=${limit}&pages=${pages}`);
    }

    public updateBlogLabel(edit: string, backedit: string): Promise<AxiosResponse<BlogLabel>> {
        return getAxios().put('/blog/put/label', { edit, backedit });
    }

    public deleteBlogLabel(label: string): Promise<AxiosResponse<BlogLabel>> {
        return getAxios().delete('/blog/delete/label', { params: { name: label } });
    }
}

export default new BlogLabelApi();