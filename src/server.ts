import express from 'express';
import { parse } from 'url';
import next from 'next';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = express();
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  app.use((req, res) => {
    const parsedURL = parse(req.url, true);
    handle(req, res, parsedURL);
  });

  app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(
      `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
      }`
    );
  }).on('error', err => {
    throw err;
  });
}).catch(e => {
  console.error(e);
  console.error(`[ERROR] Could not start frontend server: ${e.messsage}`);
});