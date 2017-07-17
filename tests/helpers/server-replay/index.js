/*
 * Copyright (c) 2015 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const http = require('http');
const URL = require('url');
const PATH = require('path');
const mime = require('mime');
const heuristic = require('./heuristic');

exports = module.exports = (har, options) => {
  http
    .createServer(makeRequestListener(har.log.entries, options))
    .listen(options.port);
};

// Export for testing
const makeRequestListener = (entries, options) => {
  const config = options.config;
  const resolvePath = options.resolvePath;
  const debug = options.debug;
    // for mocking
  const localFs = options.fs || fs;

  return function (request, response) {
    if (debug) {
      console.log(request.method, request.url);
    }
    request.parsedUrl = URL.parse(request.url, true);

    heuristic(entries, request)
      .then((entry) => {
        const localPath = config.mappings.reduce((accumulator, current) => {
          if (!accumulator && current(request.url)) {
            return PATH.resolve(resolvePath, localPath);
          }
          return accumulator;
        }, undefined);

        if (localPath) {
            // If there's local content, but no entry in the HAR, create a shim
            // entry so that we can still serve the file
          if (!entry) {
            const mimeType = mime.lookup(localPath);
            entry = {
              response: {
                status: 200,
                headers: [{
                  name: 'Content-Type',
                  value: mimeType
                }],
                content: {
                  mimeType
                }
              }
            };
          }

            // If we have a file location, then try and read it. If that fails, then
            // return a 404
          localFs.readFile(localPath, (err, content) => {
            if (err) {
              console.error('Error: Could not read', localPath, 'requested from', request.url);
              serveError(request, response, null, localPath);
              return;
            }

            entry.response.content.buffer = content;
            serveEntry(request, response, entry, config);
          });
        } else if (!serveError(request, response, entry && entry.response)) {
          serveEntry(request, response, entry, config);
        }
      });
  };
};

exports.makeRequestListener = makeRequestListener;


function serveError(request, response, entryResponse, localPath) {
  const requestUrl = request.url;
  const contentType = request.headers.accept ? request.headers.accept : 'text/plain';

  if (!entryResponse) {
    const message = `404 Not found${localPath ? `, while looking for ${localPath}` : ''}`;
    console.log('Not found:', requestUrl);
    response.writeHead(404, 'Not found', { 'content-type': contentType });

    if (contentType === 'application/json') {
      response.end(JSON.stringify({ status: 404, message, localPath }, null, 4));
    } else {
      response.end(message);
    }
    return true;
  }

  if (entryResponse._error || !entryResponse.status) { // eslint-disable-line no-underscore-dangle
    const error = entryResponse._error ? // eslint-disable-line no-underscore-dangle
      JSON.stringify(entryResponse._error) :  // eslint-disable-line no-underscore-dangle
      'Missing status'; // eslint-disable-line no-underscore-dangle
    const message = `HAR response error: ${error
  }\n\nThis resource might have been blocked by the client recording the HAR file.
  For example, by the AdBlock or Ghostery extensions.`;
    response.writeHead(410, error, { 'content-type': contentType });

    if (contentType === 'application/json') {
      response.end(JSON.stringify({ status: 410,
        error: message }, null, 4));
    } else {
      response.end(message);
    }
    return true;
  }

  return false;
}

function serveHeaders(response, entryResponse) {
    // Not really a header, but...
  response.statusCode = (entryResponse.status === 304) ? 200 : entryResponse.status;

  entryResponse.headers.forEach((header) => {
    const name = header.name;
    const value = header.value;

    if (['content-length', 'content-encoding', 'cache-control', 'pragma'].indexOf(name.toLowerCase()) === -1) {
      const existing = response.getHeader(name);
      if (existing) {
        if (Array.isArray(existing)) {
          response.setHeader(name, existing.concat(value));
        } else {
          response.setHeader(name, [existing, value]);
        }
      } else {
        response.setHeader(name, value);
      }
    }
  });
    // Try to make sure nothing is cached
  response.setHeader('cache-control', 'no-cache, no-store, must-revalidate');
  response.setHeader('pragma', 'no-cache');
}

function manipulateContent(request, entry, replacements) {
  const entryResponse = entry.response;
  let content;
  if (isBinary(entryResponse)) {
    content = entryResponse.content.buffer;
  } else {
    content = entryResponse.content.buffer.toString('utf8');
    const context = {
      request,
      entry
    };
    replacements.forEach((replacement) => {
      content = replacement(content, context);
    });
  }

  if (entryResponse.content.size > 0 && !content) {
    console.error('Error:', entry.request.url, 'has a non-zero size, but there is no content in the HAR file');
  }

  return content;
}

function isBase64Encoded(entryResponse) {
  if (!entryResponse.content.text) {
    return false;
  }
  const base64Size = entryResponse.content.size / 0.75;
  const contentSize = entryResponse.content.text.length;
  return contentSize && contentSize >= base64Size && contentSize <= base64Size + 4;
}

// FIXME
function isBinary(entryResponse) {
  return /^image\/|application\/octet-stream/.test(entryResponse.content.mimeType);
}

function serveEntry(request, response, entry, config) {
  const entryResponse = entry.response;
  serveHeaders(response, entryResponse);

  if (!entryResponse.content.buffer) {
    if (isBase64Encoded(entryResponse)) {
      entryResponse.content.buffer = new Buffer(entryResponse.content.text || '', 'base64');
    } else {
      entryResponse.content.buffer = new Buffer(entryResponse.content.text || '', 'utf8');
    }
  }

  response.end(manipulateContent(request, entry, config.replacements));
}
