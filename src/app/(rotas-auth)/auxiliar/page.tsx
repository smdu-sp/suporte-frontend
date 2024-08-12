'use client'
import Content from "@/components/Content";
import { Avatar, Box, Button, Card, Chip, Sheet, Typography } from "@mui/joy";
import CircleIcon from '@mui/icons-material/Circle';
import Logo from '@/assets/sis-icon.png'
import Msg from "@/components/Menssagem";
import Image from "next/image";
import react, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";

export default function Auxiliar() {
    interface IMensagem {
        text: string,
        user: string,
        index: boolean
    }
    const [user, setUser] = useState('Suporte')
    const [index, setIndex] = useState<boolean>(true)
    const [mensagem, setMensagem] = useState<IMensagem[]>([])
    const [status, setStatus] = useState(0)

    const router = useRouter()

    const newMensagem = () => {
        const newMessage: IMensagem = {
            text: texto,
            user: user,
            index: index
        }
        setMensagem([...mensagem, newMessage])
        if (status === 1) {
            setTexto(text[1].text)
            setUser('Suporte')
            setIndex(true)
            setMensagem([...mensagem, newMessage])
        } else if (status === 2) {
            setTexto(text[2].text)
            setUser('Suporte')
            setIndex(true)
            setMensagem([...mensagem, newMessage])
            setTimeout(() => {
                router.push('/chamados/detalhes')
            }, 3000)
        }
    }

    const text = [
        { 'text': 'Olá, com qual tipo de problema posso te ajudar?' },
        { 'text': 'Certo, Quão urgente é esta solicitação?' },
        { 'text': 'Ok, estou te encaminhando para o sistema correspondente... ' }
    ]

    const [texto, setTexto] = useState<string>(text[0].text)

    const tipos = [
        { 'name': 'Computador' },
        { 'name': 'Internet' },
        { 'name': 'Impressora' },
        { 'name': 'Monitor' },
        { 'name': 'Tela' }
    ]

    const prioridade = [
        { 'name': 'Baixa'},
        { 'name': 'Média'},
        { 'name': 'Alta'}
    ]

    useEffect(() => {
        newMensagem()
    }, [texto, user, index])

    return (
        <Content
            breadcrumbs={[
                { label: 'Auxiliar', href: '/auxiliar' }
            ]}
            titulo=''
            pagina='auxiliar'
        >
            <Sheet sx={{ width: '100%', height: '80vh', bgcolor: 'neutral.100' }}>
                <Box sx={{ display: 'flex', px: 4, bgcolor: 'neutral.50', alignItems: 'center', height: '8%' }}>
                    <Avatar sx={{ mr: 2 }}>
                        <Image
                            src={Logo}
                            alt="Prefeitura"
                            width={40}
                        />
                    </Avatar>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 20 }}>Suporte</Typography>
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
                <Box sx={{ p: 2, height: '87%' }}>
                    {mensagem && mensagem.length > 0 ? mensagem.map((mensagem) => (
                        <Msg
                            key={mensagem.text}
                            text={mensagem.text}
                            user={mensagem.user}
                            index={mensagem.index}
                        />
                    )) : null}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, height: '5%', justifyContent: 'end' }}>
                    {tipos && tipos.length > 0 && status === 0 ? tipos.map((tipos) => (
                        <Button sx={{ minWidth: '130px' }}
                            key={tipos.name}
                            onClick={() => {
                                setTexto(tipos.name);
                                setUser('Gustavo');
                                setIndex(false);
                                setStatus(1)
                            }}
                        >
                            {tipos.name}
                        </Button>
                    )) :
                        prioridade.length > 0 ? prioridade.map((prioridades) => (
                            <Button sx={{ minWidth: '130px' }}
                                key={prioridades.name}
                                onClick={() => {
                                    setTexto(prioridades.name);
                                    setUser('Gustavo');
                                    setIndex(false);
                                    setStatus(2)
                                }}
                            >
                                {prioridades.name}
                            </Button>
                        )) : null
                    }
                </Box>
            </Sheet>
        </Content>
    )
}