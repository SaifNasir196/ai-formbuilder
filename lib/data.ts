import { LibraryBig, LineChart, MessagesSquare, Shield } from 'lucide-react'
import React from 'react'

export const navLinks = [
    {
        name: "My Forms",
        icon: React.createElement(LibraryBig),
        path: "/"
    },
    {
        name: "Responses",
        icon: React.createElement(MessagesSquare),
        path: "/responses"
    },
    {
        name: "Analytics",
        icon: React.createElement(LineChart),
        path: "/analytics"
    },
    {
        name: "Pricing",
        icon: React.createElement(Shield),
        path: "/pricing"
    },
] as const

