"use client";

import { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/Dialog/Dialog";
import LabelButton from "@/components/LabelButton/LabelButton";
import Icon from "@/components/Icon/Icon";
import Input from "@/components/Input/Input";
import InputWrapper from "@/components/InputWrapper/InputWrapper";
import Select from "@/components/Select/Select";
import Checkbox from "@/components/Checkbox/Checkbox";
import {
  CollapsibleCard,
  CollapsibleCardHeader,
  CollapsibleCardContent,
} from "@/components/CollapsibleCard/CollapsibleCard";

interface CreateOrgDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateOrgFormData) => void;
}

interface CreateOrgFormData {
  name: string;
  sportId: string;
  businessType: string;
  country: string;
  timezone: string;
  isTestOrganization: boolean;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  creditCardRate: string;
  creditCardFee: string;
  achRate: string;
  achFee: string;
  rcxParentCode: string;
}

const SPORT_OPTIONS = [
  "Baseball",
  "Basketball",
  "Cheerleading",
  "Cricket",
  "Cycling",
  "Field Hockey",
  "Football",
  "Golf",
  "Gymnastics",
  "Hockey",
  "Lacrosse",
  "Rugby",
  "Soccer",
  "Softball",
  "Swimming",
  "Tennis",
  "Track & Field",
  "Volleyball",
  "Wrestling",
];

const BUSINESS_TYPE_OPTIONS = ["For-profit", "Non-profit", "Government", "Educational"];

const COUNTRY_OPTIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Mexico",
  "Brazil",
  "Japan",
  "South Korea",
  "India",
  "Singapore",
];

const TIMEZONE_OPTIONS = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "America/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

