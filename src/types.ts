import React, { ReactElement } from 'react';

export interface IPlaceholders {
  loading?: string;
  chooseField?: string;
  chooseOperator?: string;
}

export interface IField {
  label?: string;
  icon?: React.ReactNode;
  name: string;
  availableOperators?: DefaultOperatorsName[];
  valueEditor?: {
    component: ReactElement;
    getValueFromEvent?: (...args: any[]) => any;
    valuePropName?: string;
  };
}

export type DefaultOperatorsName =
  | 'null'
  | 'not-null'
  | 'equal'
  | 'not-equal'
  | 'more'
  | 'less'
  | 'contain'
  | 'not-contain'
  | string;

export interface IOperatorMeta {
  label: string;
  withoutValue?: boolean;
}

export interface INamedOperatorMeta extends IOperatorMeta {
  name: string;
}

export type OperatorsMeta = { [name in DefaultOperatorsName]: IOperatorMeta };

export interface ICondition {
  label?: string;
  name: string;
  operator: DefaultOperatorsName | string;
  value?: any;
  stringify?: (value: any) => string;
}

export interface IConditionWithOperatorMeta
  extends Omit<ICondition, 'operator'> {
  operator: INamedOperatorMeta;
}
