export function requireAuth(req, res, next) {
	if (req.headers.authorization !== process.env.AUTH_TOKEN) {
		return res.status(401).send("Unauthorized");
	}

	next();
}

