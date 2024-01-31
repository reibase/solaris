import Nav from './Nav.jsx'

const RequestAccess = () => {

    return(
        <>
            <Nav />
            <div class="mx-auto flex flex-col items-center py-[50px] w-5/6">
 
                <h1 className="mb-[20px] text-3xl font-bold text-center">
                    SOLARIS
                </h1>
                <p className="mb-[40px]">Request Access to Solaris Technical Preview</p>
                <div class="flex flex-col gap-[20px]">
                <div class="w-[300px] flex flex-col gap-2">
                    <label for="name" class="text-sm font-light text-gray-900">Name *</label>
                    <input type="text" id="name" class="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full border border-black" placeholder=""/>
                </div>
                <div class="w-[300px] flex flex-col gap-2">
                    <label for="name" class="text-sm font-light text-gray-900">Email Address *</label>
                    <input type="text" id="name" class="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full border border-black" placeholder=""/>
                </div>
                </div>
                <button class="mt-[30px] mx-auto bg-[#313131] w-[300px] px-[20px] text-white rounded-md px-4 py-[3px]">Request Access</button>
            </div>
        </>
    );
}

export default RequestAccess