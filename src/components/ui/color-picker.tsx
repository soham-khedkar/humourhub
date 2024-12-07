import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';  
import { Button } from './button';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-10 h-10 p-0"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-8 cursor-pointer border-0 p-0 bg-transparent"
        />
      </PopoverContent>
    </Popover>
  );
}