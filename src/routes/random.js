const { CatModel } = require("../mongoose");
const { storage } = require("../firebase");
const { ref, getDownloadURL } = require("firebase/storage");

module.exports = async function (_req, res) {
	let cats = await CatModel.find({});
	let randomCat = cats[Math.floor(Math.random() * cats.length)];

	let refrence = ref(storage, randomCat.filePath);
	let url = await getDownloadURL(refrence);

	res.status(200).send({
		title: randomCat.title,
		description: randomCat.description,
		tags: randomCat.tags,
		url: url,
	});
};
