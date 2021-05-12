import React from 'react';
import { View } from '@tarojs/components';
import { Icon } from '@discuzq/design';
import { diffDate } from '@common/utils/diff-date';

import styles from './index.module.scss';

const DialogBox = (props) => {
  const { shownMessages, dialogBoxRef } = props;

  return (
    <View className={styles.dialogBox} ref={dialogBoxRef}>
      {shownMessages.map(({ timestamp, displayTimePanel, text, ownedBy }, idx) => (
        <React.Fragment key={idx}>
          {displayTimePanel && <View className={styles.msgTime}>{diffDate(timestamp)}</View>}
          <View className={(ownedBy === 'myself' ? `${styles.myself}` : `${styles.itself}`) + ` ${styles.persona}`}>
            <View className={styles.profileIcon}>
              <Icon name="UserOutlined" size={20} color={'var(--color-primary)'} />
            </View>
            <View className={styles.msgContent}>{text}</View>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

export default DialogBox;
