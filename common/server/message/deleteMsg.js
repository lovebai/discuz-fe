/**
 * 删除消息
 */
import { deleteNotification } from '@discuzqfe/sdk/dist/api/notice/delete-notification';

export default async function _deleteMsg(params) {
  const res = await deleteNotification({ data: params });
  return res;
}
