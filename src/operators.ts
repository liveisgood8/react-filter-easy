import { INamedOperatorMeta, OperatorsMeta } from './types';

export const defaultOperators: OperatorsMeta = {
  'null': {
    label: 'null',
    withoutValue: true,
  },
  'not-null': {
    label: 'not null',
    withoutValue: true,
  },
  'equal': {
    label: '=',
  },
  'not-equal': {
    label: '!=',
  },
  'more': {
    label: '>',
  },
  'less': {
    label: '<',
  },
  'contain': {
    label: 'contain',
  },
  'not-contain': {
    label: 'not contain',
  },
};

export function getOperatorMeta(
  operatorName: string,
  operatorsMeta: OperatorsMeta,
): INamedOperatorMeta {
  const meta = operatorsMeta[operatorName];
  if (!meta) {
    throw new Error(
      `Meta is not founded for operator with name: ${operatorName}`,
    );
  }
  return {
    name: operatorName,
    ...meta,
  };
}
