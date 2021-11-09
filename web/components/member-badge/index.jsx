import React from 'react';
import styles from './index.module.scss';
import classnames from 'classnames';

export default class MemberBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { groupLevel,  groupName, hasBg} = this.props;
    return (
      <div className={classnames(styles.memberBadgeBox, hasBg ? styles.bg: styles.default)}>
        <img className={styles.memberBadgeIcon} src={`/dzq-img/member-badge_${groupLevel}.png`} />
        <span className={classnames(styles.memberBadgeName, styles['memberBadgeName_' + groupLevel])}>
          {groupName}
        </span>
      </div>
    );
  }
}
