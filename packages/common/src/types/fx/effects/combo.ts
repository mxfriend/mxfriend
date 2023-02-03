import { EnumValue, getLinearScale, ScaledValue, Value } from '@mxfriend/oscom';
import { getValueMap } from '../../../maps';
import { formatted, MappedValue } from '../../../oscom';
import { DelayPattern } from '../enums';
import { FxParamList } from '../fxParamList';


export class ChorusChamberParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new MappedValue(getValueMap(0.05, 4, 101)), '.2');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 2: return formatted(new MappedValue(getValueMap(0.5, 50, 51)), '.1');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 180, 37)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      case 6: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(0.1, 5, 51)), '.2');
      case 8: return formatted(new ScaledValue(getLinearScale(2, 100, 50)), '.0');
      case 9: return formatted(new MappedValue(getValueMap(1000, 20000, 51)), '.1k');
      case 10: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class FlangerChamberParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new MappedValue(getValueMap(0.05, 4, 101)), '.2');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 2: return formatted(new MappedValue(getValueMap(0.5, 20, 51)), '.1');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 180, 37)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(-90, 90, 37)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      case 6: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(0.1, 5, 51)), '.2');
      case 8: return formatted(new ScaledValue(getLinearScale(2, 100, 50)), '.0');
      case 9: return formatted(new MappedValue(getValueMap(1000, 20000, 51)), '.1k');
      case 10: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class DelayChamberParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(1, 3000, 3000)), '.0');
      case 1: return new EnumValue(DelayPattern);
      case 2: return formatted(new MappedValue(getValueMap(1000, 20000, 51)), '.1k');
      case 3: return new ScaledValue(getLinearScale(0, 100, 51)); // todo format?
      case 4: return new ScaledValue(getLinearScale(0, 100, 51)); // todo format?
      case 5: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      case 6: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(0.1, 5, 51)), '.2');
      case 8: return formatted(new ScaledValue(getLinearScale(2, 100, 50)), '.0');
      case 9: return formatted(new MappedValue(getValueMap(1000, 20000, 51)), '.1k');
      case 10: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class DelayChorusParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(1, 3000, 3000)), '.0');
      case 1: return new EnumValue(DelayPattern);
      case 2: return formatted(new MappedValue(getValueMap(1000, 20000, 51)), '.1k');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      case 6: return formatted(new MappedValue(getValueMap(0.05, 4, 101)), '.2');
      case 7: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 8: return formatted(new MappedValue(getValueMap(0.5, 50, 51)), '.1');
      case 9: return formatted(new ScaledValue(getLinearScale(0, 180, 37)), '.0');
      case 10: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class DelayFlangerParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(1, 3000, 3000)), '.0');
      case 1: return new EnumValue(DelayPattern);
      case 2: return formatted(new MappedValue(getValueMap(1000, 20000, 51)), '.1k');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      case 6: return formatted(new MappedValue(getValueMap(0.05, 4, 101)), '.2');
      case 7: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 8: return formatted(new MappedValue(getValueMap(0.5, 20, 51)), '.1');
      case 9: return formatted(new ScaledValue(getLinearScale(0, 180, 37)), '.0');
      case 10: return formatted(new ScaledValue(getLinearScale(-90, 90, 37)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      default: return super.$createParam(param);
    }
  }
}
