const fs = require('fs').promises;
const deleteImage = async (userImagePath) => {
    try{
        await fs.access(userImagePath);
        await fs.unlink(userImagePath);
        console.log('Image deleted successfully');
    }
    catch(error){
        console.error('Error while deleting image:', error);
    }
}
module.exports = {deleteImage};