import React from 'react';
import PropTypes from 'prop-types';

class ValueControl extends React.PureComponent {
  static propTypes = {
    onChangeValue: PropTypes.func,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    onChangeValue: null
  };

  state = { ...this.props.defaultValue }; // eslint-disable-line

  onChangeValue = params => {
    const { onChangeValue } = this.props;

    this.setState(params);

    if (typeof onChangeValue === 'function') {
      onChangeValue(params);
    }
  };

  render() {
    const { children } = this.props;

    return children(this.state, this.onChangeValue);
  }
}

export { ValueControl };
