export default function OAuthButton({ provider, onClick })
{
    return (

        <button className="w-96 h-20 mt-4 rounded-3xl bg-white flex flex-row justify-center 
            items-center space-x-4 transition-transform hover:scale-105 duration-300"
            onClick={ onClick }>
            <img className="h-11" src={ "/icons/"+ provider +".webp" } /><h1 className="text-3xl flex items-center font-extrabold">
                { provider.charAt(0).toUpperCase() + provider.slice(1) }
            </h1>
        </button>
    )
}