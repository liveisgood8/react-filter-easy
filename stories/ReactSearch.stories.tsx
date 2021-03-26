import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import Search, { IField, ICondition } from '../src';

export default {
  title: 'Interactive',
  component: Search,
} as Meta;

const fields: IField[] = [{
  label: 'Field #1',
  name: 'field1',
}, {
  label: 'Field #2',
  name: 'field2',
}];

const conditions: ICondition[] = [{
  label: 'Field #1',
  name: 'field1',
  operator: 'not-null',
}];

const Template: Story<React.ComponentProps<typeof Search>> = (args) => (
  <Search
    {...args}
  />
);

export const Default = Template.bind({});
Default.args = {
  conditions,
  fields,
};

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
};

export const CustomizedPlaceholder = Template.bind({});
CustomizedPlaceholder.args = {
  conditions,
  fields,
  placeholders: {
    chooseField: 'Enter field name',
  },
};
