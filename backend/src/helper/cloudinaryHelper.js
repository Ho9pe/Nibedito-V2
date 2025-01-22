const cloudinary = require('../config/cloudinary');
const createError = require('http-errors');

const publicIDfromURL = async (imageurl) => {
  const pathSegments = imageurl.split("/");

  // Get the last segment of the URL
  const lastSegment = pathSegments[pathSegments.length - 1];

  // Remove the file extension
  const publicID = lastSegment.split(".")[0];

  return publicID;
};

const uploadImage = async (file, folder) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, { folder });
        return result.secure_url;
    } catch (error) {
        throw createError(500, 'Error uploading image to cloudinary');
    }
};

const deleteImage = async (imageUrl, folder) => {
    try {
        const publicID = await publicIDfromURL(imageUrl);
        const { result } = await cloudinary.uploader.destroy(`${folder}/${publicID}`);
        if (result !== 'ok') {
            throw createError(500, 'Failed to delete image from cloudinary');
        }
    } catch (error) {
        throw createError(500, 'Error deleting image from cloudinary');
    }
};

module.exports = { publicIDfromURL, uploadImage, deleteImage };
