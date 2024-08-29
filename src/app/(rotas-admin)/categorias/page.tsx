'use client'

import Content from '@/components/Content';
import { FormEvent, Fragment, Suspense, useCallback, useContext, useEffect, useState } from 'react';
import * as categoriaServices from '@/shared/services/categoria.services';
import * as sistemaServices from '@/shared/services/sistema.services';
import { Box, Button, ChipPropsColorOverrides, ColorPaletteProp, DialogContent, DialogTitle, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Option, Select, Snackbar, Stack, Table, Tooltip, Typography, useTheme } from '@mui/joy';
import { Add, Cancel, Check, Clear, Edit, Refresh, Search, Warning } from '@mui/icons-material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertsContext } from '@/providers/alertsProvider';
import { TablePagination } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { IPaginadoCategoria, ICategoria } from '@/shared/services/categoria.services';
import { ISistema } from '@/shared/services/sistema.services';

export default function Categorias() {
  return (
    <Suspense>
      <SearchCategorias />
    </Suspense>
  )
}

function SearchCategorias() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [pagina, setPagina] = useState(searchParams.get('pagina') ? Number(searchParams.get('pagina')) : 1);
  const [limite, setLimite] = useState(searchParams.get('limite') ? Number(searchParams.get('limite')) : 10);
  const [total, setTotal] = useState(searchParams.get('total') ? Number(searchParams.get('total')) : 1);
  const [status, setStatus] = useState<string>(searchParams.get('status') ? searchParams.get('status') + '' : 'true');
  const [busca, setBusca] = useState(searchParams.get('busca') || '');
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [dados, setDados] = useState<ISistema[]>([]);
  const [statusForm, setStatusForm] = useState('true');
  const [id, setId] = useState('');
  const [idSistema, setIdSistema] = useState('');

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
    buscaCategorias();
  }, [status, pagina, limite]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString();
    },
    [searchParams]
  );

  const buscaCategorias = async () => {
    categoriaServices.buscarTudo(status, pagina, limite, busca)
      .then((response: IPaginadoCategoria) => {
        setTotal(response.total);
        setPagina(response.pagina);
        setLimite(response.limite);
        setCategorias(response.data);
      });
  }

  const desativaCategoria = async (id: string) => {
    var resposta = await categoriaServices.desativar(id);
    if (resposta) {
      setAlert('Categoria desativada!', 'Essa categoria foi desativada e não será exibida para seleção.', 'success', 3000, Check);
      buscaCategorias();
    } else {
      setAlert('Tente novamente!', 'Não foi possível desativar a categoria.', 'warning', 3000, Warning);
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

  const confirmaDesativaCategoria = async (id: string) => {
    setConfirma({
      aberto: true,
      confirmaOperacao: () => desativaCategoria(id),
      titulo: 'Desativar categoria',
      pergunta: 'Deseja desativar esta categoria?',
      color: 'warning'
    });
  }

  useEffect(() => {
    sistemaServices.buscarTudo()
      .then((res) => {
        setDados(res.data)
      })
  }, []);

  const criar = async (nome: string, sistema_id: string, status: string) => {
    const criado: ICategoria = await categoriaServices.criar(
      { nome, sistema_id, status }
    ).then((r: ICategoria) => {
      setNome('');
      setIdSistema('');
      setStatusForm('true');
      return r
    });
    if (!criado) setAlert('Tente novamente!', 'Não foi possível criar a categoria.', 'warning', 3000, Warning);
    if (criado) {
      setAlert('Categoria criada', 'Categoria registrada com sucesso.', 'success', 3000, Check)
      buscaCategorias();
    };
  }
  const atualizar = async (id: string, nome: string, sistema_id: string, status: string) => {
    const alterado: ICategoria = await categoriaServices.atualizar({
      id, nome, sistema_id, status
    }).then((r: ICategoria) => {
      setNome('');
      setIdSistema('');
      setStatusForm('true');
      return r
    });
    if (!alterado) setAlert('Tente novamente!', 'Não foi possível alterar a categoria.', 'warning', 3000, Warning);
    if (alterado) {
      setAlert('Categoria alterada', 'Categoria alterada com sucesso.', 'success', 3000, Check)
      buscaCategorias();
    };
  }

  const ativaCategoria = async (id: string) => {
    var resposta = await categoriaServices.ativar(id);
    if (resposta) {
      setAlert('Categoria ativado!', 'Essa categoria foi autorizado e será visível para seleção.', 'success', 3000, Check);
      buscaCategorias();
    } else {
      setAlert('Tente novamente!', 'Não foi possível ativar essa categoria.', 'warning', 3000, Warning);
    }
    setConfirma(confirmaVazio);
  }

  const confirmaAtivaCategoria = async (id: string) => {
    setConfirma({
      aberto: true,
      confirmaOperacao: () => ativaCategoria(id),
      titulo: 'Ativar categoria',
      pergunta: 'Deseja ativar esta categoria?',
      color: 'primary'
    });
  }

  const limpaFitros = () => {
    setBusca('');
    setStatus('true');
    setPagina(1);
    setLimite(10);
    router.push(pathname);
    buscaCategorias();
  }

  return (
    <Content
      breadcrumbs={[
        { label: 'Categorias', href: '/categorias' }
      ]}
      titulo='Categorias'
      pagina='categorias'
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
        <IconButton size='sm' onClick={buscaCategorias}><Refresh /></IconButton>
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
                buscaCategorias();
              }
            }}
          />
        </FormControl>
      </Box>
      <Table hoverRow sx={{ tableLayout: 'auto' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sistema Referente</th>
            <th style={{ textAlign: 'right' }}></th>
          </tr>
        </thead>
        <tbody>
          {categorias ? categorias.map((categoria) => (
            <tr key={categoria.id} style={{
              cursor: 'pointer',
              backgroundColor: !categoria.status ?
                theme.vars.palette.danger.plainActiveBg :
                undefined
            }}>
              <td onClick={() => {
                setOpen(true)
                setNome(categoria.nome)
                setId(categoria.id)
                setIdSistema(categoria.sistema_id)
                setStatus(categoria.status ? 'true' : 'false')
              }}
              >{categoria.nome}</td>
              <td
                onClick={() => {
                  setOpen(true)
                  setNome(categoria.nome)
                  setId(categoria.id)
                  setIdSistema(categoria.sistema_id)
                  setStatus(categoria.status ? 'true' : 'false')
                }}
              >{categoria.sistema?.nome}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  {!categoria.status ? (
                    <Tooltip title="Ativar categoria" arrow placement="top">
                      <IconButton size="sm" color="success" onClick={() => confirmaAtivaCategoria(categoria.id)}>
                        <Check />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Desativar" arrow placement="top">
                      <IconButton title="Desativar" size="sm" color="danger" onClick={() => confirmaDesativaCategoria(categoria.id)}>
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </td>
            </tr>
          )) : <tr><td colSpan={2}>Nenhuma categoria encontrada</td></tr>}
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
        <Modal open={open} onClose={() => { setOpen(false); setId(''); setNome(''); }}>
          <ModalDialog>
            <DialogTitle>{id === '' ? 'Criar' : 'Atualizar'} Categoria</DialogTitle>
            <DialogContent>Preencha todos os campos para criar uma nova categoria.</DialogContent>
            <form
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                if (id === '') {
                  criar(nome, idSistema, statusForm);
                } else {
                  atualizar(id, nome, idSistema, statusForm);
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
                  <FormLabel>Sistema Referente</FormLabel>
                  <Select value={idSistema} onChange={(_, v) => setIdSistema(v as string)} required>
                    {dados && dados.length > 0 ? dados.map((d) => <Option key={d.id} value={d.id}>{d.nome}</Option>) : null}
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