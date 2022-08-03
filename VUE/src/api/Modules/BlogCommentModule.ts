import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
class BlogComment extends DataModule<BlogComment>{
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

export interface BlogCommentModule {
    username: string;
    comment: string;
    article_id: string;
    parent_id: string;
    avatar: string;
}

class BlogCommentApi {
    //发送评论
    public sendComment(data: BlogCommentModule): Promise<AxiosResponse<BlogComment>> {
        return getAxios().post('blog/article/comment', { data });
    }
    //获取评论
    public selectCommentByArticleId(id: string): Promise<AxiosResponse<BlogComment>> {
        return getAxios().get(`blog/article/comment/${id}`,);
    }
    //点赞评论
    public praiseComment(commentId: string, data: Object): Promise<AxiosResponse<BlogComment>> {
        return getAxios().put('blog/comment/parise', { commentId, data });
    }
    //获取点赞 
    public selectPraiseComment(username: string, userId: string): Promise<AxiosResponse<BlogComment>> {
        return getAxios().get('blog/comment/parise', { params: { username, userId } });
    }
}

export default new BlogCommentApi();
export const BlogComments = new BlogComment();