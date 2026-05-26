// import { v4 as uuidv4 } from "uuid";
import { Columns } from "../Table/Table.types";
import { TableCellProps, TableCellType } from "../TableCell/TableCell.types";
import { TableRowProps } from "../TableRow/TableRow.types";

export const CELL_TEXT: TableCellProps = {
  key: "text",
  type: TableCellType.Text,
  text: "Text",
};

export const CELL_HEADER: TableCellProps = {
  key: "header",
  type: TableCellType.Header,
  text: "Label",
};

export const CELL_TEXT_LINK: TableCellProps = {
  key: "text-link",
  type: TableCellType.TextLink,
  text: "Label",
  textlink: {
    variantType: "primary",
    href: "#",
  },
};

export const CELL_STATUS: TableCellProps = {
  key: "status",
  type: TableCellType.Status,
  text: "Label",
  state: "success",
};

export const CELL_BUTTON: TableCellProps = {
  key: "button",
  type: TableCellType.Button,
  border: true,
  sentiment: "neutral",
  onClick: () => {
    console.log("clicked");
  },
};

export const CELL_TEXT_TWO_ROW: TableCellProps = {
  key: "two-row-text",
  type: TableCellType.TwoRowText,
  height: "tall",
  text: "01/04/2024",
  caption: "Caption text goes here",
  className: "sui-items-start",
};

export const CELLS_HEADER: TableCellProps[] = [
  {
    ...CELL_HEADER,
    key: "label1-header",
    children: "Label 1",
  },
  {
    ...CELL_HEADER,
    key: "label2-header",
    children: "Label 2",
  },
  {
    ...CELL_HEADER,
    key: "label3-header",
    children: "Label 3",
  },
  {
    ...CELL_HEADER,
    key: "status-header",
    children: "Status",
  },
];

export const CELLS_HEADER_ACTIONS: TableCellProps[] = [
  ...CELLS_HEADER,
  {
    key: "header",
    type: TableCellType.Header,
    text: "Two rows",
    align: "left",
    width: "20%",
  },
  {
    key: "empty-header",
    type: TableCellType.EmptyHeader,
  },
];

export const CELLS: TableCellProps[] = [
  {
    ...CELL_TEXT,
    text: "Cell 1",
  },
  CELL_TEXT_LINK,
  {
    key: "text-2",
    type: TableCellType.Text,
    text: "Cell 3",
  },
  CELL_STATUS,
];

export const CELLS_WITH_ACTIONS: TableCellProps[] = [
  {
    ...CELL_TEXT,
    text: "Cell 1",
  },
  CELL_TEXT_LINK,
  {
    key: "text",
    type: TableCellType.Text,
    text: "Cell 3",
  },
  {
    ...CELL_STATUS,
    height: "tall",
    statusAction: {
      text: "Verify account",
      onClick: () => {
        console.log("clicked");
      },
    },
  },
  { ...CELL_TEXT_TWO_ROW, align: "left", width: "20%" },
  CELL_BUTTON,
];

export const CELLS_WITH_ACTIONS_2: TableCellProps[] = [
  {
    ...CELL_TEXT,
    text: "Cell 1",
  },
  CELL_TEXT_LINK,
  {
    key: "text",
    type: TableCellType.Text,
    text: "Cell 3",
  },
  CELL_STATUS,
  { ...CELL_TEXT_TWO_ROW, align: "left", width: "20%" },
  CELL_BUTTON,
];

export const getRowPropsDefault = (): TableRowProps => ({
  __id: self.crypto.randomUUID(),
  cells: CELLS,
});
export const ROW_PROPS_HEADER: TableRowProps = {
  __id: "header",
  cells: CELLS_HEADER,
};
export const ROW_PROPS_ACTIONS: TableRowProps = {
  __id: "actions",
  cells: CELLS_WITH_ACTIONS,
};
export const ROW_PROPS_ACTIONS_2: TableRowProps = {
  __id: "actions",
  cells: CELLS_WITH_ACTIONS_2,
};
export const ROW_PROPS_HEADER_ACTIONS: TableRowProps = {
  __id: "header-actions",
  cells: CELLS_HEADER_ACTIONS,
};

export const ROW_PROPS_EXPANDABLE: TableRowProps = {
  __id: self.crypto.randomUUID(),
  cells: [
    {
      ...CELL_TEXT,
      text: "Cell 1",
    },
    CELL_TEXT_LINK,
    {
      ...CELL_TEXT,
      text: "Cell 3",
    },
    CELL_STATUS,
  ],
  expandedRows: [
    [
      {
        ...CELL_TEXT,
        text: "Cell 1A",
      },
      {
        ...CELL_TEXT,
        text: "Cell 2A",
      },
      {
        ...CELL_TEXT,
        text: "Cell 3A",
      },
      { ...CELL_STATUS, text: "Failed", state: "negative" },
    ],
    [
      {
        ...CELL_TEXT,
        text: "Cell 1B",
      },
      {
        ...CELL_TEXT,
        text: "Cell 2B",
      },
      {
        ...CELL_TEXT,
        text: "Cell 3B",
      },
      {
        ...CELL_STATUS,
        text: "Success",
      },
    ],
  ],
};

export const DEMO_DATA: Record<string, any>[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    profileImg: "http://placekitten.com/200/200",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
  },
  {
    id: "3",
    name: "John Smith",
    email: "",
  },
];

export const DEMO_COLUMNS: Columns = {
  id: {
    label: "ID",
    width: "10%",
    align: "left",
    headerProps: {
      key: "header",
      type: TableCellType.Header,
      text: "ID",
    },
    getBodyProps: (data) => ({
      key: "text",
      type: TableCellType.Text,
      text: data.id,
    }),
  },
  name: {
    label: "Name",
    width: "20%",
    headerProps: {
      key: "header",
      type: TableCellType.Header,
      text: "Name",
    },
    getBodyProps: (data) => ({
      key: "text",
      type: TableCellType.Text,
      text: data.name,
    }),
  },
  email: {
    label: "Email",
    width: "20%",
    headerProps: {
      key: "header",
      type: TableCellType.Header,
      text: "Email",
    },
    getBodyProps: (data) => ({
      key: "text",
      type: TableCellType.Text,
      text: data.email,
    }),
  },
  actions: {
    label: "Actions",
    width: "5%",
    align: "right",
    headerProps: {
      key: "header",
      type: TableCellType.Header,
    },
    getBodyProps: (data) => ({
      type: TableCellType.Actions,
      align: "right",
      actions: [
        { label: "Edit", icon: "edit", onClick: () => {} },
        {
          label: "Delete",
          icon: "delete",
          onClick: () => {},
          sentiment: "negative",
        },
      ],
    }),
  },
};
