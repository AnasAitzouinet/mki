import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

const protectedRoutes = ['/','/Fiches','/Factures','/NewClient']
const publicRoutes = ['/Login']


export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)

    const cookie = cookies().get('session')?.value
    const session = await decrypt(cookie)

    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/Login', req.nextUrl))
    }

    if (publicRoutes.includes(path) && session?.userId) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }



    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  }