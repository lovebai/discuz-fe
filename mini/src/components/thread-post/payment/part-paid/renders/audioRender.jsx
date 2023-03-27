import React from 'react';
import { Audio } from '@discuzqfe/design';
import { inject, observer } from 'mobx-react';

const AudioRender = inject('threadPost')(
  observer(({ ...props }) => {
    const { threadPost = {} } = props;
    const { postData = {} } = threadPost;
    const { audio = {} } = postData;

    return <Audio src={audio.mediaUrl} />;
  }),
);

export default AudioRender;
