'use client'

import { Avatar, Box, Sheet, Typography } from "@mui/joy";
import SsidChartSharpIcon from '@mui/icons-material/SsidChartSharp';
import * as dashboardServices from '@/shared/services/dashboard.service';
import { useEffect, useState } from "react";
import { ITecnicos, IDashboardTecnicos } from "@/shared/services/dashboard.service";

export default function Pessoas() {

    const [tecnicos, setTecnicos] = useState<IDashboardTecnicos[]>([]);
    const buscasTecnicos = async () => {
        await dashboardServices.buscaTecnicos().then((response: ITecnicos) => {
            setTecnicos(response.tecnicos);
        })
    };
    useEffect(() => {
        buscasTecnicos();
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
                {tecnicos.map((tecnicos) => (
                    <Sheet
                        key={tecnicos.usuario.id}
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
                                src={tecnicos.usuario.avatar}
                            >
                            </Avatar>
                            <Box sx={{ ml: 2, }} >
                                <Typography level="body-lg" sx={{ fontWeight: 'bold' }}>{tecnicos.usuario.nome}</Typography>
                                <Typography>{tecnicos.usuario.email}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ pr: 8 }} >
                            <Typography level="h4" endDecorator={5}>
                                <SsidChartSharpIcon color={tecnicos ? 'success' : 'error'} sx={{ transform: tecnicos ? 'rotate(0deg)' : 'scaleX(-1)' }} />
                            </Typography>
                        </Box>
                    </Sheet>
                ))}
            </Box>
        </Box>
    )
}