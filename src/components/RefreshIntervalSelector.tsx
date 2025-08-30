import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface RefreshIntervalSelectorProps {
  selectedInterval: number;
  onIntervalChange: (interval: number) => void;
}

const RefreshIntervalSelector = ({ selectedInterval, onIntervalChange }: RefreshIntervalSelectorProps) => {
  const intervals = [
    { value: 10, label: '10 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
    { value: 1800, label: '30 minutes' },
    { value: 3600, label: '1 hour' },
    { value: 21600, label: '6 hours' },
    { value: 86400, label: '1 day' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-muted-foreground">
        Auto-refresh interval
      </Label>
      <Select
        value={selectedInterval.toString()}
        onValueChange={(value) => onIntervalChange(Number(value))}
      >
        <SelectTrigger className="w-40 bg-card border-card-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {intervals.map((interval) => (
            <SelectItem key={interval.value} value={interval.value.toString()}>
              {interval.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RefreshIntervalSelector;