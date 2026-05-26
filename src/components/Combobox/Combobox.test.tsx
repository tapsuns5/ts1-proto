import React from "react";
import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Combobox, {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxHelpText,
  ComboboxItem,
  ComboboxList,
  ComboboxSearchInput,
  ComboboxTrigger,
} from "./Combobox";

describe("Combobox", () => {
  beforeEach(() => {
    global.ResizeObserver = class MockedResizeObserver {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    };
    window.HTMLElement.prototype.scrollIntoView = function () {};
  });

  it("renders trigger with label", () => {
    const { getByText, getByPlaceholderText } = render(
      <Combobox values={[]} onValuesChange={jest.fn()}>
        <ComboboxTrigger
          label="Filters"
          className="sui-w-full sui-max-w-[320px]"
        />
        <ComboboxContent className="sui-max-w-[320px]">
          <ComboboxHelpText>
            Select the items you want to sponsor.
          </ComboboxHelpText>
          <ComboboxSearchInput placeholder="Search" />
          <ComboboxList>
            <ComboboxItem value="logo-on-jerseys" label="Logo on Jerseys" />
            <ComboboxItem value="digital" label="Digital Assets" />
            <ComboboxItem value="add-ons" label="Rewarded Add-ons" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );
    expect(getByText("Filters")).toBeInTheDocument();
  });

  it("renders trigger with tag values in it", async () => {
    const values = ["logo-on-jerseys", "digital", "add-ons"];
    const { getByText } = render(
      <Combobox values={values} onValuesChange={jest.fn()}>
        <ComboboxTrigger
          label="Filters"
          className="sui-w-full sui-max-w-[320px]"
        />
        <ComboboxContent className="sui-max-w-[320px]">
          <ComboboxHelpText>
            Select the items you want to sponsor.
          </ComboboxHelpText>
          <ComboboxSearchInput placeholder="Search" />
          <ComboboxList>
            <ComboboxItem value="logo-on-jerseys" label="Logo on Jerseys" />
            <ComboboxItem value="digital" label="Digital Assets" />
            <ComboboxItem value="add-ons" label="Rewarded Add-ons" />
            <ComboboxItem value="some-other-option" label="Some Other Option" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );
    expect(getByText("Logo on Jerseys")).toBeInTheDocument();
    expect(getByText("& 2 more")).toBeInTheDocument();
  });

  it('renders trigger with "All" selected', async () => {
    const values = ["logo-on-jerseys", "digital", "add-ons"];
    const { getByText } = render(
      <Combobox values={values} onValuesChange={jest.fn()}>
        <ComboboxTrigger
          label="Filters"
          className="sui-w-full sui-max-w-[320px]"
        />
        <ComboboxContent className="sui-max-w-[320px]">
          <ComboboxHelpText>
            Select the items you want to sponsor.
          </ComboboxHelpText>
          <ComboboxSearchInput placeholder="Search" />
          <ComboboxList>
            <ComboboxItem value="logo-on-jerseys" label="Logo on Jerseys" />
            <ComboboxItem value="digital" label="Digital Assets" />
            <ComboboxItem value="add-ons" label="Rewarded Add-ons" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );
    expect(getByText("All")).toBeInTheDocument();
  });

  it("renders helper text, search input and all items inside <ComboboxContent />", async () => {
    const { getByText, getByPlaceholderText } = render(
      <Combobox values={[]} onValuesChange={jest.fn()}>
        <ComboboxTrigger
          label="Filters"
          className="sui-w-full sui-max-w-[320px]"
        />
        <ComboboxContent className="sui-max-w-[320px]">
          <ComboboxHelpText>
            Select the items you want to sponsor.
          </ComboboxHelpText>
          <ComboboxSearchInput placeholder="Search" />
          <ComboboxList>
            <ComboboxGroup label="Branded Collateral">
              <ComboboxItem value="logo-on-jerseys" label="Logo on Jerseys" />
              <ComboboxItem value="warm-up" label="Warm-up apparel" />
              <ComboboxItem value="banners" label="Banners" />
              <ComboboxItem
                value="products"
                label="Products and coupon distribution"
              />
            </ComboboxGroup>
            <ComboboxGroup label="Experiences">
              <ComboboxItem value="seminars" label="Seminars" />
              <ComboboxItem
                value="table-and-product"
                label="Table and product"
              />
              <ComboboxItem
                value="photography"
                label="Professional Photography"
              />
            </ComboboxGroup>
            <ComboboxItem value="digital" label="Digital Assets" />
            <ComboboxItem value="add-ons" label="Rewarded Add-ons" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
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

  it("filters items based on search input", async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Combobox values={[]} onValuesChange={jest.fn()}>
        <ComboboxTrigger label="Filters" />
        <ComboboxContent>
          <ComboboxSearchInput placeholder="Search" />
          <ComboboxList>
            <ComboboxItem value="logo-on-jerseys" label="Logo on Jerseys" />
            <ComboboxItem value="digital" label="Digital Assets" />
            <ComboboxItem value="add-ons" label="Rewarded Add-ons" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );

    const user = userEvent.setup();
    await user.click(getByText("Filters"));

    const searchInput = getByPlaceholderText("Search");
    await user.type(searchInput, "digital");

    expect(getByText("Digital Assets")).toBeInTheDocument();
    expect(queryByText("Logo on Jerseys")).not.toBeInTheDocument();
    expect(queryByText("Rewarded Add-ons")).not.toBeInTheDocument();
  });

  it("handles select all functionality", async () => {
    const onValuesChange = jest.fn();
    const { getByText, getByLabelText } = render(
      <Combobox values={[]} onValuesChange={onValuesChange}>
        <ComboboxTrigger label="Filters" />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="logo-on-jerseys" label="Logo on Jerseys" />
            <ComboboxItem value="digital" label="Digital Assets" />
            <ComboboxItem value="add-ons" label="Rewarded Add-ons" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );

    const user = userEvent.setup();
    await user.click(getByText("Filters"));

    await user.click(getByLabelText("Select All"));
    await user.click(getByText("Apply"));

    expect(onValuesChange).toHaveBeenCalledWith([
      "logo-on-jerseys",
      "digital",
      "add-ons",
    ]);
  });

  it("handles group selection", async () => {
    const onValuesChange = jest.fn();
    const { getByText, getByLabelText } = render(
      <Combobox values={[]} onValuesChange={onValuesChange}>
        <ComboboxTrigger label="Filters" />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxGroup label="Branded Collateral">
              <ComboboxItem value="logo-on-jerseys" label="Logo on Jerseys" />
              <ComboboxItem value="warm-up" label="Warm-up apparel" />
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );

    const user = userEvent.setup();
    await user.click(getByText("Filters"));

    await user.click(getByLabelText("Branded Collateral"));
    await user.click(getByText("Apply"));

    expect(onValuesChange).toHaveBeenCalledWith(["logo-on-jerseys", "warm-up"]);
  });

  it("handles cancel button correctly", async () => {
    const onValuesChange = jest.fn();
    const { getByText, getByLabelText } = render(
      <Combobox values={[]} onValuesChange={onValuesChange}>
        <ComboboxTrigger label="Filters" />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="logo-on-jerseys" label="Logo on Jerseys" />
            <ComboboxItem value="digital" label="Digital Assets" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );

    const user = userEvent.setup();
    await user.click(getByText("Filters"));

    await user.click(getByLabelText("Logo on Jerseys"));
    await user.click(getByText("Cancel"));

    expect(onValuesChange).not.toHaveBeenCalled();
  });

  it('displays "No results found" when search has no matches', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Combobox values={[]} onValuesChange={jest.fn()}>
        <ComboboxTrigger label="Filters" />
        <ComboboxContent>
          <ComboboxSearchInput placeholder="Search" />
          <ComboboxList>
            <ComboboxItem value="logo-on-jerseys" label="Logo on Jerseys" />
            <ComboboxItem value="digital" label="Digital Assets" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );

    const user = userEvent.setup();
    await user.click(getByText("Filters"));

    const searchInput = getByPlaceholderText("Search");
    await user.type(searchInput, "nonexistent");

    expect(getByText("No results found.")).toBeInTheDocument();
  });

  it("maintains selected values when reopening the combobox", async () => {
    const { getByText, getByLabelText } = render(
      <Combobox values={["digital"]} onValuesChange={jest.fn()}>
        <ComboboxTrigger label="Filters" />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="logo-on-jerseys" label="Logo on Jerseys" />
            <ComboboxItem value="digital" label="Digital Assets" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );

    const user = userEvent.setup();

    // Click on the trigger by finding the selected value text
    await user.click(getByText("Digital Assets"));

    const digitalCheckbox = getByLabelText("Digital Assets");
    expect(digitalCheckbox).toBeChecked();
  });

  it("unsets invalid values when combobox options change", async () => {
    const onValuesChange = jest.fn();
    const { getByLabelText, rerender, getByRole } = render(
      <Combobox values={["option1"]} onValuesChange={onValuesChange}>
        <ComboboxTrigger label="Filters" />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="option1" label="Option 1" key="option1" />
            <ComboboxItem value="option2" label="Option 2" key="option2" />
            <ComboboxItem value="option3" label="Option 3" key="option3" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );
    const user = userEvent.setup();

    // Open the combobox to verify initial states
    await user.click(getByRole("button", { name: /filters/i }));
    expect(getByLabelText("Option 1")).toBeChecked();
    expect(getByLabelText("Option 2")).not.toBeChecked();
    expect(getByLabelText("Option 3")).not.toBeChecked();

    // Rerender with different options
    rerender(
      <Combobox values={["option1"]} onValuesChange={onValuesChange}>
        <ComboboxTrigger label="Filters" />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="option4" label="Option 4" key="option4" />
            <ComboboxItem value="option5" label="Option 5" key="option5" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );

    // select a new option
    await user.click(getByLabelText("Option 4"));

    // the callback should be called with only valid options
    await user.click(getByRole("button", { name: /apply/i }));
    expect(onValuesChange).toHaveBeenCalledWith(["option4"]);
  });
});

