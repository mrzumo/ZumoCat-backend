import { CatModel } from "../utils/mongoose.js";
import { getModelJson } from "../utils/mongoose.js";

export default async function (_req, res) {
    let cats = await CatModel.find({}).sort({ uploadTime: -1 }).limit(30);

    let catJson = [];
    for (let cat of cats) {
        catJson.push(await getModelJson(cat));
    }

    res.status(200).send(catJson);
}