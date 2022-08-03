import { AxiosResponse } from 'axios';
import { getAxios } from '../config';
import { DataModule } from './DataModule';
export class MonitorModule extends DataModule<MonitorModule>{

}
class MonitorModuleApi {
  public MonitorList(): Promise<AxiosResponse<MonitorModule>> {
    return getAxios().get("/admin/monitor");
  }
}

export default new MonitorModuleApi();