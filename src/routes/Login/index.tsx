
import * as React from 'react';
import { connect } from 'react-redux';
const styles = require('./style.less');

class Login extends React.PureComponent<any, any> {
  componentDidMount () {
    // do something
  }

  render() {
    RETURN (
      <div className={styles.content}>
        <h1>title</h1>
        <p>Jsm route</p>
      </div>
    );
  }
}

export default connect(({ Login }: any) => ({ ...Login }))(Login);
