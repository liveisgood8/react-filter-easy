/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useCallback, useMemo } from 'react';
import { jsx } from '@emotion/react';
import ConditionTag from './ConditionTag';
import ConditionInput from './ConditionInput';
import { defaultOperators, getOperatorMeta } from './operators';
import {
  ICondition,
  IConditionWithOperatorMeta,
  IField,
  IPlaceholders,
  OperatorsMeta,
} from './types';
import { defaultStyles, GetStyles, IStyles, StyleFn, StyleName } from './styles';
import { defaultTheme, ITheme } from './theme';
import { defaultPlaceholders } from './placeholders';

function validateDuplicateConditions(conditions?: ICondition[]) {
  if (!conditions) {
    return;
  }

  /* const result = conditions.filter(
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

type OperatorsFunc = (operators: OperatorsMeta) => OperatorsMeta;
type SearchThemeFunc = (theme: ITheme) => ITheme;
interface ISearchProps {
  className?: string;
  styles?: IStyles;
  theme?: ITheme | SearchThemeFunc;
  placeholders?: IPlaceholders;
  /** Fields available for creating new conditions */
  fields?: IField[];
  conditions?: ICondition[];
  operators?: OperatorsMeta | OperatorsFunc;
  onChange?: (conditions: ICondition[]) => void;
}

export const Search: React.FC<ISearchProps> = ({
  className,
  styles,
  theme,
  placeholders,
  fields,
  conditions,
  operators,
  onChange,
}) => {
  validateDuplicateConditions(conditions);

  const mergedOperators: OperatorsMeta = useMemo(() => {
    if (operators) {
      if (typeof operators === 'function') {
        return operators(defaultOperators);
      } else {
        return operators;
      }
    } else {
      return defaultOperators;
    }
  }, [operators]);

  const conditionsWithOperatorsMeta:
    | IConditionWithOperatorMeta[]
    | undefined = conditions?.map((c) => ({
      label: c.label,
      name: c.name,
      operator: getOperatorMeta(c.operator, mergedOperators),
      value: c.value,
      stringify: c.stringify,
    }));


  const mergedPlaceholders = useMemo(() => {
    return placeholders ? { ...defaultPlaceholders, ...placeholders } : defaultPlaceholders;
  }, [placeholders]);

  const mergedTheme = useMemo(() => {
    if (theme) {
      if (typeof theme === 'function') {
        return theme(defaultTheme);
      } else {
        return { ...defaultTheme, ...theme };
      }
    } else {
      return defaultTheme;
    }
  }, [theme]);

  const mergedStyles = useMemo(() => {
    if (styles) {
      return { ...defaultStyles, ...styles };
    } else {
      return defaultStyles;
    }
  }, [styles]);

  const getStyles: GetStyles = useCallback((styleName: StyleName, props?: any) => {
    const styleFunction = mergedStyles[styleName] as StyleFn;
    return styleFunction(mergedTheme, props);
  }, [mergedStyles]);

  const handleConditionClose = (condition: IConditionWithOperatorMeta) => {
    if (!conditionsWithOperatorsMeta || !onChange) {
      return;
    }

    const filteredConditions = conditionsWithOperatorsMeta
      .filter((c) => c.name !== condition.name)
      .map<ICondition>((c) => ({
        ...c,
        operator: c.operator.name,
      }));

    onChange(filteredConditions);
  };

  const handleConditionInputComplete = (
    condition: IConditionWithOperatorMeta,
  ) => {
    onChange?.([
      ...(conditions ?? []),
      {
        name: condition.name,
        operator: condition.operator.name,
        value: condition.value,
      },
    ]);
  };

  return (
    <div className={className} css={getStyles('searchStyles')}>
      {conditionsWithOperatorsMeta?.map((c, i) => (
        <ConditionTag
          key={i}
          theme={mergedTheme}
          condition={c}
          onClose={() => handleConditionClose(c)}
        />
      ))}
      <ConditionInput
        placeholders={mergedPlaceholders}
        getStyles={getStyles}
        fields={fields ?? []}
        operators={mergedOperators}
        onComplete={handleConditionInputComplete}
      />
    </div>
  );
};