describe("Combobox - Single Select Mode", () => {
  beforeEach(() => {
    global.ResizeObserver = class MockedResizeObserver {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    };
    window.HTMLElement.prototype.scrollIntoView = function () {};
  });

  it("renders trigger with variant='input'", () => {
    const { getByText } = render(
      <Combobox mode="single" onValueChange={jest.fn()}>
        <ComboboxTrigger variant="input">Select a fruit</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="apple" label="Apple" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );
    expect(getByText("Select a fruit")).toBeInTheDocument();
  });

  it("renders items with check icons instead of checkboxes", async () => {
    const { getByText, queryByRole } = render(
      <Combobox mode="single" value="apple" onValueChange={jest.fn()}>
        <ComboboxTrigger variant="input">Apple</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="apple" label="Apple" selected />
            <ComboboxItem value="banana" label="Banana" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );
    const user = userEvent.setup();
    await user.click(getByText("Apple"));

    expect(queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("calls onValueChange when an item is selected", async () => {
    const onValueChange = jest.fn();
    const { getByText } = render(
      <Combobox mode="single" onValueChange={onValueChange}>
        <ComboboxTrigger variant="input">Select</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="apple" label="Apple" />
            <ComboboxItem value="banana" label="Banana" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );
    const user = userEvent.setup();
    await user.click(getByText("Select"));
    await user.click(getByText("Banana"));

    expect(onValueChange).toHaveBeenCalledWith("banana");
  });

  it("calls onSelect callback on item when selected", async () => {
    const onSelect = jest.fn();
    const onValueChange = jest.fn();
    const { getByText } = render(
      <Combobox mode="single" onValueChange={onValueChange}>
        <ComboboxTrigger variant="input">Select</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="apple" label="Apple" onSelect={onSelect} />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );
    const user = userEvent.setup();
    await user.click(getByText("Select"));
    await user.click(getByText("Apple"));

    expect(onSelect).toHaveBeenCalled();
    expect(onValueChange).toHaveBeenCalledWith("apple");
  });

  it("renders groups with heading and no checkbox", async () => {
    const { getByText, queryAllByRole } = render(
      <Combobox mode="single" onValueChange={jest.fn()}>
        <ComboboxTrigger variant="input">Select</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxGroup heading="Fruits">
              <ComboboxItem value="apple" label="Apple" />
              <ComboboxItem value="banana" label="Banana" />
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );
    const user = userEvent.setup();
    await user.click(getByText("Select"));

    expect(getByText("Fruits")).toBeInTheDocument();
    expect(queryAllByRole("checkbox")).toHaveLength(0);
  });

  it("does not show Apply/Cancel buttons in single-select mode", async () => {
    const { getByText, queryByText } = render(
      <Combobox mode="single" onValueChange={jest.fn()}>
        <ComboboxTrigger variant="input">Select</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="apple" label="Apple" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );
    const user = userEvent.setup();
    await user.click(getByText("Select"));

    expect(queryByText("Apply")).not.toBeInTheDocument();
    expect(queryByText("Cancel")).not.toBeInTheDocument();
    expect(queryByText("Select All")).not.toBeInTheDocument();
  });

  it("renders trigger with error status border", () => {
    const { container } = render(
      <Combobox mode="single" onValueChange={jest.fn()}>
        <ComboboxTrigger variant="input" status="error">Select</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="apple" label="Apple" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );
    const trigger = container.querySelector("button");
    expect(trigger?.className).toContain("sui-border-negative-border");
  });

  it("renders trigger with success status border", () => {
    const { container } = render(
      <Combobox mode="single" onValueChange={jest.fn()}>
        <ComboboxTrigger variant="input" status="success">Select</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="apple" label="Apple" />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    );
    const trigger = container.querySelector("button");
    expect(trigger?.className).toContain("sui-border-positive-border");
  });

  it("calls onOpenChange(false) when an item is selected in controlled open mode", async () => {
    const onValueChange = jest.fn();
    const onOpenChange = jest.fn();

    const ControlledCombobox = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <Combobox
          mode="single"
          onValueChange={onValueChange}
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            onOpenChange(nextOpen);
          }}
        >
          <ComboboxTrigger variant="input">Select</ComboboxTrigger>
          <ComboboxContent>
            <ComboboxList>
              <ComboboxItem value="apple" label="Apple" />
              <ComboboxItem value="banana" label="Banana" />
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      );
    };

    const { getByText } = render(<ControlledCombobox />);
    const user = userEvent.setup();

    await user.click(getByText("Select"));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    onOpenChange.mockClear();
    await user.click(getByText("Banana"));

    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
