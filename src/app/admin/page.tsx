"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Icon from "@/components/Icon/Icon";
import IconButton from "@/components/IconButton/IconButton";
import LabelButton from "@/components/LabelButton/LabelButton";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import Table from "@/components/table/Table/Table";
import { useTableHelpers } from "@/components/table/Table/hooks";
import { Columns } from "@/components/table/Table/Table.types";
import { TableCellType } from "@/components/table/TableCell/TableCell.types";
import { CreateOrgDialog } from "@/components/CreateOrgDialog/CreateOrgDialog";

const TEAMSNAP_ONE_ICON =
  "data:image/svg+xml,%3csvg%20width='36'%20height='32'%20viewBox='0%200%2036%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M19.0162%2015.8938C19.0162%2016.572%2019.1234%2017.227%2019.3236%2017.839H0V13.9473H19.3222C19.1234%2014.5607%2019.0162%2015.2143%2019.0162%2015.8938Z'%20fill='%23FF6900'/%3e%3cpath%20d='M35.7333%2013.9473V17.839H31.3032C31.502%2017.227%2031.6092%2016.572%2031.6092%2015.8938C31.6092%2015.2157%2031.502%2014.5607%2031.3032%2013.9473H35.7333Z'%20fill='%23FF6900'/%3e%3cpath%20d='M21.6116%2020.9878L11.534%2028.3094L7.70557%2026.2821L19.3236%2017.8408C19.7373%2019.1178%2020.5491%2020.2157%2021.6116%2020.9878Z'%20fill='%23FF6900'/%3e%3cpath%20d='M35.1377%2011.1607L31.3031%2013.9474H31.3017C30.888%2012.67%2030.0776%2011.5725%2029.0137%2010.7999L33.4971%207.54102L35.1377%2011.1607Z'%20fill='%23FF6900'/%3e%3cpath%20d='M31.0649%204.48631L29.0139%2010.7983C27.9764%2010.0436%2026.6967%209.59595%2025.3135%209.59595L27.7809%201.99902L31.0649%204.48584V4.48631Z'%20fill='%23FF6900'/%3e%3cpath%20d='M25.3122%209.59639C23.929%209.59639%2022.6507%2010.0422%2021.6118%2010.7987H21.6103L18.1025%200H22.1945L25.3122%209.59639Z'%20fill='%23FF6900'/%3e%3cpath%20d='M31.0648%2027.3012L27.7809%2029.7861L25.312%2022.1896C26.6952%2022.1896%2027.9736%2021.7438%2029.0125%2020.9873H29.0139L31.0648%2027.3012Z'%20fill='%23FF6900'/%3e%3cpath%20d='M21.6102%2010.7982C20.5481%2011.5737%2019.7373%2012.6711%2019.3236%2013.9471H19.3222L7.70557%205.50584L11.534%203.47852L21.6097%2010.7987L21.6102%2010.7982Z'%20fill='%23FF6900'/%3e%3cpath%20d='M35.1377%2020.627L33.4971%2024.2453L29.0137%2020.9878C30.0757%2020.2138%2030.888%2019.1178%2031.3017%2017.8408L35.1377%2020.6275V20.627Z'%20fill='%23FF6900'/%3e%3cpath%20d='M25.3122%2022.1896C23.929%2022.1896%2022.6507%2021.7438%2021.6118%2020.9873L18.1025%2031.7855H22.1945L25.3122%2022.1892V22.1896Z'%20fill='%23FF6900'/%3e%3c/svg%3e";

interface Organization {
  id: string;
  orgName: string;
  orgId: string;
  legacyOrgId: string;
  legacyOrgType: string;
  migrationStage: string;
  orgCreated: string;
  productUuid: string;
  staffEmail: string;
  staffName: string;
}

