/**
 * 相应通用数据
 */
interface ResponseMeta {
    count?: number;
    query?: number;
}
export class DataModule<T> {
    [praname: string]: any;
    code: number;
    msg = '';
    state = 0;
    id = '';
    index = '';
    create_at = '';
    update_at = '';
    meta: ResponseMeta;
    data?: T;
}