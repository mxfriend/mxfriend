import { EnumValue, getLinearScale, ScaledValue, Value } from '@mxfriend/oscom';
import { getValueMap } from '../../../maps';
import { formatted, MappedValue } from '../../../oscom';
import { Bool } from '../../enums';
import {
  DelayFactor,
  FeedbackMode,
  ModulationDelaySetup,
  ModulationDelayType,
  SimpleDelayFactor,
} from '../enums';
import { FxParamList } from '../fxParamList';


export class ModulationDelayParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(1, 3000, 3000)), '.0');
      case 1: return new EnumValue(SimpleDelayFactor);
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 3: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 4: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 5: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 6: return formatted(new MappedValue(getValueMap(0.05, 10, 101)), '.2');
      case 7: return new EnumValue(ModulationDelaySetup);
      case 8: return new EnumValue(ModulationDelayType);
      case 9: return formatted(new ScaledValue(getLinearScale(1, 10, 19)), '.1');
      case 10: return formatted(new MappedValue(getValueMap(1000, 20000, 51)), '.1k');
      case 11: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      case 12: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class StereoDelayParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 1: return formatted(new ScaledValue(getLinearScale(1, 3000, 3000)), '.0');
      case 2: return new EnumValue(FeedbackMode);
      case 3: return new EnumValue(DelayFactor);
      case 4: return new EnumValue(DelayFactor);
      case 5: return formatted(new ScaledValue(getLinearScale(-100, 100, 201)), '.0');
      case 6: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 8: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 9: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 10: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 11: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      default: return super.$createParam(param);
    }
  }
}


export class ThreeTapDelayParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(1, 3000, 3000)), '.0');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 4: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 5: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 6: return new EnumValue(DelayFactor);
      case 7: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 8: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      case 9: return new EnumValue(DelayFactor);
      case 10: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(-100, 100, 41)), '.0');
      case 12: return new EnumValue(Bool);
      case 13: return new EnumValue(Bool);
      case 14: return new EnumValue(Bool);
      default: return super.$createParam(param);
    }
  }
}


export class FourTapDelayParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(1, 3000, 3000)), '.0');
      case 1: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 3: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 4: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 5: return formatted(new ScaledValue(getLinearScale(0, 6, 7)), '.0');
      case 6: return new EnumValue(DelayFactor);
      case 7: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 8: return new EnumValue(DelayFactor);
      case 9: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 10: return new EnumValue(DelayFactor);
      case 11: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 12: return new EnumValue(Bool);
      case 13: return new EnumValue(Bool);
      case 14: return new EnumValue(Bool);
      default: return super.$createParam(param);
    }
  }
}
