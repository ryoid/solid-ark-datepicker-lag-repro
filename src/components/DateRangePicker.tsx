import {
  DatePicker,
  DatePickerColumnHeader,
  DatePickerContent,
  DatePickerControl,
  DatePickerDayCell,
  DatePickerDayCellTrigger,
  DatePickerGrid,
  DatePickerInput,
  DatePickerNextTrigger,
  DatePickerPrevTrigger,
  DatePickerRow,
  DatePickerRowGroup,
  DatePickerRowHeader,
  DatePickerTrigger,
  Select,
  SelectContent,
  SelectLabel,
  SelectOption,
  SelectOptionGroup,
  SelectOptionGroupLabel,
  useDatePickerContext,
} from "@ark-ui/solid";
import {
  ErrorBoundary,
  For,
  Show,
  createSelector,
  type Component,
} from "solid-js";
import { Portal } from "solid-js/web";

const Grid: Component<{
  offset: number;
  header: string;
}> = (props) => {
  const api = useDatePickerContext();
  const offset = () => api().getOffset(props.offset);
  return (
    <DatePickerGrid class="text-xs border-collapse border-none" asChild>
      {/* @ts-ignore not sure why the types error here they are correct props */}
      <table cellSpacing="0" cellPadding="0">
        <caption class="mb-2">
          <time class="font-medium text-sm flex-shrink-0">{props.header}</time>
        </caption>
        <DatePickerRowHeader asChild>
          <thead>
            <tr>
              <For each={api().weekDays}>
                {(day) => (
                  <DatePickerColumnHeader
                    class="px-2.5 py-2 text-zinc-500"
                    aria-label={day.long}
                    asChild
                  >
                    <td>{day.short.slice(0, -1)}</td>
                  </DatePickerColumnHeader>
                )}
              </For>
            </tr>
          </thead>
        </DatePickerRowHeader>
        <DatePickerRowGroup asChild>
          <tbody>
            <For each={offset().weeks}>
              {(week) => (
                <DatePickerRow asChild>
                  <tr>
                    <For each={week}>
                      {(day) => (
                        <DatePickerDayCell
                          value={day}
                          offset={offset()}
                          asChild
                        >
                          <td>
                            <DatePickerDayCellTrigger class="w-full px-2.5 py-2 text-zinc-800 data-[in-range]:bg-zinc-100 data-[in-range]:rounded-none data-[outside-range]:text-zinc-300 rounded-lg hover:!bg-zinc-800 hover:!text-zinc-100 data-[today]:underline underline-offset-4 data-[today]:font-medium data-[selected]:!bg-zinc-800 data-[selected]:!text-zinc-50 data-[range-start]:!rounded-l-lg data-[range-end]:!rounded-r-lg data-[disabled]:text-zinc-400 data-[disabled]:hover:!bg-transparent data-[disabled]:hover:!text-zinc-400 data-[disabled]:cursor-not-allowed">
                              {day.day}
                            </DatePickerDayCellTrigger>
                          </td>
                        </DatePickerDayCell>
                      )}
                    </For>
                  </tr>
                </DatePickerRow>
              )}
            </For>
          </tbody>
        </DatePickerRowGroup>
      </table>
    </DatePickerGrid>
  );
};

type DateRangeInputValue =
  | {
      from: Date;
      to: Date;
    }
  | {
      from: Date;
    }
  | {
      to: Date;
    };

type DateRangePickerProps = {
  value?: DateRangeInputValue;
  onInput?: (dateRange: DateRangeInputValue) => any;
};

const DateRangePicker: Component<DateRangePickerProps> = (props) => {
  return (
    <ErrorBoundary fallback={<div>Broke</div>}>
      <DatePicker selectionMode="range" modal>
        {(api) => (
          <>
            <DatePickerControl class="relative flex items-center gap-2">
              <DatePickerInput class="h-10 p-3 rounded border border-zinc-300 shadow-sm" />
              <DatePickerTrigger class="h-10 w-10 p-3 rounded border-zinc-300 shadow-sm border group">
                {"📅"}
              </DatePickerTrigger>
            </DatePickerControl>
            <Portal>
              {/* <DatePickerPositioner> */}
              <DatePickerContent class="absolute mt-2 bg-white z-40 rounded-lg border-2 border-zinc-600 shadow-lg overflow-hidden">
                <div class="flex">
                  <div class="relative p-4">
                    <div class="absolute top-3 inset-x-3 flex justify-between">
                      <DatePickerPrevTrigger class="rounded hover:bg-zinc-100 transition-colors p-1 text-zinc-600 hover:text-zinc-800 disabled:cursor-not-allowed disabled:text-zinc-400">
                        {"⬅️"}
                      </DatePickerPrevTrigger>
                      <DatePickerNextTrigger class="rounded hover:bg-zinc-100 transition-colors p-1 text-zinc-600 hover:text-zinc-800 disabled:cursor-not-allowed disabled:text-zinc-400">
                        {"➡️"}
                      </DatePickerNextTrigger>
                    </div>
                    <div class="flex gap-4">
                      <Grid offset={0} header={api().visibleRangeText.start} />
                      <Grid offset={1} header={api().visibleRangeText.end} />
                    </div>
                  </div>
                </div>
              </DatePickerContent>
              {/* </DatePickerPositioner> */}
            </Portal>
          </>
        )}
      </DatePicker>
    </ErrorBoundary>
  );
};

export default DateRangePicker;
