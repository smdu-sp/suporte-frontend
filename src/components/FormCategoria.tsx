import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import { IconButton, Option, Select } from '@mui/joy';
import { useState, FormEvent, Fragment, useEffect } from 'react';
import * as tipoServices from '@/shared/services/tipo.services';
import * as categoriaServices from '@/shared/services/categoria.services';
import { ITipo } from '@/shared/services/tipo.services';
import { IPaginadoTipo } from '@/shared/services/tipo.services';
import { useRouter, useSearchParams } from 'next/navigation';

interface Dados {
    titulo: string,
    titulo_select: string,
    tipo: string,
    criar?: any,
    open: boolean,
    atualizar?: any
}

interface ICriar {
    nome: string,
    id?: string,
    status: boolean
}

export default function FormCategoria(props: Dados) {
    const [open, setOpen] = useState<boolean>(false);
    const [id, setId] = useState<string>('');
    const [dados, setDados] = useState<ITipo[]>([]);
    const [nome, setNome] = useState('');
    const [status, setStatus] = useState('true')

    const searchParams = useSearchParams();
    const idRef = searchParams.get('id');

    useEffect(() => {
        setOpen(props.open);
        console.log(idRef);
        if (idRef) {
            tipoServices.buscarPorId(idRef)
                .then((res: ITipo) => {
                    setNome(res.nome)
                    setStatus(res.status ? 'true' : 'false')
                })
        }
    }, [idRef]);

    useEffect(() => {
        if (props.tipo === 'cat') {
            tipoServices.buscarTudo()
                .then((res: IPaginadoTipo) => {
                    setDados(res.data)
                })
        } else {
            categoriaServices.buscarTudo()
                .then((res: IPaginadoTipo) => {
                    setDados(res.data)
                })
        }
    }, []);

    return (
        <Fragment>
            <IconButton onClick={() => setOpen(true)} color='primary' variant='soft' size='lg' sx={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
            }}><Add /></IconButton>
            <Modal open={open} onClose={() => { setOpen(false); }}>
                <ModalDialog>
                    <DialogTitle>Criar {props.titulo}</DialogTitle>
                    <DialogContent>Preencha todos os campos para criar uma nova categoria.</DialogContent>
                    <form
                        onSubmit={(event: FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            if (idRef) {
                                props.atualizar(nome, id, status);
                            } else {
                                if (props.tipo !== 'tipo') {
                                    props.criar(nome, id, status);
                                } else {
                                    props.criar(nome, status);
                                }
                            }
                            setOpen(false);
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>Nome</FormLabel>
                                <Input value={nome} onChange={(e) => setNome(e.target.value)} autoFocus required />
                            </FormControl>
                            {props.tipo !== 'tipo' &&
                                <FormControl>
                                    <FormLabel>{props.titulo_select}</FormLabel>
                                    <Select onChange={(_, v) => setId(v as string)} required>
                                        {dados && dados.length > 0 && dados.map((dado) => <Option key={dado.id} value={dado.id}>{dado.nome}</Option>)}
                                    </Select>
                                </FormControl>
                            }
                            <FormControl>
                                <FormLabel>Status</FormLabel>
                                <Select value={status} onChange={(_, v) => setStatus(v as string)} required>
                                    <Option value="true">Ativo</Option>
                                    <Option value="false">Inativo</Option>
                                </Select>
                            </FormControl>
                            <Button type="submit" disabled={nome.length < 1 ? true : false}>Registrar</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </Fragment>
    );
}