import { jsonAdapter } from './json-adapter';
// import { mongoAdapter } from './mongo-adapter';

// To support MongoDB later, read process.env.USE_MONGODB
const useMongo = process.env.USE_MONGODB === 'true';

// Currently we use jsonAdapter. In the future you can export mongoAdapter when useMongo is true.
export const db = jsonAdapter;
