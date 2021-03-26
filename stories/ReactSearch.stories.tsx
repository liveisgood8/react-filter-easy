import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import Search, { IField, ICondition } from '../src';

export default {
  title: 'ReactFilterEasy',
  component: Search,
} as Meta;

const fields: IField[] = [{
  label: 'Field #1',
  name: 'field1',
  valueEditor: {
    component: <input />,
  },
}, {
  label: 'Field #2',
  name: 'field2',
  valueEditor: {
    component: <input />,
  },
}];

const conditions: ICondition[] = [{
  label: 'Field #1',
  name: 'field1',
  operator: 'not-null',
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
