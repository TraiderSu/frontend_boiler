import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DataProvider as DataProviderView } from './DataProvider';

const makeMapStateToProps = () => {
  const mapStateToProps = (state, ownProps) => {
    const { selector } = ownProps;

    return {
      data: selector ? selector(state, ownProps) : {}
    };
  };

  return mapStateToProps;
};

const DataProvider = withRouter(connect(makeMapStateToProps)(DataProviderView));

export { DataProvider };
