/**
 * 悬赏表单 - 日历选择
 */
import React, { memo, useState, useEffect } from 'react'; // 性能优化的
import { Button, Input, Toast } from '@discuzq/design'; // 原来就有的封装
import DatePickers from '@components/thread/date-picker'; // 原来就有的封装
import styles from './index.module.scss'; // 私有样式
import PropTypes from 'prop-types'; // 类型拦截

const ForTheForm = ({ confirm, cancel, data }) => {
  const [value, setValue] = useState('');// 悬赏金额
  const [times, setTimes] = useState('悬赏时间');// 悬赏的到期时间
  const [show, setShow] = useState(false);// 时间选择器是否显示
  // 时间选择器是否显示
  useEffect(() => {
    if (data !== undefined && Object.keys(data).length > 0) {
      setValue(data.value);
      setTimes(data.times);
    }
  }, []);
  // 点击确定的时候返回参数
  const redbagconfirm = () => {
    if (value <= 0 && value > 10000) {
      Toast.warning({ content: '金额数不合理,0<money<10000' });
      return;
    }
    // console.log(times);
    const gapTime = new Date(times).getTime() - new Date().getTime();

    if (times === '悬赏时间' || gapTime < 24 * 3600 * 1000) {
      Toast.warning({ content: '悬赏时间要大于当前时间24小时' });
      return;
    }
    confirm({
      value,
      times,
    });
  };
  return (
    <div className={styles.rewards}>
      <div className={styles['line-box']}>
        <div> 悬赏金额 </div>
        <div>
          <Input
            mode="number"
            value={value}
            placeholder="金额"
            onChange={e => setValue(e.target.value)}
          />
          元
        </div>
      </div>
      <div className={styles['line-box']}>
        <div> 悬赏结束时间 </div>
        <div>
          <div
            onClick={() => {
              setShow(true);
            }}
          >
            {`${times}  >`}
          </div>
        </div>
      </div>
      <DatePickers
        onSelects={(e) => {
          setTimes(e);
          setShow(false);
        }}
        isOpen={show}
        onCancels={() => {
          setShow(false);
        }}
      />
      <div className={styles.btn}>
        <Button onClick={() => cancel()}>取消</Button>
        <Button type="primary" onClick={redbagconfirm}>确定</Button>
      </div>
    </div>

  );
};

ForTheForm.propTypes = {
  cancel: PropTypes.func.isRequired, // 限定cancle的类型为functon,且是必传的
  confirm: PropTypes.func.isRequired, // 限定confirm的类型为functon,且是必传的
};

// 设置props默认类型
ForTheForm.defaultProps = {
  confirm: () => {},
  // data: { value: 3, times: '2021-04-1917:54' }, //重现传参参照
  cancel: () => {}, // 点击取消调用的事件
};

export default memo(ForTheForm);