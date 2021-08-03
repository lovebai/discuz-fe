import { createAttachment, getCosTmpKey, updateAttachment } from '@common/server';
import { fixImageOrientation } from '@common/utils/exif';


// type: 1是图片，2是文件


// 单个文件上传
const attachmentUploadOne = async (file, type = 1) => {

  // 判断是否已经开启cos




  const Bucket = 'discuz-service-test-1258344699';
  const Region = 'ap-guangzhou';

  // 使用cos上传
  const COS = (await import('cos-js-sdk-v5')).default;

  const fileName = file.name;
  const key = `${new Date().getTime()}${fileName}`;
  let cosKeyData = {};

  const cos = new COS({
    getAuthorization: async (options, callback) => {
      const res = await getCosTmpKey({
        type,
        nameArr: [key]
      });
      const { code, data } = res;
      if (code === 0) {
        cosKeyData = data;
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
      }
    }
  });

  // const cos = new COS({
  //   SecretId: 'AKIDCJAnwjKjthEk6HBm6fwzhCLFRRBlsBxG',
  //   SecretKey: 'DF1SjllSwlna8i9D6jAGFPPzT6TXHnac',
  // });



  // 开始上传
  cos.putObject({
    Bucket: Bucket,
    Region: Region,
    Key: key,
    StorageClass: 'STANDARD',
    Body: file,
    onProgress: function(progressData) {
        console.log(JSON.stringify(progressData));
        // todo: 上传进度处理
    }
  }, function(err, data) {
    if (err === null) {
      const url = cos.getObjectUrl({
        Bucket: Bucket,
        Region: Region,
        Key: key,
        Sign: false
      });

      updateAttachment({
        type,
        filePath: url,
        fileName,
        fileSize: file.size,
        fileType: file.type,
        requestId: cosKeyData?.requestId,
      });
    } else if (err) {
      // todo: 异常情况处理，上传失败
    }
  });





























  // // 使用attachment接口上传
  // const formData = new FormData();
  // formData.append('type', type);

  // if (typeof file === 'string') {
  //   formData.append('fileUrl', file);
  // } else {
  //   const fileImg = await fixImageOrientation(file);
  //   formData.append('file', fileImg);
  // }

  // return new Promise(async resolve => {
  //   const res = await createAttachment(formData);
  //   resolve(res);
  // });
};

// 多个文件上传
const attachmentUploadMultiple = async (files, type = 1) => {
  const uploadPromises = [];
  for (let i = 0; i < files.length; i++) {
    uploadPromises.push(attachmentUploadOne(files[i], type));
  }
  return Promise.all(uploadPromises);
};

export { attachmentUploadOne, attachmentUploadMultiple };
