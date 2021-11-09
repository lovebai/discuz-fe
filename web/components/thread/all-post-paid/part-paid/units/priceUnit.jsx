import { inject, observer } from 'mobx-react';
import Unit from '@components/thread/all-post-paid/part-paid/units/unit';
import { Input } from '@discuzq/design';
import React, { useState, useEffect } from 'react';

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
              <span>&nbsp;元</span>
            </>
          );
        }}
      />
    );
  }),
);

export default PriceUnit;
