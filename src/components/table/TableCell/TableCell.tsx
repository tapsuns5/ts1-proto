import React, { useState } from "react";
import { cn } from "../../../utils";
import ActionMenu from "../../ActionMenu/ActionMenu";
import Avatar from "../../Avatar/Avatar";
import { AvatarProps } from "../../Avatar/Avatar.types";
import Checkbox from "../../Checkbox/Checkbox";
import { CheckboxProps } from "../../Checkbox/Checkbox.types";
import Icon from "../../Icon/Icon";
import Skeleton from "../../Skeleton/Skeleton";
import Status from "../../Status/Status";
import { TextLink } from "../../TextLink/TextLink";
import { type TextLinkProps } from "../../TextLink/TextLink.types";
import Tooltip from "../../Tooltip/Tooltip";
import IconButton from "../../IconButton/IconButton";
import classes from "./TableCell.module.scss";
import { TableCellProps, TableCellType } from "./TableCell.types";

/**
 * TableCell is a component used to display data in a table., it can be used as a header or a cell.
  - The type prop is used to determine the type of cell to render, this component is designed to be expanded to support more types.
  - It can also use a custom component as a cell. just use the 'custom' type and pass the component in the children prop.
  - 'checkbox' and 'accordian' types are added by the parent component TableRow, they are not meant to be used directly.
  - The props for the cells in a table wil typically be set on the `columns` config when setting up the Table component.
  */
const TableCell: React.FC<TableCellProps> = ({
  type = TableCellType.Text, // Set a default
  height = "default",
  expanded = false,
  spacer = false,
  text,
  caption,
  children,
  statusAction,
  style = {},
  icon = "more_horiz",
  className = "",
  width,
  align,
  actions = [],
  avatar = {} as AvatarProps,
  checkbox = {} as CheckboxProps,
  textlink = {} as TextLinkProps,
  sort,
  onSort,
  ascending,
  tooltip,
  loading,
  prepend,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const flexAlign = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };

  const renderTooltip = () => {
    return (
      <Tooltip open={showTooltip} content={tooltip}>
        <IconButton
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setShowTooltip(!showTooltip);
          }}
          variant="neutral"
          className="sui-p-0 sui-w-auto sui-h-auto"
          icon="info"
          size="compact"
        />
      </Tooltip>
    );
  };

  const renderHeader = () => {
    let headerTailwindAlignmentClassName;
    switch (align) {
      case "left":
        headerTailwindAlignmentClassName = "sui-justify-start";
        break;
      case "center":
        headerTailwindAlignmentClassName = "sui-justify-center";
        break;
      case "right":
        headerTailwindAlignmentClassName = "sui-justify-end";
        break;
      default:
        headerTailwindAlignmentClassName = "sui-justify-center";
        break;
    }

    const headingContainerClassNames = cn(
      `sui-relative`,
      `sui-flex`,
      `sui-flex-1`,
      `sui-items-center`,
      `sui-gap-0.5`,
      headerTailwindAlignmentClassName
    );

    return (
      <>
        {prepend ? (
          <div className="sui-w-full sui-h-full sui-flex sui-flex-col">
            <div
              className={cn(
                classes["table-cell__header-prepend"],
                headingContainerClassNames
              )}>
              {prepend} {tooltip && renderTooltip()}
            </div>
            <div
              className={headingContainerClassNames}
              {...(onSort && { onClick: onSort })}>
              {renderHeaderContent()}
            </div>
          </div>
        ) : (
          <>
            {renderHeaderContent()}
            {tooltip && !prepend && renderTooltip()}
          </>
        )}
      </>
    );
  };

  const renderHeaderContent = () => {
    return (
      <>
        {!!children ? <span>{children}</span> : <span>{text}</span>}
        {!!sort && typeof ascending !== "undefined" && (
          <Icon
            name={ascending ? "arrow_upward" : "arrow_downward"}
            className="sui-text-neutral-icon-medium"
            size="s"
          />
        )}
      </>
    );
  };

  const renderContent = () => {
    if (spacer || type === "empty-header") return null;
    switch (type) {
      case TableCellType.Custom:
        return <>{children}</>;

      case TableCellType.Header:
        return renderHeader();

      // TODO: Future deprecated cells that are going to be render through composition and as childrens
      case TableCellType.Text:
        return <>{text}</>;

      case TableCellType.Accordian:
        return <Icon name={expanded ? "expand_less" : "expand_more"} />;

      case TableCellType.Checkbox:
      case TableCellType.CheckboxHeader:
        return <Checkbox {...checkbox} />;

      case TableCellType.Status:
        return (
          <div className={classes["two-row-inner"]}>
            <Status state={props.state || "inactive"} text={text} {...props} />
            {statusAction && (
              <TextLink
                {...(statusAction.href != null ? { href: statusAction.href } : {})}
                onClick={statusAction.onClick}
                className="sui-pt-0.5">
                {statusAction.text}
              </TextLink>
            )}
          </div>
        );

      case TableCellType.TextLink:
        return <TextLink {...textlink}>{text || textlink.children}</TextLink>;

      case TableCellType.Button:
        return <IconButton icon={icon} {...props} />;

      case TableCellType.Actions:
        return (
          <div style={{ display: "flex" }}>
            <IconButton
              icon={icon}
              variant="neutral"
              withBorder
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              size="compact"
              >
              Open
            </IconButton>
            <ActionMenu
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              actions={actions}
              align={align === "right" ? "right" : "left"}
            />
          </div>
        );

      case TableCellType.TwoRowText:
        return (
          <div className={classes["two-row-inner"]}>
            <span className="sui-body-dense sui-mb-0.5">{text}</span>
            <span className="sui-caption sui-text-neutral-text-weak">
              {caption}
            </span>
          </div>
        );

      case TableCellType.Avatar:
        return (
          <>
            <Avatar {...{ size: "small", ...avatar }} />
            {text}
          </>
        );

      default:
        return null;
    }
  };

  const cellStyle = {
    flexBasis: width || undefined,
    justifyContent:
      flexAlign[align as keyof typeof flexAlign] || flexAlign.center,
  };

  const cellProps = {
    "data-testid": "table-cell-component",
    ...props,
    style: {
      ...style,
      ...cellStyle,
    },
    ...(onSort && !prepend && { onClick: onSort }),
  };

  return (
    <div
      className={cn(
        classes["table-cell"],
        classes[type],
        classes[height],
        { [classes["expanded"]]: expanded },
        { "sui-cursor-pointer": onSort },
        "sui-body-dense",
        className
      )}
      {...cellProps}>
      {loading ? (
        <Skeleton
          data-testid="TableCell-LoadingSkeleton"
          className="sui-w-[50px]"
        />
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default TableCell;
