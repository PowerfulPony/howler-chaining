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
  'state', 'playing',
];

function HowlChain(soundData, audioSpriteSoundKey, singletonKey) {
  this.id = undefined;
  this.key = audioSpriteSoundKey;
  this.howl = getInstance(soundData, singletonKey);
}

listChain.forEach((method) => {
  function proxy(...args) {
    const { id } = this;
    const forApply = [...args, id];
    if (id) {
      this.howl[method](...forApply);
    }
    return this;
  }
  HowlChain.prototype[method] = proxy;
});

listProxy.forEach((method) => {
  function proxy() {
    const { id } = this;
    if (id) {
      return this.howl[method].call(this.howl, id);
    }
    return undefined;
  }
  HowlChain.prototype[method] = proxy;
});

HowlChain.prototype.play = function play(force) {
  const { id } = this;
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
  const { id } = this;
  if (id && typeof val !== 'undefined') {
    this.howl.loop.call(this.howl, val, this.id);
    return this;
  }
  return undefined;
};

HowlChain.prototype.Howl = Howl;
HowlChain.prototype.Howler = Howler;

export {
  Howl,
  Howler,
  HowlChain,
};
