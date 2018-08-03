const fetch = require('node-fetch')
const req = require('request')
const fs = require('fs')
const path = require('path')

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

const defaultOptions = {
  url: '',
  method: 'GET',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
  }
}

function request(url, options = {}) {
  let newOptions = { ...defaultOptions, ...options, url }

  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(err => {
      throw new Error(err.message)
    });
}

function download (url, savePath = './public', rename) {
  const name = rename || url.match(/(\w+)\.(\w+)$/g)[0]
  req(url).pipe(fs.createWriteStream(savePath + name))
}

const resFormat = {
  success(res, data = {}) {
    res.send({ status: 1, message: 'success', data })
  },
  error(res, err = 'error') {
    res.send({ status: 0, message: err })
  }
}

module.exports = {
  request,
  download,
  resFormat
}