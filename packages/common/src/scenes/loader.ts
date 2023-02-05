import { Container, Root, Value } from '@mxfriend/oscom';
import { applyToCallable, parseNodeText } from '../types';

export class SceneLoader {
  load(mixer: Root, sceneData: string): void {
    for (const args of parseSceneData(sceneData)) {
      if (args.length > 1) {
        this.apply(mixer, args);
      }
    }
  }

  private apply(mixer: Root, [address, ...args]: string[]): void {
    try {
      const node = mixer.$lookup(address);

      if (node instanceof Container) {
        applyToCallable(node, args, (child, arg) => {
          arg !== undefined && child.$fromText(arg, true);
        });
      } else if (node instanceof Value) {
        node.$fromText(args[0], true);
      }
    } catch (e) {
      console.log(`SceneLoader.apply(): error applying '${address}'`);
      console.log(...args);
      throw e;
    }
  }
}

function * parseSceneData(data: string): IterableIterator<string[]> {
  for (const line of data.trim().split(/\n/g)) {
    yield parseNodeText(line);
  }
}
