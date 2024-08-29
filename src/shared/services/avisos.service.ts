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
    const response = await fetch(`${process.env.API_URL}avisos?status=${status}&pagina=${pagina}&limite=${limite}&busca=${busca}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    });
    if (response.status === 401) Logout();
    if (response.status !== 200) throw new Error('Erro buscando avisos.');
    const avisos: IPaginadoAviso = await response.json();
    return avisos;
}

async function criarAviso(aviso: IAviso): Promise<IAviso | null> {
    const session = await getServerSession(authOptions);
    aviso.status = true;
    aviso.sistema_id = 'cc9da6a7-9fef-4c70-8d4f-8fc465cf211f';
    const response: Response = await fetch(`${process.env.API_URL}avisos/criar`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ ...aviso }),
    });
    if (response.status === 401) Logout();
    if (response.status !== 201) return null;
    const avisos: IAviso = await response.json();
    return avisos;
}

async function atualizarAviso(aviso: IAviso, id: string): Promise<IAviso | null> {
    const session = await getServerSession(authOptions);
    const response: Response = await fetch(`${process.env.API_URL}avisos/atualizar/${id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ ...aviso }),
    });
    if (response.status === 401) Logout();
    if (response.status !== 200) return null;
    const avisos: IAviso = await response.json();
    return avisos;
}

async function ativar(id: string): Promise<IAviso | null> {
    const session = await getServerSession(authOptions);
    const response: Response = await fetch(`${process.env.API_URL}avisos/ativa/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    });
    if (response.status === 401) Logout();
    if (response.status !== 200) return null;
    const ativado: IAviso = await response.json();
    return ativado;
}

async function desativar(id: string): Promise<IAviso | null> {
    const session = await getServerSession(authOptions);
    const response: Response = await fetch(`${process.env.API_URL}avisos/inativa/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    });
    if (response.status === 401) Logout();
    if (response.status !== 200) return null;
    const desativado: IAviso = await response.json();
    return desativado;
}

async function remover(id: string): Promise<IAviso> {
    const session = await getServerSession(authOptions);
    const response: Response = await fetch(`${process.env.API_URL}avisos/remover/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    });
    if (response.status === 401) Logout();
    if (response.status !== 200) throw new Error('Erro ao deletar aviso.');
    const removido: IAviso = await response.json();
    return removido;
}

export {
    buscarTudo,
    criarAviso,
    atualizarAviso,
    ativar,
    desativar,
    remover
}
