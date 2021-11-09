import { inject, observer } from 'mobx-react';
import { useSelectAll } from '@components/thread/all-post-paid/part-paid/hooks';
import Unit from '@components/thread/all-post-paid/part-paid/units/unit';
import { Checkbox } from '@discuzq/design';
import React from 'react';
import AudioRender from '@components/thread/all-post-paid/part-paid/renders/audioRender';

const AudioUnit = inject('threadPost')(
  observer(({ ...props }) => {
    const { setSelectAllStatus, selectAllStatus } = useSelectAll();
    const { threadPost = {} } = props;
    const { postData = {} } = threadPost;
    const { audio = {} } = postData;

    if (!audio.mediaUrl) return null;

    return (
      <Unit
        title={'音频'}
        rightActionRender={() => {
          return <Checkbox checked={selectAllStatus} onChange={setSelectAllStatus} />;
        }}
      >
        <AudioRender />
      </Unit>
    );
  }),
);

export default AudioUnit;
