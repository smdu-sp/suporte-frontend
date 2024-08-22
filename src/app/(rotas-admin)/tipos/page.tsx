'use client'

import Content from '@/components/Content';
import { Suspense, useCallback, useContext, useEffect, useState } from 'react';
import * as tipoServices from '@/shared/services/tipo.services';
import { Box, Button, ChipPropsColorOverrides, ColorPaletteProp, FormControl, FormLabel, IconButton, Input, Option, Select, Snackbar, Stack, Table, Tooltip, Typography, useTheme } from '@mui/joy';
import { Add, Cancel, Check, Clear, Edit, Refresh, Search, Warning } from '@mui/icons-material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertsContext } from '@/providers/alertsProvider';
import { TablePagination } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { IPaginadoUnidade, IUnidade } from '@/shared/services/unidade.services';
import { IPaginadoTipo, ITipo } from '@/shared/services/tipo.services';
import FormCategoria from '@/components/FormCategoria';

export default function Tipos() {
  return (
    <Suspense>
      <SearchTipos />
    </Suspense>
  )
}

function SearchTipos() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [tipos, setTipos] = useState<ITipo[]>([]);
  const [pagina, setPagina] = useState(searchParams.get('pagina') ? Number(searchParams.get('pagina')) : 1);
  const [limite, setLimite] = useState(searchParams.get('limite') ? Number(searchParams.get('limite')) : 10);
  const [total, setTotal] = useState(searchParams.get('total') ? Number(searchParams.get('total')) : 1);
  const [status, setStatus] = useState<string>(searchParams.get('status') ? searchParams.get('status') + '' : 'true');
  const [busca, setBusca] = useState(searchParams.get('busca') || '');
  const [open, setOpen] = useState(false);

  const confirmaVazio: {
    aberto: boolean,
    confirmaOperacao: () => void,
    titulo: string,
    pergunta: string,
    color: OverridableStringUnion<ColorPaletteProp, ChipPropsColorOverrides>
  } = {
    aberto: false,
    confirmaOperacao: () => { },
    titulo: '',
    pergunta: '',
    color: 'primary'
  }
  const [confirma, setConfirma] = useState(confirmaVazio);
  const { setAlert } = useContext(AlertsContext);

  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    buscaTipos();
  }, [status, pagina, limite]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString();
    },
    [searchParams]
  );



  const buscaTipos = async () => {
    tipoServices.buscarTudo(status, pagina, limite, busca)
      .then((response: IPaginadoTipo) => {
        setTotal(response.total);
        setPagina(response.pagina);
        setLimite(response.limite);
        setTipos(response.data);
      });
  }

  const desativaTipo = async (id: string) => {
    var resposta = await tipoServices.desativar(id);
    if (resposta) {
      setAlert('Tipo desativado!', 'Esse tipo foi desativado e não será exibido para seleção.', 'success', 3000, Check);
      buscaTipos();
    } else {
      setAlert('Tente novamente!', 'Não foi possível desativar o tipo.', 'warning', 3000, Warning);
    }
    setConfirma(confirmaVazio);
  }

  const criar = async (nome: string, status: string) => {
    const criado: ITipo = await tipoServices.criar(
      { nome, status }
    );
    if (!criado) setAlert('Tente novamente!', 'Não foi possível criar o tipo.', 'warning', 3000, Warning);
    if (criado) {
      setAlert('Tipo criado', 'Tipo registrado com sucesso.', 'success', 3000, Check)
      buscaTipos();
    };
  }
  const atualizar = async (id: string, nome: string, status: string) => {
    const alterado: ITipo = await tipoServices.atualizar({
      id, nome, status
    });
    if (!alterado) setAlert('Tente novamente!', 'Não foi possível alterar o tipo.', 'warning', 3000, Warning);
    if (alterado) {
      setAlert('Tipo alterado', 'Tipo alterado com sucesso.', 'success', 3000, Check)
      buscaTipos();
    };
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

  const confirmaDesativaTipo = async (id: string) => {
    setConfirma({
      aberto: true,
      confirmaOperacao: () => desativaTipo(id),
      titulo: 'Desativar tipo',
      pergunta: 'Deseja desativar este tipo?',
      color: 'warning'
    });
  }

  const ativaTipo = async (id: string) => {
    var resposta = await tipoServices.ativar(id);
    if (resposta) {
      setAlert('Tipo ativado!', 'Esse tipo foi autorizado e será visível para seleção.', 'success', 3000, Check);
      buscaTipos();
    } else {
      setAlert('Tente novamente!', 'Não foi possível ativar tipo.', 'warning', 3000, Warning);
    }
    setConfirma(confirmaVazio);
  }

  const confirmaAtivaTipo = async (id: string) => {
    setConfirma({
      aberto: true,
      confirmaOperacao: () => ativaTipo(id),
      titulo: 'Ativar tipo',
      pergunta: 'Deseja ativar este tipo?',
      color: 'primary'
    });
  }

  const limpaFitros = () => {
    setBusca('');
    setStatus('true');
    setPagina(1);
    setLimite(10);
    router.push(pathname);
    buscaTipos();
  }

  return (
    <Content
      breadcrumbs={[
        { label: 'Tipos', href: '/tipos' }
      ]}
      titulo='Tipos'
      pagina='tipos'
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
        <IconButton size='sm' onClick={buscaTipos}><Refresh /></IconButton>
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
                buscaTipos();
              }
            }}
          />
        </FormControl>
      </Box>
      <Table hoverRow sx={{ tableLayout: 'auto' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th style={{ textAlign: 'right' }}></th>
          </tr>
        </thead>
        <tbody>
          {tipos ? tipos.map((tipo) => (
            <tr key={tipo.id} style={{
              cursor: 'pointer',
              backgroundColor: !tipo.status ?
                theme.vars.palette.danger.plainActiveBg :
                undefined
            }}>
              <td onClick={() => { router.push('/tipos?id=' + tipo.id); setOpen(true) }}>{tipo.nome}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  {!tipo.status ? (
                    <Tooltip title="Ativar Unidade" arrow placement="top">
                      <IconButton size="sm" color="success" onClick={() => { confirmaAtivaTipo(tipo.id); setOpen(true) }}>
                        <Check />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Desativar" arrow placement="top">
                      <IconButton title="Desativar" size="sm" color="danger" onClick={() => confirmaDesativaTipo(tipo.id)}>
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </td>
            </tr>
          )) : <tr><td colSpan={2}>Nenhum tipo encontrado</td></tr>}
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
      <FormCategoria
        titulo='Tipo'
        titulo_select=''
        tipo='tipo'
        criar={criar}
        atualizar={atualizar}
        open={open}
      />
    </Content>
  );
}