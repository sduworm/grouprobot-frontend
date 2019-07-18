import React from 'react';
import { connect } from 'dva';

const loginInfo = process.env.NODE_ENV === 'production' ? {
  appid: '----',
  redirectBaseUrl: '----'
} :
  {
    appid: 'dingoabqpoeoug7fyy46z8',
    redirectBaseUrl: 'http://localhost:9488/'
  };

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'] || loading.effects['user/loginFetchCurrent'],
}))
class LoginPage extends React.Component {
  componentDidMount() {
    const redirectUrl = encodeURIComponent(`${loginInfo.redirectBaseUrl}#/scan/dingtalk`);
    const goto = encodeURIComponent(
      `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${loginInfo.appid}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${redirectUrl}`,
      );
    // eslint-disable-next-line no-undef
    const ddObj = DDLogin({
      goto,
      id: 'dingtalk_qr',
      style: 'border:none;background-color:#FFFFFF;',
      width: '365',
      height: '400',
    });

    const handleMessage = (event) => {
      if (event.origin === 'https://login.dingtalk.com') {
        window.location.replace(`${decodeURIComponent(goto)}&loginTmpCode=${event.data}`);
      }
    };
    if (typeof window.addEventListener !== 'undefined') {
      window.addEventListener('message', handleMessage, false);
    } else if (typeof window.attachEvent !== 'undefined') {
      window.attachEvent('onmessage', handleMessage);
    }
  }

  render() {
    return (<div id="dingtalk_qr" />);
  }
}

export default LoginPage;
