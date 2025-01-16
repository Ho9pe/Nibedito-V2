export const getImageUrl = (path, options = {}) => {
  // This function will later handle Cloudinary URLs
  const { width = 1000, quality = 80 } = options;
  return `${path}?w=${width}&q=${quality}`;
};

export const imageLoader = ({ src, width, quality }) => {
  // This will be replaced with Cloudinary loader
  return getImageUrl(src, { width, quality });
};
