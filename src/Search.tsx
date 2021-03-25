import "./styles.scss";

import React from "react";
import ConditionTag from "./ConditionTag";
import ConditionInput from "./ConditionInput";
import { defaultOperators, getOperatorMeta } from "./operators";
import {
  ICondition,
  IConditionWithOperatorMeta,
  IField,
  OperatorsMeta
} from "./types";
import Input from "antd/lib/input";

function validateDuplicateConditions(conditions?: ICondition[]) {
  if (!conditions) {
    return;
  }

  /*const result = conditions.filter(
    (filterItem, i) =>
      conditions.findIndex((e) => e.name === filterItem.name) !== i
  );
  if (result.length) {
    throw new Error(
      `Duplicates not allowed in conditions array, duplicated names: ${result
        .map((r) => r.name)
        .join(",")}`
    );
  }*/
}

interface ISearchProps {
  /** Fields available for creating new conditions */
  fields: IField[];
  conditions?: ICondition[];
  operators?: OperatorsMeta;
  onChange?: (conditions?: ICondition[]) => void;
}

export const Search: React.FC<ISearchProps> = ({
  fields,
  conditions,
  operators,
  onChange
}) => {
  validateDuplicateConditions(conditions);

  const mergedOperators: OperatorsMeta = { ...defaultOperators, ...operators };
  const conditionsWithOperatorsMeta:
    | IConditionWithOperatorMeta[]
    | undefined = conditions?.map((c) => ({
    name: c.name,
    operator: getOperatorMeta(c.operator, mergedOperators),
    value: c.value,
    stringify: c.stringify
  }));

  const handleConditionClose = (condition: IConditionWithOperatorMeta) => {
    if (!conditionsWithOperatorsMeta || !onChange) {
      return;
    }

    const filteredConditions = conditionsWithOperatorsMeta
      .filter((c) => c.name !== condition.name)
      .map<ICondition>((c) => ({
        ...c,
        operator: c.operator.name
      }));

    onChange(filteredConditions);
  };

  const handleConditionInputComplete = (
    condition: IConditionWithOperatorMeta
  ) => {
    onChange?.([
      ...(conditions ?? []),
      {
        name: condition.name,
        operator: condition.operator.name,
        value: condition.value
      }
    ]);
  };

  return (
    <div className="react-search">
      {conditionsWithOperatorsMeta?.map((c, i) => (
        <ConditionTag
          key={i}
          condition={c}
          onClose={() => handleConditionClose(c)}
        />
      ))}
      <ConditionInput
        fields={fields}
        operators={mergedOperators}
        onComplete={handleConditionInputComplete}
      />
    </div>
  );
};
