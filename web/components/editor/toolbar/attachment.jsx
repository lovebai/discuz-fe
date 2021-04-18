/**
 * 附件操作栏比如：图片上传、视频上传、语音上传等
 */
import React from 'react';
import ToolsCategory from '../tools/category';
import { Icon } from '@discuzq/design';
import styles from './index.module.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { attachIcon } from '../const';
// import Upload from '@components/upload';

class AttachmentToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
      currentAction: '',
    };
  }

  handleCategoryClick = () => {
    this.props.onCategoryClick();
  };

  handleAttachClick(item) {
    this.setState({ currentAction: item.name });
    this.props.onAttachClick(item);
  }

  handleToggle = () => {
    this.setState({ showAll: !this.state.showAll });
  }

  render() {
    const { showAll, currentAction } = this.state;
    return (
      <div className={styles['dvditor-attachment-toolbar']}>
        {!showAll && (
          <>
            <div className={styles['dvditor-attachment-toolbar__left']}>
              <ToolsCategory onClick={this.handleCategoryClick} />
            </div>
            <div className={styles['dvditor-attachment-toolbar__right']}>
              <Icon name="PictureOutlinedBig" size="20" onClick={this.handleToggle} />
            </div>
          </>
        )}
        {showAll && (
          <div className={styles['dvditor-attachment-toolbar__inner']}>
            <div className={styles['dvditor-attachment-toolbar__left']}>
              {attachIcon.map(item => <Icon key={item.name}
                  onClick={this.handleAttachClick.bind(this, item)}
                  className={styles['dvditor-attachment-toolbar__item']}
                  name={item.name}
                  color={item.name === currentAction && item.active}
                  size="20" />,
                // return (
                //   <Upload
                //     key={item.name}
                //     limit={item.limit}
                //     accept={item.accept}
                //     isCustomUploadIcon={true}
                //     onChange={}
                //   >
                //     <Icon
                //       onClick={this.handleAttachClick.bind(this, item)}
                //       className={styles['dvditor-attachment-toolbar__item']}
                //       name={item.name}
                //       color={item.name === currentAction && item.active}
                //       size="20" />
                //   </Upload>
                // );
              )}
            </div>
            <div className={classNames(styles['dvditor-attachment-toolbar__right'], styles.show)}>
              <Icon name="PhoneOutlined" size="20" onClick={this.handleToggle} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

AttachmentToolbar.propTypes = {
  onCategoryClick: PropTypes.func,
  onAttachClick: PropTypes.func,
};

export default AttachmentToolbar;
