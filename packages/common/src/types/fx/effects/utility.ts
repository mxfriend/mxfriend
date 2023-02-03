import { EnumValue, getLinearScale, ScaledValue, Value } from '@mxfriend/oscom';
import { getValueMap } from '../../../maps';
import { formatted, MappedValue } from '../../../oscom';
import { Bool } from '../../enums';
import { DeEsserMode, DeEsserVoice, EdisonEX1Mode } from '../enums';
import { FxParamList } from '../fxParamList';


export class StereoImagerParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(-100, 100, 101)), '.0');
      case 1: return formatted(new ScaledValue(getLinearScale(-100, 100, 101)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(-100, 100, 101)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 12, 25)), '.1');
      case 4: return formatted(new MappedValue(getValueMap(100, 1000, 25)), '.0');
      case 5: return formatted(new MappedValue(getValueMap(1, 10, 25)), '.2');
      case 6: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      default: return super.$createParam(param);
    }
  }
}


export class DualDeEsserParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), 2);
      case 1: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), 2);
      case 2: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), 2);
      case 3: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), 2);
      case 4: return new EnumValue(DeEsserVoice);
      case 5: return new EnumValue(DeEsserVoice);
      default: return super.$createParam(param);
    }
  }
}

export class StereoDeEsserParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), 2);
      case 1: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), 2);
      case 2: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), 2);
      case 3: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), 2);
      case 4: return new EnumValue(DeEsserVoice);
      case 5: return new EnumValue(DeEsserMode);
      default: return super.$createParam(param);
    }
  }
}


export class EdisonEX1Params extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return new EnumValue(Bool);
      case 1: return new EnumValue(EdisonEX1Mode);
      case 2: return new EnumValue(EdisonEX1Mode);
      case 3: return formatted(new ScaledValue(getLinearScale(-50, 50, 51)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(-50, 50, 51)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-50, 50, 51)), '.0');
      case 6: return formatted(new ScaledValue(getLinearScale(-50, 50, 51)), '.0');
      case 7: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      default: return super.$createParam(param);
    }
  }
}
