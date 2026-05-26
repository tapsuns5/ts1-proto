import React from "react";
import { render, screen } from "@testing-library/react";
import PropTypes from "prop-types";
import "@testing-library/jest-dom";
import ModalContainer from "./ModalContainer";
import { ModalContainerProps } from "./ModalContainer.types";

describe("ModalContainer", () => {
  let props: ModalContainerProps;

  it("should display text", () => {
    props = {
      isOpen: true,
      children: "My div",
    };
    const { getByTestId } = render(<ModalContainer {...props} />);
    const ModalContainer_component = getByTestId("modal-container-component");
    expect(ModalContainer_component).toHaveTextContent("My div");
  });

  /**
   * WARNING: Changing options for or deleting existing props can be a breaking
   * change! Make breaking changes clear in commit notes and version numbers!
   */
  it("should allow all expected props", () => {
    // List all required props
    let propTest: ModalContainerProps = {
      children: "",
    };
    // List all remaining options for required props and optional props
    propTest.type = "info";
    propTest.type = "success";
    propTest.type = "warning";
    propTest.type = "error";
    propTest.grayed = true;
    propTest.grayed = false;
  });
});
