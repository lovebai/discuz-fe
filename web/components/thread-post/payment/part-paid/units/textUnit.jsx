import { inject, observer } from 'mobx-react';
import Unit from '@components/thread-post/payment/part-paid/units/unit';
import { Slider } from '@discuzqfe/design';
import React from 'react';

const TextUnit = inject('threadPost')(
  observer(({ ...props }) => {
    const { threadPost = {} } = props;
    const { partPayInfo } = threadPost;

    return (
      <Unit title={'文字'} desc={'免费查看字数'} withoutDivider>
        <Slider
          value={partPayInfo.textFreeValue}
          onChange={(value) => {
            partPayInfo.textFreeValue = value;
          }}
          formatter={(value) => `${value} %`}
        />
      </Unit>
    );
  }),
);

export default TextUnit;
