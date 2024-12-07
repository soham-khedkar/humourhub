import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface FontSelectProps {
  font: string;
  onChange: (font: string) => void;
}

export function FontSelect({ font, onChange }: FontSelectProps) {
  const fonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia'];

  return (
    <Select value={font} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select font" />
      </SelectTrigger>
      <SelectContent>
        {fonts.map((fontOption) => (
          <SelectItem
            key={fontOption}
            value={fontOption}
            style={{ fontFamily: fontOption }}
          >
            {fontOption}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}