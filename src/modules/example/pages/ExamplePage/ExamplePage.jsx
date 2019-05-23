import React from 'react';
import { getId } from 'helpers/selectors';
import { fetchExampleRecordList } from 'modules/example/redux/exampleRecords';
import { DataProvider } from 'components/DataProvider';

import { Header, List } from 'semantic-ui-react';
import { getExampleRecords } from 'modules/example/selectors/exampleRecords';

const didMountCallback = ({ dispatch, ...props }) => {
  const id = getId(props);
  dispatch(fetchExampleRecordList(id));
};

class ExamplePage extends React.Component {
  render() {
    return (
      <>
        <Header size="medium">ExampleRecords</Header>
        <DataProvider selector={ getExampleRecords } didMountCallback={ didMountCallback }>
          {({ data }) => (
            <List divided relaxed>
              {data.map(({ id, name }) => (
                <List.Item key={ id }>{name}</List.Item>
              ))}
            </List>
          )}
        </DataProvider>
      </>
    );
  }
}

export { ExamplePage };
