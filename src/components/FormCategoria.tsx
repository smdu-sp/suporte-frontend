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
import { ITipo } from '@/shared/services/ordem.services';
import { IPaginadoTipo } from '@/shared/services/tipo.services';


export default function FormCategoria() {
    const [open, setOpen] = useState<boolean>(false);
    const [id_tipo, setId_Tipo] = useState<string>('');
    const [tipos, setTipos] = useState<ITipo[]>([]);

    useEffect(() => {
        tipoServices.buscarTudo()
            .then((res: IPaginadoTipo) => {
                setTipos(res.data)
            })
    }, []);

    return (
        <Fragment>
            <IconButton onClick={() => setOpen(true)} color='primary' variant='soft' size='lg' sx={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
            }}><Add /></IconButton>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Criar Categorias</DialogTitle>
                    <DialogContent>Preencha todos os campos para criar uma nova categoria.</DialogContent>
                    <form
                        onSubmit={(event: FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            setOpen(false);
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input autoFocus required />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Tipo Referente</FormLabel>
                                <Select onChange={(_, v) => setId_Tipo(v as string)} required>
                                    {tipos.map((tipo) => <Option key={tipo.id} value={tipo.id}>{tipo.nome}</Option>)}
                                </Select>   
                            </FormControl>
                            <Button type="submit">Registrar</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </Fragment>
    );
}