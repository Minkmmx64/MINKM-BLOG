import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
class BlogFriendChain extends DataModule<BlogFriendChain>{
    categorie = '';
    msg = '';
    state = 0;
    id = '';
    index = '';
    create_at = '';
    update_at = '';
}

class BlogFriendChainApi {

    public addFriendChain(source:Record<string,any>): Promise<AxiosResponse<BlogFriendChain>> {
        return getAxios().post('/blog/post/friend', source );
    }

    public getFriendChain(pages:number,limits:number,search?:Record<string,string> | string,query?:string): Promise<AxiosResponse<BlogFriendChain>> {
        return getAxios().get(`/blog/get/friend?pages=${pages}&limits=${limits}&search=${search}&query=${query}`);
    }

    public updateFriendChain(source: Record<string, any>): Promise<AxiosResponse<BlogFriendChain>> {
        return getAxios().put('/blog/put/friend', source);
    }

    public deleteFriendChain(id:string): Promise<AxiosResponse<BlogFriendChain>> {
        return getAxios().delete(`/blog/delete/friend?id=${id}`);
    }
}

export default new BlogFriendChainApi();