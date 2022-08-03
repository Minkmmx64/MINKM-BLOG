import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
class BlogCategoties extends DataModule<BlogCategoties>{

    categorie = '';
    msg = '';
    state = 0;
    id = '';
    index = '';
    create_at = '';
    update_at = '';

}

class BlogCategotiesApi {

    public addBlogCategoties(str: string): Promise<AxiosResponse<BlogCategoties>> {
        return getAxios().post('/blog/post/categorie', { param: str });
    }

    public getBlogCategoties(): Promise<AxiosResponse<BlogCategoties>> {
        return getAxios().get('/blog/get/categorie');
    }

    public updateBlogCategoties(edit: string, backedit: string): Promise<AxiosResponse<BlogCategoties>> {
        return getAxios().put('/blog/put/categorie', { edit, backedit });
    }

    public deleteBlogCategoties(categoties: string): Promise<AxiosResponse<BlogCategoties>> {
        return getAxios().delete('/blog/delete/categorie', { params: { name: categoties } });
    }
}

export default new BlogCategotiesApi();