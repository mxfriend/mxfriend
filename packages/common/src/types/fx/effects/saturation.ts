import { EnumValue, getLinearScale, ScaledValue, Value } from '@mxfriend/oscom';
import { getValueMap } from '../../../maps';
import { formatted, MappedValue } from '../../../oscom';
import { Bool } from '../../enums';
import { SuboctaverRange } from '../enums';
import { FxParamList } from '../fxParamList';


export class WaveDesignerParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(-100, 100, 101)), '.0');
      case 1: return formatted(new ScaledValue(getLinearScale(-100, 100, 101)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(-24, 24, 97)), '.1');
      case 3: return formatted(new ScaledValue(getLinearScale(-100, 100, 101)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(-100, 100, 101)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-24, 24, 97)), '.1');
      default: return super.$createParam(param);
    }
  }
}


export class StereoEnhancerParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(1, 50, 50)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(1, 50, 50)), '.0');
      case 6: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 7: return formatted(new ScaledValue(getLinearScale(1, 50, 50)), '.0');
      case 8: return new EnumValue(Bool);
      default: return super.$createParam(param);
    }
  }
}


export class DualEnhancerParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param < 16 ? param % 8 : param) {
      case 0: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(1, 50, 50)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(1, 50, 50)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 6: return formatted(new ScaledValue(getLinearScale(1, 50, 50)), '.0');
      case 7: return new EnumValue(Bool);
      default: return super.$createParam(param);
    }
  }
}


export class ExciterParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new MappedValue(getValueMap(1000, 10000, 51)), '.1k');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(-50, 50, 51)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 6: return new EnumValue(Bool);
      default: return super.$createParam(param);
    }
  }
}


export class GuitarAmpParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 10, 41)), '.1');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 10, 41)), '.1');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 10, 41)), '.1');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 10, 41)), '.1');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 10, 41)), '.1');
      case 5: return formatted(new ScaledValue(getLinearScale(0, 10, 41)), '.1');
      case 6: return formatted(new ScaledValue(getLinearScale(0, 10, 41)), '.1');
      case 7: return formatted(new ScaledValue(getLinearScale(0, 10, 41)), '.1');
      case 8: return new EnumValue(Bool);
      default: return super.$createParam(param);
    }
  }
}


export class TubeStageParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 50, 26)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 50, 26)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 4: return formatted(new MappedValue(getValueMap(20, 200, 51)), '.0');
      case 5: return formatted(new MappedValue(getValueMap(4000, 20000, 51)), '.1k');
      case 6: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 7: return formatted(new MappedValue(getValueMap(50, 400, 51)), '.0');
      case 8: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 9: return formatted(new MappedValue(getValueMap(1000, 10000, 51)), '.1k');
      default: return super.$createParam(param);
    }
  }
}


export class SuboctaverParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param < 10 ? param % 5 : param) {
      case 0: return new EnumValue(Bool);
      case 1: return new EnumValue(SuboctaverRange);
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      default: return super.$createParam(param);
    }
  }
}
