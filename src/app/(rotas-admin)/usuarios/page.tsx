'use client'

import Content from '@/components/Content';
import { Suspense, useCallback, useContext, useEffect, useState } from 'react';
import * as usuarioServices from '@/shared/services/usuario.services';
import * as unidadeServices from '@/shared/services/unidade.services';
import { Autocomplete, AutocompleteOption, Box, Button, Chip, ChipPropsColorOverrides, ColorPaletteProp, FormControl, FormLabel, IconButton, Input, Option, Select, Snackbar, Stack, Table, Tooltip, Typography, useTheme } from '@mui/joy';
import { Add, Cancel, Check, Clear, Edit, Refresh, Search, Warning } from '@mui/icons-material';
import { IPaginadoUsuario, IUsuario } from '@/shared/services/usuario.services';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertsContext } from '@/providers/alertsProvider';
import { TablePagination } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { IUnidade } from '@/shared/services/unidade.services';

export default function Usuarios(){
  return (
    <Suspense>
      <SearchUsuarios />
    </Suspense>
  )
}

function SearchUsuarios() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [pagina, setPagina] = useState(searchParams.get('pagina') ? Number(searchParams.get('pagina')) : 1);
  const [limite, setLimite] = useState(searchParams.get('limite') ? Number(searchParams.get('limite')) : 10);
  const [total, setTotal] = useState(searchParams.get('total') ? Number(searchParams.get('total')) : 1);
  const [status, setStatus] = useState(searchParams.get('status') ? Number(searchParams.get('status')) : 1);
  const [busca, setBusca] = useState(searchParams.get('busca') || '');
  const [unidade_id, setUnidade_id] = useState('');
  const [unidades, setUnidades] = useState<IUnidade[]>([]);
  const [usuario, setUsuario] = useState<IUsuario>({} as IUsuario);

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
    unidadeServices.listaCompleta()
        .then((response: IUnidade[]) => {
            setUnidades(response);
        })
    usuarioServices.validaUsuario()
        .then((response: IUsuario) => {
            setUsuario(response);
        })
    buscaUsuarios();
  }, [ status, pagina, limite, unidade_id ]);
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString();
    },
    [searchParams]
  );

  const buscaUsuarios = async () => {
    usuarioServices.buscarTudo(status, pagina, limite, busca, unidade_id)
      .then((response: IPaginadoUsuario) => {
        setTotal(response.total);
        setPagina(response.pagina);
        setLimite(response.limite);
        setUsuarios(response.data);
      });    
  }

  const limpaFitros = () => {
    setBusca('');
    setStatus(1);
    setUnidade_id('');
    setPagina(1);
    setLimite(10);
    router.push(pathname);
    buscaUsuarios();
  }
  
  const autorizaUsuario = async (id: string) => {
    var resposta = await usuarioServices.autorizar(id);
    if (resposta && resposta.autorizado){
      setAlert('Usuário autorizado!', 'Esse usuário foi autorizado e já pode acessar o sistema.', 'success', 3000, Check);
      buscaUsuarios();
    } else {
      setAlert('Tente novamente!', 'Não foi possível autorizar o usuário.', 'warning', 3000, Warning);
    }
    setConfirma(confirmaVazio);
  }
  
  const desativaUsuario = async (id: string) => {
    var resposta: { desativado: boolean } = await usuarioServices.desativar(id);
    if (resposta && resposta.desativado){
      setAlert('Usuário desativado!', 'Esse usuário foi desativado e não poderá acessar o sistema.', 'success', 3000, Check);
      buscaUsuarios();
    } else {
      setAlert('Tente novamente!', 'Não foi possível desativar o usuário.', 'warning', 3000, Warning);
    }
    setConfirma(confirmaVazio);
  }

  const mudaPagina = (
    _: React.MouseEvent<HTMLButtonElement> | null, novaPagina: number,
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

  const confirmaAutorizaUsuario = async (id: string) => {
    setConfirma({ 
      aberto: true,
      confirmaOperacao: () => autorizaUsuario(id),
      titulo: 'Autorizar usuário',
      pergunta: 'Deseja autorizar este usuário?',
      color: 'primary'
    });
  }

  const confirmaDesativaUsuario = async (id: string) => {
    setConfirma({ 
      aberto: true,
      confirmaOperacao: () => desativaUsuario(id),
      titulo: 'Excluir usuário',
      pergunta: 'Deseja excluir este usuário?',
      color: 'warning'
    });
  }

  const permissoes: Record<string, { label: string, value: string, color: OverridableStringUnion<ColorPaletteProp, ChipPropsColorOverrides> | undefined }> = {
    'DEV': { label: 'Desenvolvedor', value: 'DEV', color: 'primary' },
    'TEC': { label: 'Técnico', value: 'TEC', color: 'neutral' },
    'ADM': { label: 'Administrador', value: 'ADM', color: 'success' },
    'USR': { label: 'Usuário', value: 'USR', color: 'warning' },
  }

  return (
    <Content
      breadcrumbs={[
        { label: 'Usuários', href: '/usuarios' }
      ]}
      titulo='Usuários'
      pagina='usuarios'
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
        <IconButton size='sm' onClick={buscaUsuarios}><Refresh /></IconButton>
        <IconButton size='sm' onClick={limpaFitros}><Clear /></IconButton>
        {usuario.dev ? (<FormControl size="sm">
          <FormLabel>Status: </FormLabel>
          <Select
            size="sm"
            value={status}
            onChange={(_, newValue) => {
              router.push(pathname + '?' + createQueryString('status', String(newValue! || 1)));
              setStatus(newValue! || 1);
            }}
          >
            <Option value={1}>Ativos</Option>
            <Option value={2}>Inativos</Option>
            <Option value={4}>Todos</Option>
          </Select>
        </FormControl>) : null}
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Unidade: </FormLabel>
          <Autocomplete
              options={unidades}
              getOptionLabel={(option) => option && option.sigla}
              renderOption={(props, option) => (
                <AutocompleteOption {...props} key={option.id} value={option.id}>
                  {option.sigla}
                </AutocompleteOption>
              )}
              placeholder="Unidade"
              value={unidade_id && unidade_id !== '' ? unidades.find((unidade: IUnidade) => unidade.id === unidade_id) : null}
              onChange={(_, value) => {
                router.push(pathname + '?' + createQueryString('unidade_id', value ? value.id : ''));
                setUnidade_id(value ? value.id : '') ;
              }}
              filterOptions={(options, { inputValue }) => {
                  if (unidades) return (options as IUnidade[]).filter((option) => (
                      (option).nome.toLowerCase().includes(inputValue.toLowerCase()) || 
                      (option).sigla.toLowerCase().includes(inputValue.toLowerCase())
                  ));
                  return [];
              }}
              noOptionsText="Nenhuma unidade encontrada"
          />
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
                buscaUsuarios();
              }
            }}
          />
        </FormControl>
      </Box>
      <Table hoverRow sx={{ tableLayout: 'auto' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Usuário</th>
            <th>Unidade</th>
            <th style={{ textAlign: 'right' }}></th>
          </tr>
        </thead>
        <tbody>
          {usuarios ? usuarios.map((usuario) => (
            <tr key={usuario.id} style={{
              cursor: 'pointer',
              backgroundColor: usuario.status === 3 ? 
                theme.vars.palette.warning.plainActiveBg : 
                usuario.status === 2 ? 
                  theme.vars.palette.danger.plainActiveBg : 
                  undefined
            }}>
              <td onClick={() => router.push('/usuarios/detalhes/' + usuario.id)}>{usuario.nome}</td>
              <td onClick={() => router.push('/usuarios/detalhes/' + usuario.id)}>{usuario.email}</td>
              <td onClick={() => router.push('/usuarios/detalhes/' + usuario.id)}>{usuario.login}</td>
              <td onClick={() => router.push('/usuarios/detalhes/' + usuario.id)}>{usuario.unidade && <Chip onClick={() => {
                setUnidade_id(usuario.unidade_id);
                router.push(pathname + '?' + createQueryString('unidade_id', usuario.unidade_id));
              }} variant='outlined' color='neutral' title={usuario.unidade.nome}>{usuario.unidade.sigla}</Chip>}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  {usuario.status !== 1 ? (
                    <Tooltip title="Aprovar usuário novo" arrow placement="top">
                      <IconButton size="sm" color="success" onClick={() => confirmaAutorizaUsuario(usuario.id)}>
                        <Check />
                      </IconButton>
                    </Tooltip>                    
                  ) : (<Tooltip title="Excluir" arrow placement="top">
                    <IconButton title="Excluir" size="sm" color="danger" onClick={() => confirmaDesativaUsuario(usuario.id)}>
                      <Cancel />
                    </IconButton>
                  </Tooltip>)}
                </div>
              </td>
            </tr>
          )) : <tr><td colSpan={6}>Nenhum usuário encontrado</td></tr>}
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
      <IconButton onClick={() => router.push('/usuarios/detalhes/')} color='primary' variant='soft' size='lg' sx={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
      }}><Add /></IconButton>
    </Content>
  );
}