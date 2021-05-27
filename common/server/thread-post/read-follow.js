import {readFollow} from '@discuzq/sdk/dist/api/user/read-follow';

/**
 * 获取粉丝关注
 */
export default async function _readFollow(opt = {}) {
  const res = await readFollow({ ...opt, url: '/apiv3/follow' });
  return res;
}