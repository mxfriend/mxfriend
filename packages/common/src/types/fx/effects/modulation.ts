import { EnumValue, getLinearScale, ScaledValue, Value } from '@mxfriend/oscom';
import { getValueMap } from '../../../maps';
import { formatted, MappedValue } from '../../../oscom';
import { Bool } from '../../enums';
import { DimensionalChorusMode, MoodFilterMode, MoodFilterWave } from '../enums';
import { FxParamList } from '../fxParamList';

export class ChorusParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new MappedValue(getValueMap(0.05, 5, 101)), '.2');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 3: return formatted(new MappedValue(getValueMap(0.5, 50, 51)), '.1');
      case 4: return formatted(new MappedValue(getValueMap(0.5, 50, 51)), '.1');
      case 5: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 6: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 8: return formatted(new ScaledValue(getLinearScale(0, 180, 37)), '.0');
      case 9: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 10: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class FlangerParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new MappedValue(getValueMap(0.05, 5, 101)), '.2');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 3: return formatted(new MappedValue(getValueMap(0.5, 20, 51)), '.1');
      case 4: return formatted(new MappedValue(getValueMap(0.5, 20, 51)), '.1');
      case 5: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 6: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 8: return formatted(new ScaledValue(getLinearScale(0, 180, 37)), '.0');
      case 9: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 10: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 11: return formatted(new ScaledValue(getLinearScale(-90, 90, 37)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class StereoPitchParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(-12, 12, 25)), '.0');
      case 1: return formatted(new ScaledValue(getLinearScale(-50, 50, 101)), '.0');
      case 2: return formatted(new MappedValue(getValueMap(1, 500, 101)), '.1');
      case 3: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 4: return formatted(new MappedValue(getValueMap(2000, 20000, 51)), '.1k');
      case 5: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class DualPitchParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 5: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 11: return formatted(new MappedValue(getValueMap(2000, 20000, 51)), '.1k');
    }

    if (param < 11) {
      switch (param % 6) {
        case 0: return formatted(new ScaledValue(getLinearScale(-12, 12, 25)), '.0');
        case 1: return formatted(new ScaledValue(getLinearScale(-50, 50, 101)), '.0');
        case 2: return formatted(new MappedValue(getValueMap(1, 500, 101)), '.1');
        case 3: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
        case 4: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      }
    }

    return super.$createParam(param);
  }
}


export class PhaserParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new MappedValue(getValueMap(0.05, 5, 101)), '.2');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 80, 41)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 50, 26)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(2, 12, 11)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 6: return formatted(new ScaledValue(getLinearScale(-50, 50, 21)), '.0');
      case 7: return formatted(new ScaledValue(getLinearScale(0, 180, 37)), '.0');
      case 8: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      case 9: return formatted(new MappedValue(getValueMap(10, 1000, 51)), '.0');
      case 10: return formatted(new MappedValue(getValueMap(1, 2000, 51)), '.0');
      case 11: return formatted(new MappedValue(getValueMap(10, 1000, 51)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class RotarySpeakerParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new MappedValue(getValueMap(0.1, 4, 101)), '.2');
      case 1: return formatted(new MappedValue(getValueMap(2, 10, 101)), '.2');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 6: return new EnumValue(Bool);
      case 7: return new EnumValue(Bool);
      default: return super.$createParam(param);
    }
  }
}


export class TremoloPannerParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new MappedValue(getValueMap(0.05, 5, 101)), '.2');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 180, 37)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(-50, 50, 21)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 6: return formatted(new MappedValue(getValueMap(10, 1000, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(1, 2000, 51)), '.0');
      case 8: return formatted(new MappedValue(getValueMap(10, 1000, 51)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class MoodFilterParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new MappedValue(getValueMap(0.05, 20, 151)), '.2');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 3: return formatted(new MappedValue(getValueMap(20, 15000, 101)), '.1k');
      case 4: return new EnumValue(MoodFilterMode);
      case 5: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 6: return new EnumValue(MoodFilterWave);
      case 7: return formatted(new ScaledValue(getLinearScale(0, 180, 37)), '.0');
      case 8: return formatted(new ScaledValue(getLinearScale(-100, 100, 101)), '.0');
      case 9: return formatted(new MappedValue(getValueMap(10, 250, 51)), '.0');
      case 10: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 12: return new EnumValue(Bool);
      case 13: return new EnumValue(Bool);
      default: return super.$createParam(param);
    }
  }
}


export class DimensionalChorusParams extends FxParamList {
  protected $createParam(param: number): Value {
    if (param === 1) {
      return new EnumValue(DimensionalChorusMode);
    } else if (param < 7) {
      return new EnumValue(Bool);
    }

    return super.$createParam(param);
  }
}
