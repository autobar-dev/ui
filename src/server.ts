import express from "express";
import next from "next";
import { createProxyMiddleware } from "http-proxy-middleware";

const port = process.env.PORT || 4000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const apiPaths = {
  '/api': {
    target: 'http://localhost:4001', 
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