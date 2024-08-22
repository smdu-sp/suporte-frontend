import { Business, Handyman, Home, Person } from '@mui/icons-material';
import LineAxisIcon from '@mui/icons-material/LineAxis';
<<<<<<< HEAD
import NotificationsIcon from '@mui/icons-material/Notifications';
=======
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import WidgetsIcon from '@mui/icons-material/Widgets';
import SquareIcon from '@mui/icons-material/Square';

>>>>>>> d095c2b017eddc0865b1770d12e7b8d00950eca4
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
            title: 'Página Inicial',
            href: '/',
            name: '/',
            icon: Home,
        },
        {
            title: 'Dashboard',
            href: '/dashboard',
            name: 'Dashboard',
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
            title: 'Tipos',
            href: '/tipos',
            name: 'tipos',
<<<<<<< HEAD
            icon: Business,
        },
        {
            title: 'Avisos',
            href: '/avisos',
            name: 'avisos',
            icon: NotificationsIcon
=======
            icon: TurnedInIcon,
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
>>>>>>> d095c2b017eddc0865b1770d12e7b8d00950eca4
        }
    ]
}