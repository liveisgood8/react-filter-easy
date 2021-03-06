/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useState, useMemo, useEffect } from 'react';
import { jsx, css } from '@emotion/react';
import {
  IConditionWithOperatorMeta,
  IField,
  INamedOperatorMeta,
  IPlaceholders,
  OperatorsMeta,
} from '../types';
import { Tag } from '../Tag';
import { GetStyles, StyleFn } from '../styles';
import { AutoComplete } from '../AutoComplete';

export const conditionInputStyles: StyleFn = (theme) => ({
  display: 'flex',
  flexGrow: 1,
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

const nameSelectItemStyles = css({
  display: 'flex',
  alignItems: 'center',
});

const nameSelectIconStyles = css({
  width: '20px',
  height: '20px',
  marginRight: '8px',
});

interface IConditionNameSelectProps {
  autoFocus?: boolean;
  placeholders: IPlaceholders;
  fields: IField[];
  onComplete?: (field: IField) => void;
}

const ConditionNameSelect: React.FC<IConditionNameSelectProps> = ({
  autoFocus,
  placeholders,
  fields,
  onComplete,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (autoFocus) {
      setOpen(true);
    }
  }, [autoFocus]);

  const getFieldLabel = (field: IField) => {
    return (
      <div css={nameSelectItemStyles}>
        {field.icon && (
          <div css={nameSelectIconStyles}>
            {field.icon}
          </div>
        )}
        <span>{field.label ?? field.name}</span>
      </div>
    );
  };

  return (
    <AutoComplete
      autoFocus={autoFocus}
      css={conditionSelectStyles}
      open={open}
      placeholder={placeholders.chooseField}
      options={fields.map((f) => ({
        label: getFieldLabel(f),
        value: f.label ?? f.name,
        data: f,
      }))}
      onOpen={setOpen}
      onChange={(option) => onComplete?.(option.data)}
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
  const [open, setOpen] = useState(true);
  const mappedOperators: INamedOperatorMeta[] = Object.keys(operators).map(
    (n) => ({
      name: n,
      ...operators[n],
    }),
  );

  return (
    <AutoComplete
      autoFocus={true}
      css={conditionSelectStyles}
      open={open}
      placeholder={placeholders.chooseOperator}
      options={mappedOperators.map((o) => ({
        label: <span>{o.label}</span>,
        value: o.label,
        data: o,
      }))}
      onOpen={setOpen}
      onChange={(option) => onComplete?.(option.data)}
    />
  );
};

function fallbackGetValueFromEvent(e: React.ChangeEvent<HTMLInputElement>) {
  return e.currentTarget.value;
}

interface IConditionInputProps {
  getStyles: GetStyles;
  placeholders: IPlaceholders;
  fields: IField[];
  operators: OperatorsMeta;
  onComplete?: (condition: IConditionWithOperatorMeta) => void;
}

export const ConditionInput: React.FC<IConditionInputProps> = ({
  getStyles,
  placeholders,
  fields,
  operators,
  onComplete,
}) => {
  const [autoFocusFieldSelect, setAutoFocusFieldSelect] = useState(false);
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

  const reset = (focusFieldSelect?: boolean) => {
    setField(undefined);
    setOperator(undefined);
    setValue('');
    setStep('name');
    setAutoFocusFieldSelect(!!focusFieldSelect);
  };

  const handleComplete = (field: IField, operator: INamedOperatorMeta) => {
    onComplete?.({
      name: field.name,
      label: field.label,
      operator: operator,
      value,
    });
    reset(true);
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

  const handleEditorBlur = () => {
    if (field && operator) {
      handleComplete(field, operator);
      setAutoFocusFieldSelect(false);
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
      onBlur: handleEditorBlur,
      autoFocus: true,
    });
  }, [field, operator, value, setValue]);

  return (
    <div css={getStyles('conditionInputStyles')}>
      {field && (
        <Tag
          css={wrapperElementStyles}
          closable={!operator}
          onClose={() => reset()}
        >
          {field.label ?? field.name}
        </Tag>
      )}
      {operator && (
        <Tag
          css={wrapperElementStyles}
          closable={true}
          onClose={() => reset()}
        >
          {operator.label}
        </Tag>
      )}
      {step === 'name' && (
        <ConditionNameSelect
          autoFocus={autoFocusFieldSelect}
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
