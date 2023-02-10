import { LogProvider } from '@shared/container/provider/LogProvider';

import app from './app';

const logger = new LogProvider();

app.listen(3001, () => logger.log('Server running on port 3001 🚀'));
