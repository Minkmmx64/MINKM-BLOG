import { ref, Ref } from 'vue';
import { AxiosResponse } from 'axios';
import { DataModule } from '@/api/Modules/DataModule';
import { ElMessage } from "element-plus";
import { deepClone } from '@/common/Utils';
interface IuseCommonDataSource<T> {
  loadTableData: (pages?: number, limits?: number) => void;
  [index: string]: any;
  dataSource: Ref<T>;
  handleCancel: () => void;
  pagingParam: (events: { current: number, pageSize: number }) => void;
  loading: Ref<boolean>;
  total: Ref<number>;
  isEditing: Ref<boolean>;
  cancleSearchFrom: () => void;
  SearchData: () => void;
  confirmLoading: Ref<boolean>;
  current: Ref<number>;
  tableFunction?: () => {
    isEditing: Ref<boolean>,
    loadTableData: (pages?: number, limits?: number) => void;
    confirmLoading: Ref<boolean>;
    total: Ref<number>;
    current: Ref<number>;
  }
}
/**
 * @param loadTableDataApi 加载列表的API
 * @param getPaging 分页默认第一页每页10条
 * @param SearchFrom 模糊查询参数
 * @param querySelect 普通查询参数
 * @returns {useCommonDataSource}
 */
export function useCommonDataSource<T extends DataModule<T>>(
  loadTableDataApi: (currentPags: Ref<number> | number,
    limits: Ref<number> | number,
    Search: Record<string, any> | string,
    Query: Record<string, any> | string
  ) => Promise<AxiosResponse<T>>,
  getPaging: { currentPags: number, limits: number },
  SearchFrom: Ref<any>,
  querySelect?: () => Record<string, any> | string,
  isTree?: Boolean
): IuseCommonDataSource<T> {
  const confirmLoading = ref(false);
  const dataSource = ref();
  const loading = ref(false);
  const total = ref(0);
  const current = ref(1);
  const pageSize = ref(10);
  const isEditing = ref(false);
  const params = (typeof getPaging === "object" &&
    getPaging?.currentPags &&
    getPaging?.limits && getPaging !== null) ?
    getPaging : { currentPags: 1, limits: 10 };
  current.value = params.currentPags;
  pageSize.value = params.limits;

  function loadTableData() {
    const query = typeof querySelect === "function" && querySelect !== null ? querySelect() : {};
    SearchFrom = SearchFrom === null ? ref({}) : SearchFrom;
    loadTableDataApi(current.value, pageSize.value, SearchFrom.value, query)
      .then(d => {
        loading.value = true;
        setTimeout(() => {
          if (d.data.state === 200) {
            dataSource.value = deepClone(d.data.data) as [];
            //ElMessage.success(d.data.msg);
            if (isTree) {
              for (let i = 0; i < dataSource.value.length; i++) {
                dataSource.value[i].children = [];
              }
            }
            if (d.data.meta) {
              total.value = d.data.meta.count;
            }
            loading.value = false;
          } else if (d.data.state >= 400) {
            ElMessage.error(d.data.msg);
            loading.value = false;
          }
        }, 800);
      }).catch(e => {
        ElMessage.error(e);
      });
  }

  function handleCancel() {
    isEditing.value = false;
  }

  function SearchData() {
    for (let k in SearchFrom.value) {
      if (SearchFrom.value[k] !== '') {
        loadTableData();
        return;
      }
    }
    return;
  }

  function cancleSearchFrom() {
    let f = true;
    for (let k in SearchFrom.value) {
      if (SearchFrom.value[k] !== '') {
        f = false;
        SearchFrom.value[k] = ref('');
      }
    }
    if (!f) loadTableData();
    else return;
  }

  function pagingParam(e: { current: number, pageSize: number }) {
    current.value = e.current;
    pageSize.value = e.pageSize;
    loadTableData();
  }

  function tableFunction() {
    return {
      loadTableData,
      isEditing,
      confirmLoading,
      total,
      current
    };
  }

  return {
    cancleSearchFrom,
    loadTableData,
    handleCancel,
    dataSource,
    loading,
    total,
    isEditing,
    current,
    pageSize,
    pagingParam,
    SearchData,
    confirmLoading,
    tableFunction
  };
}