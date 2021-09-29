import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Button, Dialog, Tabs } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import time from '@discuzq/sdk/dist/time';
import { payGroupLevelStyle as levelStyle } from '@common/constants/const';

const MemberShipCard = ({ site, user, onRenewalFeeClick, shipCardClassName }) => {
  const { siteMode } = site;
  const { userInfo, paid, isAdmini, isIndefiniteDuration, expiredDays, expiredAt, getPayGroups } = user;
  const { group: { level, remainDays, expirationTime, groupName, description, isTop, hasPayGroup } } = userInfo;
  const theme = levelStyle[level];
  const isPaySite = siteMode === 'pay';
  const tabList = [
    ['1', 'Tab1'],
    ['2', 'Tab2'],
    ['3', 'Tab3'],
  ];


  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    getPayGroups();
  }, []);


  const handlePayGroupRenewal = () => {
    setDialogVisible(true);
  };

  const handleRenewalFee = () => {
    typeof onRenewalFeeClick === 'function' && onRenewalFeeClick();
  };

  // 获取日期格式
  const getDateFormat = () => {
    if (time.isCurrentYear(expiredAt)) {
      return 'MM月DD日';
    } else {
      return 'YYYY年MM月DD日';
    }
  };

  const renderFeeDateContent = () => {
    // 付费用户组用户
    if (level > 0) {
      return (
        <>
          <span className={styles.feeDay} style={{color: theme.otherColor}}>{remainDays}</span>天&nbsp;•&nbsp;
          <span style={{color: theme.desAndDateColor}}>{time.formatDate(expirationTime, getDateFormat())}到期</span>
        </>
      );
    }

    // 付费站点用户
    if (isPaySite && paid) {
      if (expiredDays === 0) {
        return (
          <>
            <span className={styles.feeDay}>0</span>天
          </>
        );
      } else if (isIndefiniteDuration) {
        return <span className={styles.noTimeDate}>无限期</span>;
      } else {
        return (
          <>
            <span className={styles.feeDay}>{expiredDays}</span>天&nbsp;•&nbsp;
            {time.formatDate(expiredAt, getDateFormat())}到期
          </>
        );
      }
    }
  };

  const renderButton = () => {
    const leftBtnStyle = {
      backgroundColor: theme.otherColor,
      borderColor: theme.otherColor,
      color: theme.leftBtnTextColor,
    };
    const rightBtnStyle = {
      marginLeft: '8px',
      backgroundColor: theme.rightBtnBgColor,
      borderColor: theme.otherColor,
      color: theme.otherColor,
    };

    // 付费用户组用户
    if (level > 0) {
      return (
        <>
          <Button onClick={() => {handlePayGroupRenewal(level)}} type="primary" className={styles.btn} style={leftBtnStyle}>续费</Button>
          {!isTop && <Button onClick={() => {handlePayGroupRenewal(level + 1)}} type="primary" className={styles.btn} style={rightBtnStyle}>升级</Button>}
        </>
      );
    }

    // 付费站点用户
    if (isPaySite && paid && !isIndefiniteDuration) {
      return (
        <Button onClick={handleRenewalFee} type="primary" className={styles.btn}>续费</Button>
      );
    }

    // 普通用户且后台设置了付费用户组
    if (hasPayGroup) {
      return <Button onClick={() => {handlePayGroupRenewal(level + 1)}} type="primary" className={styles.btn}>升级</Button>;
    }

  };

  const renderCard = (noBtn = false) => {
    return (
      <div className={`${styles.memberShipCardWrapper} ${shipCardClassName}`} style={{backgroundImage: `url(${theme.bgImg})`}}>
        <div className={styles.MemberShipCardContent}>
          <div className={styles.roleType} style={{color: theme.groupNameColor}}>{groupName}</div>
          <div className={styles.tagline} style={{color: theme.desAndDateColor}}>{level > 0 ? description : '访问海量站点内容'}</div>
          <div className={styles.RenewalFee} style={{visibility: noBtn ? 'hidden' : 'visible'}}>
            {renderButton()}
            <span className={styles.feeTimer}>{renderFeeDateContent()}</span>
          </div>
        </div>
      </div>
    );
  };



  return (
    <>
      {renderCard()}
      <Dialog
        title="提示"
        visible={dialogVisible}
        maskClosable={true}
        style={{
          padding: 0
        }}
        onClose={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        onConfirm={() => setVisible(false)}
      >
        <Tabs defaultActiveId={'1'}>
          {tabList.map(([id, label]) => (
            <Tabs.TabPanel key={id} id={id} label={label}>
              <div>
                {renderCard(true)}
              </div>
            </Tabs.TabPanel>
          ))}
        </Tabs>
      </Dialog>
    </>
  );



};

export default inject('site', 'user')(observer(MemberShipCard));