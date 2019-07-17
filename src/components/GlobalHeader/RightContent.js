import React from 'react';
import { FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import styles from './index.less';

export default class GlobalHeaderRight extends React.PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  render() {
    const { currentUser, onMenuClick, theme } = this.props;
    const accountMenu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Link replace to="/paas/link">
            <Icon type="rocket" style={{ fontSize: '20px' }} />
            <FormattedMessage id="menu.paas" defaultMessage="paas center" />
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" style={{ fontSize: '20px' }} />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {currentUser.name ? (
          <Dropdown overlay={accountMenu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="middle" className={styles.avatar} alt={currentUser.name}>
                {currentUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <span className={styles.name}>{currentUser.name}</span>
              <Icon type="down" style={{ paddingLeft: '9px' }} />
            </span>
          </Dropdown>
        ) : (
          <div>
            <Spin style={{ margin: 16 }} />
            <a onClick={() => onMenuClick({ key: 'logout' })}>退出</a>
          </div>
        )}
      </div>
    );
  }
}
