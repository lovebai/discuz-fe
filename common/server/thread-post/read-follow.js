import {readFollow} from '@discuzqfe/sdk/dist/api/user/read-follow';

/**
 * 获取粉丝关注
 */
export default async function _readFollow(opt = {}) {
  const res = await readFollow({ ...opt });
  return res;
}
