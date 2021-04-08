/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import AntAutoComplete from 'antd/lib/auto-complete';
import { ClassNames, css, jsx } from '@emotion/react';

interface IAutoCompleteOption<T> {
  label: React.ReactElement;
  value: string;
  data: T;
}

interface IAutoCompleteProps<T> {
  options: IAutoCompleteOption<T>[];
  autoFocus?: boolean;
  placeholder?: string;
  open?: boolean;
  onOpen?: (opened: boolean) => void;
  onChange?: (option: IAutoCompleteOption<T>) => void;
}

const style = css({
  'width': '100%',
  '.ant-select-selector': {
    height: '100% !important',
    display: 'flex',
    alignItems: 'center',
    border: 'none !important',
    boxShadow: 'none !important',
  },
});

export function AutoComplete<T>({
  options,
  autoFocus,
  placeholder,
  open,
  onOpen,
  onChange,
}: IAutoCompleteProps<T>): JSX.Element {
  const handleChange = (_: any, option: any) => {
    onChange?.(option);
  };

  return (
    <ClassNames>
      {({ css }) => (
        <AntAutoComplete
          css={style}
          size="small"
          dropdownClassName={css({
            'width': 'auto !important',
            'minWidth': '200px !important',
          })}
          autoFocus={autoFocus}
          placeholder={placeholder}
          open={open}
          filterOption={(inputValue, option) =>
            option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onDropdownVisibleChange={onOpen}
          onSelect={handleChange}
        >
          {options.map((o) => (
            <AntAutoComplete.Option key={o.value} value={o.value} data={o.data}>
              {o.label}
            </AntAutoComplete.Option>
          ))}
        </AntAutoComplete>
      )}
    </ClassNames>

  );
};
