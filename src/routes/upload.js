import { uploadImage } from "../firebase.js";

export default function (req, res, _next) {
	// Pipe the request to busboy
	req.pipe(req.busboy);

	// Wait for busboy to parse the file
	req.busboy.on("file", function (_, fileStream, fileMetadata) {
		const [_fileName, fileExt] = fileMetadata.filename.split(".");

		// Create a buffer to store the image data
		const imageBuffer = [];
		fileStream.on("data", function (data) {
			imageBuffer.push(data);
		});

		// When the file stream ends, parse the tags and upload the image
		fileStream.on("end", function () {
			
			let tags = [];
			if (req.headers.tags) {
				try {
					tags = JSON.parse(req.headers.tags);
				} catch (e) {
					return res.status(400).send("Invalid tag header");
				}
			}

			const catData = {
				title: req.headers.title,
				description: req.headers.description,
				tags: tags,
			};

			uploadImage(Buffer.concat(imageBuffer), fileExt, catData);
			res.status(200).send("Uploaded image");
		});
	});
};
