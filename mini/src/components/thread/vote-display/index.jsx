import React, { useState } from 'react';
import Checkbox from '@discuzq/design/dist/components/checkbox/index';
import Button from '@discuzq/design/dist/components/button/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import Radio from '@discuzq/design/dist/components/radio/index';
import Progress from '@discuzq/design/dist/components/progress/index';
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss';

const CHOICE_TYPE = {
  mutiple: 2, // 多选
  single: 1, // 单选
};
const VoteDisplay = (props = {}) => {
  const [isFold, setIsFold] = useState(false);
  const { voteData } = props;
  const { choiceType, voteTitle = '', subitems = [], voteUsers, isExpired, isVoted } = voteData;
  if (!voteTitle) return null;
  const isVotedEnd = isExpired || isVoted; // 投票是否已结束
  const isMutiple = choiceType === CHOICE_TYPE.mutiple;
  const typeText = isMutiple ? '多选' : '单选';
  const CheckboxRadio = isMutiple ? Checkbox : Radio;
  const votedItem = subitems.filter(item => item.isVoted).map(item => item.id);
  const defaultValue = isMutiple ? votedItem : (votedItem[0] || '');

  const UnfoldOrExpand = ({ text }) => (
    <Button full type="primary"
      className={!isFold ? styles.foldbtn : styles.expandbtn}
      onClick={() => setIsFold(!isFold)}
    >
      <Text className={styles['fold-expand']}>{!isFold ? '展开' : '收起'}{text}</Text>
      <Icon name="RightOutlined" size="10"></Icon>
    </Button>
  );
  return (
    <>
      <View className={styles.container}>
        <View className={styles.header}>
          <View className={styles['header-right']}>
            {voteTitle}
            { isVotedEnd && <Text className={styles['header-right__text']}>（{typeText}）</Text>}
          </View>
          {!isVotedEnd && (
            <View className={styles['header-left']}>
              {voteUsers}人参与
            </View>
          )}
        </View>
        {!isVotedEnd
          && (
            <CheckboxRadio.Group defaultValue={defaultValue} className={styles.content} onChange={(val) => {
              console.log(val);
            }}>
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
          <View className={styles.content}>
            {subitems.map((item, index) => {
              if ((!isFold && index < 5) || isFold) {
                const voteCount = parseInt(item.voteRate, 10) > 100 ? 100 : parseInt(item.voteRate, 10);
                return (
                  <View className={styles['result-item']} key={index}>
                    <View className={styles['result-item__header']}>
                      <View className={styles['item-header-left']}>
                        {item.content}
                        {item.isVoted && <Text className={styles.primaryText}>（已选）</Text>}
                      </View>
                      <View className={styles['item-header-right']}>
                        {item.voteCount || 0}票 {item.voteRate}
                      </View>
                    </View>
                    <Progress percent={voteCount}></Progress>
                  </View>
                );
              }
              return null;
            })}
            {/* {subitems?.length > 5 && <UnfoldOrExpand />} */}
            <Button full disabled type="primary" className={styles.disabledbtn}>
              投票已结束（{voteUsers}人参与投票）
            </Button>
          </View>
        )}
      </View>
      {!isVotedEnd && (
        <View className={styles.footer}>
          <View className={styles.left}>
            <View className={styles['left-type']}>{typeText}</View>
            <View className={styles['left-time']}>
              <Text className={styles['time-primary']}>6</Text>天<Text className={styles['time-primary']}>23</Text>小时<Text className={styles['time-primary']}>34</Text>分
            </View>
          </View>
          <Button type="primary" className={styles.vote}>投票</Button>
        </View>
      )}
    </>
  );
};

export default VoteDisplay;
