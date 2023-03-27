/**
 * 新建私信对话
 */
import { createDialog } from '@discuzqfe/sdk/dist/api/notice/create-dialog';

export default async function _createDialog(params) {
  const res = await createDialog({ data: params });
  return res;
}
