'use server'

import { getServerSession } from "next-auth";
import { IUsuario } from "./usuario.services";
import { signOut } from "next-auth/react";
import { authOptions } from "../auth/authOptions";

export interface IDashboardTecnicos {
    usuario: {
        id: string;
        nome: string;
        email: string;
        avatar?: any;
    }
}

export interface ITecnicos {
    tecnicos: [
        IDashboardTecnicos
    ];
}


async function Logout() {
    await signOut({ redirect: false });
    window.location.href = '/login';
}

async function buscaTecnicos(): Promise<ITecnicos> {
    const session = await getServerSession(authOptions);
    const response = await fetch(`${process.env.API_URL}chamados/tecnicos`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    });
    if (response.status === 401) Logout();
    if (response.status !== 200) throw new Error('Erro buscando avisos.');
    const avisos: ITecnicos = await response.json();
    return avisos;
}

export {
    buscaTecnicos
}