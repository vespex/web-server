const express = require('express');
const cors = require('cors')
const fs = require('fs')
const md5 = require('blueimp-md5')
const router = express.Router();
const util = require('../utils')
const config = require('../config')

const configPath = './public/configs/'

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
    'status': 0,
    'message': 'ok',
    'data': {}
  })
});

router.get('/proxyApi', cors(), (req, res, next) => {
  const url = req.query.url
  url && util.request(url)
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      res.json(err)
    })
});

router.get('/getConfigList', (req, res, next) => {
  const type = fs.readdirSync(configPath)
  const allFiles = type.map(item => {
    const files = fs.readdirSync(configPath + item).map(file => file.replace(/\.(.*)/, ''))
    return {title: item, files}
  })
  res.json({
    status: 0,
    message: 'ok',
    data: allFiles
  })
});
router.get('/getConfig', (req, res, next) => {
  const path = decodeURIComponent(req.query.path)
  const filePath = configPath + path + '.json'
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8')
    res.json({
      status: 0,
      message: 'ok',
      data
    })
  } else {
    res.json({
      status: 1,
      message: 'no found',
    })
  }
});
router.post('/saveConfig', (req, res, next) => {
  const path = decodeURIComponent(req.body.path)
  const config = JSON.stringify(req.body.config)
  const filePath = configPath + path + '.json'
  if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, config)
    res.json({
      status: 0,
      message: 'file updated',
    })
  } else {
    fs.writeFileSync(filePath, config)
    res.json({
      status: 0,
      message: 'file created',
    })
  }
});

module.exports = router;