import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { viewportSizes } from 'constants/viewport';

const ViewportContext = React.createContext();

function getSize() {
  switch (true) {
    case window.innerWidth < viewportSizes.mobile:
      return { size: 'mobile' };
    case window.innerWidth >= viewportSizes.mobile && window.innerWidth < viewportSizes.tablet:
      return { size: 'tablet' };
    default:
      return { size: 'desktop' };
  }
}

class ViewportControl extends React.Component {
  static propTypes = {
    children: PropTypes.shape({}).isRequired
  };

  state = {
    ...getSize()
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({
      ...getSize()
    });
  };

  render() {
    const { children } = this.props;
    return <ViewportContext.Provider value={ this.state }>{children}</ViewportContext.Provider>;
  }
}

const MediaQuery = props => {
  const { mobile, tablet } = props;

  return <ViewportContext.Consumer>{({ size }) => props[size] || tablet || mobile}</ViewportContext.Consumer>;
};

MediaQuery.propTypes = {
  mobile: PropTypes.node,
  tablet: PropTypes.node
};
MediaQuery.defaultProps = {
  mobile: <Fragment />,
  tablet: <Fragment />
};

const withMediaQuery = Component => props => (
  <ViewportContext.Consumer>{({ size }) => <Component { ...props } viewportSize={ size } />}</ViewportContext.Consumer>
);

export { ViewportControl, MediaQuery, withMediaQuery };
