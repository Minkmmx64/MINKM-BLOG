import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
class BlogDetail extends DataModule<BlogDetail>{
  msg = '';
  state = 0;
  id = '';
  index = '';
  create_at = '';
  update_at = '';
  declare data: BlogDetail;
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

class BlogDetailApi {
  /**
   * 文章详情 
   */
  public selectArticleDetails(pages: number, limit: number): Promise<AxiosResponse<BlogDetail>> {
    pages = typeof pages === 'number' ? pages : 1; //默认加载第一页
    return getAxios().get(`/blog/detail/article?limit=${limit}&pages=${pages}`);
  }
  /**
   * 文章评论
   */
  public selectArticleCommentFromId(pages: number, limit: number, SearchFrom?: Record<string, any>, QueryFrom?: Record<string, any>): Promise<AxiosResponse<BlogDetail>> {
    pages = typeof pages === 'number' ? pages : 1; //默认加载第一页
    return getAxios().get(`/blog/detail/comment?limit=${limit}&pages=${pages}&query=${JSON.stringify(QueryFrom)}&search=${JSON.stringify(SearchFrom)}`);
  }
  /**
   * 修改文章评论
   */
  public updateCommentFromId(id: string, comment: string): Promise<AxiosResponse<BlogDetail>> {
    return getAxios().put('/blog/detail/comment', { id, comment });
  }
}

export default new BlogDetailApi();