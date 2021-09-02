export const updateMyThreadAvatar = ({
  avatarUrl,
  threadList,
}) => {
  threadList.registerList({ namespace: 'my' });

  const { my } = threadList.lists;

  Object.values(my.data).forEach((pageData) => {
    pageData.forEach((threadItem) => {
      if (!threadItem.user) {
        threadItem.user = {};
      }
      threadItem.user.avatar = avatarUrl;
    });
  });

  threadList.forceUpdateList();
};
