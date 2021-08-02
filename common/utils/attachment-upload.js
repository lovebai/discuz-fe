import { createAttachment } from '@common/server';
import { fixImageOrientation } from '@common/utils/exif';


// type: 1是图片，2是文件


// 单个文件上传
const attachmentUploadOne = async (file, type = 1) => {

  // 判断是否已经开启cos



  // 使用cos上传
  const Bucket = 'discuz-service-test-1258344699';
  const Region = 'ap-guangzhou';

  const COS = (await import('cos-js-sdk-v5')).default;
  var cos = new COS({
    SecretId: 'AKIDCJAnwjKjthEk6HBm6fwzhCLFRRBlsBxG',
    SecretKey: 'DF1SjllSwlna8i9D6jAGFPPzT6TXHnac',
  });
  const key = `${new Date().getTime()}${file.name}`
  cos.putObject({
    Bucket: Bucket,
    Region: Region,
    Key: key,
    StorageClass: 'STANDARD',
    Body: file,
    onProgress: function(progressData) {
        console.log(JSON.stringify(progressData));
    }
  }, function(err, data) {
    console.log(err || data);

    if (err === null) {

      const url = cos.getObjectUrl({
        Bucket: Bucket,
        Region: Region,     /* 存储桶所在地域，必须字段 */
        Key: key,
        Sign: false
      });


      console.log(data, url);
      debugger;
    }
  });
























  // const cos = new COS({
  //   getAuthorization: (callback) => {
  //     // 异步获取临时密钥
  //     var url = '/coskey';
  //     var xhr = new XMLHttpRequest();
  //     xhr.open('POST', url, true);
  //     xhr.setRequestHeader("Content-Type", "application/json");
  //     const data = JSON.stringify({type: 1});
  //     xhr.send(data);
  //     xhr.onreadystatechange = () => {
  //       if (xhr.readyState === 4 && xhr.status === 200) {
  //         const data = JSON.parse(xhr.responseText);
  //         var credentials = data && data.credentials;
  //         if (!data || !credentials) return console.error('credentials invalid');
  //         callback({
  //           TmpSecretId: credentials.tmpSecretId,
  //           TmpSecretKey: credentials.tmpSecretKey,
  //           SecurityToken: credentials.sessionToken,
  //           // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
  //           StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
  //           ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
  //         });
  //       }
  //     };
  //   }
  // });
  // cos.options.getAuthorization(res => {
  //   console.log(res);
  // });



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
