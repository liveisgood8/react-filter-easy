import { ReactElement } from "react";

export interface IField {
  label?: string;
  name: string;
  availableOperators?: DefaultOperatorsName[];
  valueEditor?: {
    component: ReactElement;
    getValueFromEvent?: (...args: any[]) => any;
    valuePropName?: string;
  };
}

type DefaultOperatorsName =
  | "null"
  | "not-null"
  | "equal"
  | "not-equal"
  | "more"
  | "less"
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
  name: string;
  operator: DefaultOperatorsName | string;
  value?: any;
  stringify?: (value: any) => string;
}

export interface IConditionWithOperatorMeta
  extends Omit<ICondition, "operator"> {
  operator: INamedOperatorMeta;
}