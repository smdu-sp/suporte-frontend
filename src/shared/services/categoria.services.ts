'use server'

import { authOptions } from "@/shared/auth/authOptions";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { IOrdem } from "./ordem.services";
import { ISistema } from "./sistema.services";
import { ISubCategoria } from "./subcategorias.servise";
async function Logout() {
    await signOut({ redirect: false });
    window.location.href = '/login';
}

export interface ICategoria {
    id: string;
    nome: string;
    sistema_id: string;
    sistema?: ISistema;
    subcategorias?: ISubCategoria[];
    ordens?: IOrdem[];
    status: boolean;
}

export interface IPaginadoCategoria {
    data: ICategoria[];
    total: number;
    pagina: number;
    limite: number;
}

const baseURL = process.env.API_URL || 'http://localhost:3000/';

async function listaCompleta(): Promise<ICategoria[]> {
    const session = await getServerSession(authOptions);
    const categorias = await fetch(`${baseURL}categorias/lista-completa`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return categorias;
}

async function buscarTudo(status: string = 'true', pagina: number = 1, limite: number = 10, busca: string = ''): Promise<IPaginadoCategoria> {
    const session = await getServerSession(authOptions);
    const categorias = await fetch(`${baseURL}categorias/buscar-tudo?status=${status}&pagina=${pagina}&limite=${limite}&busca=${busca}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return categorias;
}

async function buscarPorId(id: string) {
    console.log(id);
    const session = await getServerSession(authOptions);
    const categoria = await fetch(`${baseURL}categorias/buscar-por-id/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return categoria;
}

async function desativar(id: string): Promise<{ autorizado: boolean }> {
    const session = await getServerSession(authOptions);
    const desativado = await fetch(`${baseURL}categorias/desativar/${id}`, {
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

async function criar({ nome, sistema_id, status }: { nome: string, sistema_id: string, status: string }): Promise<ICategoria> {
    const session = await getServerSession(authOptions);
    const novaCategoria = await fetch(`${baseURL}categorias/criar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
            nome,
            sistema_id,
            status: status === 'true'
        })
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 201) return;
        return response.json();
    });
    return novaCategoria;
}

async function atualizar({ id, nome, sistema_id, status }: { id: string, nome: string, sistema_id: string, status: string }): Promise<ICategoria> {
    const session = await getServerSession(authOptions);
    const atualizado = await fetch(`${baseURL}categorias/atualizar/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
            nome,
            sistema_id,
            status: status === 'true'
        })
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 200) return;
        return response.json();
    });
    return atualizado;
}

async function ativar(id: string): Promise<ICategoria> {
    const session = await getServerSession(authOptions);
    const ativado = await fetch(`${baseURL}categorias/atualizar/${id}`, {
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

async function buscar_por_sistema(id: string) {
    const session = await getServerSession(authOptions);
    const sistema = await fetch(`${baseURL}categorias/buscar-por-sistema/${id}`, {
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

export { 
    ativar,
    atualizar,
    buscarTudo,
    buscarPorId,
    criar,
    desativar,
    listaCompleta,
    buscar_por_sistema
};
