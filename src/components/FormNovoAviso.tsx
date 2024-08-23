'use client'

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
import { Option, Select, selectClasses, Textarea } from '@mui/joy';
import { KeyboardArrowDown } from '@mui/icons-material';
import IAviso from '@/shared/interfaces/IAviso';
import * as service from '@/shared/services/avisos.service';

// Constante tipo apenas para testes. Remover antes de subir em homologação e prod.
const tipo: string = 'a49c681d-a99a-432f-a924-3d55b5842407';

export default function FormNovoAviso({ open, openFuncao }: {  open: boolean, openFuncao: Function }) {
  const [ titulo, setTitulo ] = React.useState<string>();
  const [ mensagem, setMensagem ] = React.useState<string>();
  const [ cor, setCor ] = React.useState<string>();
  const [ rota, setRota ] = React.useState<string>();

  const handleSubmit = async (e: React.FormEvent): Promise<IAviso | null> => {
    e.preventDefault();
    try {
      if (!titulo || !mensagem || !cor || !rota) throw new Error('Campos vazios no formulário. Preencha todos os campos.');
      const aviso: IAviso = {
        titulo: titulo,
        mensagem: mensagem,
        cor: cor,
        rota: rota,
        tipo_id: tipo
      };
      const response: IAviso | null = await service.criarAviso(aviso);
      if (!response) throw new Error('Erro ao cadastrar o aviso.');
      return response;
    } catch(e) {
      console.log(e);
      return null;
    }
  };

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => openFuncao(false)}>
        <ModalDialog size='lg' sx={{ width: '500px' }}>
          <DialogTitle>Novo Aviso</DialogTitle>
          <DialogContent>Preencha as informações do aviso.</DialogContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Titulo</FormLabel>
                <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} autoFocus required />
              </FormControl>
              <FormControl>
                <FormLabel>Mensagem</FormLabel>
                <Textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} minRows={2} />
              </FormControl>
              <FormControl>
                <FormLabel>Cor</FormLabel>
                  <Select
                    value={cor}
                    placeholder="Selecione uma cor..."
                    indicator={<KeyboardArrowDown />}
                    sx={{
                        width: 240,
                        [`& .${selectClasses.indicator}`]: {
                        transition: '0.2s',
                        [`&.${selectClasses.expanded}`]: {
                            transform: 'rotate(-180deg)',
                        },
                        },
                    }}
                  >
                    <Option onClick={() => setCor('PRIMARY')} value="PRIMARY">Azul</Option>
                    <Option onClick={() => setCor('NEUTRAL')} value="NEUTRAL">Cinza</Option>
                    <Option onClick={() => setCor('WARNING')} value="WARNING">Laranja</Option>
                    <Option onClick={() => setCor('DANGER')} value="DANGER">Vermelho</Option>
                    <Option onClick={() => setCor('SUCCESS')} value="SUCCESS">Verde</Option>
                  </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Rota</FormLabel>
                <Input value={rota} onChange={(e) => setRota(e.target.value)} required />
              </FormControl>
              <Button type='submit'>Salvar</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
