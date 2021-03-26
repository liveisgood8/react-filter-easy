/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useState, useMemo } from 'react';
import { jsx, css } from '@emotion/react';
import {
  IConditionWithOperatorMeta,
  IField,
  INamedOperatorMeta,
  IPlaceholders,
  OperatorsMeta,
} from '../types';
import Select from '../Select';
import { Tag } from '../Tag';
import { GetStyles, StyleFn } from '../styles';
import { ITheme } from '../theme';

export const conditionInputStyles: StyleFn = (theme) => ({
  display: 'flex',
  height: theme.tagHeight,
});

export const conditionSelectStyles = css({
  alignSelf: 'center',
});


export const conditionInputEditorStyles: StyleFn = (theme) => ({
  'height': theme.tagHeight,
  '> *': {
    height: 'inherit',
  },
});

const wrapperElementStyles = css({
  margin: '0 2px',
});
interface IConditionNameSelectProps {
  placeholders: IPlaceholders;
  fields: IField[];
  onComplete?: (field: IField) => void;
}

const ConditionNameSelect: React.FC<IConditionNameSelectProps> = ({
  placeholders,
  fields,
  onComplete,
}) => {
  return (
    <Select
      css={conditionSelectStyles}
      placeholder={placeholders.chooseField}
      items={fields.map((f) => ({
        label: f.label ?? f.name,
        value: f,
      }))}
      onChange={(item) => onComplete?.(item.value as IField)}
    />
  );
};

interface IConditionOperatorSelectProps {
  placeholders: IPlaceholders;
  operators: OperatorsMeta;
  onComplete?: (operator: INamedOperatorMeta) => void;
}

const ConditionOperatorSelect: React.FC<IConditionOperatorSelectProps> = ({
  placeholders,
  operators,
  onComplete,
}) => {
  const mappedOperators: INamedOperatorMeta[] = Object.keys(operators).map(
    (n) => ({
      name: n,
      ...operators[n],
    }),
  );

  return (
    <Select
      css={conditionSelectStyles}
      placeholder={placeholders.chooseOperator}
      items={mappedOperators.map((o) => ({
        label: o.label,
        value: o,
      }))}
      onChange={(item) => onComplete?.(item.value as INamedOperatorMeta)}
    />
  );
};

function fallbackGetValueFromEvent(e: React.ChangeEvent<HTMLInputElement>) {
  return e.currentTarget.value;
}

interface IConditionInputProps {
  theme: ITheme,
  getStyles: GetStyles;
  placeholders: IPlaceholders;
  fields: IField[];
  operators: OperatorsMeta;
  onComplete?: (condition: IConditionWithOperatorMeta) => void;
}

export const ConditionInput: React.FC<IConditionInputProps> = ({
  theme,
  getStyles,
  placeholders,
  fields,
  operators,
  onComplete,
}) => {
  const [step, setStep] = useState<'name' | 'operator' | 'value'>('name');
  const [field, setField] = useState<IField>();
  const [operator, setOperator] = useState<INamedOperatorMeta>();
  const [value, setValue] = useState<any>('');

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
      value,
    });
    setField(undefined);
    setOperator(undefined);
    setValue('');
    setStep('name');
  };

  const handleCompleteField = (selectedField: IField) => {
    setField(selectedField);
    setStep('operator');
  };

  const handleCompleteOperator = (selectedOperator: INamedOperatorMeta) => {
    if (selectedOperator.withoutValue && field) {
      handleComplete(field, selectedOperator);
    } else {
      setOperator(selectedOperator);
      setStep('value');
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && field && operator) {
      handleComplete(field, operator);
    }
  };

  const clonedValueEditor = useMemo(() => {
    if (!field || !operator || operator.withoutValue) {
      return null;
    }

    if (!field.valueEditor) {
      throw new Error(
        `Field value editor required for '${operator.name}' operator`,
      );
    }

    const mergedValuePropName = field.valueEditor.valuePropName ?? 'value';
    const mergedGetValueFromEvent =
      field.valueEditor.getValueFromEvent ?? fallbackGetValueFromEvent;

    return React.cloneElement(field.valueEditor.component, {
      [mergedValuePropName]: value,
      onChange: (args: any[]) => setValue(mergedGetValueFromEvent(args)),
      onKeyDown: handleEditorKeyDown,
      autoFocus: true,
    });
  }, [field, operator, value, setValue]);

  return (
    <div css={getStyles('conditionInputStyles')}>
      {field && (
        <Tag css={wrapperElementStyles}>
          {field.label ?? field.name}
        </Tag>
      )}
      {operator && (
        <Tag css={wrapperElementStyles}>{operator.label}</Tag>
      )}
      {step === 'name' && (
        <ConditionNameSelect
          placeholders={placeholders}
          fields={fields}
          onComplete={handleCompleteField}
        />
      )}
      {field && step === 'operator' && (
        <ConditionOperatorSelect
          placeholders={placeholders}
          operators={field.availableOperators ? getFieldOperators() : operators}
          onComplete={handleCompleteOperator}
        />
      )}
      {step === 'value' && (
        <div css={getStyles('conditionInputEditorStyles')}>
          {clonedValueEditor}
        </div>
      )}
    </div>
  );
};
