const express = require("express");
const router = express.Router();
const convertBufferToString = require("../utils/convertBufferToString");
const { Product } = require("../models/Product");
// const multer = require("multer");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const { auth } = require("../middleware/auth");

// var storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, "uploads/");
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, `${Date.now()}_${file.originalname}`);
// 	},
// 	fileFilter: (req, file, cb) => {
// 		const ext = path.extname(file.originalname);
// 		if (ext !== ".jpg" || ext !== ".png") {
// 			return cb(res.status(400).end("only jpg, png are allowed"), false);
// 		}
// 		cb(null, true);
// 	},
// });

// var upload = multer({ storage: storage })

//=================================
//             Product
//=================================

// router.post("/uploadImage", auth, (req, res) => {

//     upload(req, res, err => {
//         if (err) {
//             return res.json({ success: false, err })
//         }
//         return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename })
//     })

// });

router.post(
	"/uploadProduct",
	upload.array("images", 5),
	auth,
	async (req, res) => {
		try {
			console.log("req.file-=-=--=-body-=-=-=", req.files, req.body);
			const url = [];

			for (let i = 0; i < req.files.length; i++) {
				let imageContent = convertBufferToString(
					req.files[i].originalname,
					req.files[i].buffer
				);
				let imageResponse = await cloudinary.uploader.upload(imageContent);
				console.log("File Uploaded :", imageResponse);
				url.push(imageResponse.secure_url);
			}

			const product = new Product(req.body);
			product.images.push(...url);
			await product.save();
			return res.status(200).json({ success: true });
		} catch (error) {
			console.log("error in uploading-=-=-=-=-", error);
			return res.status(400).json({ success: false, error });
		}
	}
);

router.post("/getProducts", (req, res) => {
	let order = req.body.order ? req.body.order : "desc";
	let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
	let limit = req.body.limit ? parseInt(req.body.limit) : 100;
	let skip = parseInt(req.body.skip);

	let findArgs = {};
	let term = req.body.searchTerm;

	for (let key in req.body.filters) {
		if (req.body.filters[key].length > 0) {
			if (key === "price") {
				findArgs[key] = {
					$gte: req.body.filters[key][0],
					$lte: req.body.filters[key][1],
				};
			} else {
				findArgs[key] = req.body.filters[key];
			}
		}
	}

	console.log(findArgs);

	if (term) {
		Product.find(findArgs)
			.find({ $text: { $search: term } })
			.populate("writer")
			.sort([[sortBy, order]])
			.skip(skip)
			.limit(limit)
			.exec((err, products) => {
				if (err) return res.status(400).json({ success: false, err });
				res
					.status(200)
					.json({ success: true, products, postSize: products.length });
			});
	} else {
		Product.find(findArgs)
			.populate("writer")
			.sort([[sortBy, order]])
			.skip(skip)
			.limit(limit)
			.exec((err, products) => {
				if (err) return res.status(400).json({ success: false, err });
				res
					.status(200)
					.json({ success: true, products, postSize: products.length });
			});
	}
});

//?id=${productId}&type=single
//id=12121212,121212,1212121   type=array
router.get("/products_by_id", (req, res) => {
	let type = req.query.type;
	let productIds = req.query.id;

	console.log("req.query.id", req.query.id);

	if (type === "array") {
		let ids = req.query.id.split(",");
		productIds = [];
		productIds = ids.map((item) => {
			return item;
		});
	}

	console.log("productIds", productIds);

	//we need to find the product information that belong to product Id
	Product.find({ _id: { $in: productIds } })
		.populate("writer")
		.exec((err, product) => {
			if (err) return res.status(400).send(err);
			return res.status(200).send(product);
		});
});

module.exports = router;
