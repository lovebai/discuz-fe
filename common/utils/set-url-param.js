export default function setUrlParam(url = '', params = {}) {
  const isCarryParam = url.includes('?');
  let newUrl = url;
  Object.keys(params).forEach((v, i) => {
    if (!params[v]) {
      return;
    }
    newUrl += `${!isCarryParam && i === 0 ? '?' : '&'}${v}=${params[v]}`;
  });
  return newUrl;
}
