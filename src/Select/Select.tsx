import './styles.scss';

import React, { useState } from 'react';
import cn from 'classnames';
import AntSelect from 'antd/lib/select';

interface ISelectItem {
  label: string;
  value: any;
}

interface ISelectProps {
  className?: string;
  placeholder?: string;
  items?: ISelectItem[];
  onChange: (item: ISelectItem) => void;
}

// TODO remove any cast from onChange

export const Select: React.FC<ISelectProps> = ({
  className,
  placeholder,
  items,
  onChange,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <AntSelect
      className={cn('react-search__select', className)}
      autoFocus={true}
      open={open}
      onDropdownVisibleChange={setOpen}
      size="small"
      placeholder={placeholder}
      style={{ minWidth: '150px' }}
      onChange={(_, option) => onChange((option as any).item)}
      showSearch={true}
      filterOption={(input, option) =>
        option?.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {items?.map((e, i) => (
        <AntSelect.Option key={i} value={e.label} item={e}>
          {e.label}
        </AntSelect.Option>
      ))}
    </AntSelect>
  );
};
