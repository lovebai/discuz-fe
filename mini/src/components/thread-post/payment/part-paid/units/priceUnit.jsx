import React from 'react';
import { inject, observer } from 'mobx-react';
import Unit from '@components/thread-post/payment/part-paid/units/unit';
import { Text } from '@tarojs/components';
import { Input } from '@discuzq/design';

const PriceUnit = inject('threadPost')(
  observer(({ ...props }) => {
    const { threadPost } = props;
    const { partPayInfo } = threadPost;
    let { payPrice } = partPayInfo;

    return (
      <Unit
        title={'设置付费价格'}
        rightActionRender={() => {
          return (
            <>
              <Input
                mode={'number'}
                htmlType={'number'}
                trim={true}
                value={payPrice}
                onChange={(e) => {
                  partPayInfo.payPrice = e.target.value;
                }}
              />
              <Text>&nbsp;元</Text>
            </>
          );
        }}
      />
    );
  }),
);

export default PriceUnit;
