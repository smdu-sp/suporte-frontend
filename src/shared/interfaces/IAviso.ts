
export default interface IAviso {
    id?: string;
    titulo: string;
    mensagem: string;
    cor: string;
    rota: string;
    status?: boolean;
    sistema_id?: string; // sistema sendo opcional apenas para ambiente de teste. 
}
