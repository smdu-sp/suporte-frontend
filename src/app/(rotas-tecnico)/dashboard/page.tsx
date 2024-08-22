"use client";

import * as React from "react";
import Content from "@/components/Content";
import dayjs, { Dayjs } from "dayjs";
import Save from "@mui/icons-material/Save";
import "dayjs/locale/pt-br";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Card,
  CardContent,
  Button,
  Box,
  Typography,
  ThemeProvider,
  useTheme,
} from "@mui/joy";
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
      pagina="dashboard"
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <DatePickerComponent label="Data de Início"  />
        <DatePickerComponent label="Data de Fim" onChange={(newValue: any) => setValue(newValue)} />
        <Button sx={{ 
          backgroundColor: palette.text.primary, color: palette.background.body,
          '&:hover': {
            backgroundColor: palette.background.body,
            color: palette.text.primary,
          }
        }}>Salvar</Button>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          py: 2,
        }}
      >
        <CardDashboard
          minWidth="24%"
          titulo="Chamados"
          descricao="Chamados abertos hoje: 20"
          valor={5}
        />
        <CardDashboard
          minWidth="24%"
          titulo="Chamados Atribuidos"
          descricao="Encerrados hoje: 2"
          valor={25}
        />
        <CardDashboard
          minWidth="24%"
          titulo="Avaliação Anual"
          descricao="Ano anterior: 3.5"
          valor={4.5}
        />
        <CardDashboard
          minWidth="24%"
          titulo="Avaliação Mensal"
          descricao="Mês anterior: 4.8"
          valor={4.9}
        />
      </Box>
      <Box
        sx={{
          minHeight: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            border: "solid 2px ",
            WebkitBoxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 10px",
            borderColor: "divider",
            minHeight: 460,
            width: "60%",
            boxShadow: 3,
            borderRadius: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'end',
          }}
        >
          <TickPlacementBars />
        </Box>
        <Box
          sx={{
            border: "solid 2px ",
            WebkitBoxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 10px",
            borderColor: "divider",
            minHeight: 460,
            width: "40%",
            boxShadow: 3,
            borderRadius: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Pessoas />
        </Box>
      </Box>
    </Content>
  );
}
