import { observable, computed } from 'mobx';
import listProxy from '../thread-list/proxy';
import ThreadListStore from  '../thread-list/list';

class TopicStore {
  constructor() {
    this.threadList = new ThreadListStore();
  }

  @observable topics = null
  @observable topicDetail = null

  @observable namespace = 'topic'
  @computed get topicThreads() {
    let newData = {};
    const homeData = this.threadList.lists?.[this.namespace];
    const attrs = this.threadList.lists?.[this.namespace]?.attribs;
    if (homeData?.data) {
      const pageData = this.threadList.listAdapter(homeData);
      newData = {
        pageData,
        ...attrs,
      };
    }
    const updateAssignThreadInfoInLists = this.threadList.updateAssignThreadInfoInLists.bind(this.threadList);
    const deleteAssignThreadInLists = this.threadList.deleteAssignThreadInLists.bind(this.threadList);
    const addThreadInTargetList = this.threadList.addThreadInTargetList.bind(this.threadList);
    const setAttribute = this.threadList.setAttribute.bind(this.threadList);
    const setTargetListDataByList = this.threadList.setTargetListDataByList.bind(this.threadList);

    const listHandlers = {
      updateAssignThreadInfoInLists, // 更新
      deleteAssignThreadInLists, // 删除
      addThreadInTargetList, // 新增
      setTargetListDataByList, // 批量更新
      setAttribute, // 更新属性
      namespace: this.namespace,
    };

    return listProxy(newData, listHandlers);
  }
  set topicThreads(data) {
    if (!data) {
      this.threadList.clearList({ namespace: this.namespace });
      return;
    }
    this.threadList.setList({
      namespace: this.namespace,
      data: { data },
      page: data.currentPage,
    });
  }
}

export default TopicStore;
