import { Avatar, Box, Sheet, Typography } from "@mui/joy";
import FaceSharpIcon from '@mui/icons-material/FaceSharp';
import SsidChartSharpIcon from '@mui/icons-material/SsidChartSharp';
interface PessoasProps {
}

const pessoas = [
    {
        "nome": "José",
        "email": "jose@prefeitura.sp.gov.br",
        "nota": 5
    },
    {
        "nome": "Fernando",
        "email": "fernando@prefeitura.sp.gov.br",
        "nota": 3
    },
    {
        "nome": "Guilherme",
        "email": "guilherme@prefeitura.sp.gov.br",
        "nota": 5
    },
    {
        "nome": "Diego",
        "email": "diego@prefeitura.sp.gov.br",
        "nota": 4
    },
    {
        "nome": "Bruno",
        "email": "bruno@prefeitura.sp.gov.br",
        "nota": 2
    },
    {
        "nome": "Gustavo",
        "email": "gustavo@prefeitura.sp.gov.br",
        "nota": 4.5
    },
]

export default function Pessoas(p: PessoasProps) {
    return (
        <Box sx={{
            width: '100%',
            height: 440,
            py: 1,
            px: 2,
        }}
        >
            <Box sx={{ pb: 1 }}>
                <Typography level="h3"> Avaliações </Typography>
                <Typography level="body-sm"> Média geral por pessoa </Typography>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    height: 360,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    '&::-webkit-scrollbar': {
                        width: '0.6em'
                    },
                    '&::-webkit-scrollbar-track': {
                        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'neutral.outlinedColor',
                        borderRadius: '10px',
                    }
                }}
            >
                {pessoas.map((pessoa) => (
                    <Sheet
                        key={pessoa.email}
                        sx={{
                            width: '100%',
                            height: 70,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderRadius: 'sm',
                            p: 3
                        }}
                    >
                        <Box sx={{ display: 'flex', }} >
                            <Avatar size="lg">
                                <FaceSharpIcon sx={{ width: 30, height: 30 }} />
                            </Avatar>
                            <Box sx={{ ml: 2, }} >
                                <Typography level="body-lg" sx={{ fontWeight: 'bold' }}>{pessoa.nome}</Typography>
                                <Typography>{pessoa.email}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ pr: 8 }} >
                            <Typography level="h4" endDecorator={pessoa.nota}><SsidChartSharpIcon /></Typography>
                        </Box>
                    </Sheet>
                ))}
            </Box>
        </Box>
    )
}