import { Bool, MappedValue } from '@mxfriend/common';
import { Container, EnumValue, ScaledValue, Value } from '@mxfriend/oscom';

export interface StereoLinkAdapterInterface {
  getLinkPreferenceNodes(): Iterable<EnumValue<Bool>>;
  getNativeLinks(): Iterable<[ch1: Container, ch2: Container, state: EnumValue<Bool>]>;
  isChannelLinkable(ch1: Container, ch2?: Container): boolean;
  getLinkableValuePairs(ch1: Container, ch2: Container): Iterable<[Value, Value]>;
  getNodesWhichShouldTriggerRelinking(ch: Container): Iterable<Value>;
  getMixPanNodes(ch: Container): Iterable<ScaledValue | MappedValue>;
}
