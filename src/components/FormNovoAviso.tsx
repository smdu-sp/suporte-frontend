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
import { Check, KeyboardArrowDown, Warning } from '@mui/icons-material';
import IAviso from '@/shared/interfaces/IAviso';
import * as service from '@/shared/services/avisos.service';
import { AlertsContext } from '@/providers/alertsProvider';

// Constante sistema apenas para testes. Remover antes de subir em homologação e prod.
const sistema: string = 'cc9da6a7-9fef-4c70-8d4f-8fc465cf211f';

export default function FormNovoAviso(
  { open, openFuncao, refreshFuncao }: 
  {
    open: boolean, 
    openFuncao: Function, 
    refreshFuncao: Function 
  }
) {
  const [ titulo, setTitulo ] = React.useState<string>();
  const [ mensagem, setMensagem ] = React.useState<string>();
  const [ cor, setCor ] = React.useState<string>();
  const [ rota, setRota ] = React.useState<string>();
  const { setAlert } = React.useContext(AlertsContext);
  
  const handleSubmit = async (e: React.FormEvent): Promise<IAviso | null> => {
    e.preventDefault();
    try {
      if (!titulo || !mensagem || !cor || !rota) throw new Error('Campos vazios no formulário. Preencha todos os campos.');
      const response: IAviso | null = await service.criarAviso({
        titulo: titulo,
        mensagem: mensagem,
        cor: cor,
        rota: rota,
        sistema_id: sistema
      });
      if (!response) throw new Error('Erro ao cadastrar o aviso.');
      setAlert('Aviso criado.', 'Esse aviso foi criado com sucesso.', 'success', 3000, Check);
      limpaCamposInput();
      refreshFuncao();
      return response;
    } catch(e) {
      setAlert('Tente novamente!', 'Não foi possível atualizar o aviso.', 'warning', 3000, Warning);
      return null;
    }
  };

  const limpaCamposInput = (): void => {
    setTitulo('');
    setMensagem('');
    setCor('');
    setRota('');
    return
  };

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => openFuncao(false)}>
        <ModalDialog size='lg' sx={{ width: '500px' }}>
          <DialogTitle>Novo Aviso</DialogTitle>
          <DialogContent>Preencha as informações do aviso.</DialogContent>
          <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            handleSubmit(e);
            openFuncao(false);
          }}>
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
              <Button type='submit' disabled={!titulo?.length || !mensagem?.length || !cor?.length || !rota?.length ? true : false}>
                Salvar
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
