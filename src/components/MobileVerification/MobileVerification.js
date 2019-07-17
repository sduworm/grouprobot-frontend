import React from 'react';
import { Button, Form, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './MobileVerification.less';
import { MetaAdditionalComponents } from '@/meta-component';

const { ClearInput } = MetaAdditionalComponents;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ project }) => ({
  project,
}))
/**
 * 入参:
 * form: 必传
 * mobileFieldName: 手机号formItem字段名称 可不填 默认值为mobile
 * codeFieldName: 验证码formItem字段名称 可不填 默认值为verificationCode
 * isMobileDisabled: 是否禁用手机号输入框
 * fieldDecoratorDates: 接受数组，长度为2, 每个对象为getFieldDecorator可加的参数 按照mobile,code的顺序获取 可以设置rule等
 * formItemDates: 接受数组，长度为2, 每个对象为FormItem可加的参数 按照mobile,code的顺序获取 可以设置label hasFeedBack等
 * 如有额外需求 如placeHolder等 请自行添加参数
 */
class MobileVerification extends React.Component {
  constructor(props) {
    super(props);
    const { isMobileDisabled = false } = props;
    this.state = {
      count: 0,
      prefix: '86',
      // 当mobileInput禁用时 获取验证码按钮应该为启用状态
      isMobileBtnDisable: isMobileDisabled === false,
    };
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, __) {
    const { form, mobileFieldName } = prevProps;
    const { isMobileBtnDisable } = prevState;
    const mobileError = form.getFieldError(mobileFieldName || 'mobile');
    if (mobileError && !isMobileBtnDisable) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isMobileBtnDisable: true,
      });
    }
    if (!mobileError && isMobileBtnDisable) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isMobileBtnDisable: false,
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  onGetCaptcha = () => {
    const { dispatch, form, mobileFieldName } = this.props;
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
    dispatch({
      type: 'project/sendSmsVerificationCode',
      payload: {
        mobile: form.getFieldValue(mobileFieldName || 'mobile'),
      },
    });
  };

  render() {
    const {
      form,
      mobileFieldName,
      codeFieldName,
      isMobileDisabled = false,
      fieldDecoratorDates,
      formItemDates,
      size,
    } = this.props;
    const mobileDecorator =
      Array.isArray(fieldDecoratorDates) && fieldDecoratorDates[0] ? fieldDecoratorDates[0] : {};
    const codeDecorator =
      Array.isArray(fieldDecoratorDates) && fieldDecoratorDates[1] ? fieldDecoratorDates[1] : {};
    const mobileFormItem = Array.isArray(formItemDates) && formItemDates[0] ? formItemDates[0] : {};
    const codeFormItem = Array.isArray(formItemDates) && formItemDates[0] ? formItemDates[1] : {};
    const { getFieldDecorator } = form;
    const { count, prefix, isMobileBtnDisable } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const prefixSelector = (
      <Select
        size="large"
        value={prefix}
        disabled={isMobileDisabled}
        onChange={this.changePrefix}
        style={{ width: 80 }}
      >
        <Option value="86">+86</Option>
      </Select>
    );

    return (
      <div className={styles.mobileVerification}>
        <FormItem
          {...(mobileFormItem.label && mobileFormItem.label !== '' ? formItemLayout : {})}
          {...mobileFormItem}
        >
          {getFieldDecorator(mobileFieldName || 'mobile', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'component.mobileVerification.mobile.required' }),
              },
              {
                pattern: /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,
                message: formatMessage({ id: 'component.mobileVerification.mobile.check' }),
              },
            ],
            ...mobileDecorator,
          })(
            <ClearInput
              addonBefore={prefixSelector}
              disabled={isMobileDisabled}
              size={size || 'large'}
              style={{ width: '100%' }}
              placeholder={formatMessage({ id: 'component.mobileVerification.mobile' })}
            />
          )}
        </FormItem>
        <FormItem
          {...(codeFormItem.label && codeFormItem.label !== '' ? formItemLayout : {})}
          {...codeFormItem}
        >
          {getFieldDecorator(codeFieldName || 'verificationCode', {
            rules: [
              {
                required: true,
                message: formatMessage({
                  id: 'component.mobileVerification.verificationCode.required',
                }),
              },
              {
                pattern: /^\d{6}$/,
                message: formatMessage({
                  id: 'component.mobileVerification.verificationCode.wrong-format',
                }),
              },
            ],
            ...codeDecorator,
          })(
            <ClearInput
              size={size || 'large'}
              placeholder={formatMessage({
                id: 'component.mobileVerification.verificationCode',
              })}
              className={styles.inputVerification}
              autoComplete="off"
            />
          )}
          <Button
            size={size || 'large'}
            disabled={count || isMobileBtnDisable}
            className={styles.getCaptcha}
            onClick={this.onGetCaptcha}
          >
            {count
              ? `${count} s`
              : formatMessage({ id: 'component.mobileVerification.verificationCode.get' })}
          </Button>
        </FormItem>
      </div>
    );
  }
}

export default MobileVerification;
