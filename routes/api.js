const express = require('express');
const md5 = require('blueimp-md5')
const router = express.Router();
const util = require('../utils')
const config = require('../config')

/* GET users listing. */
router.get('/word', (req, res, next) => {
  if (req.query && req.query.word) {
    const salt = +new Date() + '' + parseInt(Math.random() * 10000)
    const sign = md5(config.wordAppKey + req.query.word + salt + config.wordKey)
    const url = `https://openapi.youdao.com/api?q=${req.query.word}&from=EN&to=zh_CHS&appKey=${config.wordAppKey}&salt=${salt}&sign=${sign}`
    util.request(url)
      .then(data => {
        util.resFormat.success(res, data)
      })
      .catch(err => {
        util.resFormat.success(res, err)
      })
  } else {
    util.resFormat.success(res, '字符不能为空')
  }
});

router.get('/test', (req, res, next) => {
  res.send({
    status: 0,
    message: 'ok',
    data: {}
  })
});

module.exports = router;