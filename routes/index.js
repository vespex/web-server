var express = require('express');
var router = express.Router();
var multer = require('multer')

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, 'public/api')
  },
  filename (req, file, cb) {
    cb(null, file.originalname)
  }
})

const api = multer({ storage })

const route = [ // path配置 如无其他配置 需以/结尾
  { name: 'index', path: '/', data: { title: 'xinge\'s page'} },
  { name: 'swagger', path: '/swagger/', },
  { name: 'swaggerAll', path: '/swagger/*', },
]

/* GET home page. */
route.forEach(item => {
  router.get(item.path, (req, res, next) => {
    let reqPath = req.path.endsWith('/') ? (req.path + 'index') : req.path
    res.render(reqPath.slice(1), item.data || {});
  });
})

router.post('/swagger/submit', api.single('doc'), (req, res, next) => {
  if(req.file) {
    return res.json({ result: 1, message: '上传成功' })
  }
  return res.json({ result: 0, message: '上传失败' })
});

module.exports = router;
