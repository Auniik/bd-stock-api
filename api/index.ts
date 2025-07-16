import app from '../src/app';
import { createServer } from 'http';

export default (req: any, res: any) => {
  const server = createServer(app);
  return server.emit('request', req, res);
};