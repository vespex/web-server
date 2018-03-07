var express = require('express');
var router = express.Router();
var multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file)
    cb(null, 'public/api')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const route = [
  { name: 'index', path: '/', data: { title: 'xinge\'s page'} },
  { name: 'swagger', path: '/swagger/*', },
]

var api = multer({ storage })
/* GET home page. */
route.forEach(item => {
  let path = item.path.slice(1)
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
