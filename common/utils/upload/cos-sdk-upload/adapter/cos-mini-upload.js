import { getCosTmpKey, updateAttachment } from '@common/server';
import time from '@discuzq/sdk/dist/time';
import sha1 from 'js-sha1';
var COS = require('cos-wx-sdk-v5');

export default (options) => {
  return new Promise(async (resolve, reject) => {
    const {
      file,
      type,
      qcloudCos,
      qcloudCosBucketName: Bucket,
      qcloudCosBucketArea: Region,
      qcloudCosSignUrl: isOpenSign,
    } = options;

    if (!qcloudCos || typeof file === 'string') {
      reject('error');
      return;
    }

    // 初始化cos实例
    const cos = new COS({
      getAuthorization: async (_options, callback) => {
        const res = await getCosTmpKey({
          type,
          fileSize,
          fileName: attachmentId,
        });
        const { code, data } = res;
        if (code === 0) {
          const credentials = data && data.credentials;
          callback({
            TmpSecretId: credentials.tmpSecretId,
            TmpSecretKey: credentials.tmpSecretKey,
            SecurityToken: credentials.sessionToken,
            StartTime: data.startTime,
            ExpiredTime: data.expiredTime,
          });
        } else {
          // todo: 处理异常情况，获取临时密钥失败
          reject('error');
        }
      }
    });

    const filePath = res.tempFiles[0].path;
    const filename = filePath.substr(filePath.lastIndexOf('/') + 1);
    const fileSize = file.size;
    const path = `public/attachments/${time.formatDate(new Date(), 'YYYY/MM/DD')}/`;
    const attachmentId = sha1(new Date().getTime() + fileName) + fileName;
    const key = path + attachmentId;
    cos.postObject({
      Bucket,
      Region,
      Key: key,
      FilePath: filePath,
      onProgress: function (info) {
          console.log(JSON.stringify(info));
      }
    }, function (err, data) {
      if (err === null) {
        cos.getObjectUrl({
          Bucket: Bucket,
          Region: Region,
          Key: key,
          Sign: isOpenSign,
        }, async (err, data) => {
          if (err === null) {
            const { Url: cosUrl } = data;
            const res = await updateAttachment({
              type,
              cosUrl,
              fileName,
            });
            resolve(res);
          } else if (err) {
            // todo: 异常情况处理，上传失败
            reject('error');
          }
        });
      } else if (err) {
        // todo: 异常情况处理，上传失败
        reject('error');
      }
    });

  });
};
