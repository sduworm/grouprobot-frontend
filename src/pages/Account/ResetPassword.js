import React from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Button, Row, Col } from 'antd';
import { connect } from 'dva';
import { MetaAdditionalComponents } from '@/meta-component';

const { ClearInput } = MetaAdditionalComponents;
const FormItem = Form.Item;

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

@connect()
@Form.create()
class ResetPassword extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form
      .validateFields({ force: true }, (err, values) => {
        if (!err) {
          dispatch({
            type: 'resetPassword/submit',
            payload: {
              ...values,
            },
          });
        }
      })
      .catch(err => {
        throw err;
      });
  };

  checkConfirmPassword = e => {
    const { form } = this.props;
    const confirmValue = form.getFieldValue('secondNewUserPass');
    let errors = [];
    if (confirmValue && confirmValue !== e.target.value) {
      errors = [new Error(formatMessage({ id: 'app.resetPassword.confirm-password.check' }))];
    }
    if (confirmValue) {
      form.setFields({
        secondNewUserPass: {
          value: confirmValue,
          errors,
        },
      });
    }
  };

  handleCheck = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('firstNewUserPass')) {
      callback(formatMessage({ id: 'app.resetPassword.confirm-password.check' }));
    } else {
      callback();
    }
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSubmit} className="oneColForm">
        <FormItem
          {...formItemLayout}
          label={formatMessage({ id: 'app.resetPassword.oldPassword.label' })}
        >
          {getFieldDecorator('oldUserPass', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'app.resetPassword.oldPassword.required' }),
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w]{6,12}$/,
                message: formatMessage({ id: 'app.resetPassword.password.check' }),
              },
            ],
          })(
            <ClearInput
              type="password"
              placeholder={formatMessage({ id: 'app.resetPassword.oldPassword.placeholder' })}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage({ id: 'app.resetPassword.firstNewUserPass.label' })}
        >
          {getFieldDecorator('firstNewUserPass', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'app.resetPassword.firstNewUserPass.required' }),
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w]{6,12}$/,
                message: formatMessage({ id: 'app.resetPassword.password.check' }),
              },
            ],
          })(
            <ClearInput
              onChange={this.checkConfirmPassword}
              type="password"
              placeholder={formatMessage({ id: 'app.resetPassword.firstNewUserPass.placeholder' })}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage({ id: 'app.resetPassword.secondNewUserPass.label' })}
        >
          {getFieldDecorator('secondNewUserPass', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'app.resetPassword.secondNewUserPass.required' }),
              },
              {
                validator: this.handleCheck,
              },
            ],
          })(
            <ClearInput
              type="password"
              placeholder={formatMessage({ id: 'app.resetPassword.secondNewUserPass.placeholder' })}
            />
          )}
        </FormItem>
        <FormItem>
          <Row style={{ width: 720 }}>
            <Col span={8} />
            <Col span={16}>
              <Button loading={submitting} type="primary" htmlType="submit" style={{ width: 150 }}>
                <FormattedMessage id="form.save" />
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    );
  }
}

export default ResetPassword;
