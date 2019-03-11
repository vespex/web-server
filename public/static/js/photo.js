;(function(){
  var photo = document.getElementById('photo')
  var photoImg = document.getElementById('photo-img')
  var resultImg = document.getElementById('result-img')
  var toCanny = function (e, result, type) {
    var width = e.target.width
    var height = e.target.height
    var img_u8 = new jsfeat.matrix_t(width, height, jsfeat.U8C1_t);
    // 灰度
    jsfeat.imgproc.grayscale(result, width, height, img_u8);
    // 高斯模糊
    jsfeat.imgproc.gaussian_blur(img_u8, img_u8, 6, 0);
    // canny计算
    jsfeat.imgproc.canny(img_u8, img_u8, 20, 50);
  }
  var readFiles = function (files) {
    if (files.length === 1) {
      for (var file of files) {
        var reader = new FileReader()
        if (file.type.match(/image/)) {
          reader.onload = function (e) {
            var result = e.target.result
            photoImg.src = result
            photoImg.onload = function (e) {
              toCanny(e, result, file.type)
            }
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }
  
  photo.addEventListener('dragover', function (e) {
    console.log('dragover');
    e.preventDefault()
  }, false)
  photo.addEventListener('drop', function (e) {
    console.log('drop');
    e.preventDefault()
    readFiles(e.dataTransfer.files)
  }, false)
}())