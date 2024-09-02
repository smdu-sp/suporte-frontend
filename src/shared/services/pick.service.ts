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

const baseURL = process.env.API_URL || 'http://localhost:3000/';


async function upAvatar(filee: any) {
    const session = await getServerSession(authOptions);

    const form = new FormData();
    form.append("file", filee)

    const sistemas = await fetch(`${baseURL}minio`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        },
        body: form
    }).then((response) => {
        if (response.status === 401) Logout();
        return response.json();
    })
    return sistemas;
}

const sendFile = async (filesElement: any) => {
    const dataForm = new FormData();
    for (const file of filesElement.current.files) {
      dataForm.append('file', file);
    }
    
    const session = await getServerSession(authOptions);

    const res = await fetch(`http://localhost:8080/upload`, {
      method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        },
      body: dataForm,
    });
    const data = await res.json();
    console.log(data);
  };

export {
    upAvatar,
    sendFile
}