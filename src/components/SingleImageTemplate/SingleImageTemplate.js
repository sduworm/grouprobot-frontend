/* eslint-disable no-nested-ternary */
/** Created by YangXiaozhe on 2018/6/22 */
import React from 'react';
import { Icon, message, Upload, Modal } from 'antd';
import { FILE_OPERATION_URLS } from '../../config';
import style from './SingleImageTemplate.less';

const Config = FILE_OPERATION_URLS;
const imgTypes = new Set(['image/png', 'image/jpeg']);
const DEFAULT_BIG_IMG_FILE_SIZE = 5;

class SingleImageTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      previewImage: '',
      previewVisible: false,
      key: '',
    };
  }

  onRemove = () => {
    const { id, form } = this.props;
    form.setFieldsValue({ [id]: null });
  };

  handleChange = info => {
    const { id, form } = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    this.setState({ loading: false });
    if (info.file.status === 'done' || info.file.status === 'error') {
      if (!info.file.response || !info.file.response.isSuccess) {
        message.error('上传错误');
        this.setState({ key: info.file.uid });
        return;
      }
      form.setFieldsValue({ [id]: info.file.response.data.id });
      return;
    }
    this.setState({ key: info.file.uid });
  };

  beforeUpload = file => {
    const { maxLength } = this.props;
    const isImage = imgTypes.has(file.type);
    if (!isImage) {
      message.error('请选择图片格式的文件');
    }
    const isTooBig = file.size / 1024 / 1024 > (maxLength || DEFAULT_BIG_IMG_FILE_SIZE);
    if (isTooBig) {
      message.error(`文件请勿超过${maxLength || DEFAULT_BIG_IMG_FILE_SIZE}M`);
    }
    return isImage && !isTooBig;
  };

  handlePreview = () => {
    const { value } = this.props;
    this.setState({
      previewImage: `${Config.CONF_FILE_DOWNLOAD_API}?id=${value}`,
      previewVisible: true,
    });
  };

  handleOk = () => this.setState({ previewVisible: false });

  render() {
    const { stateBehaviour, value, maxLength, uploadText } = this.props;
    const { loading, previewVisible, previewImage, key } = this.state;
    const defaultFileList = value
      ? [
          {
            uid: '-1',
            name: 'uploadImage',
            status: 'done',
            url: `${Config.CONF_FILE_DOWNLOAD_API}?id=${value}`,
          },
        ]
      : [];
    const props = {
      key,
      name: 'file',
      listType: 'picture-card',
      showUploadList: true,
      defaultFileList,
      action: Config.CONF_FILE_UPLOAD_API,
      beforeUpload: this.beforeUpload,
      headers: {
        authorization: 'authorization-text',
      },
      onChange: this.handleChange,
      onPreview: this.handlePreview,
      onRemove: this.onRemove,
    };
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : stateBehaviour === 'READONLY' ? 'picture' : 'plus'} />
        <div className="ant-upload-text">
          {stateBehaviour === 'READONLY' ? '暂无图片' : uploadText}
        </div>
      </div>
    );

    const hasFileInUploader = value || loading;
    return (
      <div>
        <Upload {...props}>{hasFileInUploader ? null : uploadButton}</Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleOk}
          width="auto"
          className={style.imgModal}
          centered
        >
          <div className={style.imgContainer}>
            <img alt="uploadImage" className={style.img} src={previewImage} />
          </div>
        </Modal>
        {!hasFileInUploader ? (
          <p style={{ color: '#999999' }}>
            图片需清晰仅支持jpg、png格式;大小不超过
            {maxLength || DEFAULT_BIG_IMG_FILE_SIZE}M
          </p>
        ) : null}
      </div>
    );
  }
}

export default SingleImageTemplate;
