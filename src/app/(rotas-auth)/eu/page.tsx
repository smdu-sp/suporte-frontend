'use client'

import { useContext, useEffect, useState } from "react";
import { Autocomplete, AutocompleteOption, Avatar, Badge, Box, Button, Card, CardActions, CardOverflow, Chip, ChipPropsColorOverrides, ColorPaletteProp, Divider, FormControl, FormLabel, IconButton, Input, Option, Select, Stack } from "@mui/joy";
import { Business, Check, EmailRounded } from "@mui/icons-material";
import { useRouter } from 'next/navigation';
import { OverridableStringUnion } from '@mui/types';

import { useRef } from 'react';
import Content from "@/components/Content";
import { IUnidade } from "@/shared/services/unidade.services";
import { IUsuario } from "@/shared/services/usuario.services";
import * as usuarioServices from "@/shared/services/usuario.services";
import * as unidadeServices from "@/shared/services/unidade.services";
import { AlertsContext } from "@/providers/alertsProvider";
import EditIcon from '@mui/icons-material/Edit';
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/auth/authOptions";

import * as pickFiles from "@/shared/services/pick.service";
import { parse } from "path";

export default function UsuarioDetalhes() {
    const [usuario, setUsuario] = useState<IUsuario>();
    const [unidades, setUnidades] = useState<IUnidade[]>([]);
    const [unidade_id, setUnidade_id] = useState('');
    const router = useRouter();
    const { setAlert } = useContext(AlertsContext);
    const [urlAvatar, setUrlAvatar] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const permissoes: Record<string, { label: string, value: string, color: OverridableStringUnion<ColorPaletteProp, ChipPropsColorOverrides> | undefined }> = {
        'DEV': { label: 'Desenvolvedor', value: 'DEV', color: 'primary' },
        'TEC': { label: 'Técnico', value: 'TEC', color: 'neutral' },
        'ADM': { label: 'Administrador', value: 'ADM', color: 'success' },
        'USR': { label: 'Usuário', value: 'USR', color: 'warning' },
    }
    const submitData = () => {
        if (!selectedFile || !usuario) { return; }
    
        const formData = new FormData();
        formData.append('foto', selectedFile); 
    
        usuarioServices.atualizar(usuario.id, formData)
            .then((response) => {
                if (response) {
                    setAlert('Usuário alterado!', 'Dados atualizados com sucesso!', 'success', 3000, Check);
                    console.log(response);
                }
            })
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            
            setSelectedFile(event.target.files[0]);

            const foto = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setUrlAvatar(reader.result as string);
                }
            };
            reader.readAsDataURL(foto);
        }
    };

    // useEffect(() => {
    //     handleUpload()
    // }, [selectedFile])

    const handleUpload = async () => {
        if (!selectedFile) {
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('http://localhost:3000/minio', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Erro ao enviar imagem: ${response.statusText}`);
        }

        const data = await response.json();
        setUrlAvatar(data.url);
    };



    useEffect(() => {
        usuarioServices.validaUsuario()
            .then((response: IUsuario) => {
                setUsuario(response);
                setUnidade_id(response.unidade_id);
            });

        unidadeServices.listaCompleta()
            .then((response: IUnidade[]) => {
                setUnidades(response);
            })
    }, []);

    return (
        <Content
            breadcrumbs={[
                { label: 'Meu Perfil', href: '/eu' },
            ]}
            titulo={usuario ? usuario.nome : 'Meu Perfil'}
            tags={
                usuario ? <div style={{ display: 'flex', gap: '0.2rem' }}>
                </div> : null
            }
            pagina=""
        >
            <Box
                sx={{
                    display: 'flex',
                    mx: 'auto',
                    width: '90%',
                    flexDirection: 'column',
                    maxWidth: 800,
                    px: { xs: 2, md: 6 },
                    py: { xs: 2, md: 3 },
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', height: '150px', mb: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ position: 'relative', }}>
                        <Avatar
                            sx={{ width: 100, height: 100 }}
                            color="neutral"
                            variant="soft"
                            src={urlAvatar}
                        >
                        </Avatar>
                        <form action="">
                            <Input
                                type="file"
                                onChange={handleFileChange}
                                sx={{
                                    display: 'none',
                                }}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload">
                                <IconButton
                                    component="span"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: -20,
                                        zIndex: 1,
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        }
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </label>
                        </form>
                    </Box>
                </Box>
                <Card sx={{ width: '100%' }}>
                    <Stack spacing={2} >
                        <Stack>
                            <FormControl>
                                <FormLabel>Unidade</FormLabel>
                                <Autocomplete
                                    startDecorator={<Business />}
                                    options={unidades}
                                    getOptionLabel={(option) => option && option.sigla}
                                    renderOption={(props, option) => (
                                        <AutocompleteOption {...props} key={option.id} value={option.id}>
                                            {option.sigla}
                                        </AutocompleteOption>
                                    )}
                                    placeholder="Unidade"
                                    value={unidade_id && unidade_id !== '' ? unidades.find((unidade: IUnidade) => unidade.id === unidade_id) : null}
                                    onChange={(_, value) => value && setUnidade_id(value?.id)}
                                    filterOptions={(options, { inputValue }) => {
                                        if (unidades) return (options as IUnidade[]).filter((option) => (
                                            (option).nome.toLowerCase().includes(inputValue.toLowerCase()) ||
                                            (option).sigla.toLowerCase().includes(inputValue.toLowerCase())
                                        ));
                                        return [];
                                    }}
                                    noOptionsText="Nenhuma unidade encontrada"
                                />
                            </FormControl>
                        </Stack>
                        <Divider />
                        <Stack direction="row" spacing={2}>
                            <FormControl sx={{ flexGrow: 1 }}>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    value={usuario ? usuario?.email : 'USR'}
                                    size="sm"
                                    type="email"
                                    startDecorator={<EmailRounded />}
                                    placeholder="Email"
                                    sx={{ flexGrow: 1 }}
                                    disabled
                                />
                            </FormControl>
                        </Stack>
                    </Stack>
                    <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                        <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                            <Button size="sm" variant="outlined" color="neutral" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button size="sm" variant="solid" onClick={submitData}>
                                Salvar
                            </Button>
                        </CardActions>
                    </CardOverflow>
                </Card>
            </Box>
        </Content>
    );
}
