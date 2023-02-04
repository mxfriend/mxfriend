import { Container, Value } from '@mxfriend/oscom';
import { FxParamListConstructor } from './map';


const $map = Symbol('map');

export abstract class AbstractFx extends Container {
  private readonly [$map]: Record<number, FxParamListConstructor>;

  constructor(map: Record<number, FxParamListConstructor>) {
    super(true);
    this[$map] = map;
    this.$updateParamList = this.$updateParamList.bind(this);
  }

  $attach(prop: string | number, node: Container | Value) {
    super.$attach(prop, node);

    if (node instanceof Value && prop === 'type') {
      node.$on('local-change', this.$updateParamList);
      node.$on('remote-change', this.$updateParamList);
    }
  }

  private $updateParamList(type?: number): void {
    if (type !== undefined) {
      this.$set('par', new this[$map][type]);
    }
  }
}
