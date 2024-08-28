"use client";

import * as React from "react";
import Content from "@/components/Content";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { Button, Box, useTheme, Grid, Stack } from "@mui/joy";

import CardDashboard from "@/components/CardDashboard";
import TickPlacementBars from "@/components/Grafico";
import Pessoas from "@/components/Pessoas";
import DatePickerComponent from "@/components/DatePicker";

dayjs.locale("pt-br");

export default function Dashboard() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs(Date.now()));
  const { palette } = useTheme();
  return (
    <Content
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}
      titulo="Dashboard"
      pagina="/"
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <DatePickerComponent label="Data Inicial" />
        <DatePickerComponent label="Data Final" onChange={(newValue: any) => setValue(newValue)} />
        <Button sx={{
          backgroundColor: palette.text.primary, color: palette.background.body,
          '&:hover': {
            backgroundColor: palette.background.body,
            color: palette.text.primary,
          }
        }}>Salvar</Button>
      </Box>
      <Stack
        direction={{ xs: 'column', sm: 'row', md: 'row', lg: 'row' }}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
        }}
        gap={{ xs: 2, sm: 2, md: 2, lg: 4 }}
        paddingRight={{ xs: 0, sm: 0, md: 0, lg: 2 }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'column', md: 'column', lg: 'row' }}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            gap: 2
          }}
        >
          <CardDashboard
            titulo="Chamados"
            descricao="Abertos hoje: 20"
            valor={5}
          />
          <CardDashboard
            titulo="Chamados Atribuidos"
            descricao="Encerrados hoje: 2"
            valor={25}
          />
        </Stack>
        <Stack
          direction={{ xs: 'column', sm: 'column', md: 'column', lg: 'row' }}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            gap: 2
          }}
        >
          <CardDashboard
            titulo="Avaliação Anual"
            descricao="Ano anterior: 3.5"
            valor={4.5}
          />
          <CardDashboard
            titulo="Avaliação Mensal"
            descricao="Mês anterior: 4.8"
            valor={4.9}
          />
        </Stack>
      </Stack>
      <Stack
        direction={{md: 'column', lg: 'column', xl: 'row'}}
        sx={{
          minHeight: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Stack
          sx={{
            border: "solid 2px ",
            WebkitBoxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 10px",
            borderColor: "divider",
            minHeight: 460,
            boxShadow: 3,
            borderRadius: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'end',
          }}
          width={{ xs: '100%', md: '100%', lg: '100%', xl: '60%' }}
        >
          <TickPlacementBars />
        </Stack>
        <Stack
          sx={{
            border: "solid 2px ",
            WebkitBoxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 10px",
            borderColor: "divider",
            minHeight: 460,
            boxShadow: 3,
            borderRadius: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}         
          width={{ xs: '100%', md: '100%', lg: '100%', xl: '40%' }}
        >
          <Pessoas />
        </Stack>
      </Stack>
    </Content>
  );
}
