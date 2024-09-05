import { Box, Card, CardContent, Sheet, Skeleton, Typography } from "@mui/joy";
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
            <Typography level="h1" sx={{ fontSize: '40px', fontWeight: 'bold', p: 0, width: 60 }}>
                <Skeleton animation="wave" variant="rectangular" loading={props.valor !== -1 ? false : true} >{props.valor}</Skeleton>
            </Typography>
            <Typography level="h4" sx={{ fontSize: 14, fontWeight: 'bold', p: 0, width: 60, display: 'inline' }}>
                <Skeleton animation="wave" variant="inline" loading={props.descricao !== "erro ao carregar" ? false : true} >{props.descricao}</Skeleton>
            </Typography>
        </Sheet>
    )
}