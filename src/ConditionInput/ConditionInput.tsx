import "./styles.scss";

import React, { useState, useMemo } from "react";
import {
  IConditionWithOperatorMeta,
  IField,
  INamedOperatorMeta,
  IOperatorMeta,
  OperatorsMeta
} from "../types";
import Select from "../Select";
import { Tag } from "../Tag";

interface IConditionNameSelectProps {
  fields: IField[];
  onComplete?: (field: IField) => void;
}

const ConditionNameSelect: React.FC<IConditionNameSelectProps> = ({
  fields,
  onComplete
}) => {
  return (
    <Select
      className="react-search__condition-input"
      placeholder="Поле"
      items={fields.map((f) => ({
        label: f.label ?? f.name,
        value: f
      }))}
      onChange={(item) => onComplete?.(item.value as IField)}
    />
  );
};

interface IConditionOperatorSelectProps {
  operators: OperatorsMeta;
  onComplete?: (operator: INamedOperatorMeta) => void;
}

const ConditionOperatorSelect: React.FC<IConditionOperatorSelectProps> = ({
  operators,
  onComplete
}) => {
  const mappedOperators: INamedOperatorMeta[] = Object.keys(operators).map(
    (n) => ({
      name: n,
      ...operators[n]
    })
  );

  return (
    <Select
      className="react-search__condition-input"
      placeholder="Оператор"
      items={mappedOperators.map((o) => ({
        label: o.label,
        value: o
      }))}
      onChange={(item) => onComplete?.(item.value as INamedOperatorMeta)}
    />
  );
};

function fallbackGetValueFromEvent(e: React.ChangeEvent<HTMLInputElement>) {
  return e.currentTarget.value;
}

interface IConditionInputProps {
  fields: IField[];
  operators: OperatorsMeta;
  onComplete?: (condition: IConditionWithOperatorMeta) => void;
}

export const ConditionInput: React.FC<IConditionInputProps> = ({
  fields,
  operators,
  onComplete
}) => {
  const [step, setStep] = useState<"name" | "operator" | "value">("name");
  const [field, setField] = useState<IField>();
  const [operator, setOperator] = useState<INamedOperatorMeta>();
  const [value, setValue] = useState<any>("");

  const getFieldOperators = (): OperatorsMeta => {
    if (!field || !field.availableOperators) {
      return operators;
    }

    return field.availableOperators.reduce((operatorsMeta, operator) => {
      const opMeta = operators[operator];
      if (!opMeta) {
        throw new Error(`Operator meta not founded for operator: ${operator}`);
      }
      operatorsMeta[operator] = opMeta;
      return operatorsMeta;
    }, {} as OperatorsMeta);
  };

  const handleComplete = (field: IField, operator: INamedOperatorMeta) => {
    onComplete?.({
      name: field.name,
      operator: operator,
      value
    });
    setField(undefined);
    setOperator(undefined);
    setValue("");
    setStep("name");
  };

  const handleCompleteField = (selectedField: IField) => {
    setField(selectedField);
    setStep("operator");
  };

  const handleCompleteOperator = (selectedOperator: INamedOperatorMeta) => {
    if (selectedOperator.withoutValue && field) {
      handleComplete(field, selectedOperator);
    } else {
      setOperator(selectedOperator);
      setStep("value");
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && field && operator) {
      handleComplete(field, operator);
    }
  };

  const clonedValueEditor = useMemo(() => {
    if (!field || !operator || operator.withoutValue) {
      return null;
    }

    if (!field.valueEditor) {
      throw new Error(
        `Field value editor required for '${operator.name}' operator`
      );
    }

    const mergedValuePropName = field.valueEditor.valuePropName ?? "value";
    const mergedGetValueFromEvent =
      field.valueEditor.getValueFromEvent ?? fallbackGetValueFromEvent;

    return React.cloneElement(field.valueEditor.component, {
      [mergedValuePropName]: value,
      onChange: (args: any[]) => setValue(mergedGetValueFromEvent(args)),
      onKeyDown: handleEditorKeyDown,
      autoFocus: true
    });
  }, [field, operator, value, setValue]);

  return (
    <div className="condition-input-wrapper">
      {field && (
        <Tag className="condition-input-wrapper__element">
          {field.label ?? field.name}
        </Tag>
      )}
      {operator && (
        <Tag className="condition-input-wrapper__element">{operator.label}</Tag>
      )}
      {step === "name" && (
        <ConditionNameSelect fields={fields} onComplete={handleCompleteField} />
      )}
      {field && step === "operator" && (
        <ConditionOperatorSelect
          operators={field.availableOperators ? getFieldOperators() : operators}
          onComplete={handleCompleteOperator}
        />
      )}
      {step === "value" && (
        <div className="condition-input-wrapper__input-wrapper">
          {clonedValueEditor}
        </div>
      )}
    </div>
  );
};
