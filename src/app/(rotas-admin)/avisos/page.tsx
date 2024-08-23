'use client'

import Content from '@/components/Content';
import { Suspense, useCallback, useContext, useEffect, useState } from 'react';
import { Box, Button, ChipPropsColorOverrides, ColorPaletteProp, FormControl, FormLabel, IconButton, Input, Option, Select, Snackbar, Stack, Table, Tooltip, Typography, useTheme } from '@mui/joy';
import { Add, Cancel, Check, Clear, Refresh, Search, Warning } from '@mui/icons-material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertsContext } from '@/providers/alertsProvider';
import { TablePagination } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import * as avisoService from '@/shared/services/avisos.service';
import IAviso from '@/shared/interfaces/IAviso';
import FormNovoAviso from '@/components/FormNovoAviso';
import FormAtualizaAviso from '@/components/FormAtualizaAviso';

export default function Avisos(){
  return (
    <Suspense>
      <SearchAvisos />
    </Suspense>
  )
}

function SearchAvisos() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [avisos, setAvisos] = useState<IAviso[]>([]);
  const [pagina, setPagina] = useState(searchParams.get('pagina') ? Number(searchParams.get('pagina')) : 1);
  const [limite, setLimite] = useState(searchParams.get('limite') ? Number(searchParams.get('limite')) : 10);
  const [total, setTotal] = useState(searchParams.get('total') ? Number(searchParams.get('total')) : 1);
  const [status, setStatus] = useState<string>(searchParams.get('status') ? searchParams.get('status') + '' : 'true');
  const [busca, setBusca] = useState(searchParams.get('busca') || '');
  const [openNovoAviso, setOpenNovoAviso] = useState<boolean>(false);
  const [openAtualizaAviso, setOpenAtualizaAviso] = useState<boolean>(false);

  const confirmaVazio: {
    aberto: boolean,
    confirmaOperacao: () => void,
    titulo: string,
    pergunta: string,
    color: OverridableStringUnion<ColorPaletteProp, ChipPropsColorOverrides>
  } = {
    aberto: false,
    confirmaOperacao: () => {},
    titulo: '',
    pergunta: '',
    color: 'primary'
  }
  const [confirma, setConfirma] = useState(confirmaVazio);
  const { setAlert } = useContext(AlertsContext);

  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    buscaAvisos();
  }, [ status, pagina, limite ]);
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString();
    },
    [searchParams]
  );

  const buscaAvisos = async () => {
    avisoService.buscarTudo(status, pagina, limite, busca)
      .then((response: avisoService.IPaginadoAviso) => {
        setTotal(response.total);
        setPagina(response.pagina);
        setLimite(response.limite);
        setAvisos(response.data);
      });
  }
  
  const desativaAviso = async (id: string) => {
    var resposta = await avisoService.desativar(id);
    if (resposta){
      setAlert('Aviso desativado!', 'Esse aviso foi desativado e não será exibido para seleção.', 'success', 3000, Check);
        avisoService.desativar(id);
    } else {
      setAlert('Tente novamente!', 'Não foi possível desativar o aviso.', 'warning', 3000, Warning);
    }
    setConfirma(confirmaVazio);
  }

  const mudaPagina = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    novaPagina: number,
  ) => {
    router.push(pathname + '?' + createQueryString('pagina', String(novaPagina + 1)));
    setPagina(novaPagina + 1);
  };

  const mudaLimite = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    router.push(pathname + '?' + createQueryString('limite', String(event.target.value)));
    setLimite(parseInt(event.target.value, 10));
    setPagina(1);
  };

  const confirmaDesativaAviso = async (id: string) => {
    setConfirma({ 
      aberto: true,
      confirmaOperacao: () => desativaAviso(id),
      titulo: 'Desativar aviso',
      pergunta: 'Deseja desativar este aviso?',
      color: 'warning'
    });
  }

  const ativaAviso = async (id: string) => {
    var resposta = await avisoService.ativar(id);
    if (resposta){
      setAlert('Aviso ativado!', 'Esse aviso foi autorizado e será visível para seleção.', 'success', 3000, Check);
        avisoService.buscarTudo();
    } else {
      setAlert('Tente novamente!', 'Não foi possível ativar Aviso.', 'warning', 3000, Warning);
    }
    setConfirma(confirmaVazio);
  }

  const confirmaAtivaAviso = async (id: string) => {
    setConfirma({ 
      aberto: true,
      confirmaOperacao: () => ativaAviso(id),
      titulo: 'Ativar aviso',
      pergunta: 'Deseja ativar este aviso?',
      color: 'primary'
    });
  }

  const limpaFitros = () => {
    setBusca('');
    setStatus('true');
    setPagina(1);
    setLimite(10);
    router.push(pathname);
    avisoService.buscarTudo();
  }

  return (
    <Content
        breadcrumbs={[
            { label: 'Avisos', href: '/avisos' }
        ]}
        titulo='Avisos'
        pagina='avisos'
    >
      <Snackbar
        variant="solid"
        color={confirma.color}
        size="lg"
        invertedColors
        open={confirma.aberto}
        onClose={() => setConfirma({ ...confirma, aberto: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ maxWidth: 360 }}
      >
        <div>
          <Typography level="title-lg">{confirma.titulo}</Typography>
          <Typography sx={{ mt: 1, mb: 2 }} level="title-md">{confirma.pergunta}</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="solid" color="primary" onClick={() => confirma.confirmaOperacao()}>
              Sim
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setConfirma(confirmaVazio)}
            >
              Não
            </Button>
          </Stack>
        </div>
      </Snackbar>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
          alignItems: 'end',
        }}
      >
        <IconButton size='sm' onClick={buscaAvisos}><Refresh /></IconButton>
        <IconButton size='sm' onClick={limpaFitros}><Clear /></IconButton>
        <FormControl size="sm">
          <FormLabel>Status: </FormLabel>
          <Select
            size="sm"
            value={status}
            onChange={(_, newValue) => {
              router.push(pathname + '?' + createQueryString('status', String(newValue! || 'true')));
              setStatus(newValue! || 'true');
            }}
          >
            <Option value={'true'}>Ativos</Option>
            <Option value={'false'}>Inativos</Option>
            <Option value={'all'}>Todos</Option>
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Buscar: </FormLabel>
          <Input
            startDecorator={<Search fontSize='small' />}
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                router.push(pathname + '?' + createQueryString('busca', busca));
                buscaAvisos();
              }
            }}
          />
        </FormControl>
      </Box>
      <Table hoverRow sx={{ tableLayout: 'auto' }}>
        <thead>
          <tr>
            <th>Título</th>
            <th style={{ textAlign: 'right' }}></th>
          </tr>
        </thead>
        <tbody>
          {avisos ? avisos.map((avisos) => (
            <tr key={avisos.id} style={{
              cursor: 'pointer',
              backgroundColor: !avisos.status ?
                  theme.vars.palette.danger.plainActiveBg : 
                  undefined
            }}>
              <td onClick={() => setOpenAtualizaAviso(true)}>{avisos.titulo}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  {!avisos.status ? (
                    <Tooltip title="Ativar Aviso" arrow placement="top">
                      <IconButton size="sm" color="success" onClick={() => confirmaAtivaAviso(avisos.id ? avisos.id : '')}>
                        <Check />
                      </IconButton>
                    </Tooltip>                    
                  ) : (
                    <Tooltip title="Desativar Aviso" arrow placement="top">
                      <IconButton title="Desativar" size="sm" color="danger" onClick={() => confirmaDesativaAviso(avisos.id ? avisos.id : '')}>
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </td>
              <FormAtualizaAviso open={openAtualizaAviso} openFuncao={setOpenAtualizaAviso} aviso={avisos} />
            </tr>
          )) : <tr><td colSpan={2}>Nenhum aviso encontrado</td></tr>}
        </tbody>
      </Table>
      {(total && total > 0) ? <TablePagination
        component="div"
        count={total}
        page={(pagina - 1)}
        onPageChange={mudaPagina}
        rowsPerPage={limite}
        onRowsPerPageChange={mudaLimite}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="Registros por página"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      /> : null}
      {<FormNovoAviso open={openNovoAviso} openFuncao={setOpenNovoAviso} />}
      <IconButton onClick={() => setOpenNovoAviso(true)} color='primary' variant='soft' size='lg' sx={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
      }}><Add /></IconButton>
    </Content>
  );
}