import React from 'react';
import { inject, observer } from 'mobx-react';
import Unit from '@components/thread-post/payment/part-paid/units/unit';
import { Input } from '@discuzq/design';
import styles from '../../index.module.scss';

const PriceUnit = inject('threadPost')(observer(({ ...props }) => {
  const { threadPost } = props;
  const { partPayInfo } = threadPost;
  const { payPrice } = partPayInfo;

  return (
      <Unit
        className={styles['paid-unit--price']}
        title={'设置付费价格'}
        rightActionRender={() => (
            <>
              <Input
                mode={'number'}
                htmlType={'number'}
                placeholder={'金额'}
                trim={true}
                value={payPrice}
                onChange={(e) => {
                  partPayInfo.payPrice = e.target.value;
                }}
              />
              <span>&nbsp;元</span>
            </>
        )}
      />
  );
}));

export default PriceUnit;
