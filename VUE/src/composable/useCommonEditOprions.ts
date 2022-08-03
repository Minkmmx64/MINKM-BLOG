import { DataModule } from "@/api/Modules/DataModule";
import { deepClone } from "@/common/Utils";
import { AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import { Ref, ref } from "vue";
import BaseApi from '@/api/Modules/BaseApi';
/**
 * 增删改操作
 */
type options = "update" | "add" | "delete" | "View";

/**
 * 任意类型
 */
type TypeAll = Record<string, any> | string | number | boolean;

/**
 * 通用修改表格Api
 */
interface IuseCommonEditOprions<T>{
  /**
   * 修改数据
   */
  handleEdit: (record:T) => void;
  /**
   * 删除数据
   */
  handleDelete: (...params) => void;
  /**
   * 编辑完成
   */
  handleOk: (options?: options) => void;
  /**
   * 关闭弹框
   */
  handleCancel: () => void;
  /**
   * 单纯查看
   */
  handleView: () => void;
  /**
   * 修改操作
   */
  update: () => void;
  /**
   * 增加操作
   */
  insert: () => void;
  /**
   * 编辑完成
   */
  isEditing: Ref<boolean>
  /**
   * 数据类型
   */
  EditOptions: Ref<TypeAll>;
}

export function useCommonEditOprions<T extends DataModule<K>,K>(
  CommonApi: BaseApi<T>,
  EditOptions: Ref<TypeAll>,
  tableFunction?: () => {
    isEditing: Ref<boolean>,
    loadTableData: (pages?: number, limits?: number) => void;
    confirmLoading: Ref<boolean>;
    total: Ref<number>;
    current: Ref<number>;
  },
  additional?: TypeAll //修改附加参数
): IuseCommonEditOprions<T> {

  const id = null as Record<string, string>;
  const showView = ref<boolean>();
  const { isEditing, loadTableData, confirmLoading, total, current } = tableFunction();
  
  function handleEdit(record: T) {
    EditOptions.value = deepClone(record);
    isEditing.value = true;
  }

  function handleDelete(record:TypeAll,id?:TypeAll) {
    CommonApi.delete(record, id)
      .then((data) => {
        if (data.data.state === 200) {
          ElMessage.success(data.data.msg);
          if ((total.value - 1) % 10 === 0 && total.value !== 1) {
            current.value = current.value - 1;
          }
          loadTableData();
        }
      }).catch((error) => ElMessage.error(error));
  }

  function handleOk(options?: options) {
    switch (options) {
      case "update": {
        confirmLoading.value = true;
        CommonApi.update(EditOptions.value, id, additional).then(data => {
          setTimeout(() => {
            if (data.data.state === 200) {
              loadTableData();
              ElMessage.success(data.data.msg);
            } else ElMessage.error(data.data.msg);
            isEditing.value = false;
            confirmLoading.value = false;
          }, 800);
        }).catch(error => ElMessage.error(error));
        break;
      }
      case "delete": {
        
      }
      case "add": {
        
      }
    }
  }

  function handleCancel() {
    showView.value = false;
    isEditing.value = false;
  }

  function update(){

  }

  function insert() {
    
  }

  function handleView() {
    showView.value = true;
  }

  return {
    handleEdit,
    handleDelete,
    handleOk,
    handleCancel,
    update,
    insert,
    isEditing,
    EditOptions,
    handleView
  };
}