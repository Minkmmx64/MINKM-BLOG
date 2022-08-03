import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
import BaseApi from './BaseApi';
class BlogArticle extends DataModule<BlogArticle>{

    msg = '';
    state = 0;
    id = '';
    index = '';
    create_at = '';
    update_at = '';
    declare data: BlogArticle;
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

class BlogArticleApi implements BaseApi<BlogArticle> {

    /**添加文章 */
    public addBlogArticle(param: Article): Promise<AxiosResponse<BlogArticle>> {
        return getAxios().post('/blog/post/article', param);
    }

    /**加载分类选择器 */
    public loadSelectOptions(): Promise<AxiosResponse<BlogArticle>> {
        return getAxios().get('/blog/get/categorie');
    }

    /**加载热门文章 */
    public loadHotArticle(id: string | string[]): Promise<AxiosResponse<BlogArticle>> {
        return getAxios().get('/blog/get/hot/article', { params: { id } });
    }

    /**
     * @param limit //每一页大小
     * @param pages //当前页
     * @returns 获取未删除文章
     */
    public loadAllArticle(pages: number, limits: number, searchFrom?: Record<string, any>): Promise<AxiosResponse<BlogArticle>> {
        pages = typeof pages === 'number' ? pages : 1; //默认加载第一页
        return getAxios().get(`/blog/get/all/article?limits=${limits}&pages=${pages}&search=${JSON.stringify(searchFrom)}`);
    }

    /**
     * @param param 修改后数据
     * @returns 修改文章
     */
    public update(param: Article): Promise<AxiosResponse<BlogArticle>> {
        return getAxios().put(`/blog/put/article`, param);
    }

    /**
     * @param limit 
     * @param pages 
     * @returns 加载标签选项
     */
    public loadLabelOptions(): Promise<AxiosResponse<BlogArticle>> {
        return getAxios().get(`/blog/get/label`);
    }

    /**
     * @param id 
     * @returns 软删除文章
     */
    public delete(id: string, state: number): Promise<AxiosResponse<BlogArticle>> {
        return getAxios().put(`/blog/put/recovery/${id}/article`, { state });
    }

    /**
     * @param limit 
     * @param pages 
     * @returns 获取软删除文章
     */
    public LoadArticleRecovery(pages: number, limit: number, searchFrom?: Record<string, any>): Promise<AxiosResponse<BlogArticle>> {
        pages = typeof pages === 'number' ? pages : 1; //默认加载第一页
        limit = typeof limit === 'number' ? limit : 10; //默认10
        return getAxios().get(`/blog/get/recovery/article?limit=${limit}&pages=${pages}&search=${JSON.stringify(searchFrom)}`);
    }

    /**
     * @param id 
     * @returns 硬删除文章
     */
    public deleteArticle(id: string): Promise<AxiosResponse<BlogArticle>> {
        return getAxios().delete(`/blog/delete/${id}/article`);
    }

    public add: (...params: any[]) => Promise<AxiosResponse<BlogArticle>>;
}

export default new BlogArticleApi();