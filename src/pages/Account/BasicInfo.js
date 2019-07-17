import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class BasicInfo extends React.Component {
  render() {
    const { history, currentUser, dispatch } = this.props;
    if (!currentUser || _.isEmpty(currentUser)) {
      return <div className="emptyBasicInfo" />;
    }
    const props = {
      search: `type=form&cmpId=5bcae0e14f50ea43e4c6115g&metaOpStatus=edit&filterId=${
        currentUser.userId
      }`,
      params: {
        metaId: 'basic-info',
      },
      history,
      metaEventListener: () => {
        dispatch({
          type: 'user/fetchCurrent',
        });
      },
    };

    // return <MetaComponent {...props} />;
    return <div {...props} />;
  }
}

export default BasicInfo;
