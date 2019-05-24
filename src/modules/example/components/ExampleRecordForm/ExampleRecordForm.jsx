import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { Input, Button, Grid } from 'semantic-ui-react';

import { fetchExampleRecordList, createExampleRecord, patchExampleRecord } from 'modules/example/redux/exampleRecords';

class ExampleRecordForm extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({}),
    handleEdit: PropTypes.func.isRequired,
    isEditting: PropTypes.bool.isRequired
  };

  static defaultProps = {
    initialValues: null
  };

  onSubmit = async (values, form) => {
    const { dispatch, isEditting, handleEdit } = this.props;

    if (isEditting) {
      await dispatch(patchExampleRecord(values));
      handleEdit();
    } else {
      await dispatch(createExampleRecord(values));
    }

    form.reset();
    dispatch(fetchExampleRecordList(values));
  };

  render() {
    const { initialValues } = this.props;

    return (
      <Form
        initialValues={ initialValues }
        onSubmit={ this.onSubmit }
        render={ ({ handleSubmit, pristine, invalid }) => (
          <form onSubmit={ handleSubmit } autoComplete="off">
            <Grid columns={ 2 }>
              <Grid.Column>
                <Field name="name">
                  {({ input, meta }) => (
                    <>
                      <Input
                        { ...input }
                        error={ meta.touched && meta.error }
                        fluid
                        placeholder="Enter example record name"
                      />
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </>
                  )}
                </Field>
              </Grid.Column>
              <Grid.Column>
                <Button primary disabled={ pristine || invalid }>
                  Submit
                </Button>
              </Grid.Column>
            </Grid>
          </form>
        ) }
      />
    );
  }
}

export { ExampleRecordForm };
