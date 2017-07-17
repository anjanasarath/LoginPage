const bodyParser = require('body-parser');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
const harServer = require('./har-server'); // eslint-disable-line newline-after-import

const config = require(process.env.NODE_ENV === 'production' ?
  '../../webpack.config.production.js' :
  '../../webpack.config.js');

const port = 8090;
const mockPort = 8099;

harServer(path.resolve(__dirname, './all.har.json'), mockPort);

const server = new WebpackDevServer(webpack(config), {
  contentBase: './',
  publicPath: '/',
  stats: { colors: true },
  proxy: { '/**': { target: `http://localhost:${mockPort}` } }
});

server.use(bodyParser.json({ type: 'application/*+json' }));

server.listen(port, 'localhost', () => {
  console.log(`WebpackDevServer running on http://localhost:${port}`);
});
