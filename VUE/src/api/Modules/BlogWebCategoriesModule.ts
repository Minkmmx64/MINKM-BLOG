import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
export class BlogWebCategories extends DataModule<BlogWebCategories>{
  categorie = '';
  msg = '';
  state = 0;
  id = '';
  index = '';
  create_at = '';
  update_at = '';
}

class BlogWebCategoriesApi {
  public addWebCategories(source: Record<string, any>): Promise<AxiosResponse<BlogWebCategories>> {
    return getAxios().post('/blog/post/WebCategories', source);
  }

  public getWebCategories(pages: number, limits: number, search?: Record<string, string> | string, query?: string): Promise<AxiosResponse<BlogWebCategories>> {
    return getAxios().get(`/blog/get/WebCategories?pages=${pages}&limits=${limits}&search=${search}&query=${query}`);
  }

  public updateWebCategories(source: Record<string, any>): Promise<AxiosResponse<BlogWebCategories>> {
    return getAxios().put('/blog/put/WebCategories', source);
  }

  public deleteWebCategories(id: string): Promise<AxiosResponse<BlogWebCategories>> {
    return getAxios().delete(`/blog/delete/WebCategories?id=${id}`);
  }
}

export default new BlogWebCategoriesApi();