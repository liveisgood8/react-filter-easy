import { ReactComponent as SizeIcon } from './size.svg';
import { ReactComponent as ColorIcon } from './color-palette.svg';
import { ReactComponent as PriceIcon } from './dollar.svg';
import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import Search, { IField, ICondition } from '../src';

export default {
  title: 'ReactFilterEasy',
  component: Search,
} as Meta;

const fields: IField[] = [{
  label: 'Size',
  name: 'size',
  icon: <SizeIcon />,
  valueEditor: {
    component: <input />,
  },
}, {
  label: 'Color',
  name: 'color',
  icon: <ColorIcon />,
  valueEditor: {
    component: <input />,
  },
}, {
  label: 'Price',
  name: 'price',
  icon: <PriceIcon />,
  valueEditor: {
    component: <input />,
  },
}];

const conditions: ICondition[] = [{
  label: 'Price',
  name: 'price',
  operator: 'equal',
  value: '850',
}];

type Props = React.ComponentProps<typeof Search>;
const Template: Story<Props> = (args) => (
  <Search
    {...args}
  />
);

export const Default = Template.bind({});
Default.args = {
  conditions,
  fields,
} as Props;

export const CustomOperators = Template.bind({});
CustomOperators.args = {
  conditions,
  fields: [{
    name: 'field1',
    availableOperators: ['contains'],
    valueEditor: {
      component: <input />,
    },
  }, {
    name: 'field2',
    valueEditor: {
      component: <input />,
    },
  }],
  operators: (operators) => ({
    ...operators,
    'contains': {
      label: 'contains',
    },
  }),
} as Props;

export const CustomizedTheme = Template.bind({});
CustomizedTheme.args = {
  theme: (theme) => ({
    ...theme,
    tagHeight: '40px',
    colors: {
      searchBoxBorderColor: 'lightgreen',
      valueEditorBorderColor: 'green',
      conditionTagHoverColor: 'lightgreen',
    },
    spacing: {
      ...theme.spacing,
      conditions: '5px',
    },
  }),
  conditions,
  fields,
} as Props;

export const CustomizedPlaceholder = Template.bind({});
CustomizedPlaceholder.args = {
  conditions,
  fields,
  placeholders: {
    chooseField: 'Enter field name',
  },
} as Props;

export const Loading = Template.bind({});
Loading.args = {
  conditions,
  fields,
  loading: true,
} as Props;
