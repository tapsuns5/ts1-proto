import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Status from './Status';
import { StatusProps } from './Status.types';

describe('Status', () => {
  let props: StatusProps;

  it('should display children', () => {
    const { getByTestId } = render(
      <Status testId='status-component' state='success' text='Good Job' />
    );

    const Status_component = getByTestId('status-component');
    expect(Status_component).toHaveTextContent('Good Job');
  });
});
