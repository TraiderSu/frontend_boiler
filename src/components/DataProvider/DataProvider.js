import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { location as locationProps, match as matchProps, history as historyProps } from 'helpers/propTypes';

class DataProvider extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.func,
    didMountCallback: PropTypes.func,
    didUpdateCallback: PropTypes.func,
    data: PropTypes.shape({}),
    match: PropTypes.shape(matchProps),
    location: PropTypes.shape(locationProps).isRequired,
    history: PropTypes.shape(historyProps).isRequired
  };

  static defaultProps = {
    children: noop,
    didMountCallback: null,
    didUpdateCallback: null,
    data: null,
    match: null
  };

  state = { hasError: false };

  componentDidMount() {
    const { didMountCallback, ...props } = this.props;

    if (didMountCallback) {
      didMountCallback(props);
    }
  }

  componentDidUpdate(prevProps) {
    const { didUpdateCallback, ...props } = this.props;

    if (didUpdateCallback) {
      didUpdateCallback(prevProps, props);
    }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
    console.error(error, info);
  }

  render() {
    const {
      data, children, dispatch, location, match, history
    } = this.props;

    const { hasError, error, info } = this.state;

    if (hasError) {
      return <ErrorBoundary error={ error } info={ info } />;
    }

    return children({
      ...data,
      dispatch,
      location,
      match,
      history
    });
  }
}

export { DataProvider };
