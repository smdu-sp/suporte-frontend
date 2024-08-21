import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";

interface IProps {
    label: string;
    defaultValue?: Dayjs | null;
    format?: string;
    value?: Dayjs | null;
    onChange?: (value: Dayjs | null) => void;

}
export default function DatePickerComponent(props: IProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={props.label} 
                defaultValue={props.defaultValue || null} 
                format={props.format || "DD/MM/YYYY"} 
                value={props.value || null}
                onChange={props.onChange || (() => {})} 
                sx={{
                    width:  200, 
                    height: 50, 
                }}
            />
        </LocalizationProvider>
    );
}
