const publicIDfromURL = async (imageurl) => {
  const pathSegments = imageurl.split("/");

  // Get the last segment of the URL
  const lastSegment = pathSegments[pathSegments.length - 1];

  // Remove the file extension
  const publicID = lastSegment.split(".")[0];

  return publicID;
};

module.exports = { publicIDfromURL };
