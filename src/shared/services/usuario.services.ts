'use server'

import { authOptions } from "@/shared/auth/authOptions";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { IUnidade } from "./unidade.services";

async function Logout() {
    await signOut({ redirect: false });
    window.location.href = '/login';
}

export interface IUsuario {
    id: string;
    nome: string;
    email: string;
    login: string;
    dev: boolean;
    status: number;
    unidade_id: string;
    unidade?: IUnidade;
    ultimoLogin: Date;
    criadoEm: Date;
    atualizadoEm: Date;
    avatar?: any;
}

export interface ICreateUsuario {
    nome: string;
    email: string;
    login: string;
    dev?: boolean;
    unidade_id?: string;
}

export interface IUpdateUsuario {
    id?: string;
    dev?: boolean;
    status?: number;
    unidade_id?: string;
    foto?: any;
}

export interface IPaginadoUsuario {
    data: IUsuario[];
    total: number;
    pagina: number;
    limite: number;
}

const baseURL = process.env.API_URL || 'http://localhost:3000/';

async function listaCompleta(): Promise<IUsuario[]> {
    const session = await getServerSession(authOptions);
    const usuarios = await fetch(`${baseURL}usuarios/lista-completa`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return usuarios;
}

async function buscarTudo(status: number = 1, pagina: number = 1, limite: number = 10, busca: string = '', unidade_id: string = ''): Promise<IPaginadoUsuario> {
    const session = await getServerSession(authOptions);
    const usuarios = await fetch(`${baseURL}usuarios/buscar-tudo?status=${status}&pagina=${pagina}&limite=${limite}&busca=${busca}&unidade_id=${unidade_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return usuarios;
}

async function buscarPorId(id: string): Promise<IUsuario> {
    const session = await getServerSession(authOptions);
    const usuario = await fetch(`${baseURL}usuarios/buscar-por-id/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return usuario;
}

async function autorizar(id: string): Promise<{ autorizado: boolean }> {
    const session = await getServerSession(authOptions);
    const autorizado = await fetch(`${baseURL}usuarios/autorizar/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 200) return;
        return response.json();
    })
    return autorizado;
}

async function criar(data: ICreateUsuario, formdata?: FormData, ): Promise<IUsuario> {
    const session = await getServerSession(authOptions);
    const criado = await fetch(`${baseURL}usuarios/criar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }, body: JSON.stringify(data)
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    if (formdata) {
        await fetch(`${baseURL}usuarios/atualizar/${criado.id}`, {
            method: "PATCH",
            body: formdata,
            headers: {
                "Authorization": `Bearer ${session?.access_token}`
            }
        });
    }
    return criado;
}

async function atualizar(
    id: string, 
    formdata?: FormData, 
    data?: IUpdateUsuario
): Promise<IUsuario | void> {
    const session = await getServerSession(authOptions);
    const userUpdateResponse = await fetch(`${baseURL}usuarios/atualizar/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    });
    if (userUpdateResponse.status === 401) {
        Logout();
        return;
    }
    if (userUpdateResponse.status !== 200) {
        return;
    }
    await fetch(`${baseURL}usuarios/atualizar/${id}`, {
        method: "PATCH",
        body: formdata,
        headers: {
            "Authorization": `Bearer ${session?.access_token}`
        }
    });
    return userUpdateResponse.json();
}


async function desativar(id: string): Promise<{ desativado: boolean }> {
    const session = await getServerSession(authOptions);
    const desativado = await fetch(`${baseURL}usuarios/desativar/${id}`, {
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

async function validaUsuario(): Promise<IUsuario> {
    const session = await getServerSession(authOptions);
    const usuario = await fetch(`${baseURL}usuarios/valida-usuario`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 200) Logout();
        return response.json();
    })
    return usuario;
}

async function buscarNovo(login: string): Promise<{ id?: string, login?: string, nome?: string, email?: string, unidade_id?: string, message?: string }> {
    const session = await getServerSession(authOptions);
    const usuario = await fetch(`${baseURL}usuarios/buscar-novo?login=${login}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status === 403) {
            return { message: 'Usuário já cadastrado.'}
        }
        if (response.status !== 200) return;
        return response.json();
    })
    return usuario;
}

export { 
    atualizar,
    autorizar,
    buscarNovo,
    buscarPorId,
    buscarTudo,
    criar,
    desativar,
    listaCompleta,
    validaUsuario
};
