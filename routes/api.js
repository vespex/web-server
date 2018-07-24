var express = require('express');
var md5 = require('blueimp-md5')
var router = express.Router();
var util = require('../utils')
var config = require('../config')
/* GET users listing. */
router.get('/word', function(req, res, next) {
  if (req.query && req.query.word) {
    let salt = +new Date() + '' + parseInt(Math.random() * 10000)
    let sign = md5(config.wordAppKey + req.query.word + salt + config.wordKey)
    let url = `https://openapi.youdao.com/api?q=${req.query.word}&from=EN&to=zh_CHS&appKey=${config.wordAppKey}&salt=${salt}&sign=${sign}`
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

router.get('/test', function (req, res, next) {
  res.send({status: 0, message: 'ok', data: {}})
});
module.exports = router;
