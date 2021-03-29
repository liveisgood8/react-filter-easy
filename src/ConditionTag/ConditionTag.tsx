/** @jsxRuntime classic */
/** @jsx jsx */
import React, { Fragment } from 'react';
import { jsx } from '@emotion/react';
import { Tag } from '../Tag';
import { IConditionWithOperatorMeta } from '../types';
import { ITheme } from '../theme';

function fallbackStringify(value?: any) {
  return value ? value.toString() : '';
}

const getConditionElementStyles = (theme: ITheme) => ({
  'marginRight': theme.spacing.conditionInternal,
});

const getConditionTagStyles = (theme: ITheme) => ({
  'display': 'flex',
  'cursor': 'pointer',
  'height': theme.tagHeight,
  'marginRight': theme.spacing.conditions,

  '&:hover': {
    '.condition-tag__element': {
      'backgroundColor': theme.colors.conditionTagHoverColor,
    },
  },
});

interface IConditionTag {
  theme: ITheme;
  condition: IConditionWithOperatorMeta;
  onClose?: () => void;
}

export const ConditionTag: React.FC<IConditionTag> = ({
  theme,
  condition,
  onClose,
}) => {
  const conditionStringify = condition.stringify ?? fallbackStringify;

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onClose?.();
  };

  const renderTag = (className: string, label: string) => {
    return <Tag css={getConditionElementStyles(theme)} className={className}>{label}</Tag>;
  };

  const renderAsLastTag = (className: string, label: string) => {
    return (
      <Tag css={getConditionElementStyles(theme)} closable={true} onClose={handleClose} className={className}>
        {label}
      </Tag>
    );
  };

  const renderCondition = () => {
    const operatorRenderer = condition.operator.withoutValue ?
      renderAsLastTag :
      renderTag;
    const valueRenderer = condition.operator.withoutValue ?
      undefined :
      renderAsLastTag;

    return (
      <Fragment>
        {renderTag(
          'condition-tag__element',
          condition.label ?? condition.name,
        )}
        {operatorRenderer(
          'condition-tag__element',
          condition.operator.label,
        )}
        {valueRenderer &&
          valueRenderer(
            'condition-tag__element',
            conditionStringify(condition.value),
          )}
      </Fragment>
    );
  };

  return <div css={getConditionTagStyles(theme)}>{renderCondition()}</div>;
};
