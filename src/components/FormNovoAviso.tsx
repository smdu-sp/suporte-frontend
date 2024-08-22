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

export default function FormNovoAviso({ open, openFuncao }: {  open: boolean, openFuncao: Function }) {
  return (
    <React.Fragment>
      <Modal open={open} onClose={() => openFuncao(false)}>
        <ModalDialog size='lg' sx={{ width: '500px' }}>
          <DialogTitle>Novo Aviso</DialogTitle>
          <DialogContent>Preencha as informações do aviso.</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              openFuncao(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Titulo</FormLabel>
                <Input autoFocus required />
              </FormControl>
              <FormControl>
                <FormLabel>Mensagem</FormLabel>
                <Textarea minRows={2} />
              </FormControl>
              <FormControl>
                <FormLabel>Cor</FormLabel>
                    <Select
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
                        <Option value="PRIMARY">Azul</Option>
                        <Option value="NEUTRAL">Cinza</Option>
                        <Option value="WARNING">Laranja</Option>
                        <Option value="DANGER">Vermelho</Option>
                        <Option value="SUCCESS">Verde</Option>
                    </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Rota</FormLabel>
                <Input required />
              </FormControl>
              <Button type="submit">Criar</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
