import '@emotion/react';
import { InterpolationWithTheme } from '@emotion/core';
import { conditionInputStyles,
  conditionInputEditorStyles,
} from './ConditionInput/ConditionInput';
import { ITheme } from './theme';

export type StyleFn = (theme: ITheme, props?: any) => InterpolationWithTheme<any>;

export const searchStyles: StyleFn = (theme) => ({
  'border': `1px solid ${theme.colors.searchBoxBorderColor}`,
  'padding': '5px',
  'display': 'flex',
  'align-items': 'center',
  'flex-wrap': 'wrap',
});

export interface IStyles {
  searchStyles?: StyleFn;
  conditionInputStyles?: StyleFn;
  conditionInputEditorStyles?: StyleFn;
}

export type StyleName = keyof IStyles;
export type GetStyles = (name: keyof IStyles, props?: any) => InterpolationWithTheme<any>;

export const defaultStyles: IStyles = {
  searchStyles,
  conditionInputStyles,
  conditionInputEditorStyles,
};
