import React from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { noop } from '@components/thread/utils';

/**
 * 新发布内容
 * @prop {boolean} visible 是否显示新发布内容
 * @prop {number} conNum 有几条新发布内容
 * @prop {function} goRefresh 刷新点击事件
 */
const NewContent = (props) => {
  const {
    visible = false,
    conNum = 0,
    goRefresh = noop
  } = props;
  return (
    <div>
      {
        visible && (
          <div className={styles.container} onClick={goRefresh}>
            <span className={styles.text}>有{conNum}条新发布的内容</span>
            <div className={styles.refreshBtn}>
              点击刷新
            </div>
            <Icon className={styles.refreshIcon} name="LoadingOutlined" size={14} color='#90b2f8'/>
          </div>
        )
      }
    </div>
  );
};

export default React.memo(NewContent);
