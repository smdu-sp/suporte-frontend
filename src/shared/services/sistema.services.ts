'use server'

import { authOptions } from "@/shared/auth/authOptions";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { IOrdem } from "./ordem.services";
import { ICategoria } from "./categoria.services";
async function Logout() {
    await signOut({ redirect: false });
    window.location.href = '/login';
}

export interface ISistema {
    id: string;
    nome: string;
    padrao?: boolean;
    categorias?: ICategoria[];
    ordens?: IOrdem[];
    status: boolean;
}

export interface IPaginadoSistema {
    data: ISistema[];
    total: number;
    pagina: number;
    limite: number;
}

const baseURL = process.env.API_URL || 'http://localhost:3000/';

async function listaCompleta(): Promise<ISistema[]> {
    const session = await getServerSession(authOptions);
    const sistemas = await fetch(`${baseURL}sistemas/lista-completa`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return sistemas;
}

async function buscarTudo(status: string = 'true', pagina: number = 1, limite: number = 10, busca: string = ''): Promise<IPaginadoSistema> {
    const session = await getServerSession(authOptions);
    const sistemas = await fetch(`${baseURL}sistemas/buscar-tudo?status=${status}&pagina=${pagina}&limite=${limite}&busca=${busca}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return sistemas;
}

async function buscarPorId(id: string): Promise<ISistema> {
    const session = await getServerSession(authOptions);
    const sistema = await fetch(`${baseURL}sistemas/buscar-por-id/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return sistema;
}

async function desativar(id: string): Promise<{ autorizado: boolean }> {
    const session = await getServerSession(authOptions);
    const desativado = await fetch(`${baseURL}sistemas/desativar/${id}`, {
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

async function criar({ nome, padrao, status }: { nome: string, padrao: string, status: string }): Promise<ISistema> {
    const session = await getServerSession(authOptions);
    const novoSistema = await fetch(`${baseURL}sistemas/criar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
            nome,
            padrao: padrao === 'false',
            status: status === 'true'
        })
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 201) return;
        return response.json();
    });
    return novoSistema;
}

async function atualizar({ id, nome, padrao, status }: { id: string, nome: string, padrao: boolean, status: string }): Promise<ISistema> {
    const session = await getServerSession(authOptions);
    const atualizado = await fetch(`${baseURL}sistemas/atualizar/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
            nome,
            padrao,
            status: status === 'true'
        })
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 200) return;
        return response.json();
    });
    return atualizado;
}

async function ativar(id: string): Promise<ISistema> {
    const session = await getServerSession(authOptions);
    const ativado = await fetch(`${baseURL}sistemas/atualizar/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ status: true })
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 200) return;
        return response.json();
    });
    return ativado;
}

export { 
    ativar,
    atualizar,
    buscarTudo,
    buscarPorId,
    criar,
    desativar,
    listaCompleta
};
