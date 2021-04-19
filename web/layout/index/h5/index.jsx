import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import { Button, Upload, Tabs, Popup } from '@discuzq/design';
import ThreadContent from '@components/thread';
import HomeHeader from '@components/thread/home-header';
import styles from './index.module.scss';
import List from './components/list';
import TopNew from './components/top-news';
import FilterModalPopup from './components/filter-modal-popup';
import filterData from './data';

@inject('site')
@inject('user')
@inject('index')
@observer
class IndexH5Page extends React.Component {
  render() {
    const visible = false;
    // const [visible, setVisible] = useState(false);

    // 点击更多弹出筛选
    const searchClick = () => {
    //   setVisible(true);
    
    }
    // 关闭筛选框
    const onClose = () => {
    //   setVisible(false);
    }
    const { index, user } = this.props;
    const { sticks, threads, categories } = index;
    const HeaderContent = () => {
        return (
          <>
            <HomeHeader/>
            <div className={styles.homeContent}>
              <Tabs
                scrollable={true}
                type={'primary'}
                tabBarExtraContent={
                  <div
                    style={{
                      width: 70,
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button onClick={searchClick}>更多</Button>
                    <FilterModalPopup visible={visible} onClose={onClose} filterData={filterData}></FilterModalPopup>
                  </div>
              }
              >
                  {categories.map((item, index) => (
                  <Tabs.TabPanel key={index} id={item.pid} label={item.name}>
                  </Tabs.TabPanel>
                  ))}
              </Tabs>
            </div>
            <div className={styles.homeContent}>
              <TopNew data={sticks}/>
            </div>
          </>
        )
    }
    const renderItem = (dataList, rowData) => {
      return (
        <div>
          { dataList.index === 0 && <HeaderContent />}
          <ThreadContent data={dataList.data[dataList.index]}/>
        </div>
      )
    }
    return (
      <div className={styles.homeBox}>
        { threads.pageData.length > 0 ?
        <List
          onRefresh={this.onRefresh}
          refreshing={false}
          data={threads.pageData}
          renderItem={renderItem}
        /> :
        <HeaderContent />
       }
      </div>
    );
  }
}
export default IndexH5Page;
