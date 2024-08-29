'use client'

import Content from '@/components/Content';
import { FormEvent, Fragment, Suspense, useCallback, useContext, useEffect, useState } from 'react';
import * as sistemaServices from '@/shared/services/sistema.services';
import { Box, Button, ChipPropsColorOverrides, ColorPaletteProp, DialogContent, DialogTitle, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Option, Select, Snackbar, Stack, Table, Tooltip, Typography, useTheme } from '@mui/joy';
import { Add, Cancel, Check, Clear, Refresh, Search, Warning } from '@mui/icons-material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertsContext } from '@/providers/alertsProvider';
import { TablePagination } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { IPaginadoSistema, ISistema } from '@/shared/services/sistema.services';

export default function Sistemas() {
  return (
    <Suspense>
      <SearchSistemas />
    </Suspense>
  )
}

function SearchSistemas() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [sistemas, setSistemas] = useState<ISistema[]>([]);
  const [pagina, setPagina] = useState(searchParams.get('pagina') ? Number(searchParams.get('pagina')) : 1);
  const [limite, setLimite] = useState(searchParams.get('limite') ? Number(searchParams.get('limite')) : 10);
  const [total, setTotal] = useState(searchParams.get('total') ? Number(searchParams.get('total')) : 1);
  const [status, setStatus] = useState<string>(searchParams.get('status') ? searchParams.get('status') + '' : 'true');
  const [busca, setBusca] = useState(searchParams.get('busca') || '');
  const [nome, setNome] = useState('');
  const [dados, setDados] = useState<ISistema[]>([]);
  const [statusForm, setStatusForm] = useState('true');
  const [padrao, setPadrao] = useState('true');
  const [id, setId] = useState('');

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
    buscaSistemas();
  }, [status, pagina, limite]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    sistemaServices.buscarTudo()
      .then((res: IPaginadoSistema) => {
        setDados(res.data)
      })
  }, []);



  const buscaSistemas = async () => {
    sistemaServices.buscarTudo(status, pagina, limite, busca)
      .then((response: IPaginadoSistema) => {
        setTotal(response.total);
        setPagina(response.pagina);
        setLimite(response.limite);
        setSistemas(response.data);
      });
  }

  const desativaSistema = async (id: string) => {
    var resposta = await sistemaServices.desativar(id);
    if (resposta) {
      setAlert('Sistema desativado!', 'Esse sistema foi desativado e não será exibido para seleção.', 'success', 3000, Check);
      buscaSistemas();
    } else {
      setAlert('Tente novamente!', 'Não foi possível desativar o tipo.', 'warning', 3000, Warning);
    }
    setConfirma(confirmaVazio);
  }

  const criar = async (nome: string, status: string) => {
    const criado: ISistema = await sistemaServices.criar(
      { nome, status }
    ).then((r: ISistema) => {
      setNome('');
      setPadrao('false');
      setStatusForm('true');
      return r
    });
    if (!criado) setAlert('Tente novamente!', 'Não foi possível criar o tipo.', 'warning', 3000, Warning);
    if (criado) {
      setAlert('Sistema criado', 'Sistema registrado com sucesso.', 'success', 3000, Check)
      buscaSistemas();
    };
  }
  const atualizar = async (id: string, nome: string, padrao: boolean, status: string) => {
    const alterado: ISistema = await sistemaServices.atualizar({
      id, nome, status
    }).then((r: ISistema) => {
      setNome('');
      setPadrao('false');
      setStatusForm('true');
      return r
    });
    if (!alterado) setAlert('Tente novamente!', 'Não foi possível alterar o tipo.', 'warning', 3000, Warning);
    if (alterado) {
      setAlert('Sistema alterado', 'Sistema alterado com sucesso.', 'success', 3000, Check)
      buscaSistemas();
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

  const confirmaDesativaSistema = async (id: string) => {
    setConfirma({
      aberto: true,
      confirmaOperacao: () => desativaSistema(id),
      titulo: 'Desativar sistema',
      pergunta: 'Deseja desativar este sistema?',
      color: 'warning'
    });
  }

  const ativaSistema = async (id: string) => {
    var resposta = await sistemaServices.ativar(id);
    if (resposta) {
      setAlert('Sistema ativado!', 'Esse sistema foi autorizado e será visível para seleção.', 'success', 3000, Check);
      buscaSistemas();
    } else {
      setAlert('Tente novamente!', 'Não foi possível ativar tipo.', 'warning', 3000, Warning);
    }
    setConfirma(confirmaVazio);
  }

  const confirmaAtivaSistema = async (id: string) => {
    setConfirma({
      aberto: true,
      confirmaOperacao: () => ativaSistema(id),
      titulo: 'Ativar sistema',
      pergunta: 'Deseja ativar este sistema?',
      color: 'primary'
    });
  }

  const limpaFitros = () => {
    setBusca('');
    setStatus('true');
    setPagina(1);
    setLimite(10);
    router.push(pathname);
    buscaSistemas();
  }

  return (
    <Content
      breadcrumbs={[
        { label: 'Sistemas', href: '/sistemas' }
      ]}
      titulo='Sistema'
      pagina='sistemas'
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
        <IconButton size='sm' onClick={buscaSistemas}><Refresh /></IconButton>
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
                buscaSistemas();
              }
            }}
          />
        </FormControl>
      </Box>
      <Table hoverRow sx={{ tableLayout: 'auto' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Padrão</th>
            <th style={{ textAlign: 'right' }}></th>
          </tr>
        </thead>
        <tbody>
          {sistemas ? sistemas.map((sistema) => (
            <tr key={sistema.id} style={{
              cursor: 'pointer',
              backgroundColor: !sistema.status ?
                theme.vars.palette.danger.plainActiveBg :
                undefined
            }}>
              <td onClick={() => {
                setOpen(true)
                setNome(sistema.nome)
                setId(sistema.id)
                setStatus(sistema.status ? 'true' : 'false')
              }}>{sistema.nome}</td>
              <td onClick={() => {
                setOpen(true)
                setNome(sistema.nome)
                setId(sistema.id)
                setPadrao(sistema.padrao ? 'false' : 'true')
                setStatus(sistema.status ? 'true' : 'false')
              }}>{tipo.padrao ? 'Sim' : 'Não'}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  {!sistema.status ? (
                    <Tooltip title="Ativar Unidade" arrow placement="top">
                      <IconButton size="sm" color="success" onClick={() => { confirmaAtivaSistema(sistema.id);}}>
                        <Check />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Desativar" arrow placement="top">
                      <IconButton title="Desativar" size="sm" color="danger" onClick={() => confirmaDesativaSistema(sistema.id)}>
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </td>
            </tr>
          )) : <tr><td colSpan={2}>Nenhum sistema encontrado</td></tr>}
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
      <Fragment>
        <IconButton onClick={() => setOpen(true)} color='primary' variant='soft' size='lg' sx={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
        }}><Add /></IconButton>
        <Modal open={open} onClose={() => { setOpen(false); setId(''); setNome(''); setPadrao('false'); setStatusForm('true'); }}>
          <ModalDialog>
            <DialogTitle>{id === '' ? 'Criar' : 'Atualizar'} Sistema</DialogTitle>
            <DialogContent>Preencha todos os campos para criar um novo sistema.</DialogContent>
            <form
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                if (id === '') {
                  criar(nome, statusForm);
                } else {
                  atualizar(id, nome, padrao === 'false' ? true : false, statusForm);
                }
                setOpen(false);
              }}
            >
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Nome</FormLabel>
                  <Input value={nome} onChange={(e) => setNome(e.target.value)} autoFocus required />
                </FormControl>
                <FormControl>
                  <FormLabel>Padrão</FormLabel>
                  <Select value={padrao} onChange={(_, v) => setPadrao(v as string)} required>
                    <Option value="true">Não</Option>
                    <Option value="false">Sim</Option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select value={statusForm} onChange={(_, v) => setStatusForm(v as string)} required>
                    <Option value="true">Ativo</Option>
                    <Option value="false">Inativo</Option>
                  </Select>
                </FormControl>
                <Button type="submit" disabled={nome.length < 1 ? true : false}>{id === '' ? 'Criar' : 'Atualizar'}</Button>
              </Stack>
            </form>
          </ModalDialog>
        </Modal>
      </Fragment>
    </Content>
  );
}