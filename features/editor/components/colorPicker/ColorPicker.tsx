import { ChromePicker, CirclePicker } from "react-color";
import { color } from "../../type";
import { rgbObjectToString } from "../../utils";

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
    return (
        <div>
            <ChromePicker
                color={value}
                onChange={(color) => {
                    const formattedValue = rgbObjectToString(color.rgb);
                    onChange(formattedValue);
                }}
                className="border rounded-lg mb-5"
            />
            <CirclePicker
                color={value}
                colors={color}
                onChangeComplete={(color) => {
                    const formattedValue = rgbObjectToString(color.rgb);
                    onChange(formattedValue);
                }}
            />
        </div>
    );
};
