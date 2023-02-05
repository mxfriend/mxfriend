import { MappedValue } from '@mxfriend/common';
import { Container, ScaledValue } from '@mxfriend/oscom';

export interface StereoToolsAdapterInterface {
  getMixPanNodes(ch: Container): Iterable<ScaledValue | MappedValue>;
}
