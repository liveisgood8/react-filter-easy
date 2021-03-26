import { Story, Meta } from '@storybook/react/types-6-0';
import React from 'react';

import Search from '../src';

export default {
  title: 'Interactive',
  component: Search,
} as Meta;

const Template: Story<React.ComponentProps<typeof Search>> = (args) => (
  <Search
    {...args}
  />
);

const Default = Template.bind({});
Default.args = {
  fields: [{
    label: 'Field #1',
    name: 'field1',
  }, {
    label: 'Field #2',
    name: 'field2',
  }],
};
