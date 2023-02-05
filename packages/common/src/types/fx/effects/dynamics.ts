import { EnumValue, getLinearScale, ScaledValue, Value } from '@mxfriend/oscom';
import { getValueMap } from '../../../maps';
import { formatted, MappedValue, RawEnumValue } from '../../../oscom';
import { Bool } from '../../enums';
import {
  CombinatorBandSolo,
  CombinatorMeterMode,
  CombinatorRatio,
  CombinatorXoverSlope,
  LeisureCompMode,
  UltimoCompRatio,
} from '../enums';
import { FxParamList } from '../fxParamList';


export class PrecisionLimiterParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 18, 37)), '.1');
      case 1: return formatted(new ScaledValue(getLinearScale(-18, 0, 37)), '.1');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 10, 11)), '.0');
      case 4: return formatted(new MappedValue(getValueMap(0.05, 1, 51)), '.2');
      case 5: return formatted(new MappedValue(getValueMap(20, 2000, 51)), '.0');
      case 6: return new EnumValue(Bool);
      case 7: return new EnumValue(Bool);
      default: return super.$createParam(param);
    }
  }
}


export class FairCompParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return new EnumValue(Bool);
      case 1: return formatted(new ScaledValue(getLinearScale(-20, 0, 41)), '.1');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 10, 101)), '.1');
      case 3: return formatted(new ScaledValue(getLinearScale(1, 6, 6)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-18, 6, 49)), '.1');
      case 6: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      default: return super.$createParam(param);
    }
  }
}

export class MSFairCompParams extends FairCompParams {
  protected $createParam(param: number): Value {
    return super.$createParam(param > 6 && param < 13 ? (param + 1) % 7 : param);
  }
}


export class LeisureCompParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return new EnumValue(Bool);
      case 1: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 3: return new EnumValue(LeisureCompMode);
      case 4: return formatted(new ScaledValue(getLinearScale(-18, 6, 49)), '.1');
      default: return super.$createParam(param);
    }
  }
}


export class UltimoCompParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return new EnumValue(Bool);
      case 1: return formatted(new ScaledValue(getLinearScale(-48, 0, 49)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(-48, 0, 49)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(1, 7, 61)), '.1');
      case 4: return formatted(new ScaledValue(getLinearScale(1, 7, 61)), '.1');
      case 5: return new EnumValue(UltimoCompRatio);
      default: return super.$createParam(param);
    }
  }
}


export class SoundMaxerParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param < 8 ? param % 4 : param) {
      case 0: return new EnumValue(Bool);
      case 1: return formatted(new ScaledValue(getLinearScale(0, 10, 51)), '.1');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 10, 51)), '.1');
      case 3: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      default: return super.$createParam(param);
    }
  }
}


export class CombinatorParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return new EnumValue(Bool);
      case 1: return new EnumValue(CombinatorBandSolo);
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 19, 20)), '.0');
      case 4: return formatted(new MappedValue(getValueMap(20, 3000, 51)), '.0');
      case 5: return new EnumValue(Bool);
      case 6: return formatted(new ScaledValue(getLinearScale(1, 10, 10)), '.0');
      case 7: return new EnumValue(Bool);
      case 8: return formatted(new ScaledValue(getLinearScale(-50, 50, 51)), '.0');
      case 9: return new EnumValue(CombinatorXoverSlope);
      case 10: return new EnumValue(CombinatorRatio);
      case 11: return formatted(new ScaledValue(getLinearScale(-40, 0, 81)), '.1');
      case 12: return formatted(new ScaledValue(getLinearScale(-10, 10, 41)), '.1');
      case 13: return formatted(new ScaledValue(getLinearScale(-10, 10, 41)), '.1');
      case 14: return formatted(new ScaledValue(getLinearScale(-10, 10, 41)), '.1');
      case 15: return new RawEnumValue();
      case 16: return formatted(new ScaledValue(getLinearScale(-10, 10, 41)), '.1');
      case 17: return formatted(new ScaledValue(getLinearScale(-10, 10, 41)), '.1');
      case 18: return new RawEnumValue();
      case 19: return formatted(new ScaledValue(getLinearScale(-10, 10, 41)), '.1');
      case 20: return formatted(new ScaledValue(getLinearScale(-10, 10, 41)), '.1');
      case 21: return new RawEnumValue();
      case 22: return formatted(new ScaledValue(getLinearScale(-10, 10, 41)), '.1');
      case 23: return formatted(new ScaledValue(getLinearScale(-10, 10, 41)), '.1');
      case 24: return new RawEnumValue();
      case 25: return formatted(new ScaledValue(getLinearScale(-10, 10, 41)), '.1');
      case 26: return formatted(new ScaledValue(getLinearScale(-10, 10, 41)), '.1');
      case 27: return new RawEnumValue();
      case 28: return new EnumValue(CombinatorMeterMode);
      default: return super.$createParam(param);
    }
  }
}
