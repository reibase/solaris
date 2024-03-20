import React from "react";
import { useStore } from "../../../store.js";
import UserCredit from "./UserCredit.jsx";
import OwnerCredit from "./OwnerCredit.jsx";

export default function Community({
	updatedProject,
	setUpdatedProject,
	currentUser,
	setCurrentUser,
	setMembers,
	members,
	balances,
	setBalances,
	setOwnerBalance,
	ownerBalance,
	updateProject,
}) {
	const { dark, user } = useStore();
	return (
		<div className="flex flex-col gap-1">
			<div>
				<OwnerCredit
					setOwnerBalance={setOwnerBalance}
					ownerBalance={ownerBalance}
					owner={true}
					member={currentUser}
					updatedProject={updatedProject}
					setUpdatedProject={setUpdatedProject}
					setCurrentUser={setCurrentUser}
					currentUser={currentUser}
					balances={balances}
				/>
				{members
					?.filter((member) => member.id !== user.info.id)
					.map((member) => (
						<UserCredit
							setMembers={setMembers}
							members={members}
							key={member.id}
							currentUser={currentUser}
							member={member}
							updatedProject={updatedProject}
							setUpdatedProject={setUpdatedProject}
							setCurrentUser={setCurrentUser}
							balances={balances}
							setBalances={setBalances}
							updateProject={updateProject}
						/>
					))}
			</div>
		</div>
	);
}
