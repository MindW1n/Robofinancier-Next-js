export default async function UserIcon({ session })
{
    return (

        <div className="rounded-full bg-white w-16 h-16 overflow-hidden hover:scale-105 transform duration-300">
            <img src={ session.user.image ? session.user.image : ""}/> 
        </div>
    )
}