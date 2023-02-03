import { EnumValue, getLinearScale, ScaledValue, Value } from '@mxfriend/oscom';
import { getValueMap } from '../../../maps';
import { formatted, MappedValue } from '../../../oscom';
import { Bool } from '../../enums';
import { VintageReverbSide } from '../enums';
import { FxParamList } from '../fxParamList';


export class HallParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 1: return formatted(new MappedValue(getValueMap(0.2, 5, 51)), '.2');
      case 2: return formatted(new ScaledValue(getLinearScale(2, 100, 50)), '.0');
      case 3: return formatted(new MappedValue(getValueMap(1000, 20000, 25)), '.1k');
      case 4: return formatted(new ScaledValue(getLinearScale(1, 30, 30)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 6: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 8: return formatted(new MappedValue(getValueMap(0.5, 2, 51)), 2);
      case 9: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), '.0');
      case 10: return formatted(new ScaledValue(getLinearScale(0, 250, 51)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class ChamberParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 1: return formatted(new MappedValue(getValueMap(0.3, 29, 51)), '.2');
      case 2: return formatted(new ScaledValue(getLinearScale(4, 76, 37)), '.0');
      case 3: return formatted(new MappedValue(getValueMap(1000, 20000, 25)), '.1k');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 26)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 6: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 8: return formatted(new MappedValue(getValueMap(0.25, 4, 53)), '.2');
      case 9: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), '.0');
      case 10: return formatted(new ScaledValue(getLinearScale(0, 250, 51)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 12: return formatted(new ScaledValue(getLinearScale(0, 500, 101)), '.0');
      case 13: return formatted(new ScaledValue(getLinearScale(0, 500, 101)), '.0');
      case 14: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 15: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class RoomParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 1: return formatted(new MappedValue(getValueMap(0.3, 29, 51)), '.2');
      case 2: return formatted(new ScaledValue(getLinearScale(4, 76, 37)), '.0');
      case 3: return formatted(new MappedValue(getValueMap(1000, 20000, 25)), '.1k');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 26)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 6: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 8: return formatted(new MappedValue(getValueMap(0.25, 4, 53)), '.2');
      case 9: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), '.0');
      case 10: return formatted(new ScaledValue(getLinearScale(0, 250, 51)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 12: return formatted(new ScaledValue(getLinearScale(0, 1200, 241)), '.0');
      case 13: return formatted(new ScaledValue(getLinearScale(0, 1200, 241)), '.0');
      case 14: return formatted(new ScaledValue(getLinearScale(-100, 100, 101)), '.0');
      case 15: return formatted(new ScaledValue(getLinearScale(-100, 100, 101)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class RichPlateParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 1: return formatted(new MappedValue(getValueMap(0.3, 29, 51)), '.2');
      case 2: return formatted(new ScaledValue(getLinearScale(4, 39, 36)), '.0');
      case 3: return formatted(new MappedValue(getValueMap(1000, 20000, 25)), '.1k');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 26)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 6: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 8: return formatted(new MappedValue(getValueMap(0.25, 4, 53)), '.2');
      case 9: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), '.0');
      case 10: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      case 12: return formatted(new ScaledValue(getLinearScale(0, 1200, 241)), '.0');
      case 13: return formatted(new ScaledValue(getLinearScale(0, 1200, 241)), '.0');
      case 14: return formatted(new ScaledValue(getLinearScale(-100, 100, 101)), '.0');
      case 15: return formatted(new ScaledValue(getLinearScale(-100, 100, 101)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class PlateParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 1: return formatted(new MappedValue(getValueMap(0.5, 10, 51)), '.2');
      case 2: return formatted(new ScaledValue(getLinearScale(2, 100, 50)), '.0');
      case 3: return formatted(new MappedValue(getValueMap(1000, 20000, 25)), '.1k');
      case 4: return formatted(new ScaledValue(getLinearScale(1, 30, 30)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 6: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 8: return formatted(new MappedValue(getValueMap(0.5, 2, 51)), '.2');
      case 9: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.2');
      case 10: return formatted(new ScaledValue(getLinearScale(1, 50, 50)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(0, 100, 21)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class AmbienceParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 1: return formatted(new MappedValue(getValueMap(0.2, 7.3, 51)), '.2');
      case 2: return formatted(new ScaledValue(getLinearScale(2, 100, 50)), '.0');
      case 3: return formatted(new MappedValue(getValueMap(1000, 20000, 25)), '.1k');
      case 4: return formatted(new ScaledValue(getLinearScale(1, 30, 30)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 6: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 8: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 9: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class GatedReverbParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 1: return formatted(new ScaledValue(getLinearScale(140, 1000, 51)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 30, 31)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(1, 50, 50)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 6: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 8: return formatted(new ScaledValue(getLinearScale(-30, 0, 61)), '.1');
      case 9: return formatted(new ScaledValue(getLinearScale(1, 30, 30)), '.0');
      default: return super.$createParam(param);
    }
  }
}


export class ReverseReverbParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 1: return formatted(new MappedValue(getValueMap(140, 1000, 51)), '.0');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 50, 51)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(1, 30, 30)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 6: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 8: return formatted(new ScaledValue(getLinearScale(-30, 0, 61)), '.1');
      default: return super.$createParam(param);
    }
  }
}


export class VintageRoomParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 1: return formatted(new MappedValue(getValueMap(0.1, 20, 51)), '.2');
      case 2: return formatted(new ScaledValue(getLinearScale(2, 100, 50)), '.0');
      case 3: return formatted(new ScaledValue(getLinearScale(1, 30, 30)), '.0');
      case 4: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 5: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 6: return formatted(new MappedValue(getValueMap(0.1, 10, 51)), '.2');
      case 7: return formatted(new MappedValue(getValueMap(0.1, 10, 51)), '.2');
      case 8: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 9: return formatted(new MappedValue(getValueMap(200, 20000, 51)), '.1k');
      case 10: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 11: return formatted(new ScaledValue(getLinearScale(0, 200, 101)), '.0');
      case 12: return new EnumValue(Bool);
      default: return super.$createParam(param);
    }
  }
}


export class VintageReverbParams extends FxParamList {
  protected $createParam(param: number): Value {
    switch (param) {
      case 0: return formatted(new ScaledValue(getLinearScale(0, 120, 61)), '.0');
      case 1: return formatted(new ScaledValue(getLinearScale(0.4, 4.5, 42)), '~.1');
      case 2: return formatted(new ScaledValue(getLinearScale(0, 100, 51)), '.0');
      case 3: return new EnumValue(Bool);
      case 4: return new EnumValue(VintageReverbSide);
      case 5: return formatted(new ScaledValue(getLinearScale(-12, 12, 49)), '.1');
      case 6: return formatted(new MappedValue(getValueMap(10, 500, 51)), '.0');
      case 7: return formatted(new MappedValue(getValueMap(10000, 20000, 51)), '.1k');
      case 8: return formatted(new MappedValue(getValueMap(0.5, 2, 51)), '.2');
      case 9: return formatted(new MappedValue(getValueMap(0.25, 1, 51)), '.2');
      default: return super.$createParam(param);
    }
  }
}
