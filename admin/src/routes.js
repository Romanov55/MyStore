import Admin from './pages/Admin'
import Auth from './pages/Auth'
import { ADMIN_ROUTE, LOGIN_ROUTE } from './utils/consts'

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
]