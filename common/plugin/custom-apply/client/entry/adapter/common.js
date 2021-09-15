import { formatDate } from '@common/utils/format-date';
import { PLUGIN_TOMID_CONFIG } from '@common/plugin/plugin-tomid-config';

// 获取提交数据
export const getPostData = (body) => {
  return {
    tomId: PLUGIN_TOMID_CONFIG.apply,
    body,
  };
};
