import fs from 'fs';


const content = fs.readFileSync(global.ROOT_PATH + "/static/index.html", 'utf8');

export default function (_req, res) {
	res.status(200).send(content);
	// res.status(200).send(JSON.stringify({ "code": 200, "message": "Server Running"}));
};
