export const createDateString = (date: Date) => {
  return date?.toLocaleDateString("en-us", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export enum ACTION {
  CLICK = "click",
}
export enum ACTION_ID {
  TODAY = "today",
  LAST_7_DAYS = "last-7-days",
  LAST_14_DAYS = "last-14-days",
  LAST_30_DAYS = "last-30-days",
  MONTH_TO_DATE = "month-to-date",
  YEAR_TO_DATE = "year-to-date",
  CUSTOM_RANGE = "custom-range",
  SINGLE = "single",
  CANCEL = "cancel",
}
export const FIXED_DATES_LIST: {
  value: Exclude<ACTION_ID, ACTION_ID.CUSTOM_RANGE | ACTION_ID.SINGLE>;
  label: string;
}[] = [
  { value: ACTION_ID.TODAY, label: "Today" },
  { value: ACTION_ID.LAST_7_DAYS, label: "Last 7 days" },
  { value: ACTION_ID.LAST_14_DAYS, label: "Last 14 days" },
  { value: ACTION_ID.LAST_30_DAYS, label: "Last 30 days" },
  { value: ACTION_ID.MONTH_TO_DATE, label: "Month to date" },
  { value: ACTION_ID.YEAR_TO_DATE, label: "Year to date" },
];

export const getDateRange = (
  date: Exclude<ACTION_ID, ACTION_ID.CUSTOM_RANGE | ACTION_ID.SINGLE>
): [Date, Date] => {
  switch (date) {
    case ACTION_ID.TODAY:
      return [new Date(), new Date()];
    case ACTION_ID.LAST_7_DAYS:
      return [
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date(),
      ];
    case ACTION_ID.LAST_14_DAYS:
      return [
        new Date(new Date().setDate(new Date().getDate() - 14)),
        new Date(),
      ];
    case ACTION_ID.LAST_30_DAYS:
      return [
        new Date(new Date().setDate(new Date().getDate() - 30)),
        new Date(),
      ];
    case ACTION_ID.MONTH_TO_DATE:
      return [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ];
    case ACTION_ID.YEAR_TO_DATE:
      return [new Date(new Date().getFullYear(), 0, 1), new Date()];
    default:
      return [new Date(), new Date()];
  }
};
