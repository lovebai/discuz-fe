import {readPermissions} from '@discuzqfe/sdk/dist/api/user/read-permissions.js';
export default async function _readPermissions(opts, ctx = null) {
  const res = await readPermissions({ ...opts, __context: ctx });
  return res;
}
