import React from 'react';
import { render } from '@testing-library/react';
import InputWrapper from './InputWrapper';
import { InputWrapperProps } from './InputWrapper.types';

describe('InputWrapper', () => {
  let props: InputWrapperProps;

  it('should render component', async () => {
    // props = {
    //   type: 'text',
    //   name: 'first_name',
    //   label: 'First Name',
    // }
    // const { getByTestId } = render(<InputWrapper {...props} />)
    // const InputWrapper_component = getByTestId(`${props.name}-input`)
    // expect(InputWrapper_component).not.toBeNull()
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  // it('should allow all expected props', () => {
  //   // List all required props
  //   let propTest: InputWrapperProps = {
  //     children: '',
  //   }
  //   // List all remaining options for required props and optional props
  //   propTest.type = 'info'
  //   propTest.type = 'success'
  //   propTest.type = 'warning'
  //   propTest.type = 'error'
  //   propTest.grayed = true
  //   propTest.grayed = false
  // })
});
