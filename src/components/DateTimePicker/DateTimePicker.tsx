import * as React from "react";
import { useEffect, useState, useRef } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva } from "class-variance-authority";
import { cn } from "../../utils";
import Icon from "../Icon/Icon";
import IconButton from "../IconButton/IconButton";
import InputWrapper from "../InputWrapper/InputWrapper";
import { DateTimePickerPopoverContent } from "./components/DateTimePickerPopoverContent";
import type { DateTimePickerProps } from "./DateTimePicker.types";
import {
	dateToDateTimeLocal,
	dateTimeLocalToDate,
	dateToInputFormat,
	isMobile,
	isValidDate,
} from "./utils";
import { parse } from "date-fns";

const DateTimePicker = React.forwardRef<HTMLInputElement, DateTimePickerProps>(
	(
		{
			value,
			onChange,
			calendarAlign = "start",
			calendarProps,
			defaultDate,
			className,
			size,
			errors,
			popoverModalMode = false,
			withFooter = false,
			allowClear = false,
			label,
			required,
			name,
			helpText,
			showHelpIcon,
			helpIconTooltipContent,
			disabled,
			onCaptureAction,
			useNativeOnMobile = true,
			...props
		},
		ref,
	): JSX.Element => {
		const [openPopover, setOpenPopover] = useState(false);
		const [tempDateValue, setTempDateValue] = useState<Date | null>(
			value ?? null,
		);
		const [inputText, setInputText] = useState<string>(
			value ? dateToInputFormat(value) : "",
		);
		const inputRef = useRef<HTMLInputElement>(null);
		const rawInputRef = useRef<string>("");

		const hasErrors = Boolean(errors?.length);
		const useMobileInput = useNativeOnMobile && isMobile();
		const isSmallScreen = window.innerWidth < 768;

		const showClear = allowClear && value;

		useEffect(() => {
			// When picker opens, use value if it exists, otherwise use defaultDate
			setTempDateValue(
				value ?? (openPopover && defaultDate ? defaultDate : null),
			);
		}, [value, openPopover, defaultDate]);

		useEffect(() => {
			// Update input text when value changes externally
			setInputText(value ? dateToInputFormat(value) : "");
		}, [value]);

		const onOpenChange = (isOpen: boolean) => {
			setOpenPopover(isOpen);
			if (!isOpen && !withFooter) {
				onChange?.(tempDateValue);
			}
		};

		const handleNativeInputChange = (
			e: React.ChangeEvent<HTMLInputElement>,
		) => {
			const newDate = dateTimeLocalToDate(e.target.value);
			onChange?.(newDate);
		};

		const handleClear = (e: React.MouseEvent) => {
			e.stopPropagation(); // Prevent opening popover when clicking clear
			setInputText("");
			onChange?.(null);
		};

		const formatAsUserTypes = (value: string): string => {
			// Remove all non-numeric characters to get just the digits
			const digitsOnly = value.replace(/\D/g, "");

			if (!digitsOnly) return "";

			let formatted = "";

			// Month (MM) - first 1-2 digits
			if (digitsOnly.length >= 1) {
				formatted += digitsOnly.substring(0, Math.min(2, digitsOnly.length));
			}

			// Add slash after month when we have day digits
			if (digitsOnly.length >= 3) {
				formatted += "/";
				// Day (DD) - next 1-2 digits
				formatted += digitsOnly.substring(2, Math.min(4, digitsOnly.length));
			}

			// Add slash after day when we have year digits
			if (digitsOnly.length >= 5) {
				formatted += "/";
				// Year (YYYY) - next 1-4 digits
				formatted += digitsOnly.substring(4, Math.min(8, digitsOnly.length));
			}

			// Add space before time when we have hour digits (after 8 digits for MMDDYYYY)
			if (digitsOnly.length >= 9) {
				formatted += " ";
				// Hour (HH) - next 1-2 digits, convert to 12-hour format
				const hourStr = digitsOnly.substring(
					8,
					Math.min(10, digitsOnly.length),
				);
				if (hourStr.length === 2) {
					const hour24 = Number.parseInt(hourStr, 10);
					let hour12 = hour24;
					if (hour24 === 0) {
						hour12 = 12;
					} else if (hour24 > 12) {
						hour12 = hour24 - 12;
					}
					formatted += String(hour12).padStart(2, "0");
				} else {
					formatted += hourStr;
				}
			}

			// Add colon after hour when we have minute digits (after 10 digits for MMDDYYYYHH)
			if (digitsOnly.length >= 11) {
				formatted += ":";
				// Minute (MM) - next 1-2 digits
				formatted += digitsOnly.substring(10, Math.min(12, digitsOnly.length));
			}

			// Add AM/PM when we have complete time (12 digits total: MMDDYYYYHHMM)
			if (digitsOnly.length >= 12) {
				const hour = Number.parseInt(digitsOnly.substring(8, 10), 10);
				formatted += hour >= 12 ? " PM" : " AM";
			}

			return formatted;
		};

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const rawValue = e.target.value;
			rawInputRef.current = rawValue; // Track what user actually typed

			// Check if this looks like a malformed date that needs reformatting
			// This happens when user types digits after a formatted portion (e.g., "12/252024")
			const digitsOnly = rawValue.replace(/\D/g, "");
			const hasSlashes = rawValue.includes("/");
			const hasColons = rawValue.includes(":");
			const hasLetters = /[A-Za-z]/.test(rawValue);

			// If it's purely numeric, auto-format
			const isPurelyNumeric = /^[\d\s]*$/.test(rawValue);

			// Check for clearly malformed patterns that need reformatting
			// Only reformat if we're confident it's a typing scenario, not editing
			const isClearlyMalformed =
				hasSlashes &&
				!hasColons &&
				!hasLetters &&
				// Pattern like "12/252024" - digits run together after day
				(/^\d{1,2}\/\d{3,}\d*$/.test(rawValue) ||
					// Pattern like "12/25/202402" - digits run together after year
					/^\d{1,2}\/\d{1,2}\/\d{5,}$/.test(rawValue) ||
					// Pattern like "12/25/2024 0230" - time digits run together
					/^\d{1,2}\/\d{1,2}\/\d{4}\s+\d{3,}$/.test(rawValue));

			if (isPurelyNumeric) {
				// Always auto-format purely numeric input
				if (rawValue.trim()) {
					const formatted = formatAsUserTypes(rawValue);
					setInputText(formatted);
				} else {
					setInputText("");
				}
				return;
			}

			if (isClearlyMalformed) {
				// Only reformat clearly malformed patterns
				const formatted = formatAsUserTypes(rawValue);
				setInputText(formatted);
				return;
			}

			// For all other cases (including properly formatted dates), preserve as-is
			// This includes cases like "12/31/2024 2:30 PM" which should not be reformatted
			setInputText(rawValue);
		};

		const parseInputDate = (input: string): Date | null => {
			if (!input.trim()) return null;

			// Handle 2-digit year conversion manually before parsing
			const processedInput = input
				.trim()
				.replace(
					/(\d{1,2})\/(\d{1,2})\/(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)/i,
					(match, month, day, year, hours, minutes, period) => {
						// Convert 2-digit year to 4-digit year
						const currentYear = new Date().getFullYear();
						const century = Math.floor(currentYear / 100) * 100;
						const fullYear = century + Number.parseInt(year, 10);
						return `${month}/${day}/${fullYear} ${hours}:${minutes} ${period}`;
					},
				);

			// Define supported date formats for date-fns parsing
			const formats = [
				"MM/dd/yyyy h:mm a", // 12/31/2024 2:30 PM
				"MM/dd/yyyy hh:mm a", // 12/31/2024 02:30 PM
				"M/d/yyyy h:mm a", // 1/1/2024 2:30 PM
				"M/d/yyyy hh:mm a", // 1/1/2024 02:30 PM
			];

			// Try parsing with date-fns using each format
			for (const formatStr of formats) {
				try {
					const parsed = parse(processedInput, formatStr, new Date());
					if (isValidDate(parsed)) {
						return parsed;
					}
				} catch {
					// Continue to next format if parsing fails
				}
			}

			// Fallback to native Date parsing for other formats
			try {
				const nativeDate = new Date(processedInput);
				return isValidDate(nativeDate) ? nativeDate : null;
			} catch {
				return null;
			}
		};

		const handleInputBlur = () => {
			const parsedDate = parseInputDate(inputText);
			if (parsedDate) {
				onChange?.(parsedDate);
			} else if (rawInputRef.current.trim() === "") {
				// User explicitly cleared the field
				onChange?.(null);
			} else {
				// Invalid input - revert to last valid value
				setInputText(value ? dateToInputFormat(value) : "");
			}
		};

		const handleCalendarIconClick = (e: React.MouseEvent) => {
			e.stopPropagation();
			if (disabled) return;
			setOpenPopover(!openPopover);
		};

		const handleContentHeight = React.useCallback(
			(elem: HTMLDivElement | null) => {
				if (!isSmallScreen) {
					return;
				}
				const el = elem?.parentElement;
				if (el) {
					const availableHeight = Number.parseInt(
						window
							.getComputedStyle(el)
							.getPropertyValue("--radix-popper-available-height")
							.replace("px", ""),
					);
					const rect = el.getBoundingClientRect();
					if (
						isSmallScreen ||
						(!Number.isNaN(availableHeight) && availableHeight < rect.height)
					) {
						// If content height exceeds available height, center it in viewport
						// Center the element in the viewport using CSS transform
						el.style.position = "fixed";
						el.style.top = "50%";
						el.style.left = "50%";
						el.style.transform = "translate(-50%, -50%)";
						el.style.maxHeight = "calc(100vh - 40px)";
						el.style.maxWidth = "calc(100vw - 40px)";
						el.style.overflow = "auto";
						el.style.zIndex = "99999";
					}
				}
			},
			[],
		);

		// Render native input for mobile
		if (useMobileInput) {
			return (
				<InputWrapper
					label={label}
					required={required}
					name={name}
					helpText={helpText}
					showHelpIcon={showHelpIcon}
					errors={errors}
					className={className}
					helpIconTooltipContent={helpIconTooltipContent}
				>
					<div className="sui-relative">
						<input
							ref={inputRef}
							className={cn(
								dateTimePickerVariants({ size, error: hasErrors }),
								"sui-w-full sui-cursor-pointer",
							)}
							id={name}
							name={name}
							type="datetime-local"
							value={value ? dateToDateTimeLocal(value) : ""}
							disabled={disabled}
							onChange={handleNativeInputChange}
							{...props}
						/>
						<div className="sui-absolute sui-right-1 sui-top-1/2 -sui-translate-y-1/2 sui-flex sui-items-center sui-gap-1">
							{showClear && (
								<Icon
									name="close"
									size="s"
									className="sui-text-neutral-icon-medium sui-cursor-pointer hover:sui-text-neutral-text sui-pointer-events-auto"
									onClick={handleClear}
									data-testid="datetimepicker-clear-icon-mobile"
								/>
							)}
							<div className="sui-pointer-events-none">
								<IconButton
									className={cn(
										size === "small" ? "sui-w-3 sui-h-3" : "",
										"active:sui-scale-100",
									)}
									icon="calendar_month"
									disabled={disabled}
									size="compact"
									tabIndex={-1}
								/>
							</div>
						</div>
					</div>
				</InputWrapper>
			);
		}

		// Render custom popover for desktop
		return (
			<PopoverPrimitive.Root
				open={openPopover}
				onOpenChange={onOpenChange}
				modal={popoverModalMode}
			>
				<fieldset className={cn("sui-w-full", className)}>
					<InputWrapper
						label={label}
						required={required}
						name={name}
						helpText={helpText}
						showHelpIcon={showHelpIcon}
						errors={errors}
						helpIconTooltipContent={helpIconTooltipContent}
					>
						<PopoverPrimitive.Anchor className="sui-w-full">
							<div
								className={cn(
									dateTimePickerVariants({ size, error: hasErrors }),
									"sui-flex sui-items-center",
								)}
							>
								<input
									ref={ref as React.RefObject<HTMLInputElement>}
									data-testid="text-datetimepicker-input"
									{...props}
									type="text"
									className="sui-bg-transparent sui-outline-none placeholder:sui-text-[0.9rem] disabled:sui-cursor-not-allowed disabled:sui-text-neutral-text-disabled sui-flex-1 sui-min-w-0"
									id={name}
									name={name}
									value={inputText}
									placeholder="MM/DD/YYYY HH:MM AM"
									disabled={disabled}
									onChange={handleInputChange}
									onBlur={handleInputBlur}
									aria-label={label || "Select date and time"}
								/>
								<div className="sui-flex sui-items-center sui-gap-1 sui-shrink-0">
									{showClear && (
										<Icon
											name="close"
											size="s"
											className="sui-text-neutral-icon-medium sui-cursor-pointer hover:sui-text-neutral-text"
											onClick={handleClear}
											data-testid="datetimepicker-clear-icon"
										/>
									)}
									<Icon
										name="calendar_month"
										className={cn(
											"sui-text-neutral-icon-medium",
											disabled
												? "sui-cursor-not-allowed sui-text-neutral-text-weak"
												: "sui-cursor-pointer hover:sui-text-neutral-text",
										)}
										size="s"
										onClick={handleCalendarIconClick}
										data-testid="datetimepicker-calendar-icon"
									/>
								</div>
							</div>
						</PopoverPrimitive.Anchor>
					</InputWrapper>
				</fieldset>
				<PopoverPrimitive.Portal>
					<PopoverPrimitive.Content
						ref={handleContentHeight}
						className="sui-z-[99999] sui-rounded-[5px] sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-shadow-1"
						sideOffset={isSmallScreen ? 8 : 8}
						align={isSmallScreen ? "center" : calendarAlign}
						side={isSmallScreen ? "bottom" : undefined}
						collisionPadding={isSmallScreen ? 16 : 8}
						data-testid="datetimepicker-popover-content"
						sticky="always"
					>
						<DateTimePickerPopoverContent
							dateValue={tempDateValue}
							setDateValue={setTempDateValue}
							setOpenPopover={setOpenPopover}
							showFooter={withFooter}
							onChange={onChange ?? (() => {})}
							onCaptureAction={onCaptureAction}
							calendarProps={calendarProps}
							defaultDate={defaultDate}
							isVertical={isSmallScreen}
						/>
					</PopoverPrimitive.Content>
				</PopoverPrimitive.Portal>
			</PopoverPrimitive.Root>
		);
	},
);

DateTimePicker.displayName = "DateTimePicker";

export const dateTimePickerVariants = cva(
	[
		"sui-flex sui-items-center sui-gap-1 sui-rounded-full sui-border sui-border-solid sui-border-neutral-border sui-bg-white sui-px-2 sui-text-desktop-5",
		"hover:sui-border-action-border-hover",
		"data-[state=open]:sui-border-action-background",
		"disabled:sui-cursor-not-allowed disabled:sui-bg-neutral-background-weak disabled:sui-text-neutral-text-weak",
	],
	{
		variants: {
			size: {
				small: "sui-h-[32px]",
				default: "sui-h-[48px]",
				large: "sui-h-[56px]",
			},
			error: {
				true: "sui-border-negative-border-hover",
			},
		},
		defaultVariants: { size: "default" },
	},
);

export default DateTimePicker;
