/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import AntSelect from 'antd/lib/select';

interface ISelectItem {
  label?: React.ReactNode;
  value: string;
  data: any;
}

interface ISelectProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  open?: boolean;
  items?: ISelectItem[];
  onOpenChange?: (opened: boolean) => void;
  onChange: (item: ISelectItem) => void;
}

// TODO remove any cast from onChange

export const Select: React.FC<ISelectProps> = ({
  className,
  placeholder,
  autoFocus,
  open,
  items,
  onOpenChange,
  onChange,
}) => {
  return (
    <AntSelect
      className={className}
      autoFocus={autoFocus}
      open={open}
      onDropdownVisibleChange={onOpenChange}
      size="small"
      placeholder={placeholder}
      style={{ minWidth: '150px' }}
      optionLabelProp="value"
      onChange={(_, option) => onChange((option as any).item)}
      showSearch={true}
      filterOption={(input, option) =>
        option?.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {items?.map((e, i) => (
        <AntSelect.Option key={i} value={e.value} test="test" item={e}>
          {e.label}
        </AntSelect.Option>
      ))}
    </AntSelect>
  );
};
