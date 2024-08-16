import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function DatePickerComponent(props: any) {
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