export function CreateOrgDialog({ open, onOpenChange, onCreate }: CreateOrgDialogProps) {
  const [formData, setFormData] = useState<CreateOrgFormData>({
    name: "",
    sportId: "",
    businessType: "non-profit",
    country: "United States",
    timezone: "",
    isTestOrganization: false,
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    creditCardRate: "3.5",
    creditCardFee: "1.5",
    achRate: "1.99",
    achFee: "0.99",
    rcxParentCode: "",
  });

  const [allExpanded, setAllExpanded] = useState(true);
  const [showRcxPrograms, setShowRcxPrograms] = useState(false);
  const [rcxLeague, setRcxLeague] = useState<string | null>(null);
  const [rcxError, setRcxError] = useState<string | null>(null);

  const rcxLeagues = [
    { league_id: "RCX-LEAGUE-123", child_account_id: "RCX-CHILD-456", league_name: "RCX NFL Flag" },
    { league_id: "RCX-LEAGUE-124", child_account_id: "RCX-CHILD-457", league_name: "RCX MLS Go" },
    { league_id: "RCX-LEAGUE-125", child_account_id: "RCX-CHILD-458", league_name: "RCX NBA Youth" },
    { league_id: "RCX-LEAGUE-126", child_account_id: "RCX-CHILD-459", league_name: "RCX MLB Little League" },
  ];

  const toggleAllSections = () => {
    setAllExpanded(!allExpanded);
  };

  const handleSaveRcxParentCode = () => {
    if (formData.rcxParentCode.trim()) {
      if (formData.rcxParentCode === "9") {
        setRcxError("No RCX account found for this code");
        setShowRcxPrograms(false);
        setRcxLeague(null);
      } else {
        setRcxError(null);
        setShowRcxPrograms(true);
        setRcxLeague("ftl-optimist-club");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
  };

  const handleInputChange = (field: keyof CreateOrgFormData, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value ?? "" }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="lg"
        showCloseIconButton
        className="sui-max-w-[900px] sui-py-4 sui-px-3 sui-rounded-[16px]"
      >
        <DialogHeader className="sui-flex sui-justify-between">
          <DialogTitle>Create Organization</DialogTitle>
          <LabelButton
            type="button"
            variantType="tertiary"
            size="small"
            icon="collapse_all"
            iconPosition="right"
            labelText={allExpanded ? "Collapse all" : "Expand all"}
            onClick={toggleAllSections}
          />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="sui-space-y-4" data-1p-ignore>
          <div className="sui-px-3 sui-flex sui-flex-col sui-gap-4 sui-overflow-y-auto sui-pb-[80px] sui-max-h-[70vh]">
            {/* Basic Information Section */}
            <CollapsibleCard defaultOpen={allExpanded} open={allExpanded} onOpenChange={() => {}}>
              <CollapsibleCardHeader title="Basic Information" />
              <CollapsibleCardContent>
                <div className="sui-grid sui-grid-cols-2 sui-gap-4 sui-mt-2">
                  <Input
                    name="name"
                    label="Organization name"
                    required
                    value={formData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}
                  />

                  <Select
                    name="sportId"
                    label="Sport"
                    required
                    placeholder="Select a sport"
                    options={SPORT_OPTIONS}
                    value={formData.sportId}
                    onChange={(value) => handleInputChange("sportId", value ?? "")}
                    isSearchable
                  />

                  <Select
                    name="businessType"
                    label="Business Type"
                    required
                    options={BUSINESS_TYPE_OPTIONS}
                    value={formData.businessType}
                    onChange={(value) => handleInputChange("businessType", value ?? "")}
                  />

                  <Select
                    name="country"
                    label="Country"
                    required
                    options={COUNTRY_OPTIONS}
                    value={formData.country}
                    onChange={(value) => handleInputChange("country", value ?? "")}
                  />

                  <Select
                    name="timezone"
                    label="Timezone"
                    required
                    placeholder="Select a timezone"
                    options={TIMEZONE_OPTIONS}
                    value={formData.timezone}
                    onChange={(value) => handleInputChange("timezone", value ?? "")}
                    isSearchable
                  />

                  <div className="sui-col-span-2">
                    <Checkbox
                      name="isTestOrganization"
                      label="Is test organization"
                      checked={formData.isTestOrganization}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("isTestOrganization", e.target.checked)}
                    />
                  </div>
                </div>
              </CollapsibleCardContent>
            </CollapsibleCard>

            {/* Owner Details Section */}
            <CollapsibleCard defaultOpen={allExpanded} open={allExpanded} onOpenChange={() => {}}>
              <CollapsibleCardHeader title="Owner Details" />
              <CollapsibleCardContent>
                <div className="sui-grid sui-grid-cols-2 sui-gap-4 sui-mt-2">
                  <Input
                    name="ownerFirstName"
                    label="Owner First Name"
                    required
                    value={formData.ownerFirstName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("ownerFirstName", e.target.value)}
                  />

                  <Input
                    name="ownerLastName"
                    label="Owner Last Name"
                    required
                    value={formData.ownerLastName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("ownerLastName", e.target.value)}
                  />

                  <div className="sui-col-span-2">
                    <Input
                      name="ownerEmail"
                      label="Owner Email"
                      required
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("ownerEmail", e.target.value)}
                    />
                  </div>
                </div>
              </CollapsibleCardContent>
            </CollapsibleCard>

            {/* RCX Parent Code Section */}
            <CollapsibleCard defaultOpen={allExpanded} open={allExpanded} onOpenChange={() => {}}>
              <CollapsibleCardHeader title="RCX Parent code" />
              <CollapsibleCardContent>
                <div className="sui-grid sui-grid-cols-2 sui-gap-4 sui-mt-2 sui-items-end">
                  <div className="sui-col-span-2 sui-flex sui-gap-2 sui-items-end">
                    <div className="sui-flex-grow">
                      <Input
                        name="rcxParentCode"
                        type="text"
                        label="RCX Parent Code"
                        placeholder="Enter RCX Parent Code"
                        value={formData.rcxParentCode}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("rcxParentCode", e.target.value)}
                      />
                    </div>
                    <LabelButton
                      type="button"
                      variantType="primary"
                      labelText="Save"
                      onClick={handleSaveRcxParentCode}
                    />
                  </div>
                </div>

                {/* Error message */}
                {rcxError && (
                  <div className="sui-mt-2 sui-text-sm" style={{ color: 'red' }}>
                    {rcxError}
                  </div>
                )}

                {/* RCX Account - shown after Save */}
                {showRcxPrograms && (
                  <div className="sui-mt-4 sui-grid sui-grid-cols-1 sui-gap-2">
                    {/* FTL Optimist Club option */}
                    <button
                      type="button"
                      onClick={() => setRcxLeague("ftl-optimist-club")}
                      className={`sui-relative sui-text-left sui-rounded-lg sui-border sui-border-solid sui-p-3 sui-cursor-pointer sui-transition-all ${
                        rcxLeague === "ftl-optimist-club"
                          ? 'sui-border-admin-action-border sui-bg-admin-action-background-weak-hover'
                          : 'sui-border-neutral-border sui-bg-white hover:sui-bg-neutral-background-weak'
                      }`}
                    >
                      <img
                        alt="RCX Sports"
                        className="sui-absolute sui-top-2 sui-right-8 sui-h-2 sui-w-auto"
                        src="/RCXSports_Vert_CMYK.png"
                      />
                      <div className="sui-flex sui-items-center sui-justify-between">
                        <div>
                          <p className="sui-text-sm sui-font-medium sui-text-neutral-text">
                            RCX Account Name: FTL Optimist Club
                          </p>
                        </div>
                        {rcxLeague === "ftl-optimist-club" && (
                          <div className="sui-flex sui-items-center sui-justify-center sui-w-4 sui-h-4 sui-rounded-full sui-bg-admin-action-background">
                            <Icon name="check" size="s" className="sui-text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                )}
              </CollapsibleCardContent>
            </CollapsibleCard>

            {/* Financial Information Section */}
            <CollapsibleCard defaultOpen={allExpanded} open={allExpanded} onOpenChange={() => {}}>
              <CollapsibleCardHeader title="Financial Information" />
              <CollapsibleCardContent>
                <div className="sui-grid sui-grid-cols-2 sui-gap-4 sui-mt-2">
                  <Input
                    name="creditCardRate"
                    label="Credit Card Rate (%)"
                    required
                    type="number"
                    step="any"
                    value={formData.creditCardRate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("creditCardRate", e.target.value)}
                    data-1p-ignore
                  />

                  <Input
                    name="creditCardFee"
                    label="Credit Card Fee"
                    required
                    type="financial"
                    currency="USD"
                    value={formData.creditCardFee}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("creditCardFee", e.target.value)}
                    data-1p-ignore
                  />

                  <Input
                    name="achRate"
                    label="ACH Rate (%)"
                    required
                    type="number"
                    step="any"
                    value={formData.achRate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("achRate", e.target.value)}
                    data-1p-ignore
                  />

                  <Input
                    name="achFee"
                    label="ACH Fee"
                    required
                    type="financial"
                    currency="USD"
                    value={formData.achFee}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("achFee", e.target.value)}
                    data-1p-ignore
                  />
                </div>
              </CollapsibleCardContent>
            </CollapsibleCard>
          </div>

          <DialogFooter className="sui-py-0">
            <div className="sui-flex sui-w-full sui-justify-end sui-gap-1 sui-px-4">
              <DialogClose asChild>
                <LabelButton variantType="secondary" labelText="Cancel" />
              </DialogClose>
              <LabelButton type="submit" variantType="primary" labelText="Create" />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
