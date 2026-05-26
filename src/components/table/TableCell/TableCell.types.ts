import { ActionType } from "../../ActionMenu/ActionMenu.types";
import { AvatarProps } from "../../Avatar/Avatar.types";
import { CheckboxProps } from "../../Checkbox/Checkbox.types";
import { type TextLinkProps } from "../../TextLink/TextLink.types";
import React from "react";

export enum TableCellType {
  Text = "text",
  Accordian = "accordian",
  Checkbox = "checkbox",
  TextLink = "text-link",
  Button = "button",
  Actions = "actions",
  Status = "status",
  Avatar = "avatar",
  Header = "header",
  CheckboxHeader = "checkbox-header",
  EmptyHeader = "empty-header",
  TwoRowText = "two-row-text",
  Custom = "custom",
}

/**
 * NOTE: Update TableCell.test.tsx with all additions and changes!
 */
export type TableCellProps = {
  /**
   * The key of the cell, used for sorting and filtering
   */
  key?: string;

  /**
   * The type of cell to render, headers types are used for the header row, use 'custom' to render your own component and pass it in as children
   */
  type?: TableCellType | `${TableCellType}`;

  height?: "default" | "tall";
  /**
   * Width can be specified as a css value, e.g. '100px', '50%', 'auto'. It is as the 'flex-basis' property.
   */
  width?: string;
  /**
   * align defaults to center, will be translated to flexbox property 'justify-content'
   */
  align?: "left" | "center" | "right";

  /**
   * Text is used for text, text-link, header, button, status, and two-row-text
   */
  text?: React.ReactNode;
  /**
   * caption is used for 2nd row of two-row-text
   */
  caption?: string;
  /**
   * Children go between <Component>children</Component>
   */
  children?: React.ReactNode;
  /**
   * statusAction is used for the link in status type
   */
  statusAction?: {
    text: string;
    onClick?: () => void;
    href?: string;
  };
  actions?: ActionType[];

  /**
   * for grouping props to the sub component, not the cell itself
   */
  avatar?: AvatarProps;
  textlink?: TextLinkProps;
  checkbox?: CheckboxProps;
  sort?: "alpha" | "date" | "numeric";
  onSort?: () => void;
  /**
   * The following props are passed from the TableRow component
   */
  spacer?: boolean;
  accordianState?: "default" | "expanded";

  loading?: boolean;
  /**
   * Any other props to pass along (comment this out when running tests to catch prop errors)
   */
  [x: string]: any;
};
