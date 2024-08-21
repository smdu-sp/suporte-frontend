import { Business, Handyman, Home, Person } from '@mui/icons-material';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import NotificationsIcon from '@mui/icons-material/Notifications';
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
        }  ,
        {
            title: 'Tipos',
            href: '/tipos',
            name: 'tipos',
            icon: Business,
        },
        {
            title: 'Avisos',
            href: '/avisos',
            name: 'avisos',
            icon: NotificationsIcon
        }
    ]
}