const columns: Columns = {
  orgName: {
    label: "Org Name",
    align: "left",
    headerProps: {
      className: "sui-bg-neutral-background-weak sui-min-w-[250px]",
    },
    getBodyProps: (row) => ({
      type: TableCellType.Text,
      text: row.orgName,
      className: "sui-min-w-[250px]",
    }),
  },
  orgId: {
    label: "Org ID",
    align: "left",
    headerProps: {
      className: "sui-bg-neutral-background-weak sui-min-w-[80px]",
    },
    getBodyProps: (row) => ({
      type: TableCellType.Text,
      text: row.orgId,
      className: "sui-min-w-[80px]",
    }),
  },
  legacyOrgId: {
    label: "Legacy Org ID",
    align: "left",
    headerProps: {
      className: "sui-bg-neutral-background-weak sui-min-w-[200px]",
    },
    getBodyProps: (row) => ({
      type: TableCellType.Text,
      text: row.legacyOrgId,
      className: "sui-min-w-[200px]",
    }),
  },
  legacyOrgType: {
    label: "Legacy Org Type",
    align: "left",
    headerProps: {
      className: "sui-bg-neutral-background-weak sui-min-w-[100px]",
    },
    getBodyProps: (row) => ({
      type: TableCellType.Text,
      text: row.legacyOrgType,
      className: "sui-min-w-[100px]",
    }),
  },
  migrationStage: {
    label: "Migration Stage",
    align: "left",
    headerProps: {
      className: "sui-bg-neutral-background-weak sui-min-w-[120px]",
    },
    getBodyProps: (row) => ({
      type: TableCellType.Text,
      text: row.migrationStage,
      className: "sui-min-w-[120px]",
    }),
  },
  orgCreated: {
    label: "Org Created",
    align: "left",
    headerProps: {
      className: "sui-bg-neutral-background-weak sui-min-w-[150px]",
    },
    getBodyProps: (row) => ({
      type: TableCellType.Text,
      text: row.orgCreated,
      className: "sui-min-w-[150px]",
    }),
  },
  productUuid: {
    label: "Product UUID",
    align: "left",
    headerProps: {
      className: "sui-bg-neutral-background-weak sui-min-w-[350px]",
    },
    getBodyProps: (row) => ({
      type: TableCellType.Text,
      text: row.productUuid,
      className: "sui-min-w-[350px]",
    }),
  },
  staffEmail: {
    label: "Staff Email",
    align: "left",
    headerProps: {
      className: "sui-bg-neutral-background-weak sui-min-w-[200px]",
    },
    getBodyProps: (row) => ({
      type: TableCellType.Text,
      text: row.staffEmail,
      className: "sui-min-w-[200px]",
    }),
  },
  staffName: {
    label: "Staff Name",
    align: "left",
    headerProps: {
      className: "sui-bg-neutral-background-weak sui-min-w-[200px]",
    },
    getBodyProps: (row) => ({
      type: TableCellType.Text,
      text: row.staffName,
      className: "sui-min-w-[200px]",
    }),
  },
  actions: {
    label: "",
    align: "center",
    headerProps: {
      className: "sui-bg-neutral-background-weak sui-basis-[112px] sui-min-w-[112px]",
    },
    getBodyProps: () => ({
      type: TableCellType.Text,
      text: "",
      className: "sui-basis-[112px] sui-min-w-[112px]",
    }),
  },
};

const organizations: Organization[] = [];

