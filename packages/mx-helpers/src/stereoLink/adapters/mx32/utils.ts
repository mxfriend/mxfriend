import { Mixer } from '@mxfriend/libmx32';
import { Node } from '@mxfriend/oscom';

const excluded: RegExp[] = [
  /\/(gate|dyn)\/keysrc$/,
  /\/mix(?:\/\d+)?\/pan$/,
];

const includePatterns = {
  hadly: [
    /\/config\/(color|icon)$/,
    /\/preamp\/[^\/]+$/,
    /\/delay\/[^\/]+$/,
    /^\/headamp\//,
  ],
  eq: [
    /\/eq\//,
  ],
  dyn: [
    /\/gate\//,
    /\/dyn\//,
  ],
  fdrmute: [
    /\/mix\/(?!\d)/,
  ],
  always: [
    /^\/-stat\/solosw\//,
    /\/insert\/(on|pos)$/,
    /\/grp\//,
    /\/automix\//,
    /\/mix\/\d+\//,
  ],
};

export type LinkableChecker = (node: Node) => boolean;

export function getLinkabilityChecker(mixer: Mixer): LinkableChecker {
  const included: RegExp[] = [
    ...includePatterns.always,
  ];

  for (const option of ['hadly', 'eq', 'dyn', 'fdrmute'] as const) {
    if (mixer.config.linkcfg[option].$get()) {
      included.push(...includePatterns[option]);
    }
  }

  return (node) => !excluded.some((pattern) => pattern.test(node.$address))
    && included.some((pattern) => pattern.test(node.$address));
}
