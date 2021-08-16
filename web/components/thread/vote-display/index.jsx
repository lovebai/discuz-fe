import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import { Checkbox, Button, Icon, Radio, Progress, Toast } from '@discuzq/design';
import CountDown from '@common/utils/count-down';
import { debounce } from '@common/utils/throttle-debounce';

const CHOICE_TYPE = {
  mutiple: 2, // 多选
  single: 1, // 单选
};
const VoteDisplay = (props = {}) => {
  const [isFold, setIsFold] = useState(false);
  const { voteData, threadId } = props;
  const {
    choiceType,
    voteTitle = '',
    subitems = [],
    voteUsers,
    isExpired,
    isVoted,
    expiredAt = '',
    voteId,
  } = voteData;
  if (!voteTitle) return null;
  const isVotedEnd = isExpired || isVoted; // 投票是否已结束
  const isMutiple = choiceType === CHOICE_TYPE.mutiple;
  const typeText = isMutiple ? '多选' : '单选';
  const CheckboxRadio = isMutiple ? Checkbox : Radio;
  const votedItem = subitems.filter(item => item.isVoted).map(item => item.id);
  const defaultValue = isMutiple ? votedItem : (votedItem[0] || '');

  let countDownIns = null;
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [value, setValue] = useState([]);
  useEffect(() => {
    if (!countDownIns) countDownIns = new CountDown();
    return () => {
      countDownIns.stop();
    };
  }, []);

  useEffect(() => {
    if (countDownIns) {
      const time = expiredAt.replace(/-/g, '/');
      countDownIns.start(time, (res) => {
        const { days, hours, minutes } = res;
        setDay(days);
        setHour(hours);
        setMinute(minutes);
      });
    }
  }, [expiredAt]);

  const handleVote = debounce(async () => {
    if (value.length <= 0) {
      Toast.info({ content: '请先选择投票选项' });
      return;
    }
    const params = {
      threadId,
      vote: {
        id: voteId,
        subitemIds: value,
      },
    };
    const { thread } = props;
    const result = thread.createVote(params);
    const { success, data, msg } = result;
    if (!success) Toast.info({ content: msg });
    else {
      console.log(data);
    }
  }, 1000);

  const UnfoldOrExpand = ({ text }) => (
    <Button full type="primary"
      className={!isFold ? styles.foldbtn : styles.expandbtn}
      onClick={() => setIsFold(!isFold)}
    >
      <span className={styles['fold-expand']}>{!isFold ? '展开' : '收起'}{text}</span>
      <Icon name="RightOutlined" size="10"></Icon>
    </Button>
  );
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles['header-right']}>
            {voteTitle}
            { isVotedEnd && <span className={styles['header-right__text']}>（{typeText}）</span>}
          </div>
          {!isVotedEnd && (
            <div className={styles['header-left']}>
              {voteUsers}人参与
            </div>
          )}
        </div>
        {!isVotedEnd
          && (
            <CheckboxRadio.Group
              defaultValue={defaultValue}
              className={styles.content}
              onChange={(val) => {
                if (isMutiple) setValue(val);
                else setValue([val]);
              }}
            >
              {subitems.map((item, index) => {
                if ((!isFold && index < 5) || isFold) {
                  return <CheckboxRadio key={index} name={item.id}>{item.content}</CheckboxRadio>;
                }
                return null;
              })}
              {subitems?.length > 5 && <UnfoldOrExpand text="投票" />}
            </CheckboxRadio.Group>
          )}
        {isVotedEnd && (
          <div className={styles.content}>
            {subitems.map((item, index) => {
              if ((!isFold && index < 5) || isFold) {
                const voteCount = parseInt(item.voteRate, 10) > 100 ? 100 : parseInt(item.voteRate, 10);
                return (
                  <div className={styles['result-item']} key={index}>
                    <div className={styles['result-item__header']}>
                      <div className={styles['item-header-left']}>
                        {item.content}
                        {item.isVoted && <span className={styles.primaryText}>（已选）</span>}
                      </div>
                      <div className={styles['item-header-right']}>
                        {item.voteCount || 0}票 {item.voteRate}
                      </div>
                    </div>
                    <Progress percent={voteCount}></Progress>
                  </div>
                );
              }
              return null;
            })}
            {/* {subitems?.length > 5 && <UnfoldOrExpand />} */}
            <Button full disabled type="primary" className={styles.disabledbtn}>
              投票已结束（{voteUsers}人参与投票）
            </Button>
          </div>
        )}
      </div>
      {!isVotedEnd && (
        <div className={styles.footer}>
          <div className={styles.left}>
            <div className={styles['left-type']}>{typeText}</div>
            <div className={styles['left-time']}>
              <span className={styles['time-primary']}>{ day }</span>天<span className={styles['time-primary']}>{hour}</span>小时<span className={styles['time-primary']}>{minute}</span>分
            </div>
          </div>
          <Button type="primary" className={styles.vote} onClick={handleVote}>投票</Button>
        </div>
      )}
    </>
  );
};

export default inject('thread', 'index')(observer(VoteDisplay));
