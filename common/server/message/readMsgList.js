/**
 * 获取消息通知列表
 */
import { readNotification } from '@discuzqfe/sdk/dist/api/notice/read-notification';

export default async function _readMsgList(opts, ctx = null) {
  const res = await readNotification({ ...opts, __context: ctx });
  return res;
}
