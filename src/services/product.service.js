import { uploadImage, deleteImage } from '../helpers/cloudinary.js';
import Product from '../modals/Product.js';

export const createProductService = async (data, files = []) => {
  const uploadedImages = [];

  for (const file of files) {
    const result = await uploadImage(file.buffer, {
      folder: 'products',
    });
    uploadedImages.push({
      url: result.secure_url,
      publicId: result.public_id,
    });
  }

  const product = await Product.create({ ...data, images: uploadedImages });
  return product;
};

export const updateProductService = async (id, data, files = []) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');

  if (files.length > 0) {
    for (const img of product.images) {
      if (img?.publicId) {
        await deleteImage(img.publicId);
      }
    }

    const uploadedImages = [];
    for (const file of files) {
      const result = await uploadImage(file.buffer, {
        folder: 'products',
      });
      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    product.images = uploadedImages;
  }

  Object.assign(product, data);
  await product.save();

  return product;
};
