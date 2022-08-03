import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
class BlogFrontArticle<T> extends DataModule<BlogFrontArticle<T>>{

    msg = '';
    state = 0;
    id = '';
    index = '';
    create_at = '';
    update_at = '';
    declare data: BlogFrontArticle<T>;
}

export interface Article {
    //内容
    content: string,
    //标题
    title: string,
    //标签
    label: string,
    //作者
    author?: string,
    //署名
    signature: string,
    //分类
    categorie: string,
    //描述
    describe: string,
    //图片
    picture: string

    data?: Article[]
}

class BlogFrontArticleApi {

    //获取文章
    public blogArticle(limit: number, size: number, search: string): Promise<AxiosResponse<BlogFrontArticle<Article>>> {
        return getAxios().get('client/get/article', { params: { limit, size, search } });
    }

    //获取归档
    public searchBlogFile(): Promise<AxiosResponse<BlogFrontArticle<Article>>> {
        return getAxios().get('client/get/file');
    }

    public clientLabelandCategories(): Promise<AxiosResponse<BlogFrontArticle<Article>>> {
        return getAxios().get('client/get/detali');
    }

    public HomeBlogArticle(limit: number, current: number, query: string | number, search: string): Promise<AxiosResponse<BlogFrontArticle<Article[]>>> {
        return getAxios().get(`client/home/article?limit=${limit}&current=${current}&query=${query}&search=${search}`);
    }

}

export default new BlogFrontArticleApi();