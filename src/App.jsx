import axios from "axios";
function App() {
	const auth = async () => {
		console.log("clicked");
		await axios.get("/auth/github").then(function (res) {
			console.log("res", res);
		});
	};
	return (
		<div className="text-3xl font-bold underline text-blue-800">
			<a href="/auth/github">Hello world</a>
		</div>
	);
}

export default App;
