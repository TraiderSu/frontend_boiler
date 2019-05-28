import React from 'react';
import PropTypes from 'prop-types';
import { getSearch } from 'helpers/selectors';
import { ValueControl } from 'components/ValueControl';
import { fetchExampleRecordList, deleteExampleRecord } from 'modules/example/redux/exampleRecords';
import { DataProvider } from 'components/DataProvider';
import { ExampleRecordForm } from 'modules/example/components/ExampleRecordForm';

import {
  Header, Grid, Button, Pagination
} from 'semantic-ui-react';
import { getExampleRecords } from 'modules/example/selectors/exampleRecords';
import _find from 'lodash/find';
import styles from './ExampleRecordListPage.less';

const didMountCallback = ({ dispatch, ...props }) => {
  dispatch(fetchExampleRecordList({ query: props.valueControlParams }));
};

const didUpdateCallback = (prevProps, { dispatch, ...props }) => {
  const prevSearch = getSearch(prevProps);
  const search = getSearch(props);

  if (prevSearch !== search) {
    dispatch(fetchExampleRecordList({ query: props.valueControlParams }));
  }
};

class ExampleRecordListPage extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  state = {
    editRecordId: null
  };

  handleDelete(id) {
    const { dispatch } = this.props;
    dispatch(deleteExampleRecord(id));
  }

  handleEdit = (editRecordId = null) => {
    this.setState({ editRecordId });
  };

  renderListHeader() {
    return (
      <Grid>
        <Grid.Column width={ 2 }>
          <Header size="small">id</Header>
        </Grid.Column>
        <Grid.Column width={ 11 }>
          <Header size="small">name</Header>
        </Grid.Column>
        <Grid.Column width={ 2 }>
          <Header size="small">actions</Header>
        </Grid.Column>
      </Grid>
    );
  }

  renderRow({ id, name }) {
    return (
      <Grid key={ id }>
        <Grid.Column width={ 2 }>{id}</Grid.Column>
        <Grid.Column width={ 11 }>{name}</Grid.Column>
        <Grid.Column width={ 2 }>
          <Button onClick={ () => this.handleEdit(id) } size="mini" icon="pencil alternate" />
          <Button onClick={ () => this.handleDelete(id) } size="mini" icon="trash alternate outline" />
        </Grid.Column>
      </Grid>
    );
  }

  render() {
    const { editRecordId } = this.state;

    return (
      <ValueControl defaultValue={ { limit: 10, offset: 0 } }>
        {(valueControlParams, onChangeValue) => (
          <DataProvider
            valueControlParams={ valueControlParams }
            selector={ getExampleRecords }
            didMountCallback={ didMountCallback }
            didUpdateCallback={ didUpdateCallback }
          >
            {({ data, total }) => (
              <div className={ styles.container }>
                <Header size="medium">ExampleRecords</Header>
                <ExampleRecordForm
                  initialValues={ _find(data, item => item.id === editRecordId) }
                  isEditting={ !!editRecordId }
                  handleEdit={ this.handleEdit }
                />
                <div className={ styles.list }>
                  {this.renderListHeader()}
                  {data.map(params => this.renderRow(params))}
                  <Pagination
                    ellipsisItem={ null }
                    activePage={ Math.ceil(
                      (valueControlParams.limit + valueControlParams.offset) / valueControlParams.limit
                    ) }
                    onPageChange={ (_, { activePage }) => onChangeValue({ offset: (activePage - 1) * valueControlParams.limit })
                    }
                    totalPages={ Math.ceil(total / valueControlParams.limit) }
                  />
                </div>
              </div>
            )}
          </DataProvider>
        )}
      </ValueControl>
    );
  }
}

export { ExampleRecordListPage };
