"use client"
import LoginForm from "@/components/loginForm/component"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export default function Login() {

    const session = useSession()
    const router = useRouter()

    useEffect(() => {

        if(session.status == "loading") return
        const loadingToast = toast.loading('Checking your authentication data...')
        setTimeout(() => {
            
            toast.dismiss(loadingToast)
            setTimeout(() => {

                if(session.status == "authenticated") {
    
                    toast.success("Authenticated!")
                    setTimeout(() => router.push("/home/"), 100)
                }
        
                else toast("This didn't work!\nYou're gonna have to sign in again...", { icon: "✋" })
            }, 200)
        } , 1700)
    }, [session])

    return (

        <div className="flex justify-center items-center h-screen">
            <LoginForm />
        </div>
    )
}
