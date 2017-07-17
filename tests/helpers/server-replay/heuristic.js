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

const URL = require('url');

module.exports = function (entries, request) {
  return new Promise((resolve) => {
    let body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();


      let topPoints = 0;
      let topEntry = null;

      entries.forEach((entry) => {
        if (!entry.request.parsedUrl) {
          entry.request.parsedUrl = URL.parse(entry.request.url, true);
        }
        if (!entry.request.indexedHeaders) {
          entry.request.indexedHeaders = indexHeaders(entry.request.headers);
        }
        const points = rate(entry.request, request, body);
        if (points > topPoints) {
          topPoints = points;
          topEntry = entry;
        }
      });

      resolve(topEntry);
    });
  });
};

function rate(entryRequest, request, body) {
  let points = 0;

    // method, host and pathname must match
  if (
        entryRequest.method !== request.method ||
        (request.parsedUrl.host !== null && entryRequest.parsedUrl.host !== request.parsedUrl.host) ||
        entryRequest.parsedUrl.pathname !== request.parsedUrl.pathname
    ) {
    return 0;
  }

  if (entryRequest.postData && entryRequest.postData.text) {
    if (entryRequest.postData.text) {
      // points += 1;
      if (entryRequest.postData.text !== body) {
        return 0;
      }
    }
  }
    // One point for matching above requirements
  points += 1;

    // each query
  const entryQuery = entryRequest.parsedUrl.query;
  const requestQuery = request.parsedUrl.query;
  if (entryQuery && requestQuery) {
    Object.keys(requestQuery).forEach((name) => {
      if (requestQuery[name]) {
        points += stripProtocol(entryQuery[name]) === stripProtocol(requestQuery[name]) ? 1 : 0;
      }
    });
        // TODO handle missing query parameters and adjust score appropriately
  }

    // each query
  // const requestContentText = request.content.text;

    // each header
  const entryHeaders = entryRequest.indexedHeaders;
  const requestHeaders = request.headers;
  Object.keys(requestHeaders).forEach((name) => {
    if (entryHeaders[name]) {
      points += stripProtocol(entryHeaders[name]) === stripProtocol(requestHeaders[name]) ? 1 : 0;
    }
  });


  return points;
}

function stripProtocol(string) {
  return string && string.replace(/^https?/, '');
}

function indexHeaders(entryHeaders) {
  const headers = {};
  entryHeaders.forEach((header) => {
    headers[header.name.toLowerCase()] = header.value;
        // TODO handle multiple of the same named header
  });
  return headers;
}
