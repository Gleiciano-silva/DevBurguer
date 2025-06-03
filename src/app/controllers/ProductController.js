import * as yup from "yup";
import Product from "../models/Product.js";
import Category from "../models/Category";
import User from "../models/user.js";
class ProductController {
	async store(request, response) {
		const schema = yup.object({
			name: yup.string().required(),
			price: yup.number().required(),
			category_id: yup.number().required(),
			offer: yup.boolean(),
		});

		try {
			schema.validateSync(request.body, { abortEarly: false });
		} catch (err) {
			return response.status(400).json({ error: err.errors });
		}
		const { admin: isAdmin } = await User.findByPk(request.userId);

		if (!isAdmin) {
			return response.status(401).json();
		}

		const { filename: path } = request.file;
		const { name, price, category_id, offer } = request.body;

		const product = await Product.create({
			name,
			price,
			category_id,
			path,
			offer,
		});

		return response.status(201).json(product);
	}
	async update(request, response) {
		const schema = yup.object({
			name: yup.string(),
			price: yup.number(),
			category_id: yup.number(),
			offer: yup.boolean(),
		});

		try {
			schema.validateSync(request.body, { abortEarly: false });
		} catch (err) {
			return response.status(400).json({ error: err.errors });
		}
		const { admin: isAdmin } = await User.findByPk(request.userId);

		if (!isAdmin) {
			return response.status(401).json();
		}
		const { id } = request.params;
		const findProduct = await Product.findByPk(id);

		if (!findProduct) {
			return response
				.status(400)
				.json({ error: "Make sure your product ID is correct" });
		}

		let path;
		if (request.file) {
			path = request.file.filename;
		}

		const { name, price, category_id, offer } = request.body;

		await Product.update(
			{
				name,
				price,
				category_id,
				path,
				offer,
			},
			{
				where: {
					id,
				},
			},
		);

		return response.status(200).json(product);
	}
	async index(request, response) {
		const products = await Product.findAll({
			include: [
				{
					model: Category,
					as: "category",
					attributes: ["id", "name"],
				},
			],
		});

		return response.json(products);
	}
}

export default new ProductController();
