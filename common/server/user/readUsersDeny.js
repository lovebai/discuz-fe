import {readUsersDeny} from '@discuzqfe/sdk/dist/api/user/read-usersdeny';


export default async function _readUsersDeny(opts, ctx) {
  const res = await readUsersDeny({ ...opts, __context: ctx });
  return res;
}
