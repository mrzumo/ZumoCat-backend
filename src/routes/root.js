export default function (_req, res) {
	res.status(200).send(JSON.stringify({ "code": 200, "message": "Server Running"}));
};
