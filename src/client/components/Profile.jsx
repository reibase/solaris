import Nav from "./Nav.jsx";

// To do:
// 1. Add endpoint <a href... > /api/auth/logout

const Profile = () => {
	return (
		<>
			<Nav />
			<div className="mx-auto bg-white shadow-lg rounded-lg flex flex-col items-center py-[50px] w-5/6 md:w-2/3 lg:w-1/2">
				<h1 className="font-inter mb-[70px] w-4/5 text-2xl font-bold text-left">
					Profile
				</h1>
				<div class="mb-[50px] w-32 h-32 rounded-full bg-gray-800"></div>

				<h1 className="font-inter mb-[70px] text-2xl font-bold text-center">
					First Last
				</h1>
				<div class="flex flex-col gap-[20px]">
					<a
						href="/api/auth/logout"
						className="flex font-bold w-[150px] text-sm font-medium rounded-md border-2 border-gray-500"
					>
						<span className="font-inter mx-auto text-gray-500">Log out</span>
					</a>
					<a
						href="/api/auth/etc"
						className="flex font-bold w-[150px] text-sm font-medium rounded-md border-2 border-red-500"
					>
						<span className="font-inter mx-auto text-red-500">
							Delete Account
						</span>
					</a>
				</div>
			</div>
		</>
	);
};

export default Profile;
