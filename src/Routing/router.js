import Login from "../Pages/Login"
import CurrentSection from "../Pages/CurrentSection"

export const privateRoutes = [
    {path: '/login', component: Login, exact: true}
]


export const publicRoutes = [
    {path: '/section/:section', component: CurrentSection, exact: true}
]