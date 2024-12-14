"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const { data: session } = useSession()

    const user: User = session?.user as User
    const username = user?.username

    const pathname = usePathname();
    if (pathname === "/signin" || pathname === "/signup" || pathname === `/u/${username}`) {
        return null;
    }

    return (
        <>
            <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                    <Link href={"/"} className="text-xl font-bold mb-4 md:mb-0">Anonmyous Message</Link>
                    {user && pathname==="/dashboard"? <Link className="px-2 py-2 text-md text-black bg-[#F1F5F9] rounded-md" href={"/"}>Homepage</Link> : !user? "" :<Link href={"/dashboard"} className="px-2 py-2 text-md text-black bg-[#F1F5F9] rounded-md">Dashboard</Link>}
                    <div>
                        {session ? (<>
                          
                            <span className="mr-4" >Welcome {user?.username || user?.email}</span> <Button onClick={() => signOut({ callbackUrl: "/" })} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>Logout</Button>


                        </>) :

                            (<Link href={"/signin"}><Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button></Link>)}</div>

                </div>

            </nav>
        </>
    )
}

export default Navbar
