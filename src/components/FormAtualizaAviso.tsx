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
import { AlertsContext } from '@/providers/alertsProvider';
import { Check, Warning } from '@mui/icons-material';

// Constante tipo apenas para testes. Remover antes de subir em homologação e prod.
const tipo: string = '93ebf577-6f2f-4ce3-ace4-340b8f711cbb';

export default function FormAtualizaAviso(
  { open, openFuncao, aviso, refreshFuncao }: 
  {  
    open: boolean, 
    openFuncao: Function, 
    aviso: IAviso, 
    refreshFuncao: Function 
  }
) {
  const [ titulo, setTitulo ] = React.useState<string>();
  const [ mensagem, setMensagem ] = React.useState<string>();
  const [ cor, setCor ] = React.useState<string>();
  const [ rota, setRota ] = React.useState<string>();
  const { setAlert } = React.useContext(AlertsContext);

  React.useEffect(() => {
    setTitulo(aviso.titulo);
    setMensagem(aviso.mensagem);
    setCor(aviso.cor);
    setRota(aviso.rota);
  }, [ aviso ]);

  const handleUpdate = async (e: React.FormEvent): Promise<IAviso | null> => {
    e.preventDefault();
    try {
      if (!titulo || !mensagem || !cor || !rota) throw new Error('Campos vazios no formulário. Preencha todos os campos.');
      if (!aviso.id) throw new Error('ID do aviso não encontrado.');
      const response: IAviso | null = await service.atualizarAviso({
        titulo: titulo,
        mensagem: mensagem,
        cor: cor,
        rota: rota,
        tipo_id: tipo
      }, aviso.id);
      if (!response) throw new Error('Erro ao atualizar o aviso.');
      setAlert('Aviso atualizado!', 'Esse aviso foi atualizado com sucesso.', 'success', 3000, Check);
      openFuncao(false);
      refreshFuncao();
      return response;
    } catch(e) {
      console.log(e);
      setAlert('Tente novamente!', 'Não foi possível atualizar o aviso.', 'warning', 3000, Warning);
      return null;
    }
  };

  const handleDelete = async (e: React.FormEvent): Promise<IAviso | null> => {
    e.preventDefault();
    try {
      if (!aviso.id) throw new Error('ID do aviso não encontrado.');
      const aviso_deletado: IAviso = await service.remover(aviso.id);
      if (!aviso_deletado) throw new Error('Erro ao deletar o aviso');
      setAlert('Aviso deletado!', 'Esse aviso foi deletado com sucesso.', 'success', 3000, Check);
      refreshFuncao();
      return aviso_deletado;
    } catch (error) {
      console.log(e);
      setAlert('Tente novamente!', 'Não foi possível deletar o aviso.', 'warning', 3000, Warning);
      return null;
    }
  }

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => openFuncao(null)}>
        <ModalDialog size='lg' sx={{ width: '500px' }}>
          <DialogTitle>Atualizar Aviso</DialogTitle>
          <DialogContent>Atualize as informações do aviso.</DialogContent>
          <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            handleUpdate(e);
            openFuncao(false);
          }}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Titulo</FormLabel>
                <Input value={titulo} required onChange={(e) => setTitulo(e.target.value)}  />
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
                    <Option value="PRIMARY" onClick={() => setCor('PRIMARY')}>Azul</Option>
                    <Option value="NEUTRAL" onClick={() => setCor('NEUTRAL')}>Cinza</Option>
                    <Option value="WARNING" onClick={() => setCor('WARNING')}>Laranja</Option>
                    <Option value="DANGER" onClick={() => setCor('DANGER')}>Vermelho</Option>
                    <Option value="SUCCESS" onClick={() => setCor('SUCCESS')}>Verde</Option>
                  </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Rota</FormLabel>
                <Input value={rota} required onChange={(e) => setRota(e.target.value)} />
              </FormControl>
              <Button type="submit" disabled={!titulo?.length || !mensagem?.length || !cor?.length || !rota?.length ? true : false}>
                Salvar
              </Button>
              <Button onClick={(e) => {
                handleDelete(e);
                openFuncao(false);
              }} color='danger' variant='soft'>Deletar</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
