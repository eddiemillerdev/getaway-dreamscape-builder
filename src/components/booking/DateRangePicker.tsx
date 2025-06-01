
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DateRangePicker = ({ dateRange, onDateRangeChange, isOpen, onOpenChange }: DateRangePickerProps) => {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal h-14"
        >
          <div className="flex items-center w-full">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <div className="flex-1">
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    <div className="text-xs text-gray-600">CHECK-IN / CHECK-OUT</div>
                    <div className="font-medium">
                      {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-gray-600">CHECK-IN</div>
                    <div className="font-medium">{format(dateRange.from, 'MMM dd')}</div>
                  </>
                )
              ) : (
                <>
                  <div className="text-xs text-gray-600">CHECK-IN / CHECK-OUT</div>
                  <div className="text-gray-500">Add dates</div>
                </>
              )}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={(range) => {
            onDateRangeChange(range);
            if (range?.from && range?.to) {
              onOpenChange(false);
            }
          }}
          numberOfMonths={2}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
