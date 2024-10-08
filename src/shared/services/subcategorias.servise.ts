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

export interface ISubCategoria {
    id: string;
    nome: string;
    categoria_id: string;
    categoria?: ICategoria;
    ordens?: IOrdem[];
    status: boolean;
}

export interface IPaginadoSubCategoria {
    data: ISubCategoria[];
    total: number;
    pagina: number;
    limite: number;
}

const baseURL = process.env.API_URL || 'http://localhost:3000/';

async function listaCompleta(): Promise<ISubCategoria[]> {
    const session = await getServerSession(authOptions);
    const subcategorias = await fetch(`${baseURL}subcategorias/lista-completa`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return subcategorias;
}

async function buscarTudo(status: string = 'true', pagina: number = 1, limite: number = 10, busca: string = ''): Promise<IPaginadoSubCategoria> {
    const session = await getServerSession(authOptions);
    const subcategorias = await fetch(`${baseURL}subcategorias/buscar-tudo?status=${status}&pagina=${pagina}&limite=${limite}&busca=${busca}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return subcategorias;
}

async function buscarPorId(id: string) {
    console.log(id);
    const session = await getServerSession(authOptions);
    const subcategoria = await fetch(`${baseURL}subcategorias/buscar-por-id/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return subcategoria;
}

async function desativar(id: string): Promise<{ autorizado: boolean }> {
    const session = await getServerSession(authOptions);
    const desativado = await fetch(`${baseURL}subcategorias/desativar/${id}`, {
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

async function criar({ nome, categoria_id, status }: { nome: string, categoria_id: string, status: string }): Promise<ISubCategoria> {
    const session = await getServerSession(authOptions);
    const novaSubcategoria = await fetch(`${baseURL}subcategorias/criar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
            nome,
            categoria_id,
            status: status === 'true'
        })
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 201) return;
        return response.json();
    });
    return novaSubcategoria;
}

async function atualizar({ id, nome, categoria_id, status }: { id: string, nome: string, categoria_id: string, status: string }): Promise<ISubCategoria> {
    const session = await getServerSession(authOptions);
    const atualizado = await fetch(`${baseURL}subcategorias/atualizar/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
            nome,
            categoria_id,
            status: status === 'true'
        })
    }).then((response) => {
        if (response.status === 401) Logout();
        if (response.status !== 200) return;
        return response.json();
    });
    return atualizado;
}

async function ativar(id: string): Promise<ISubCategoria> {
    const session = await getServerSession(authOptions);
    const ativado = await fetch(`${baseURL}subcategorias/atualizar/${id}`, {
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

async function buscar_por_categoria(id: string) {
    const session = await getServerSession(authOptions);
    const subcategoria = await fetch(`${baseURL}subcategorias/buscar-por-categoria/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        }
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return subcategoria;
}

export { 
    ativar,
    atualizar,
    buscarTudo,
    buscarPorId,
    criar,
    desativar,
    listaCompleta,
    buscar_por_categoria
};
