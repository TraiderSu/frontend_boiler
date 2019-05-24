import { connect } from 'react-redux';
import { ExampleRecordListPage as ExampleRecordListPageView } from './ExampleRecordListPage';

const ExampleRecordListPage = connect()(ExampleRecordListPageView);

export { ExampleRecordListPage as default };
