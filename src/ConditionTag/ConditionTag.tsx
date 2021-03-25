import "./styles.scss";

import React, { Fragment } from "react";
import { Tag } from "../Tag";
import { IConditionWithOperatorMeta } from "../types";

function fallbackStringify(value?: any) {
  return value ? value.toString() : "";
}

interface IConditionTag {
  condition: IConditionWithOperatorMeta;
  onClose?: () => void;
}

export const ConditionTag: React.FC<IConditionTag> = ({
  condition,
  onClose
}) => {
  const conditionStringify = condition.stringify ?? fallbackStringify;

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onClose?.();
  };

  const renderTag = (className: string, label: string) => {
    return <Tag className={className}>{label}</Tag>;
  };

  const renderAsLastTag = (className: string, label: string) => {
    return (
      <Tag closable={true} onClose={handleClose} className={className}>
        {label}
      </Tag>
    );
  };

  const renderCondition = () => {
    const operatorRenderer = condition.operator.withoutValue
      ? renderAsLastTag
      : renderTag;
    const valueRenderer = condition.operator.withoutValue
      ? undefined
      : renderAsLastTag;

    return (
      <Fragment>
        {renderTag(
          "condition-tag__element condition-tag__name",
          condition.name
        )}
        {operatorRenderer(
          "condition-tag__element condition-tag__operator",
          condition.operator.label
        )}
        {valueRenderer &&
          valueRenderer(
            "condition-tag__element condition-tag__value",
            conditionStringify(condition.value)
          )}
      </Fragment>
    );
  };

  return <div className="condition-tag">{renderCondition()}</div>;
};
