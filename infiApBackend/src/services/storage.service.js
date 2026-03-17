const imageKit = require("@imagekit/nodejs");

const imagekit = new imageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});


async function uploadFile(buffer) {
    try {
        const response = await imagekit.files.upload({
            file: buffer.toString('base64'),
            fileName: `blog_${Date.now()}.jpg`
        });
        console.log("ImageKit upload response:", response);
        return response;
    } catch (error) {
        console.error("ImageKit upload error:", error);
        throw error;
    }
}

module.exports = uploadFile;