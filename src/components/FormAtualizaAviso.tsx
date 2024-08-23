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

// Constante tipo apenas para testes. Remover antes de subir em homologação e prod.
const tipo: string = 'a49c681d-a99a-432f-a924-3d55b5842407';

export default function FormAtualizaAviso({ open, openFuncao, aviso }: {  open: boolean, openFuncao: Function, aviso: IAviso }) {
  // debugar prop de aviso, renderizando uma apenas no form de atualização
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
      return response;
    } catch(e) {
      console.log(e);
      // adicionar handler de erros
      return null;
    }
  };

  const handleDelete = async (e: React.FormEvent): Promise<IAviso | null> => {
    e.preventDefault();
    try {
      if (!aviso.id) throw new Error('ID do aviso não encontrado.');
      const aviso_deletado: IAviso = await service.remover(aviso.id);
      if (!aviso_deletado) throw new Error('Erro ao deletar o aviso');
      return aviso_deletado;
    } catch (error) {
      console.log(e);
      return null;
    }
  }

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => openFuncao(false)}>
        <ModalDialog size='lg' sx={{ width: '500px' }}>
          <DialogTitle>Atualizar Aviso</DialogTitle>
          <DialogContent>Atualize as informações do aviso.</DialogContent>
          <form onSubmit={handleUpdate}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Titulo</FormLabel>
                <Input value={titulo} autoFocus required onChange={(e) => setTitulo(e.target.value)}  />
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
              <Button type="submit">Salvar</Button>
              <Button onClick={handleDelete} color='danger' variant='soft'>Deletar</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
