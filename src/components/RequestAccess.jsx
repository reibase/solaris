import Nav from './Nav.jsx'
import { Link } from 'react-router-dom';
const RequestAccess = () => {

    return(
        <>
            <Nav />
            <div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6 md:w-2/3 lg:w-1/2">

                <h1 className="mb-[20px] font-inter text-3xl font-bold text-center">
                    SOLARIS
                </h1>
                <p className="mb-[40px] font-inter">Request Access to Solaris Technical Preview</p>
                <div class="flex flex-col gap-[20px]">
                <div class="w-[300px] flex flex-col gap-2">
                    <label for="name" class="font-inter text-sm font-light text-gray-900">Name *</label>
                    <input type="text" id="name" class="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full border border-black" placeholder=""/>
                </div>
                <div class="w-[300px] flex flex-col gap-2">
                    <label for="name" class="font-inter text-sm font-light text-gray-900">Email Address *</label>
                    <input type="text" id="name" class="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full border border-black" placeholder=""/>
                </div>
                </div>
                <Link to="/thanks">
                    <button class="font-light font-inter mt-[30px] mx-auto bg-[#313131] w-[300px] px-[20px] text-white rounded-md px-4 py-[3px]">Request Access</button>
                </Link>
            </div>
        </>
    );
}

export default RequestAccess