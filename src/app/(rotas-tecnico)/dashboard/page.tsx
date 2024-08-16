"use client";

import * as React from "react";
import Content from "@/components/Content";
import dayjs, { Dayjs } from "dayjs";
import Save from "@mui/icons-material/Save";
import "dayjs/locale/pt-br";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Card, CardContent, Button, Box, Typography, ThemeProvider, createTheme } from "@mui/material";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";

dayjs.locale("pt-br");

const theme = createTheme({
  palette: {
    background: {
      paper: '#fff',
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    action: {
      active: '#001E3C',
    },
    success: {
      main: '#009688', 
      dark: '#00695C', 
    },
  },
});

export default function Dashboard() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2024-04-17"));
  return (
    <Content>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Data de Início"
            defaultValue={dayjs("2024-01-01")} // Ajuste o formato da data aqui
            sx={{
              width: 200,
              height: 50,
            }}
          />
          <DatePicker
            label="Data Fim"
            value={value}
            onChange={(newValue) => setValue(newValue)}
            sx={{
              width: 200,
              height: 50,
            }}
          />
          <Button
            sx={{
              color: theme.palette.background.paper,
              borderColor: theme.palette.text.primary,
              backgroundColor: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: theme.palette.action.active,
              },
            }}
            variant="outlined"
          >
            Salvar
          </Button>
        </LocalizationProvider>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 4,
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",          
        }}
      >
        <ThemeProvider theme={theme}>
          <Card>
            <CardContent
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 2,
                p: 2,
                minWidth: 300,
              }}
            >
              <Typography sx={{ color: 'text.secondary' }}>Chamados Novos</Typography>
              <Typography sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
                0  
              </Typography>
              <Typography
                sx={{
                  color: 'success.dark',
                  display: 'inline',
                  fontWeight: 'bold',
                  mx: 0.5,
                  fontSize: 14,
                }}
              >
                +18.77%
              </Typography>
              <Typography sx={{ color: 'text.secondary', display: 'inline', fontSize: 14 }}>
                vs. last week
              </Typography>
            </CardContent>
          </Card>
        </ThemeProvider>
      </Box>
    </Content>
  );
}
