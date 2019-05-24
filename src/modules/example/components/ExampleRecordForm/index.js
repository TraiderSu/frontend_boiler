import { connect } from 'react-redux';
import { ExampleRecordForm as ExampleRecordFormView } from './ExampleRecordForm';

const ExampleRecordForm = connect()(ExampleRecordFormView);

export { ExampleRecordForm };
