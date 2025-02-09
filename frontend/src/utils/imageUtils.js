import axios from '@/utils/axios';

export const getImageUrl = (url, transform = {}) => {
    if (!url) return '/images/default-avatar.png';

    if (!url.includes('cloudinary')) return url;

    const [baseUrl, imagePath] = url.split('/upload/');
    const transformations = [];

    if (transform.width) transformations.push(`w_${transform.width}`);
    if (transform.height) transformations.push(`h_${transform.height}`);
    if (transform.crop) transformations.push(`c_${transform.crop}`);
    if (transform.quality) transformations.push(`q_${transform.quality}`);

    const transformString = transformations.length > 0
        ? transformations.join(',') + '/'
        : '';

    return `${baseUrl}/upload/${transformString}${imagePath}`;
};

export const getOptimizedImageUrl = (url, preset = 'thumbnail') => {
    const presets = {
        thumbnail: { width: 300, height: 300, crop: 'fill', quality: 80 },
        product: { width: 800, height: 800, crop: 'fill', quality: 90 },
        banner: { width: 1200, height: 400, crop: 'fill', quality: 90 }
    };

    return getImageUrl(url, presets[preset]);
};

export const imageLoader = ({ src, width, quality }) => {
    return getImageUrl(src, { width, quality });
};

export const uploadImage = async (file, userId) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const formData = new FormData();
        formData.append('profilePicture', file);

        const { data } = await axios.put(
            `/users/profile/${userId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (data.success && data.payload?.user) {
            localStorage.setItem('user', JSON.stringify(data.payload.user));
            return data.payload.user;
        }
        throw new Error(data.message || 'Failed to upload image');
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
};
