"use client"
import { useState } from "react"
import { signIn as nextAuthLogin } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import OAuthButton from "../OAuthButton/component"

export default function LoginForm()
{
    const [formFlag, setFormFlag] = useState(false)
    const [login, setLogin] = useState("")
    const [signInPassword, setsignInPassword] = useState("")
    const [nickName, setnickName] = useState("")
    const [email, setEmail] = useState("")
    const [signUpPassword, setsignUpPassword] = useState("")
    const router = useRouter()

    const handleSignUp = () => {

        nextAuthLogin("credentials", { signUp: true, name: nickName, email: email, password: signUpPassword, redirect: false })
            .then((response) => {

                if(response.error) toast.error(response.error)

                else if(response.ok) {
                    
                    toast.success("You are signed up!")
                    router.push("/home")
                }
            })
    }

    const handleSignIn = () => {

        nextAuthLogin("credentials", { signUp: false, login: login, password: signInPassword, redirect: false })
            .then((response) => {

                if(response.error) toast.error(response.error)

                else if(response.ok) {
                    
                    toast.success("You are signed in!")
                    router.push("/home")
                }
            })
    }

    const handleKeyPress = (event, action) => {

        if (event.key === 'Enter') {

            event.preventDefault()
            action()
        }
    }

    return (
        
        <>
            <div className= { (formFlag ? "hidden " : "") + "loginForm" } onKeyDown = { (event) => handleKeyPress(event, handleSignIn) }>
                <p className="loginFormTitle">Sign in</p>
                <form className="flex flex-col">
                    <input type="text" placeholder="Email or nickname" className=" bg-gray-500 placeholder-white signInComponent"
                        value={ login } onChange={ (event) => setLogin(event.target.value) }/>
                    <input type="password" placeholder="Password" className=" bg-gray-500 placeholder-white signInComponent"
                        value={ signInPassword } onChange={ (event) => setsignInPassword(event.target.value) }/>
                    <button type="button" className=" bg-blue-600 signInComponent" onClick={ handleSignIn }>Sign in</button>
                    <button type="button" className=" bg-orange-600 signInComponent" onClick={ () => setFormFlag(!formFlag) }>No account yet?</button>
                </form>
                <p className="mt-7 text-center font-bold">Or you can sign in with</p>
                <OAuthButton provider="google" onClick={ () => nextAuthLogin("google") } />
                <OAuthButton provider="vk" onClick={ () => nextAuthLogin("vk") } />
            </div>
            <div className={ (formFlag ? "" : "hidden ") + "loginForm" } onKeyDown = { (event) => handleKeyPress(event, handleSignUp) }>
                <p className="loginFormTitle">Sign up</p>
                <form className="flex flex-col">
                    <input type="text" placeholder="Nickname" className=" bg-gray-500 placeholder-white signInComponent"
                        value={ nickName } onChange={ (event) => setnickName(event.target.value) }/>
                    <input type="email" placeholder="Email" className=" bg-gray-500 placeholder-white signInComponent"
                        value={ email } onChange={ (event) => setEmail(event.target.value) }/>
                    <input type="password" placeholder="Password" className=" bg-gray-500 placeholder-white signInComponent"
                        value={ signUpPassword } onChange={ (event) => setsignUpPassword(event.target.value) }/>
                    <button type="button" className=" bg-blue-600 signInComponent"  onClick={ handleSignUp }>Sign up</button>
                    <button type="button" className=" bg-orange-600 signInComponent" onClick={ () => setFormFlag(!formFlag) }>Or still sign in!</button>
                </form>
            </div>
        </>
    )
}