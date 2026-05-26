import React from 'react';
import type { StoryFn } from '@storybook/react';
import Birthdate from './Birthdate';
import type { BirthdateProps } from './Birthdate.types';
import { getBirthdateErrors } from './validation';

export default {
  title: 'Components/Birthdate',
  component: Birthdate,
  parameters: {
    componentSubtitle: 'Specialized input component for birthdate fields.',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/B9YbaCM1s3RdIe9kLCLRcu/%F0%9F%92%BB-Web-App-%E2%80%94-Base-Components?type=design&node-id=1766-18279&mode=dev',
    },
    viewport: {
      defaultViewport: 'responsive',
    },
  },
  tags: ['autodocs'],
};


const Template: StoryFn<typeof Birthdate> = (args: BirthdateProps) => <Birthdate {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'birthdate',
  required: true,
  size: 'default',
  onChange: () => {},
};

export const WithSimpleValidation = Template.bind({});
WithSimpleValidation.args = {
  name: 'birthdate-validated',
  required: true,
  size: 'default',
  validate: true,
  onChange: () => {},
};

export const WithExternalValidation = (args: BirthdateProps) => {
  const [value, setValue] = React.useState('');
  const [errors, setErrors] = React.useState<string[]>([]);
  const maxAge = 120;
  const minAge = 13;

  const onChange = (date: string) => {
    if (date) {
      const error = getBirthdateErrors(date, maxAge, minAge);
      error ? setErrors([error]) : setErrors([]);
      setValue(date);
    }
  };
  
  return <Birthdate {...{ ...args, errors, onChange, value }} />;
};
