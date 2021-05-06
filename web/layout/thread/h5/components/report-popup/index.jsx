import React, { useState } from 'react';
import { Toast, Popup, Button, Textarea, Radio } from '@discuzq/design';
import styles from './index.module.scss';

const InputPop = (props) => {
  const { visible, onOkClick, onCancel, inputText, reportContent = [] } = props;


  const [value, setValue] = useState('');
  const [showTextarea, setShowTextarea] = useState(false);


  const onChoiceChange = (e) => {
    if (e === 'other') {
      setShowTextarea(true);
      setValue('');
    } else {
      setShowTextarea(false);
      setValue(reportContent[Number(e)]);
    }
  };

  const onSubmitClick = async () => {
    if (typeof onOkClick === 'function') {
      try {
        const success = await onOkClick(value);
        if (success) {
          setValue('');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Popup position="bottom" visible={visible} onClose={onCancel}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>举报</div>
          <div className={styles.reason}>请点击举报理由</div>
        </div>
        <div className={styles.body}>
          <Radio.Group defaultValue='5' onChange={e => onChoiceChange(e)}>
            {
              reportContent.map((val, index) => (
                <div className={styles.reportTitle} key={index}>
                  <div className={styles.content}>{val}</div>
                  <Radio name={`${index}`}></Radio>
                </div>
              ))
            }
            <div className={styles.reportTitle}>
              <div className={styles.content}>其他</div>
              <Radio name="other"></Radio>
            </div>
          </Radio.Group>
          {
            showTextarea
              ? <div className={styles.textarea}>
              <Textarea
                className={styles.input}
                rows={5}
                showLimit={true}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={inputText}>
              </Textarea>
            </div> : ''
          }
        </div>
        <div className={styles.button}>
          <Button full={true} onClick={onSubmitClick} className={styles.ok} type="primary" size="large">
            确定
        </Button>
          <Button full={true} onClick={onCancel} className={styles.cancel} type="primary" size="large">
            取消
        </Button>
        </div>
      </div>
    </Popup>
  );
};

export default InputPop;