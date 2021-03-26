interface IThemeColors {
  searchBoxBorderColor: string;
  valueEditorBorderColor: string;
  conditionTagHoverColor: string;
}

interface IThemeSpacing {
  conditionInternal: string; // Spacings beetwen tags inside condition
  conditions: string; // Spacing beetwen conditions
}

export interface ITheme {
  colors: IThemeColors;
  tagHeight: string;
  spacing: IThemeSpacing;
}

const colors: IThemeColors = {
  searchBoxBorderColor: 'lightgray',
  valueEditorBorderColor: 'lightgray',
  conditionTagHoverColor: 'lightgray',
};

const tagHeight = '25px';

const spacing: IThemeSpacing = {
  conditionInternal: '1px',
  conditions: '3px',
};

export const defaultTheme: ITheme = {
  colors,
  tagHeight,
  spacing,
};

