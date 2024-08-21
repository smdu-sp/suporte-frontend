'use client'

import AlertsProvider from '@/providers/alertsProvider';
import AuthSessionProvider from '@/providers/sessionProvider';
import MenuProvider from '@/shared/contexts/MenuContext';
import { CssBaseline } from '@mui/joy';
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider, extendTheme } from '@mui/joy/styles';
import { Lato } from "next/font/google";

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const materialTheme = materialExtendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          50: "#fee4e9",
          100: "#fcadbc",
          200: "#fb768f",
          300: "#f93f62",
          400: "#f94668",
          500: "#f70835",
          600: "#c0062a",
          700: "#89041e",
          800: "#520312",
          900: "#1b0106"
        }
      }
    },
    light: {
      palette: {
        primary: {
          50: "#e4ebfd",
          100: "#afc4fa",
          200: "#7a9df6",
          300: "#4576f3",
          400: "#0a3299",
          500: "#104eef",
          600: "#0c3dba",
          700: "#092b85",
          800: "#051a50",
          900: "#02091b"
        }
      }
    },
  }
});

const theme = extendTheme({
  fontFamily: {
    display: lato.style.fontFamily, // applies to `h1`–`h4`
    body: lato.style.fontFamily, // applies to `title-*` and `body-*`
  },
  "colorSchemes": {
    "dark": {
      "palette": {
        "primary": {
          "50": "#fee4e9",
          "100": "#fcadbc",
          "200": "#fb768f",
          "300": "#f93f62",
          "400": "#f94668",
          "500": "#f70835",
          "600": "#c0062a",
          "700": "#89041e",
          "800": "#520312",
          "900": "#1b0106"
        },
        warning: {
          solidColor: '#000',
          solidBg: '#ffc107',
          solidBorder: '#ffc107',
          solidHoverBg: '#ffca2c',
          solidHoverBorder: '#ffc720',
          solidActiveBg: '#ffcd39',
          solidActiveBorder: '#ffc720',
          solidDisabledBg: '#ffc107',
          solidDisabledBorder: '#ffc107',
        }
      }
    },
    "light": {
      "palette": {
        "primary": {
          "50": "#e4ebfd",
          "100": "#afc4fa",
          "200": "#7a9df6",
          "300": "#4576f3",
          "400": "#0a3299",
          "500": "#104eef",
          "600": "#0c3dba",
          "700": "#092b85",
          "800": "#051a50",
          "900": "#02091b"
        },
        warning: {
          solidColor: '#000',
          solidBg: '#ffc107',
          solidBorder: '#ffc107',
          solidHoverBg: '#ffca2c',
          solidHoverBorder: '#ffc720',
          solidActiveBg: '#ffcd39',
          solidActiveBorder: '#ffc720',
          solidDisabledBg: '#ffc107',
          solidDisabledBorder: '#ffc107',
        }
      }
    }
  }
});

export default function RootLayout({children}:{children: React.ReactNode}) {
  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }} defaultMode='system'>
      <JoyCssVarsProvider theme={theme} defaultMode='system'>
        <CssBaseline />
        <MenuProvider>
          <html lang="pt-BR">
            <head>
              <title>{process.env.NEXT_PUBLIC_PROJECT_NAME}</title>
            </head>
            <body>
              <AuthSessionProvider>
                <AlertsProvider>
                  {children}
                </AlertsProvider>
              </AuthSessionProvider>
            </body>
          </html>
        </MenuProvider>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}

