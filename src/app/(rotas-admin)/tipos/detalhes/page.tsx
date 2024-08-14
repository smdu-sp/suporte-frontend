'use client'

import TipoDetalhes from './[id]/page';

export const dynamicParams = true;

export default function TipoNovo(props: any) {
    return TipoDetalhes(props);
}
