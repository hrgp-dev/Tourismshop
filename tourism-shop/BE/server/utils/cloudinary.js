const cloudinary = require("cloudinary").v2;

// cloudinary.config({
// 	CLOUDINARY_URL:
// 		"cloudinary://126496329963836:QMEjVMBMMwX8vfxihuj8oIwLy9Y@disi7lm6o",
// 		Cloud_name:	"disi7lm6o",
// 		API_Key: "126496329963836"
// });

cloudinary.config({
	cloud_name: "disi7lm6o",
	api_key: "126496329963836",
	api_secret: "QMEjVMBMMwX8vfxihuj8oIwLy9Y",
});

module.exports = cloudinary;
