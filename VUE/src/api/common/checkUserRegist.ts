import { userNameRegEx, userNicknameRegEx, userPhoneRegEx, userPsdRegEx } from '@/common/common';
import { ElMessage } from 'element-plus';
import { IUserRegist } from './ChatBase';
export function registError(params: IUserRegist) {
    let isAccess = 1;
    let uname = params.uname;
    let nickname = params.nickname;
    let psd = params.psd;
    let bpsd = params.bpsd;
    let phone = params.phone;
    if (!userNameRegEx.test(uname)) {
        ElMessage.error("用户名6-20个包含中英文数字下划线");
        isAccess = 0;
    }
    if (!userNicknameRegEx.test(nickname)) {
        ElMessage.error("昵称6-20个包含中英文数字下划线");
        isAccess = 0;
    }
    if (!userPhoneRegEx.test(phone)) {
        ElMessage.error("手机号不规范");
        isAccess = 0;
    }
    if (!userPsdRegEx.test(psd)) {
        ElMessage.error("密码6-20位英文数字");
        isAccess = 0;
    }
    if (psd !== bpsd) {
        ElMessage.error("两次密码不正确");
        isAccess = 0;
    }
    if (isAccess) {
        return true;
    }
    return false;
}