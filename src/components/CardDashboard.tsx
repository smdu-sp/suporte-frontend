import { Card, CardContent, Sheet, Typography } from "@mui/joy";
interface IProps {
    minWidth?: string,
    titulo: string,
    valor: number,
    descricao: string,
}
export default function CardDashboard(props: IProps) {
    return (
        <Sheet sx={{
            boxShadow: 1,
            borderRadius: 14,
            minWidth: '50%',
            border: 'solid 2px ',
            WebkitBoxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 10px',
            borderColor: 'divider',
            p: 2,
            mx: 0,
        }}>
            <Typography sx={{ fontWeight: 600, letterSpacing: 0.2, p: 0 }}>{props.titulo}</Typography>
            <Typography sx={{ fontSize: 34, fontWeight: 'bold', p: 0 }}>
                {props.valor}
            </Typography>
            <Typography color="neutral" sx={{ display: 'inline', fontSize: 14 }}>
                {props.descricao}
            </Typography>
        </Sheet>
    )
}