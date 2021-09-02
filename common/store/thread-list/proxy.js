export default (data, listHandlers) => {
  const {
    updateAssignThreadInfoInLists, // 更新
    deleteAssignThreadInLists, // 删除
    addThreadInTargetList, // 新增
    setTargetListDataByList, // 批量更新
    setAttribute, // 属性
    namespace,
  } = listHandlers;

  if (data) {
    return new Proxy(data, {
      get(oTarget, sKey) {
        const res = Reflect.get(oTarget, sKey);
        // 代理pageData
        if (sKey === 'pageData' && Array.isArray(res)) {
          return new Proxy(res, {
            set: (oTarget, sKey, vValue) => {
              const cbType = oTarget[sKey] === undefined ? 'create' : 'modify';

              if (sKey === 'length') {
                Reflect.set(oTarget, sKey, vValue);
                return true;
              }
              // 新增
              if (cbType === 'create') {
                addThreadInTargetList({
                  namespace,
                  threadInfo: vValue,
                });
              }
              // 修改
              if (cbType === 'modify') {
                // 更新帖子信息
                updateAssignThreadInfoInLists({
                  threadId: vValue.threadId,
                  threadInfo: vValue,
                });
              }
              return true;
            },
            // 删除
            deleteProperty(oTarget, sKey) {
              if (sKey in oTarget) {
                deleteAssignThreadInLists({
                  threadId: oTarget[sKey].threadId,
                });
                return true;
              }
            },
          });
        }
        return res;
      },
      set(oTarget, sKey, vValue) {
        console.log('set', oTarget, sKey, vValue);
        if (sKey === 'pageData') {
          // 批量更新
          setTargetListDataByList({
            namespace,
            list: vValue,
          });
        } else {
          setAttribute({
            namespace,
            key: sKey,
            value: vValue,
          });
        }
        return true;
      },
    });
  }
};
