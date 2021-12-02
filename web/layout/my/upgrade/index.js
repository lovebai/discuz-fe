import React, { useState, useEffect } from 'react';
import { Button, Tabs } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import { payGroupLevelStyle as levelStyle } from '@common/constants/const';
import groupPay from '@common/pay-bussiness/group-pay';
import classnames from 'classnames';
import Router from '@discuzq/sdk/dist/router';
import Header from '@components/header';
import styles from './index.module.scss';


const Index = ({ site, user, shipCardClassName, setTitle = () => { } }) => {
  const [defaultActive, setDefaultActive] = useState(1);
  const { userInfo = {}, payGroups } = user || {};
  const { group = {} } = userInfo;

  useEffect(async () => {
    const _payGroups = await user.queryPayGroups();

    console.log(`object`, group, _payGroups)
    const { query } = Router.router.router;
    let level = 1;

    if (query.level) {
      // 1. 徽章进入
      level = query.level;
    } else if (group.level > 0 && group.level === _payGroups.length) {
      // 2. 已是最高等级付费组，重定向个人中心续费
      Router.redirect({ url: '/my' });
    } else {
      // 3. 激活更高一级的付费用户组
      level = group.level + 1;
    }

    setDefaultActive(Number(level));
  }, []);

  useEffect(() => {
    const title = payGroups[defaultActive - 1]?.name;
    setTitle(title);
  }, [payGroups.length, defaultActive]);

  useEffect(() => {
    // 站点付费模式且没有付费用户组时，重定个人中心
    if ( (site.siteMode === 'pay' && !group.hasPayGroup)) {
      Router.redirect({ url: '/my' });
    }
  }, [payGroups.length, site.siteMode, group.hasPayGroup])
  
  // 执行付费
  const doPay = async ({ amount, groupId, title }) => {
    try {
      await groupPay({ amount, groupId, title, user, site });
      window.history.length <= 1 ? Router.redirect({ url: '/my' }) : Router.back();

    } catch (error) {
      console.log(error);
    }
  };

  const renderCard = (data) => {
    const { groupName, level, description } = data;
    const theme = levelStyle[level] || {};
    return (
      <div className={`${styles.memberShipCardWrapper} ${shipCardClassName}`} style={{ backgroundImage: `url(${theme.bgImg})` }}>
        <div className={styles.MemberShipCardContent}>
          <div className={styles.roleType} style={{ color: theme.groupNameColor }}>{groupName}</div>
          <div className={styles.tagline} style={{ color: theme.desAndDateColor }}>{level > 0 ? description : '访问海量站点内容'}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      <Tabs activeId={defaultActive} onActive={activeId => setDefaultActive(activeId)}>
        {payGroups.map(({ name: groupName, level, description, fee, notice, amount, groupId, days }) => {
          const data = {
            groupName,
            level,
            description,
          };
          return (
            <Tabs.TabPanel key={level} id={level} label={groupName}>
              <div>
                <div className={classnames(styles.tabPanel, {
                  [styles.mobileTabPanel]: true
                })}>

                  {renderCard(data)}

                  <div className={classnames(styles.operation, {
                    [styles.mobileOperation]: true
                  })}>
                    <div className={styles.top}>
                      <div className={styles.mobileUpgradePrice}>
                        <span className={styles.symbol}>￥</span>
                        <span className={styles.price}>{fee}</span>
                      </div>
                      <div className={styles.time}>有效期：{`${days}天`}</div>
                    </div>

                    {level > group.level && <Button className={styles.upgradeBtn} style={{ margin: 0 }} onClick={() => doPay({ amount, title: groupName, groupId })}>立即升级</Button>}
                  </div>
                
                </div>

                <div className={styles.tips} style={{ padding: '16px' }}>
                  <div className={styles.title}>购买须知</div>
                  <div className={styles.text}>{notice}</div>
                </div>
              </div>
            </Tabs.TabPanel>
          );
        })}
      </Tabs>
    </div>
  );

};

export default inject('site', 'user')(observer(Index));
