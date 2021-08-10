
import locals from '@common/utils/local-bridge';
import constants from '@common/constants';
import Taro from '@tarojs/taro';

const attachmentApiUpload = (options) => {
  return new Promise(async (resolve, reject) => {
    const { file, type, host } = options;
    const tempFilePath = file.path || file.tempFilePath;
    const name = file.name || '图片';
    const token = locals.get(constants.ACCESS_TOKEN_NAME);
    const formData = {
      type,
      name,
    };

    Taro.uploadFile({
      url: `${host}/apiv3/attachments`,
      filePath: tempFilePath,
      name: '图片',
      header: {
        'authorization': `Bearer ${token}`
      },
      formData: formData,
      success(res) {
        if (res.statusCode === 200) {
          const ret = JSON.parse(res.data);
          resolve(ret);
        } else {
          console.log(res);
          const msg = res.statusCode === 413 ? '上传大小超过了服务器限制' : res.msg;
          Toast.error({ content: `上传失败：${msg}` });
        }
      },
      fail(res) {
        console.log(res);
      }
    });
  });
};

export default attachmentApiUpload;