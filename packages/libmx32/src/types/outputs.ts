import { Bool, RawEnumValue } from '@mxfriend/common';
import {
  Collection,
  Container,
  Enum,
  EnumValue,
  IntValue,
  Property,
  Value,
} from '@mxfriend/oscom';
import {
  OutputSource,
  OutputPos,
  iQGroup,
  iQSpeaker,
  iQEQ,
  iQModelMap,
} from './enums';
import { Delay } from './misc';


export class iQSettings extends Container {
  @Enum(iQGroup) group: EnumValue<iQGroup>;
  @Enum(iQSpeaker) speaker: EnumValue<iQSpeaker>;
  @Enum(iQEQ) eq: EnumValue<iQEQ>;
  @Property model: IntValue;

  constructor() {
    super(true);
    this.$updateModel = this.$updateModel.bind(this);
  }

  $attach(prop: string | number, node: Container | Value) {
    super.$attach(prop, node);

    if (node instanceof Value && prop === 'speaker') {
      node.$on('local-change', this.$updateModel);
      node.$on('remote-change', this.$updateModel);
    }
  }

  private $updateModel(speaker?: iQSpeaker): void {
    if (speaker !== undefined) {
      this.$set('model', speaker !== 0 ? new EnumValue(iQModelMap[speaker]) : new IntValue());
    }
  }
}


export class Output extends Container {
  @Property src: RawEnumValue<OutputSource>;
  @Enum(OutputPos) pos: EnumValue<OutputPos>;

  constructor() {
    super(true);
  }
}

export class OutputWithInvert extends Output {
  @Enum(Bool) invert: EnumValue<Bool>;
}

export class OutputWithDelay extends OutputWithInvert {
  @Property delay: Delay;
}

export class P16Output extends OutputWithInvert {
  @Property iQ: iQSettings;
}


export class MainOutputList extends Collection<OutputWithDelay> {
  constructor() {
    super(() => new OutputWithDelay(), { size: 16, pad: 2 });
  }
}

export class AuxOutputList extends Collection<OutputWithInvert> {
  constructor() {
    super(() => new OutputWithInvert(), { size: 6, pad: 2 });
  }
}

export class P16OutputList extends Collection<P16Output> {
  constructor() {
    super(() => new P16Output(), { size: 16, pad: 2 });
  }
}

export class AESOutputList extends Collection<OutputWithInvert> {
  constructor() {
    super(() => new OutputWithInvert(), { size: 2, pad: 2 });
  }
}

export class RecordOutputList extends Collection<Output> {
  constructor() {
    super(() => new Output(), { size: 2, pad: 2 });
  }
}

export class Outputs extends Container {
  @Property main: MainOutputList;
  @Property aux: AuxOutputList;
  @Property p16: P16OutputList;
  @Property aes: AESOutputList;
  @Property rec: RecordOutputList;
}
