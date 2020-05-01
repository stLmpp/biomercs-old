import { trackByFactory } from '../util/util';

export interface LabelValue<T = any> {
  label: string;
  value: T;
}

export const trackByValue = trackByFactory<LabelValue>('value');
export const trackByLabel = trackByFactory<LabelValue>('label');
