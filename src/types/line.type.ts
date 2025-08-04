import { LineTypeEnum } from './line-type.enum';

export type LineType = {
  uid: string;
  type: LineTypeEnum;
  values: any[];
};
