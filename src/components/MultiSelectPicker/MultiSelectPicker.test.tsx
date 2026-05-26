import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MultiSelectPicker, {
  MultiSelectPickerContent,
  MultiSelectPickerGroup,
  MultiSelectPickerHelpText,
  MultiSelectPickerItem,
  MultiSelectPickerList,
  MultiSelectPickerSearchInput,
  MultiSelectPickerTrigger,
} from "./MultiSelectPicker";

describe("MultiSelectPicker", () => {
  beforeEach(() => {
    global.ResizeObserver = class MockedResizeObserver {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    };
    window.HTMLElement.prototype.scrollIntoView = function () {};
  });

  it("render trigger with placeholder", () => {
    const { getByText, getByPlaceholderText } = render(
      <MultiSelectPicker name="" values={[]} onValuesChange={jest.fn()}>
        <MultiSelectPickerTrigger
          placeholder="Filters"
          className="sui-w-full sui-max-w-[320px]"
        />
        <MultiSelectPickerContent className="sui-max-w-[320px]">
          <MultiSelectPickerHelpText>
            Select the items you want to sponsor.
          </MultiSelectPickerHelpText>
          <MultiSelectPickerSearchInput placeholder="Search" />
          <MultiSelectPickerList>
            <MultiSelectPickerItem
              value="logo-on-jerseys"
              label="Logo on Jerseys"
            />
            <MultiSelectPickerItem value="digital" label="Digital Assets" />
            <MultiSelectPickerItem value="add-ons" label="Rewarded Add-ons" />
          </MultiSelectPickerList>
        </MultiSelectPickerContent>
      </MultiSelectPicker>,
    );
    expect(getByText("Filters")).toBeInTheDocument();
  });

  it("render trigger with tag values in it", async () => {
    const values = ["logo-on-jerseys", "digital", "add-ons"];
    const { getByText, getByPlaceholderText } = render(
      <MultiSelectPicker name="" values={values} onValuesChange={jest.fn()}>
        <MultiSelectPickerTrigger
          placeholder="Filters"
          className="sui-w-full sui-max-w-[320px]"
        />
        <MultiSelectPickerContent className="sui-max-w-[320px]">
          <MultiSelectPickerHelpText>
            Select the items you want to sponsor.
          </MultiSelectPickerHelpText>
          <MultiSelectPickerSearchInput placeholder="Search" />
          <MultiSelectPickerList>
            <MultiSelectPickerItem
              value="logo-on-jerseys"
              label="Logo on Jerseys"
            />
            <MultiSelectPickerItem value="digital" label="Digital Assets" />
            <MultiSelectPickerItem value="add-ons" label="Rewarded Add-ons" />
          </MultiSelectPickerList>
        </MultiSelectPickerContent>
      </MultiSelectPicker>,
    );
    expect(getByText("Logo on Jerseys")).toBeInTheDocument();
  });

  it("render helper text, search input and all items inside <MultiSelectPickerContent />", async () => {
    const { getByText, getByPlaceholderText } = render(
      <MultiSelectPicker values={[]} name="" onValuesChange={jest.fn()}>
        <MultiSelectPickerTrigger
          placeholder="Filters"
          className="sui-w-full sui-max-w-[320px]"
        />
        <MultiSelectPickerContent className="sui-max-w-[320px]">
          <MultiSelectPickerHelpText>
            Select the items you want to sponsor.
          </MultiSelectPickerHelpText>
          <MultiSelectPickerSearchInput placeholder="Search" />
          <MultiSelectPickerList>
            <MultiSelectPickerGroup label="Branded Collateral">
              <MultiSelectPickerItem
                value="logo-on-jerseys"
                label="Logo on Jerseys"
              />
              <MultiSelectPickerItem value="warm-up" label="Warm-up apparel" />
              <MultiSelectPickerItem value="banners" label="Banners" />
              <MultiSelectPickerItem
                value="products"
                label="Products and coupon distribution"
              />
            </MultiSelectPickerGroup>
            <MultiSelectPickerGroup label="Experiences">
              <MultiSelectPickerItem value="seminars" label="Seminars" />
              <MultiSelectPickerItem
                value="table-and-product"
                label="Table and product"
              />
              <MultiSelectPickerItem
                value="photography"
                label="Professional Photography"
              />
            </MultiSelectPickerGroup>
            <MultiSelectPickerItem value="digital" label="Digital Assets" />
            <MultiSelectPickerItem value="add-ons" label="Rewarded Add-ons" />
          </MultiSelectPickerList>
        </MultiSelectPickerContent>
      </MultiSelectPicker>,
    );
    const user = userEvent.setup();

    expect(getByText("Filters")).toBeInTheDocument();
    await user.click(getByText("Filters"));
    expect(
      getByText("Select the items you want to sponsor."),
    ).toBeInTheDocument();
    expect(getByPlaceholderText("Search")).toBeInTheDocument();
    expect(getByText("Branded Collateral")).toBeInTheDocument();
    expect(getByText("Logo on Jerseys")).toBeInTheDocument();
    expect(getByText("Warm-up apparel")).toBeInTheDocument();
    expect(getByText("Banners")).toBeInTheDocument();
    expect(getByText("Products and coupon distribution")).toBeInTheDocument();
    expect(getByText("Experiences")).toBeInTheDocument();
    expect(getByText("Seminars")).toBeInTheDocument();
    expect(getByText("Table and product")).toBeInTheDocument();
    expect(getByText("Professional Photography")).toBeInTheDocument();
    expect(getByText("Digital Assets")).toBeInTheDocument();
    expect(getByText("Rewarded Add-ons")).toBeInTheDocument();
  });
});
