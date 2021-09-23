import api from '../api';

export default async function _readDownloadAttachment(params) {
  const res = await api.http({
    url: '/apiv3/attachment.download',
    method: 'get',
    params,
  });

  return res;
}