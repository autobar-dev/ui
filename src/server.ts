import express from "express";
import next from "next";
import { createProxyMiddleware } from "http-proxy-middleware";
import { checkEnvVars } from "./utils/helpers/checkEnvVars";
import dotenv from "dotenv";

dotenv.config();
checkEnvVars();

const port = process.env.PORT || 4000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const apiPaths = {
  '/api': {
    target: process.env.NEXT_PUBLIC_API_URL, 
    pathRewrite: {
      '^/api': '/'
    },
    changeOrigin: true
  },
}

const isDevelopment = process.env.NODE_ENV !== 'production';

app.prepare().then(() => {
  const server = express();

  server.use('/api', createProxyMiddleware(apiPaths['/api']));

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  })
}).catch(err => {
    console.log('Error:::::', err)
})