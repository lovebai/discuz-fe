import { readThreadAttachmentUrl } from '@discuzqfe/sdk/dist/api/thread/read-threadattachmenturl';

export default async function _readThreadAttachmentUrl(opts, ctx = null) {
  return await readThreadAttachmentUrl({ ...opts, __context: ctx });
}
