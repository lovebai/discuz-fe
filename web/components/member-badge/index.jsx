import React from 'react';
import styles from './index.module.scss';
import classnames from 'classnames';

export default class MemberBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { groupLevel,  groupName} = this.props;
    return (
      <div className={styles.memberBadgeBox}>
        <img className={styles.memberBadgeIcon} src={`/dzq-img/member-badge_${groupLevel}.png`} />
        <div className={classnames(styles.memberBadgeName, styles['memberBadgeName_' + groupLevel])}>
          {groupName}
        </div>
      </div>
    );
  }
}
