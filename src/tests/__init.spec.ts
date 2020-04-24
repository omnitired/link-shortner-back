import { addInitialData, setJwts } from './utils/constants';
import { truncateTables } from './utils/helpers';

before(async () => {
  if (process.env.NODE_ENV === 'test') {
    await truncateTables('users');
    await addInitialData();
    await setJwts();
  }
});
