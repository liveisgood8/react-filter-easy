import { Operator, ICondition } from "../types";

interface IStringifiedCondition {
  name: string;
  operator: string;
  value?: string;
}

const defaultOperatorString: { [operator in Operator]: string } = {
  equal: "=",
  "not-equal": "!=",
  null: "Null",
  "not-null": "Not null",
  less: "<",
  more: ">"
};

export function stringifyCondition(
  condition: ICondition
): IStringifiedCondition {
  return {
    name: condition.name,
    operator: defaultOperatorString[condition.operator],
    value: condition.value.toString()
  };
}
