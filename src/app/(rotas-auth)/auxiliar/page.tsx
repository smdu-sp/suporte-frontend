'use client'
import Content from "@/components/Content";
import { Avatar, Box, Button, Card, Chip, Input, Sheet, Textarea, Typography } from "@mui/joy";
import CircleIcon from '@mui/icons-material/Circle';
import Logo from '@/assets/sis-icon.png'
import Msg from "@/components/Menssagem";
import Image from "next/image";
import react, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import * as usuarioServices from "@/shared/services/usuario.services";
import { IUsuario } from "@/shared/services/usuario.services";
import SendIcon from '@mui/icons-material/Send';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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
    const [nome, setNome] = useState('');
    const [textCampo, setTextCampo] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            await usuarioServices.validaUsuario()
                .then((response: IUsuario) => {
                    setNome(
                        response.nome.split(' ')[0] + ' ' +
                        response.nome.split(' ')[
                        response.nome.split(' ').length - 1
                        ]);
                });
        };
        fetchData();
    }, []);

    const router = useRouter()

    const newMensagem = () => {
        const newMessage: IMensagem = {
            text: texto,
            user: user,
            index: index
        }
        setUser('Suporte')
        setIndex(true)
        setMensagem([...mensagem, newMessage])
        if (status === 1) {
            setTexto(text[1].text)
            setMensagem([...mensagem, newMessage])
        } else if (status === 2) {
            setTexto(text[2].text)
            setMensagem([...mensagem, newMessage])
        } else if (status === 3) {
            setTexto(text[3].text)
            setMensagem([...mensagem, newMessage])
            setTimeout(() => {
                router.push('/chamados/detalhes')
            }, 3000)
        }
    }

    const text = [
        { 'text': 'Olá, com qual tipo de problema posso te ajudar?' },
        { 'text': 'Poderia descrever com poucas paralavras o que aconteceu?' },
        { 'text': 'Qual o nivel de prioridade?' },
        { 'text': 'Ok, estou te encaminhando para o sistema correspondente... ' }
    ]

    const [texto, setTexto] = useState<string>(text[0].text)

    const tipos = [
        { 'name': 'Computador' },
        { 'name': 'Internet' },
        { 'name': 'Impressora' },
        { 'name': 'Monitor' }
    ]

    const prioridade = [
        { 'name': 'Baixa' },
        { 'name': 'Média' },
        { 'name': 'Alta' }
    ]

    useEffect(() => {
        newMensagem()
    }, [user, index])

    return (
        <Content
            breadcrumbs={[
                { label: 'Auxiliar', href: '/auxiliar' }
            ]}
            titulo='Auxiliar'
            pagina='auxiliar'
        >
            <Sheet sx={{ width: '100%', height: '900px', bgcolor: 'primary.solidDisabledColor', borderRadius: '10px' }}>
                <Box sx={{ display: 'flex', px: 4, bgcolor: 'neutral.softActiveBg', alignItems: 'center', height: '8%', borderBottom: '1px solid', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
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
                <Box sx={{ p: 2, height: '72%', overflow: 'auto' }}>
                    {mensagem && mensagem.length > 0 ? mensagem.map((mensagem) => (
                        <Msg
                            key={mensagem.text}
                            text={mensagem.text}
                            user={mensagem.user}
                            index={mensagem.index}
                        />
                    )) : null}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, height: '20%', justifyContent: 'end' }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', px: 3 }}>
                        <Box sx={{}}>
                            <Textarea
                                disabled={status !== 1}
                                sx={{ width: '100%', height: '90px', borderRadius: '0px', borderTopLeftRadius: 10, borderTopRightRadius: 10, fontSize: 20 }}
                                placeholder={status !== 1 ? 'Escolha uma das categorias abaixo...' : 'Digite aqui...'}
                                onChange={(e) => setTextCampo(e.target.value)}
                                value={textCampo}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        setStatus(2);
                                        setUser(nome);
                                        setIndex(false);
                                        setTexto(textCampo)
                                        setTextCampo('')
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{
                            bgcolor: 'white',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                        }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {tipos && tipos.length > 0 && status === 0 ? tipos.map((tipos) => (
                                    <Button
                                        sx={{ minWidth: '130px', border: '1px solid green' }}
                                        variant="soft"
                                        color="success"
                                        key={tipos.name}
                                        onClick={() => {
                                            setTexto(tipos.name);
                                            setUser(nome);
                                            setIndex(false);
                                            setStatus(1)
                                        }}
                                    >
                                        {tipos.name}
                                    </Button>
                                )) : status === 2 &&
                                    prioridade.length > 0 ? prioridade.map((prioridades) => (
                                        <Button sx={{ minWidth: '130px' }}
                                            key={prioridades.name}
                                            onClick={() => {
                                                setTexto(prioridades.name);
                                                setUser(nome);
                                                setIndex(false);
                                                setStatus(3)
                                            }}
                                        >
                                            {prioridades.name}
                                        </Button>
                                    )) : null
                                }
                            </Box>
                            <Box>
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        setStatus(2);
                                        setUser(nome);
                                        setIndex(false);
                                        setTexto(textCampo);
                                        setTextCampo('');
                                    }}
                                    endDecorator={<SendIcon />}
                                >
                                    Enviar
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Sheet>
        </Content>
    )
}