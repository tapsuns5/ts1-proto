import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Label from './Label';
import { LabelProps } from './Label.types';
import { act } from 'react-dom/test-utils';
import { TooltipProvider } from '../Tooltip/Tooltip';

describe('Label', () => {
  let props: LabelProps;

  it('should display children', () => {
    props = {
      children: 'My div',
      htmlFor: 'my-div',
    };
    const { getByTestId } = render(<Label {...props} />);
    const Label_component = getByTestId('label-component');
    expect(Label_component).toHaveTextContent('My div');
  });
  it('should show as required', () => {
    props = {
      children: 'My div',
      htmlFor: 'my-div',
      required: true,
    };
    const { getByTestId } = render(<Label {...props} />);
    const Label_component = getByTestId('label-component');
    expect(Label_component).toHaveTextContent('*');
  });
  it('should show help icon', () => {
    props = {
      children: 'My div',
      htmlFor: 'my-div',
      showHelpIcon: true,
    };
    const { getByTestId } = render(
      <TooltipProvider>
        <Label {...props} />
      </TooltipProvider>
    );
    const Label_component = getByTestId('label-component');
    const helpIcon = getByTestId('icon-component');
    expect(Label_component).toHaveTextContent('My div');
    expect(helpIcon).toBeInTheDocument();
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it('should allow all expected props', () => {
    // List all required props
    let propTest: LabelProps = {
      htmlFor: 'inputId',
    };
    // List all remaining options for required props and optional props
    propTest.children = '';
    propTest.required = true;
    propTest.required = false;
    propTest.srOnly = false;
    propTest.srOnly = true;
    propTest.showHelpIcon = false;
    propTest.showHelpIcon = true;
  });
});
