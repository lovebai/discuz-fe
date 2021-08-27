export default (data, listHandlers) => {
  const {
    updateAssignThreadInfoInLists, // 更新
    deleteAssignThreadInLists, // 删除
    addThreadInTargetList, // 新增
    setTargetListDataByList, // 批量更新
    setAttribute, // 属性
    namespace,
  } = listHandlers;

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
              console.log('新增');
              addThreadInTargetList({
                namespace,
                threadInfo: vValue,
              });
            }
            // 修改
            if (cbType === 'modify') {
              console.log('修改');
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
            console.log('删除');
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
        console.log('批量更新', vValue);
        // 批量更新
        setTargetListDataByList({
          namespace,
          list: vValue,
        });
      } else {
        console.log('更新属性', sKey, vValue);
        setAttribute({
          namespace,
          key: sKey,
          value: vValue,
        });
      }
      return true;
    },
  });
};