export default function AdminPage() {
  const [query, setQuery] = useState("");
  const [includeTestOrgs, setIncludeTestOrgs] = useState(true);
  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false);

  const { headerRow } = useTableHelpers({
    data: organizations,
    columns,
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Search query:", query);
  };

  const handleCreateOrg = (data: any) => {
    console.log("Creating organization:", data);
    setIsCreateOrgDialogOpen(false);
  };

  const internalTestOrgCount = 0;

  return (
    <div id="root">
      <div
        role="region"
        aria-label="Notifications (F8)"
        tabIndex={-1}
        style={{ pointerEvents: "none" }}
      >
        <ol
          tabIndex={-1}
          className="sui-fixed sui-z-[1001] sui-flex sui-w-full sui-flex-col sui-p-2 sui-max-w-[478px] [top:0] [right:0] [&>li]:[top:12px] [&>li]:[scale:0.96] [&>li:nth-last-child(2)]:[top:20px] [&>li:nth-last-child(2)]:[scale:0.98] [&>li:last-child]:[top:28px] [&>li:last-child]:[scale:1]"
        />
      </div>

      <div className="sui-flex sui-flex-col sui-gap-4 md:sui-p-4 sui-w-full">
        <div className="sui-flex sui-flex-col">
          <h1 className="sui-text-heading-sm sui-flex sui-items-center sui-font-bold">
            <LabelButton
              asChild
              variantType="primary"
              data-testid="home-button"
              aria-label="Go to Home"
            >
              <a href="/" data-discover="true">
                Home
              </a>
            </LabelButton>
            <Icon name="chevron_right" size="default" />
            <a
              href="https://admin.teamsnap.com"
              className="hover:sui-text-blue-6"
            >
              All Tools
            </a>
            <Icon name="chevron_right" size="default" />
            <img
              className="sui-w-[20px] sui-h-[20px] sui-object-contain sui-mr-1"
              alt="TeamSnap One Icon"
              src={TEAMSNAP_ONE_ICON}
            />
            TeamSnap One (Fusion) Organizations
            <IconButton
              icon="swap_horiz"
              size="compact"
              aria-label="Switch to TSB Organizations"
              title="Switch to TSB Organizations"
              className="sui-ml-1"
            />
          </h1>

          <div className="sui-flex sui-justify-between sui-items-end sui-gap-2 sui-mt-4 sui-mb-2">
            <div className="sui-flex sui-flex-col sui-flex-grow">
              <form
                className="sui-flex sui-w-full sui-gap-2"
                noValidate
                onSubmit={handleSearch}
              >
                <div className="sui-flex-grow sui-relative">
                  <Input
                    name="query"
                    type="text"
                    leftIcon="search"
                    placeholder="Search by Org ID, Product UUID, Org Name, Staff Last Name, or Staff Email."
                    value={query}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    className="sui-w-full"
                  />
                </div>
                <LabelButton
                  type="submit"
                  variantType="primary"
                  labelText="Search"
                  data-testid="search-button"
                />
              </form>
            </div>
            <LabelButton
              variantType="primary"
              labelText="+ Create organization"
              onClick={() => setIsCreateOrgDialogOpen(true)}
            />
          </div>

          <div className="sui-flex sui-items-center sui-gap-1">
            <input
              id="includeTestOrgs"
              className="sui-checkbox sui-cursor-pointer"
              type="checkbox"
              checked={includeTestOrgs}
              onChange={(e) => setIncludeTestOrgs(e.target.checked)}
            />
            <Label
              htmlFor="includeTestOrgs"
              className="sui-cursor-pointer sui-mt-0.5 sui-mb-0"
            >
              Include Internal Test Orgs ({internalTestOrgCount})
            </Label>
          </div>
        </div>

        <div className="sui-overflow-x-auto">
          <section
            className="sui-rounded-2xl md:sui-rounded-3xl sui-border sui-border-neutral-border sui-bg-neutral-background sui-pb-2 sui-w-full"
            data-testid="table-container"
          >
            <header
              className="sui-flex sui-flex-col md:sui-flex-row sui-items-end md:sui-items-center"
              data-testid="table-container-header"
              title="Organizations Summary"
            >
              <div className="sui-heading-sm sui-p-0.5">&nbsp;</div>
            </header>
            <div className="sui-flex" data-testid="table-scroll-wrapper">
              <div className="sui-overflow-x-auto sui-flex-1 sui-w-1">
                <Table
                  headerRow={headerRow}
                  rows={[]}
                  emptyLabel="No organizations found"
                  stickyLastColumn
                  className="sui-w-full"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <CreateOrgDialog
        open={isCreateOrgDialogOpen}
        onOpenChange={setIsCreateOrgDialogOpen}
        onCreate={handleCreateOrg}
      />
    </div>
  );
}
