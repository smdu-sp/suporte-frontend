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

export interface IChamados {
    chamados: number,
    hoje: number
}

export interface IAtribuidos {
    chamados: number,
    encerrados_hoje: number
}


async function Logout() {
    await signOut({ redirect: false });
    window.location.href = '/login';
}


async function buscaChamados(): Promise<IChamados> {
    const session = await getServerSession(authOptions);
    const response = await fetch(`${process.env.API_URL}chamados/abertos`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    });
    if (response.status === 401) Logout();
    const avisos: IChamados = await response.json();
    return avisos;
}

async function buscaChamadosAtribuidos(): Promise<IAtribuidos> {
    const session = await getServerSession(authOptions);
    const response = await fetch(`${process.env.API_URL}chamados/atribuidos`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    });
    if (response.status === 401) Logout();
    const avisos: IAtribuidos = await response.json();
    return avisos;
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
    const avisos: ITecnicos = await response.json();
    return avisos;
}

export {
    buscaTecnicos,
    buscaChamados,
    buscaChamadosAtribuidos
}