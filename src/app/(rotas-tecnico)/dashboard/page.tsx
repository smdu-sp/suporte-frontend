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
  createTheme,
} from "@mui/material";
import CardDashboard from "@/components/CardDashboard";
import DatePickerComponent from "@/components/DatePicker";

dayjs.locale("pt-br");

const theme = createTheme({
  palette: {
    background: {
      paper: "#fff",
    },
    text: {
      primary: "#173A5E",
      secondary: "#46505A",
    },
    action: {
      active: "#001E3C",
    },
    success: {
      main: "#009688",
      dark: "#00695C",
    },
  },
});

export default function Dashboard() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs(Date.now()));
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
        <Button 
          sx={{
            color: theme.palette.background.paper,
            borderColor: theme.palette.text.primary,
            backgroundColor: theme.palette.text.primary,
            textTransform: "none",
            "&:hover": {
              backgroundColor: theme.palette.action.active,
            },
          }}
          variant="outlined"
        >
          Salvar
        </Button>
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
          }}
        ></Box>
        <Box
          sx={{
            border: "solid 2px ",
            WebkitBoxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 10px",
            borderColor: "divider",
            minHeight: 460,
            width: "40%",
            boxShadow: 3,
            borderRadius: 5,
          }}
        ></Box>
      </Box>
    </Content>
  );
}
