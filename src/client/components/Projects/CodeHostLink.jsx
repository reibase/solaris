import ExternalLink from "../../assets/externallink.png";
import darkExternalLink from "../../assets/externallinkdarkmode.png";
import githubLogo from "../../assets/github.png";
import githubLogoDarkMode from "../../assets/githubdarkmode.png";
import gitlabLogo from "../../assets/gitlab.svg";
import { useStore } from "../../store.js";

export default function CodeHostLink({ url, text, host, width = "300px" }) {
	const { dark } = useStore();
	const icon = {
		github: dark ? githubLogoDarkMode : githubLogo,
		gitlab: gitlabLogo,
	};
	const formatted = { github: "GitHub", gitlab: "GitLab" };
	return (
		<a href={url} target="_blank" className="cursor-pointer">
			<div
				className={`flex border text-[11px] border-[#8D4D4D4] hover:bg-[#E7F0FF] text-slate-800 dark:text-white dark:border-[#8B929F] dark:hover:bg-[#18181B]/75 rounded-md py-[2px] px-[12px] w-[${width}] justify-between items-center cursor-pointer`}
			>
				<span className="w-content mr-2">
					<img className="w-[16px]" src={icon[host]} />
				</span>
				<div className="w-full flex row justify-start">
					<span className=" max-w-[170px] text-left truncate">View {text}</span>
					<span className="w-[60px] ml-1"> on {formatted[host]}</span>
				</div>
				<span className="w-content flex items-end justify-end ml-2">
					<img
						className="w-[16px]"
						src={dark ? darkExternalLink : ExternalLink}
					/>
				</span>
			</div>
		</a>
	);
}
