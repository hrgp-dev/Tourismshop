const DataUri = require("datauri/parser");
var dataUriChild = new DataUri();
const path = require("path");

module.exports = function (originalName, buffer) {
	console.log("Originalname in bufferfile==-==-=-=-=-", originalName);
	var extName = path.extname(originalName);
	return dataUriChild.format(extName, buffer).content;
};
