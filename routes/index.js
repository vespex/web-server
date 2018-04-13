var express = require('express');
var fs = require('fs');
var config = require('../config')
var router = express.Router();
var multer = require('multer')
var isDev = process.env.NODE_ENV === 'development'
// require('../data/db.js')
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
  { name: 'pc', path: '/pc/'},
  { name: 'example', path: '/example/' },
  { name: 'swagger', path: '/swagger/', },
  { name: 'swaggerAll', path: '/swagger/*', },
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

const list = [
  {
    id: 1,
    avatar: 'https://dummyimage.com/160x160',
    title: '运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装',
    spec: 'S码 蓝色',
    price: '198.00',
    num: 2,
    min: 2,
    max: 10,
  },
  {
    id: 2,
    avatar: 'https://dummyimage.com/160x160',
    title: '运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装',
    spec: 'S码 蓝色',
    price: '198.00',
    num: 10,
    min: 1,
    max: 200,
  },
  {
    id: 3,
    avatar: 'https://dummyimage.com/160x160',
    title: '运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装',
    spec: 'S码 蓝色',
    price: '198.00',
    num: 6,
    min: 5,
    max: 200,
  },
  {
    id: 4,
    avatar: 'https://dummyimage.com/160x160',
    title: '运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装',
    spec: 'S码 蓝色',
    price: '198.00',
    num: 2,
    min: 2,
    max: 10,
  },
  {
    id: 5,
    avatar: 'https://dummyimage.com/160x160',
    title: '运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装',
    spec: 'S码 蓝色',
    price: '198.00',
    num: 10,
    min: 1,
    max: 200,
  },
  {
    id: 6,
    avatar: 'https://dummyimage.com/160x160',
    title: '运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装',
    spec: 'S码 蓝色',
    price: '198.00',
    num: 6,
    min: 5,
    max: 200,
  },
  {
    id: 7,
    avatar: 'https://dummyimage.com/160x160',
    title: '运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装',
    spec: 'S码 蓝色',
    price: '198.00',
    num: 2,
    min: 2,
    max: 10,
  },
  {
    id: 8,
    avatar: 'https://dummyimage.com/160x160',
    title: '运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装',
    spec: 'S码 蓝色',
    price: '198.00',
    num: 10,
    min: 1,
    max: 200,
  },
  {
    id: 9,
    avatar: 'https://dummyimage.com/160x160',
    title: '运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装 运动服套装女2018春季新款韩版春装',
    spec: 'S码 蓝色',
    price: '198.00',
    num: 6,
    min: 5,
    max: 200,
  }
]

router.post('/mp/cart/update', (req, res, next) => {
  const { changeList } = req.body
  changeList.forEach(item => {
    let {id, ...data} = item
    let {num} = data
    if (num === 0) {
      list.splice(list.findIndex(itm => itm.id === id), 1)
    } else {
      let cartItem = list.find(itm => itm.id === id)
      cartItem && Object.assign(cartItem, data)
    }
  })
  res.send({ status: 1, data: { list }, message: 'ok' })
});

router.get('/mp/cart/list', (req, res, next) => {
  res.send({ status: 1, data: { list }, message: 'ok' })
});
router.get('/api/test', (req, res, next) => {
  setTimeout(() => {
    res.send({ status: 1, data: { test: 'test' }, message: 'ok' })
  }, 1000)
});

module.exports = router;
