import * as React from 'react';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import { ModalDialogProps } from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { Card, ColorPaletteProp } from '@mui/joy';
import IAviso from '@/shared/interfaces/IAviso';

export default function ModalAviso({ avisos }: { avisos: IAviso[] }) {
  const [variant, setVariant] = React.useState<ModalDialogProps['variant'] | undefined>('soft');
  return (
    <React.Fragment>
      <Modal 
        open={!!variant} 
        onClose={() => setVariant(undefined)} 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: 700,
          justifySelf: 'center'
        }} 
      >
        <React.Fragment>
          <ModalClose variant='soft' color='danger' sx={{ top: 'auto' }} />
          {avisos.map((a: IAviso) => {
              if (!a.status) return
              return (
                <Card variant={variant} color={a.cor.toLocaleLowerCase() as ColorPaletteProp} sx={{ width: 500, marginBottom: 5 }} >
                  <DialogTitle>{a.titulo}</DialogTitle>
                  <DialogContent>{a.mensagem}</DialogContent>
                </Card>
              );
          })}
        </React.Fragment>
      </Modal>
    </React.Fragment>
  );
}

