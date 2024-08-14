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
    const [idCategoria, setIdCategoria] = useState(0);

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
                router.push(`/chamados/detalhes?tipo=${idCategoria}`)
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
        {
            'id': 1,
            'name': 'GLPI'
        },
        {
            'id': 2,
            'name': 'DSUP'
        },
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
            <Sheet sx={{ width: '100%', height: '900px', borderRadius: '10px', marginTop: 2 }} variant="outlined">
                <Sheet sx={{ display: 'flex', px: 4, alignItems: 'center', height: '8%', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} variant="soft">
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
                </Sheet>
                <Box sx={{ p: 2, height: '72%', overflow: 'auto', '&::-webkit-scrollbar': { width: '5px' } }}>
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
                                    if (event.key === 'Enter' && status === 1) {
                                        setStatus(2);
                                        setUser(nome);
                                        setIndex(false);
                                        setTexto(textCampo)
                                        setTextCampo('')
                                    }
                                }}
                            />
                        </Box>
                        <Sheet
                            sx={{
                                height: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 1,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                            }}
                            variant="soft"
                        >
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {tipos && tipos.length > 0 && status === 0 ? tipos.map((tipos) => (
                                    <Button
                                        sx={{ minWidth: '130px' }}
                                        key={tipos.name}
                                        onClick={() => {
                                            setTexto(tipos.name);
                                            setUser(nome);
                                            setIndex(false);
                                            setIdCategoria(tipos.id);
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
                                    disabled={status !== 1}
                                    endDecorator={<SendIcon />}
                                >
                                    Enviar
                                </Button>
                            </Box>
                        </Sheet>
                    </Box>
                </Box>
            </Sheet>
        </Content>
    )
}