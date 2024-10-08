import { Avatar, Box, Card, CardContent, Chip, ChipPropsColorOverrides, ColorPaletteProp, Skeleton, Typography } from "@mui/joy";
import { OverridableStringUnion } from '@mui/types';
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as usuarioServices from "@/shared/services/usuario.services";
import { IUsuario } from "@/shared/services/usuario.services";
import io from 'socket.io-client';

export default function Usuario() {
  const router = useRouter();
  const pathname = usePathname();
  const permissoes: Record<string, { label: string, value: string, color: OverridableStringUnion<ColorPaletteProp, ChipPropsColorOverrides> | undefined }> = {
    'DEV': { label: 'Desenvolvedor', value: 'DEV', color: 'primary' },
    'TEC': { label: 'Técnico', value: 'TEC', color: 'neutral' },
    'ADM': { label: 'Administrador', value: 'ADM', color: 'success' },
    'USR': { label: 'Usuário', value: 'USR', color: 'warning' },
  }

  const socket = io('http://localhost:3000');

  const validaUsuario = async () => {
    usuarioServices.validaUsuario()
      .then((response: IUsuario) => {
        setUsuario(response);
      });
  }

  useEffect(() => {
    socket.on('avatar', (data: boolean) => {
      if (data) {
        validaUsuario()
      }
    })
  }, []);

  useEffect(() => {
    validaUsuario()
  }, []);
  const [usuario, setUsuario] = useState<IUsuario>();

  function verificaNome(nome: string) {
    if (!nome) return 'Usuário';
    const nomes = nome.split(' ');
    if (nomes.length > 2) {
      return nomes[0] + ' ' + nomes[nomes.length - 1];
    }
    return nome;
  }

  return (usuario ?
    <Card sx={{ maxWidth: 250, ":hover": { opacity: '60%' }, cursor: 'pointer' }} variant={pathname === '/eu' ? 'soft' : undefined} onClick={() => { router.push('/eu') }}>
      <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Avatar
          variant="solid"
          sx={{
            width: 70,
            height: 70,
          }}
          src={usuario.avatar}
        >
        </Avatar>
        <Typography
          level="title-lg"
          title={usuario.nome}
          sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >{verificaNome(usuario.nome)}</Typography>
        <Typography level="body-xs">{usuario.email}</Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {usuario.unidade ? <Chip color='neutral' variant='outlined' size='sm'>{usuario.unidade?.sigla}</Chip> : null}
        </Box>
      </CardContent>
    </Card>
    : <Card sx={{ maxWidth: 250 }}>
      <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Avatar
          variant="solid"
          sx={{
            width: 50,
            height: 50,
          }}
        >
        </Avatar>
        <Typography
          level="title-lg"
          title="Nome do Usuário"
          sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          <Skeleton>
            Nome do Usuário
          </Skeleton>
        </Typography>
        <Typography level="body-xs">
          <Skeleton>
            emailusuario@prefeitura.sp.gov.br
          </Skeleton>
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Typography level="body-xs">
            <Skeleton>
              Unidade
            </Skeleton>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}