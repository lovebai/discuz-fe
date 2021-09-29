import PayBox from '@components/payBox';

export default ({ amount, groupId, title, userStore, siteStore }) => {
  return new Promise((resolve, reject) => {
    PayBox.createPayBox({
      data: {
        amount,
        groupId,
        title,
        type: 4,
      },
      isAnonymous: false, // 是否匿名
      success: async (orderInfo) => {
        await userStore.updateUserInfo(userStore.id);
        await siteStore.getSiteInfo();
        resolve(orderInfo);
      },
      failed: async (orderInfo) => {
        reject(orderInfo);
      },
    });
  }).catch((e) => {
    console.error(e);
  });
};
