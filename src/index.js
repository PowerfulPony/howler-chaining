import { Howl, Howler } from 'howler';

const chankCollection = new Map();
function getInstance(soundData, singletonKey) {
  let instance;

  if (typeof singletonKey === 'undefined') instance = new Howl(soundData);

  if (chankCollection.get(singletonKey)) {
    instance = chankCollection.get(singletonKey);
  } else {
    instance = new Howl(soundData);
    chankCollection.set(singletonKey, instance);
  }

  return instance;
}

const listChain = [
  'play', 'pause', 'stop',
  'mute', 'volume', 'fade',
  'rate', 'seek',
  'on', 'once', 'off',
];

const listProxy = [
  'state', 'playing'
];

function HowlChain(soundData, audioSpriteSoundKey, singletonKey) {
  this.id = undefined;
  this.key = audioSpriteSoundKey;
  this.howl = getInstance(soundData, singletonKey);
}

listChain.forEach((method) => {
  function proxy(...args) {
    const id = this.id;
    const forApply = [...args, id]
    if (id) {
      this.howl[method].apply(this.howl, forApply);
    }
    return this;
  }
  HowlChain.prototype[method] = proxy;
});

listProxy.forEach((method) => {
  function proxy() {
    const id = this.id;
    if (id) {
      return this.howl[method].call(this.howl, id);
    }
  }
  HowlChain.prototype[method] = proxy;
});

HowlChain.prototype.play = function play(force) {
  const id = this.id;
  if (typeof id === 'undefined') {
    this.id = this.howl.play.call(this.howl, this.key);
    return this;
  }

  if (this.playing()) {
    this.stop();
  }

  if (force || this.howl.play.call(this.howl, id) === null) {
    this.id = this.howl.play.call(this.howl, this.key);
  }

  return this;
};

HowlChain.prototype.loop = function loop(val) {
  const id = this.id;
  if (id) {
    if (typeof val !== 'undefined') {
      this.howl.loop.call(this.howl, val, this.id);
      return this;
    }
  }
};

HowlChain.prototype.Howl = Howl;
HowlChain.prototype.Howler = Howler;

export {
  Howl,
  Howler,
  HowlChain,
}
