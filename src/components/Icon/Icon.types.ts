/**
 * NOTE: Update Icon.test.tsx with all additions and changes!
 */
export type IconProps = {
  // Turn it to just string because we allow countless icons in the projects
  // we should decide on a better way to handle icon names in the future
  /**
   * Which icon to display
   */
  name: string;
  /**
   * Size of icon
   */
  size?: "xs" | "s" | "default" | "l" | "xl";
  /**
   * Whether icon should be filled
   */
  filled?: boolean;
  className?: string;

  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
};

/**
 * An array containing every icon we support, for easier updating while preserving type safety
 */
export const ICON_NAMES = [
  "account_balance",
  "account_circle",
  "add",
  "archive",
  "arrow_downward",
  "arrow_drop_down",
  "arrow_forward",
  "arrow_selector_tool",
  "arrow_upward",
  "attach_file",
  "attach_money",
  "bar_chart",
  "build_circle",
  "calendar_month",
  "call",
  "cached",
  "chat",
  "check",
  "check_box",
  "check_box_outline_blank",
  "check_circle",
  "chevron_left",
  "chevron_right",
  "close",
  "content_copy",
  "credit_card",
  "crop_square",
  "delete",
  "description",
  "division",
  "download",
  "drag_handle",
  "edit",
  "email",
  "expand_less",
  "expand_more",
  "feed",
  "filter_alt",
  "format_bold",
  "format_italic",
  "format_list_bulleted",
  "format_list_numbered",
  "format_size",
  "format_underline",
  "grade",
  "grid_on",
  "group",
  "home",
  "image",
  "inbox",
  "indeterminate_check_box",
  "info",
  "keyboard_backspace",
  "link",
  "location_on",
  "lock",
  "mail",
  "military_tech",
  "monetization_on",
  "more_horiz",
  "mouse",
  "notifications",
  "open_in_new",
  "person",
  "person_add",
  "person_remove",
  "photo",
  "picture_as_pdf",
  "progress_activity",
  "radio_button_checked",
  "radio_button_unchecked",
  "refresh",
  "remove",
  "report",
  "schedule",
  "search",
  "send",
  "settings",
  "share",
  "shopping_cart",
  "signature",
  "sort_by_alpha",
  "sort",
  "speed",
  "star_ellipse",
  "swap_horiz",
  "undo",
  "unfold_more",
  "upload",
  "verified_user",
  "view_week",
  "visibility",
  "visibility_off",
  "warning",
  "keyboard_arrow_left",
  "keyboard_arrow_right",
] as const;

/**
 * Every icon we support
 */
export type ListOptions = (typeof ICON_NAMES)[number];
