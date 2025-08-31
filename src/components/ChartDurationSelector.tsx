import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type ChartDuration = '7' | '30' | '90' | '365';

interface ChartDurationSelectorProps {
  selectedDuration: ChartDuration;
  onDurationChange: (duration: ChartDuration) => void;
}

const durationOptions = [
  { value: '7' as ChartDuration, label: '7 Days' },
  { value: '30' as ChartDuration, label: '30 Days' },
  { value: '90' as ChartDuration, label: '90 Days' },
  { value: '365' as ChartDuration, label: '1 Year' },
];

const ChartDurationSelector = ({ selectedDuration, onDurationChange }: ChartDurationSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Period:</span>
      <Select value={selectedDuration} onValueChange={onDurationChange}>
        <SelectTrigger className="w-32 h-8 text-xs bg-secondary/20 border-card-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-card-border">
          {durationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ChartDurationSelector;