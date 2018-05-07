var request = require('request')

const defaultOptions = {
  url: '',
  method: 'GET',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
  }
}

const resFormat = {
  success(res, data = {}) {
    res.send({ status: 1, message: 'success', data })
  },
  error(res, err = 'error') {
    res.send({ status: 0, message: err })
  }
}

function getData (url, options = {}) {
  let newOptions = { ...defaultOptions, ...options, url}
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
  return new Promise((resolve, reject) => {
    request(newOptions, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        let data
        try {
          data = JSON.parse(res.body)
        }
        catch (e) {
          data = res.body
        }
        resolve(data)
      }
      reject(err || res.statusCode)
    })
  })
}

module.exports = {
  getData,
  resFormat
}