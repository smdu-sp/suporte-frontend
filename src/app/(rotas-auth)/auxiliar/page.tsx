'use client'
import Content from "@/components/Content";
import { Avatar, Box, Chip, Sheet, Typography } from "@mui/joy";
import CircleIcon from '@mui/icons-material/Circle';
import Logo from '@/assets/sis-icon.png'
import Msg from "@/components/Menssagem";
import Image from "next/image";
import react, { useEffect, useState } from 'react'


export default function Auxiliar() {
    interface IMensagem {
        text: string,
        user: string,
        index: boolean
    }
    const [user, setUser] = useState('')
    const [texto, setTexto] = useState('')
    const [index, setIndex] = useState<boolean>(true)
    const [mensagem, setMensagem] = useState<IMensagem[]>([])


    useEffect(() => {
        
    }, [mensagem])


    const newMensagem = (dados: IMensagem) => {
        if (dados) {
            setMensagem([dados])
        }
    }

    const text = [
        { 'text': 'Olá, com qual tipo de problema posso te ajudar?' },
        { 'text': 'Certo, Quão urgente é esta solicitação?' },
        { 'text': 'Ok, estou-lhe encaminhando para o sistema correspondente... ' }
    ]

    const tipos = [
        [
            'Computador',
            'Internet',
            'Impressora',
            'Monitor',
            'Tela',
        ]
    ]

    const prioridade = [
        'Baixa',
        'Média',
        'Alta'
    ]


    return (
        <Content
            breadcrumbs={[
                { label: 'Auxiliar', href: '/auxiliar' }
            ]}
            titulo=''
            pagina='auxiliar'
        >
            <Sheet sx={{ width: '100%', height: '80vh', bgcolor: 'neutral.100' }}>
                <Box sx={{ display: 'flex', py: 2, px: 4, bgcolor: 'neutral.50', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }}>
                        <Image
                            src={Logo}
                            alt="Prefeitura"
                            width={40}
                        />
                    </Avatar>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 20 }}>Prefeitura</Typography>
                    <Chip
                        variant="outlined"
                        color="neutral"
                        size="sm"
                        startDecorator={<CircleIcon sx={{ fontSize: 10, color: 'green' }} />}
                        sx={{ fontSize: 13, mt: 0.5, ml: 1 }}
                    >
                        Online
                    </Chip>
                </Box>
                <Box sx={{ p: 2 }}>
                    {mensagem && mensagem.length > 0 ? mensagem.map((mensagem) => (
                        <Msg
                            text={mensagem.text}
                            user={mensagem.user}
                            index={mensagem.index}
                        />
                    )) : null}
                </Box>
            </Sheet>
        </Content>
    )
}