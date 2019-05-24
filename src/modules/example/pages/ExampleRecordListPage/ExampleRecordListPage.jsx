import React from 'react';
import PropTypes from 'prop-types';
import { fetchExampleRecordList, deleteExampleRecord } from 'modules/example/redux/exampleRecords';
import { DataProvider } from 'components/DataProvider';
import { ExampleRecordForm } from 'modules/example/components/ExampleRecordForm';

import { Header, List, Button } from 'semantic-ui-react';
import { getExampleRecords } from 'modules/example/selectors/exampleRecords';
import _find from 'lodash/find';
import styles from './ExampleRecordListPage.less';

const didMountCallback = ({ dispatch }) => {
  dispatch(fetchExampleRecordList());
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

  render() {
    const { editRecordId } = this.state;

    return (
      <>
        <DataProvider selector={ getExampleRecords } didMountCallback={ didMountCallback }>
          {({ data }) => (
            <div className={ styles.container }>
              <Header size="medium">ExampleRecords</Header>
              <ExampleRecordForm
                initialValues={ _find(data, item => item.id === editRecordId) }
                isEditting={ !!editRecordId }
                handleEdit={ this.handleEdit }
              />
              <List divided relaxed>
                {data.map(({ id, name }) => (
                  <List.Item key={ id }>
                    <div className={ styles.list__item }>
                      <Header size="small">
                        <span>{id}</span>
                        <span>&nbsp;&nbsp;&nbsp;</span>
                        <span>{name}</span>
                      </Header>
                      <div>
                        <Button onClick={ () => this.handleEdit(id) } size="mini" icon="pencil alternate" />
                        <Button onClick={ () => this.handleDelete(id) } size="mini" icon="trash alternate outline" />
                      </div>
                    </div>
                  </List.Item>
                ))}
              </List>
            </div>
          )}
        </DataProvider>
      </>
    );
  }
}

export { ExampleRecordListPage };
