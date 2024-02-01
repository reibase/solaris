import Nav from './Nav.jsx'
import { Link } from 'react-router-dom';
const Profile = () => {

    return(
        <>  
            <Nav />
            <div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6">
                    <h1 className="font-inter mb-[70px] w-4/5 text-2xl font-bold text-left">
                        Profile
                    </h1>
                <div class="mb-[50px] w-32 h-32 rounded-full bg-gray-800"></div>

                <h1 className="font-inter mb-[70px] text-2xl font-bold text-center">
                    First Last
                </h1>
                <div class="flex flex-col gap-[20px]">
                    <Link to="/">
                        <button className='flex font-bold w-[300px] rounded-md border-2 border-gray-500' >
                            <span className='font-inter mx-auto text-gray-500'>Log out</span>
                        </button>
                    </Link>
                    <button className='flex font-bold w-[300px] rounded-md border-2 border-red-500' >
                        <span className='font-inter mx-auto text-red-500'>Delete Account</span>
                    </button>
                </div>
                
            </div>
        </>
    );
}

export default Profile