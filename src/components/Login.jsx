import Nav from './Nav.jsx'

const Login = () => {

    return(
        <>  
            <Nav />
            <div class="mx-auto flex flex-col items-center py-[50px] w-5/6">
 
                <h1 className="mb-[70px] text-3xl font-bold underline text-center">
                    Solaris Logo
                </h1>
                <div class="flex flex-col gap-[20px]">
                    <button className='flex w-[300px] px-[20px] items-center justify-space-between w-full rounded-md border border-black'>
                        <span>Continue with GitHub</span>
                    </button>
                    <button className='flex w-[300px] px-[20px] items-center justify-space-between w-full rounded-md border border-black'>
                        <span>Continue with Gmail</span>
                    </button>
                </div>
                <button class="mt-[30px] mx-auto bg-[#313131] w-[300px] px-[20px] text-white rounded-md px-4 py-[3px]">Request Access</button>
            </div>
        </>
    );
}

export default Login