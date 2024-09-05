'use client'

import { Avatar, Box, Sheet, Skeleton, Typography } from "@mui/joy";
import SsidChartSharpIcon from '@mui/icons-material/SsidChartSharp';
import * as dashboardServices from '@/shared/services/dashboard.service';
import { useEffect, useState } from "react";
import { ITecnicos, IDashboardTecnicos } from "@/shared/services/dashboard.service";

export default function Pessoas() {

    const [tecnicos, setTecnicos] = useState<IDashboardTecnicos[]>([]);
    const [loading, setLoading] = useState(true)
    const buscasTecnicos = async () => {
        await dashboardServices.buscaTecnicos().then((response: ITecnicos) => {
            setTecnicos(response.tecnicos);
        })
    };
    useEffect(() => {
        buscasTecnicos().then(() => {
            setLoading(false)
        })
    }, []);

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
            <Skeleton animation="wave" variant="rectangular" loading={loading}>
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

                    {tecnicos && tecnicos.length > 0 ? tecnicos.map((tecnico) => (
                        <Sheet
                            key={tecnico.usuario.id}
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
                            <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                <Avatar
                                    variant="soft"
                                    src={tecnico.usuario.avatar}
                                >
                                </Avatar>
                                <Box sx={{ ml: 2, }} >
                                    <Typography level="body-lg" sx={{ fontWeight: 'bold' }}>{tecnico.usuario.nome}</Typography>
                                    <Typography>{tecnico.usuario.email}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ pr: 8 }} >
                                <Typography level="h4" endDecorator={5}>
                                    <SsidChartSharpIcon color={tecnicos ? 'success' : 'error'} sx={{ transform: tecnicos ? 'rotate(0deg)' : 'scaleX(-1)' }} />
                                </Typography>
                            </Box>
                        </Sheet>
                    )) : null}
                </Box>
            </Skeleton>
        </Box>
    )
}