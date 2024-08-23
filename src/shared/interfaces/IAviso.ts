
export default interface IAviso {
    id?: string;
    titulo: string;
    mensagem: string;
    cor: string;
    rota: string;
    status?: boolean;
    tipo_id?: string; // tipo sendo opicional apenas para ambiente de teste. 
}
