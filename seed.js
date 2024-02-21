import axios from "axios";

import { Project, User } from "./src/db/models/index.js";

const users = [
	{
		username: "jex441",
		verifiedThru: "github",
		email: "jwfirenze@gmail.com",
		avatar: "https://avatars.githubusercontent.com/u/75996017?v=4",
	},
	{
		username: "user456",
		verifiedThru: "github",
		email: "user456@example.com",
		avatar: "https://avatars.githubusercontent.com/u/123456?v=4",
	},
	{
		username: "dev789",
		verifiedThru: "github",
		email: "dev789@test.com",
		avatar: "https://avatars.githubusercontent.com/u/987654?v=4",
	},
	{
		username: "coder1",
		verifiedThru: "github",
		email: "coder1@github.com",
		avatar: "https://avatars.githubusercontent.com/u/555555?v=4",
	},
	{
		username: "techGeek",
		verifiedThru: "github",
		email: "techGeek@example.org",
		avatar: "https://avatars.githubusercontent.com/u/999999?v=4",
	},
	{
		username: "codingNinja",
		verifiedThru: "github",
		email: "ninja@codeland.com",
		avatar: "https://avatars.githubusercontent.com/u/111111?v=4",
	},
	{
		username: "devOpsMaster",
		verifiedThru: "github",
		email: "devOpsMaster@devops.org",
		avatar: "https://avatars.githubusercontent.com/u/777777?v=4",
	},
	{
		username: "dataWizard",
		verifiedThru: "github",
		email: "dataWizard@dataworld.com",
		avatar: "https://avatars.githubusercontent.com/u/222222?v=4",
	},
	{
		username: "codeArtist",
		verifiedThru: "github",
		email: "artist@code.com",
		avatar: "https://avatars.githubusercontent.com/u/333333?v=4",
	},
	{
		username: "hackerman",
		verifiedThru: "github",
		email: "hackerman@hacker.com",
		avatar: "https://avatars.githubusercontent.com/u/444444?v=4",
	},
];

const projects = [
	{
		identifier: "user123/project1",
		host: "github",
		hostID: "456789",
		live: true,
		connected: true,
		installationID: "987654",
	},
	{
		identifier: "companyA/repoX",
		host: "github",
		hostID: "987654",
		live: true,
		connected: true,
		installationID: "123456",
	},
	{
		identifier: "organizationB/app1",
		host: "github",
		hostID: "321098",
		live: true,
		connected: true,
		installationID: "456789",
	},
	{
		identifier: "organizationB/app1",
		host: "github",
		hostID: "3222098",
		live: true,
		connected: true,
		installationID: "456789",
	},
	{
		identifier: "organizationB/app1",
		host: "github",
		hostID: "321038",
		live: true,
		connected: true,
		installationID: "456789",
	},
];

const createRootUser = async () => {
	await axios.get("http://localhost:3001/api/auth/github");
};

const createUsers = async () => {
	await Promise.all(
		users.map(async ({ username, verifiedThru, avatar, email }) => {
			await User.create({
				username,
				verifiedThru,
				avatar,
				email,
			});
		})
	);
};

const createProjects = async () => {
	await Promise.all(
		projects.map(async (project) => {
			const proj = await Project.create({
				identifier: project.identifier,
				host: project.host,
				hostID: project.hostID,
				live: project.live,
				connected: project.connected,
				installationID: project.installationID,
			});
			await proj.setUser(1);
			console.log(proj.UserId);
		})
	);
};

createUsers();
createProjects();
