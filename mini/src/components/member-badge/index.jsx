import React from 'react';
import styles from './index.module.scss';
import classnames from 'classnames';
import { IMG_SRC_HOST } from '@common/constants/site';
import { View, Text, Image } from '@tarojs/components';
import badgeImg from  '../../../../web/public/dzq-img/member-badge_2.png'



export default class MemberBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { groupLevel,  groupName} = this.props;
    // const badgeImg = `${IMG_SRC_HOST}/assets/member-badge_${groupLevel}.png`
    
    return (
      <View className={styles.memberBadgeBox}>
        <Image className={styles.memberBadgeIcon} src={badgeImg} />
        <View className={classnames(styles.memberBadgeName, styles['memberBadgeName_' + groupLevel])}>
          <Text>{groupName}</Text>
        </View>
      </View>
    );
  }
}
