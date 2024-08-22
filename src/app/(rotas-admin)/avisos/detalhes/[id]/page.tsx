'use client'

import Content from "@/components/Content";
import { useContext, useEffect, useState } from "react";
import * as tipoServices from "@/shared/services/tipo.services";
import { Box, Button, Card, CardActions, CardOverflow, FormControl, FormLabel, Input, Option, Select, Stack } from "@mui/joy";
import { Business, Check } from "@mui/icons-material";
import { useRouter } from 'next/navigation';
import { AlertsContext } from "@/providers/alertsProvider";
import { ITipo } from "@/shared/services/tipo.services";

export default function AvisoDetalhes(props: { params: { id: string } }) {
    const [idTipo, setIdTipo] = useState<string>('');
    const [status, setStatus] = useState<string>('true');
    const [nome, setNome] = useState<string>('');
    const { id } = props.params;
    const { setAlert } = useContext(AlertsContext);
    const router = useRouter();

    const submitForm = async () => {
        if (!id){
            const criado: ITipo = await tipoServices.criar({
                nome, status
            });
            if (criado) router.push('/tipos/detalhes/' + criado.id);
        } else {
            const alterado: ITipo = await tipoServices.atualizar({
                id, nome, status
            });
            if (alterado) setAlert('Tipo alterado!', 'Tipo alterado com sucesso!', 'success', 3000, Check);
        }
    }

    useEffect(() => {
        if (id) {
            tipoServices.buscarPorId(id)
                .then((response: ITipo) => {
                    setIdTipo(response.id);
                    setNome(response.nome);
                    setStatus(response.status ? 'true' : 'false');
                });
        }
    }, [ id ]);

    return (
        <Content
            breadcrumbs={[
                { label: 'Tipos', href: '/tipos' },
                { label: nome ? nome : 'Novo tipo', href: '/tipos/detalhes/' + idTipo || '' },
            ]}
            titulo={nome ? nome : 'Novo Tipo'}
            pagina="tipos"
        >
            <Box
                sx={{
                    display: 'flex',
                    mx: 'auto',
                    width: '90%',
                    maxWidth: 800,
                    px: { xs: 2, md: 6 },
                    py: { xs: 2, md: 3 },
                }}
            >
                <Card sx={{ width: '100%' }}>
                        <Stack spacing={2} >
                            <Stack direction="row" spacing={2}>
                                <FormControl sx={{ flexGrow: 1 }}>
                                    <FormLabel>Nome</FormLabel>
                                    <Input
                                        value={nome || ''}
                                        onChange={(event) => setNome(event.target.value)}
                                        size="sm"
                                        type="text"
                                        startDecorator={<Business />}
                                        placeholder="Nome"
                                        required
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        value={status}
                                        onChange={(_, value) => value && setStatus(value)}
                                        size="sm"
                                        placeholder="Status"
                                        startDecorator={<Business />}
                                    >
                                        <Option value={'true'}>Ativo</Option>
                                        <Option value={'false'}>Inativo</Option>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Stack>
                        <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                            <Button size="sm" variant="outlined" color="neutral" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button size="sm" variant="solid" color="primary" onClick={submitForm}>
                                Salvar
                            </Button>
                            </CardActions>
                        </CardOverflow>
                </Card>
            </Box>            
        </Content>
    );
}
