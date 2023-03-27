import {setSignInFields} from '@discuzqfe/sdk/dist/api/login/set-sign-in-fields';

export default async function _setSignInFields(opts, ctx) {
  return await setSignInFields({ ...opts, __context: ctx });
}
