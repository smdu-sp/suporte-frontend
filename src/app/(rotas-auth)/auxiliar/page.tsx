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
import { IPaginadoTipo, ITipo } from '@/shared/services/tipo.services';
import * as tipoServices from '@/shared/services/tipo.services';
import * as categoriaServices from '@/shared/services/categoria.services';
import { ICategoria } from '@/shared/services/categoria.services';
import * as subcategoriasServices from '@/shared/services/subcategorias.servise';
import { ISubCategoria } from '@/shared/services/subcategorias.servise';

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
    const [tipos, setTipos] = useState<ITipo[]>([]);
    const [categoria, setCategoria] = useState<ICategoria[]>([]);
    const [subCategoria, setSubCategoria] = useState<ISubCategoria[]>([]);
    const [idTipo, setIdTipo] = useState('');
    const [idCategoria, setIdCategoria] = useState('');
    const [idSubCategoria, setIdSubCategoria] = useState('');

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
        tipoServices.buscarTudo()
            .then((response: IPaginadoTipo) => {
                setTipos(response.data);
            })
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

        setTexto(text[status].text)
        setMensagem([...mensagem, newMessage])

        if (status === 4) {
            setTimeout(() => {
                router.push(`/chamados/detalhes?tipo=${idTipo}&categoria=${idCategoria}&subcategoria=${idSubCategoria}`)
            }, 3000)
        }
    }

    const buscarCategoria = (id: string) => {
        categoriaServices.buscar_por_tipo(id)
            .then((response) => {
                setCategoria(response);
                console.log(response);
            })
    }


    const buscarSubCategoria = (id: string) => {
        subcategoriasServices.buscar_por_categoria(id)
            .then((response) => {
                setSubCategoria(response);
                console.log(response);
            })
    }

    const text = [
        { 'text': 'Olá, Como posso te ajudar?' },
        { 'text': 'Certo, qual o problema?' },
        { 'text': 'O que em especifico esta acontecendo?' },
        { 'text': 'Poderia descrever com poucas paralavras o que aconteceu?' },
        { 'text': 'Ok, estou te encaminhando para o sistema correspondente... ' }
    ]

    const [texto, setTexto] = useState<string>(text[0].text)

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
                                disabled={status !== 3}
                                sx={{ width: '100%', height: '90px', borderRadius: '0px', borderTopLeftRadius: 10, borderTopRightRadius: 10, fontSize: 20 }}
                                placeholder={status !== 3 ? 'Escolha uma das categorias abaixo...' : 'Digite aqui...'}
                                onChange={(e) => setTextCampo(e.target.value)}
                                value={textCampo}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' && status === 3 && textCampo !== '') {
                                        setStatus(4);
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
                                {status === 0 ?
                                    tipos && tipos.length > 0 && status === 0 ? tipos.map((tipos) => (
                                        <Button
                                            sx={{ minWidth: '130px' }}
                                            key={tipos.id}
                                            onClick={() => {
                                                setTexto(tipos.nome);
                                                setUser(nome);
                                                setIndex(false);
                                                setStatus(1);
                                                buscarCategoria(tipos.id)
                                                setIdTipo(tipos.id)
                                            }}
                                        >
                                            {tipos.nome}
                                        </Button>
                                    )) : ''
                                    : null}
                                {
                                    status === 1 ?
                                        categoria && categoria.length > 0 ? categoria.map((categoria) => (
                                            <Button sx={{ minWidth: '130px' }}
                                                key={categoria.id}
                                                onClick={() => {
                                                    setTexto(categoria.nome);
                                                    setUser(nome);
                                                    setIndex(false);
                                                    setStatus(2);
                                                    buscarSubCategoria(categoria.id)
                                                    setIdCategoria(categoria.id)
                                                }}
                                            >
                                                {categoria.nome}
                                            </Button>
                                        )) : ''
                                        : null}
                                {
                                    status === 2 &&
                                        subCategoria && subCategoria.length > 0 ? subCategoria.map((subCategoria) => (
                                            <Button sx={{ minWidth: '130px' }}
                                                key={subCategoria.id}
                                                onClick={() => {
                                                    setTexto(subCategoria.nome);
                                                    setUser(nome);
                                                    setIndex(false);
                                                    setStatus(3)
                                                    setIdSubCategoria(subCategoria.id)
                                                }}
                                            >
                                                {subCategoria.nome}
                                            </Button>
                                        )) : null
                                }
                            </Box>
                            <Box>
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        setStatus(4);
                                        setUser(nome);
                                        setIndex(false);
                                        setTexto(textCampo);
                                        setTextCampo('');
                                    }}
                                    disabled={status !== 3 || textCampo === ''}
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