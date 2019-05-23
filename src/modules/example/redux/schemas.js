import { schema } from 'normalizr';
import { EXAMPLE_RECORDS } from 'core/entitiesNames';

export default {
  [EXAMPLE_RECORDS]: new schema.Entity(EXAMPLE_RECORDS)
};
