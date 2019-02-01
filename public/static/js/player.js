var Player = function(music) {
  var index = 0;
  var el = document.createElement('div');
  var opts = document.createElement('div');
  var playBtn = document.createElement('button');
  var nextBtn = document.createElement('button');

  var play = function() {
    wavesurfer.play();
    playBtn.innerText = '暂停';
  };
  var pause = function() {
    wavesurfer.pause();
    playBtn.innerText = '播放';
  };
  var next = function() {
    index = index < music.length - 1 ? index + 1 : 0
    wavesurfer.load(music[index]);
  };
  var checkPlay = function() {
    if (wavesurfer.isPlaying()) {
      pause()
    } else {
      play()
    }
  };

  el.id = 'waveform';
  opts.className = 'waveform-opts';
  playBtn.innerText = '播放';
  nextBtn.innerText = '下一曲';

  var wavesurfer = WaveSurfer.create({
    container: el,
  });

  wavesurfer.setVolume(0.5);
  wavesurfer.load(music[index]);
  wavesurfer.on('ready', function() {
    play();
  });
  wavesurfer.on('finish', function() {
    next();
  });

  playBtn.addEventListener(
    'click',
    function() {
      checkPlay();
    },
    false
  );
  nextBtn.addEventListener(
    'click',
    function() {
      next();
    },
    false
  );

  opts.appendChild(playBtn);
  opts.appendChild(nextBtn);
  el.appendChild(opts);
  document.body.appendChild(el);
};
