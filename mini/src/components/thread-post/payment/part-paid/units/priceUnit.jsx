import React from 'react';
import { inject, observer } from 'mobx-react';
import Unit from '@components/thread-post/payment/part-paid/units/unit';
import { Text } from '@tarojs/components';
import { Input } from '@discuzq/design';

const PriceUnit = inject('threadPost')(
  observer(({ ...props }) => {
    const { threadPost } = props;
    const { partPayInfo } = threadPost;
    const { payPrice } = partPayInfo;

    return (
      <Unit
        title="设置付费价格"
        rightActionRender={() => (
          <>
            <Input
              mode="number"
              htmlType="number"
              placeholder="金额"
              trim
              value={payPrice}
              onChange={(e) => {
                partPayInfo.payPrice = e.target.value;
              }}
            />
            <Text>&nbsp;元</Text>
          </>
        )}
      />
    );
  }),
);

export default PriceUnit;
