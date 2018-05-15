var express = require('express');
var fs = require('fs');
var config = require('../config')
var router = express.Router();
var multer = require('multer')
var isDev = process.env.NODE_ENV === 'development'
// require('../data/db.js')
/* upload */
const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, 'public/json')
  },
  filename (req, file, cb) {
    cb(null, file.originalname)
  }
})

const api = multer({ storage })

/* router list */
const route = [ // path配置 如无其他配置 需以/结尾
  { name: 'root', path: '/', data: { title: 'xinge\'s page'} },
  { name: 'index', path: '/index/' },
  { name: 'pc', path: '/pc/'},
  { name: 'admin', path: '/admin/' },
  { name: 'example', path: '/example/' },
  { name: 'swagger', path: '/swagger/', },
  { name: 'swaggerAll', path: '/swagger/*', },
  { name: 'activity', path: '/activity/*', },
]
if (isDev) {
  var server = require('http').createServer(express());
} else {
  var options = {
    cert: fs.readFileSync(config.sslPath + 'www.vesper.com.cn_bundle.crt'),
    key: fs.readFileSync(config.sslPath + 'www.vesper.com.cn.key')
  };
  var server = require('https').createServer(options, express());
}

/* socket.io */
var io = require('socket.io')(server);

server.listen(3030);

var connectNum = 0
io.on('connection', (socket) => {
  connectNum++
  console.log('socket count: ' + connectNum)
  socket.on('disconnect', () => {
    connectNum--
    console.log('socket count: ' + connectNum)
  });

  socket.on('message', (obj) => {
    io.emit('message', obj);
  });

});

/* GET page */
route.forEach(item => {
  router.get(item.path, (req, res, next) => {
    let reqPath = req.path.endsWith('/') ? (req.path + 'index') : req.path
    res.render(reqPath.slice(1), item.data || {});
  });
})

/* POST */
router.post('/swagger/submit', api.single('doc'), (req, res, next) => {
  if(req.file) {
    return res.json({ result: 1, message: '上传成功' })
  }
  return res.json({ result: 0, message: '上传失败' })
});

module.exports = router;
