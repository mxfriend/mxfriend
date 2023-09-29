const nodes: string[] = [
  '/config/{ch,aux,fx,bus,mtx}link',
  '/config/mute',
  '/config/linkcfg',
  '/config/mono',
  '/config/solo',
  '/config/talk',
  '/config/talk/{A,B}',
  '/config/osc',
  '/config/userrout/{out,in}',
  '/config/routing',
  '/config/routing/{IN,AES50A,AES50B,CARD,OUT,PLAY}',
  '/config/userctrl/{A,B,C}',
  '/config/userctrl/{A,B,C}/{enc,btn}',
  '/config/tape',
  '/config/amixenable',
  '/config/dp48',
  '/config/dp48/{assign,link,grpname}',

  '/ch/{01-32}/config',
  '/ch/{01-32}/delay',
  '/ch/{01-32}/preamp',
  '/ch/{01-32}/gate',
  '/ch/{01-32}/gate/filter',
  '/ch/{01-32}/dyn',
  '/ch/{01-32}/dyn/filter',
  '/ch/{01-32}/insert',
  '/ch/{01-32}/eq',
  '/ch/{01-32}/eq/{1-4}',
  '/ch/{01-32}/mix',
  '/ch/{01-32}/mix/{01-16}',
  '/ch/{01-32}/grp',
  '/ch/{01-32}/automix',

  '/auxin/{01-08}/config',
  '/auxin/{01-08}/preamp',
  '/auxin/{01-08}/eq',
  '/auxin/{01-08}/eq/{1-4}',
  '/auxin/{01-08}/mix',
  '/auxin/{01-08}/mix/{01-16}',
  '/auxin/{01-08}/grp',

  '/fxrtn/{01-08}/config',
  '/fxrtn/{01-08}/eq',
  '/fxrtn/{01-08}/eq/{1-4}',
  '/fxrtn/{01-08}/mix',
  '/fxrtn/{01-08}/mix/{01-16}',
  '/fxrtn/{01-08}/grp',

  '/bus/{01-16}/config',
  '/bus/{01-16}/dyn',
  '/bus/{01-16}/dyn/filter',
  '/bus/{01-16}/insert',
  '/bus/{01-16}/eq',
  '/bus/{01-16}/eq/{1-6}',
  '/bus/{01-16}/mix',
  '/bus/{01-16}/mix/{01-06}',
  '/bus/{01-16}/grp',

  '/mtx/{01-06}/config',
  '/mtx/{01-06}/preamp',
  '/mtx/{01-06}/dyn',
  '/mtx/{01-06}/dyn/filter',
  '/mtx/{01-06}/insert',
  '/mtx/{01-06}/eq',
  '/mtx/{01-06}/eq/{1-6}',
  '/mtx/{01-06}/mix',
  '/mtx/{01-06}/grp',

  '/main/{st,m}/config',
  '/main/{st,m}/dyn',
  '/main/{st,m}/dyn/filter',
  '/main/{st,m}/insert',
  '/main/{st,m}/eq',
  '/main/{st,m}/eq/1',
  '/main/{st,m}/eq/2',
  '/main/{st,m}/eq/3',
  '/main/{st,m}/eq/4',
  '/main/{st,m}/eq/5',
  '/main/{st,m}/eq/6',
  '/main/{st,m}/mix',
  '/main/{st,m}/mix/01',
  '/main/{st,m}/mix/02',
  '/main/{st,m}/mix/03',
  '/main/{st,m}/mix/04',
  '/main/{st,m}/mix/05',
  '/main/{st,m}/mix/06',
  '/main/{st,m}/grp',

  '/dca/{1-8}',
  '/dca/{1-8}/config',

  '/fx/{1-8}',
  '/fx/{1-8}/source',
  '/fx/{1-8}/par',

  '/outputs/main/{01-16}',
  '/outputs/main/{01-16}/delay',

  '/outputs/aux/{01-06}',
  '/outputs/p16/{01-16}',
  '/outputs/p16/{01-16}/iQ',

  '/outputs/aes/{01-02}',
  '/outputs/rec/{01-02}',
  '/headamp/{000-127}',
];

export function * getSceneNodes() : Iterable<string> {
  for (const pattern of nodes) {
    yield * expandPattern(pattern);
  }
}

function * expandPattern(pattern: string): Iterable<string> {
  const m = pattern.match(/^(.*?)\{(?:(\d+-\d+)|(.+?))}(.*)$/);

  if (!m) {
    yield pattern;
  } else if (m[2] !== undefined) {
    const [first, last] = m[2].split('-');
    const pad = first.length;
    const n = parseInt(last, 10);

    for (let i = parseInt(first, 10); i <= n; ++i) {
      yield * expandPattern(`${m[1]}${i.toString().padStart(pad, '0')}${m[4]}`);
    }
  } else {
    for (const item of m[3].split(/,/g)) {
      yield * expandPattern(`${m[1]}${item}${m[4]}`);
    }
  }
}
