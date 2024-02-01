import Nav from './Nav.jsx'
import githubLogo from '../assets/github-logo.png'
import gmailLogo from '../assets/gmail-logo.png'
import { Link } from 'react-router-dom'
const Login = () => {

    return(
        <>  
            <Nav />
            <div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6">
 
                <h1 className="font-inter mb-[70px] text-3xl font-bold underline text-center">
                    Solaris Logo
                </h1>
                <div class="flex flex-col gap-[20px]">
                    <button className='flex gap-[10px] w-[300px] px-[20px] items-center w-full rounded-md border border-black'>
                        <span className='font-inter'>Continue with GitHub</span>
                        <img src={githubLogo}/>
                    </button>
                    <button className='flex gap-[10px] w-[300px] px-[20px] items-center justify-space-between w-full rounded-md border border-black'>
                        <span className='font-inter'>Continue with Gmail</span>
                        <img src={gmailLogo}/>
                    </button>
                </div>
                <Link to="/requestaccess">
                    <button class="font-inter mt-[30px] mx-auto bg-[#313131] w-[350px] px-[20px] text-white rounded-md px-4 py-[3px]">Request Access</button>
                </Link>
            </div>
        </>
    );
}

export default Login