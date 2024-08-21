'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import IAviso from "../interfaces/IAviso";
import { signOut } from "next-auth/react";

export interface IPaginadoAviso {
    data: IAviso[];
    total: number;
    pagina: number;
    limite: number;
}

async function Logout() {
    await signOut({ redirect: false });
    window.location.href = '/login';
}

async function buscarTudo(status: string = 'true', pagina: number = 1, limite: number = 10, busca: string = ''): Promise<IPaginadoAviso> {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${process.env.API_URL}avisos?status=${status}&pagina=${pagina}&limite=${limite}&busca=${busca}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    });
    if (res.status !== 200) console.log('erro');
    const avisos: IPaginadoAviso = await res.json();
    return avisos
}

async function ativar(id: string): Promise<IAviso> {
    const session = await getServerSession(authOptions);
    const ativado = await fetch(`${process.env.API_URL}avisos/ativa/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 200) return;
        return response.json();
    });
    return ativado;
}

async function desativar(id: string): Promise<{ autorizado: boolean }> {
    const session = await getServerSession(authOptions);
    const desativado = await fetch(`${process.env.API_URL}avisos/inativa/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 200) return;
        return response.json();
    });
    return desativado;
}

async function remover(id: string): Promise<{ autorizado: boolean }> {
    const session = await getServerSession(authOptions);
    const desativado = await fetch(`${process.env.API_URL}avisos/remover/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 200) return;
        return response.json();
    });
    return desativado;
}

export {
    buscarTudo,
    ativar,
    desativar,
    remover
}
