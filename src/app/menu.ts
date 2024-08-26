import { Business, Handyman, Home, Person } from '@mui/icons-material';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import WidgetsIcon from '@mui/icons-material/Widgets';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import BookIcon from '@mui/icons-material/Book';
export interface IMenuOption {
    title:  string;
    href:   string;
    name:   string;
    icon:   any; 
};

export interface IMenu {
    tecOptions:    IMenuOption[];
    userOptions:    IMenuOption[];
    adminOptions:   IMenuOption[];
}


export const menu: IMenu = {
    tecOptions: [
        {
            title: 'Dashboard',
            href: '/',
            name: '/',
            icon: LineAxisIcon,
        },
    ],
    userOptions: [
        {
            title: 'Chamados',
            href: '/chamados',
            name: 'chamados',
            icon: Handyman,
        },
    ],
    adminOptions: [
        {
            title: 'Usuários',
            href: '/usuarios',
            name: 'usuarios',
            icon: Person,
        },
        {
            title: 'Unidades',
            href: '/unidades',
            name: 'unidades',
            icon: Business,
        },
        {
            title: 'Avisos',
            href: '/avisos',
            name: 'avisos',
            icon: TurnedInIcon,
        },
        {
            title: 'Tipos',
            href: '/tipos',
            name: 'tipos',
            icon: BookIcon,
        },
        {
            title: 'Categorias',
            href: '/categorias',
            name: 'categorias',
            icon: WidgetsIcon,
        },
        {
            title: 'Sub Categorias',
            href: '/subcategorias',
            name: 'sub categorias',
            icon: LabelImportantIcon,
        }
    ]
}