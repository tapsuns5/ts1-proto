import React from "react";
import { render } from "@testing-library/react";
import Select from "./Select";
import { SelectProps } from "./Select.types";

describe("Select", () => {
  it("should render component", async () => {
    const props: SelectProps = {
      name: "pet",
      label: "Pet",
      options: [
        { label: "Dog", value: "Dog" },
        { label: "Cat", value: "Cat" },
        { label: "Fish", value: "Fish" },
      ],
    };
    const { getByTestId } = render(<Select {...props} />);
    const Select_component = getByTestId(`${props.name}-input`);
    expect(Select_component).not.toBeNull();
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  // it('should allow all expected props', () => {
  //   // List all required props
  //   let propTest: InputProps = {
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

  it("should accept react-select passthrough props", () => {
    // Test that props from react-select are properly passed through
    const props: SelectProps = {
      name: "passthrough-test",
      options: ["Option 1", "Option 2"],
      // These are react-select props that should now work without manual type additions
      openMenuOnFocus: true,
      closeMenuOnSelect: false,
      menuShouldScrollIntoView: false,
      menuShouldBlockScroll: true,
    };
    const { getByTestId } = render(<Select {...props} />);
    const select_component = getByTestId(`${props.name}-input`);
    expect(select_component).not.toBeNull();
  });
});
