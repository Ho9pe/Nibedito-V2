import { useState } from 'react';
import { productService } from '@/services/productService';

export default function ProductTester() {
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const testCreateProduct = async () => {
        try {
            const formData = new FormData();
            formData.append('name', 'Test Product');
            formData.append('description', 'This is a test product description');
            formData.append('price', '99.99');
            formData.append('category', '65f1234567890123456789'); // Replace with actual category ID
            formData.append('shipping', 'true');
            
            const variants = [
                {
                    color: 'Black',
                    size: 'M',
                    quantity: 10,
                    imageIndices: [0]
                }
            ];
            formData.append('variants', JSON.stringify(variants));
            
            if (file) {
                formData.append('image', file);
            }

            const response = await productService.createProduct(formData);
            setResult(JSON.stringify(response, null, 2));
            setError('');
        } catch (err) {
            setError(err.message);
            setResult('');
        }
    };

    const testGetProducts = async () => {
        try {
            const response = await productService.getAllProducts({
                page: 1,
                limit: 10,
                search: ''
            });
            setResult(JSON.stringify(response, null, 2));
            setError('');
        } catch (err) {
            setError(err.message);
            setResult('');
        }
    };

    const testGetProduct = async () => {
        try {
            const slug = 'test-product'; // Replace with actual slug
            const product = await productService.getProduct(slug);
            setResult(JSON.stringify(product, null, 2));
            setError('');
        } catch (err) {
            setError(err.message);
            setResult('');
        }
    };

    const testUpdateProduct = async () => {
        try {
            const slug = 'test-product'; // Replace with actual slug
            const formData = new FormData();
            formData.append('name', 'Updated Test Product');
            formData.append('price', '149.99');
            
            if (file) {
                formData.append('image', file);
            }

            const response = await productService.updateProduct(slug, formData);
            setResult(JSON.stringify(response, null, 2));
            setError('');
        } catch (err) {
            setError(err.message);
            setResult('');
        }
    };

    const testDeleteProduct = async () => {
        try {
            const slug = 'test-product'; // Replace with actual slug
            const response = await productService.deleteProduct(slug);
            setResult(JSON.stringify(response, null, 2));
            setError('');
        } catch (err) {
            setError(err.message);
            setResult('');
        }
    };

    return (
        <div className="product-tester">
            <h2>Product API Tester</h2>
            
            <div className="test-section">
                <h3>Image Upload</h3>
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*"
                />
            </div>

            <div className="test-section">
                <h3>API Tests</h3>
                <div className="button-group">
                    <button onClick={testCreateProduct}>Test Create Product</button>
                    <button onClick={testGetProducts}>Test Get Products</button>
                    <button onClick={testGetProduct}>Test Get Single Product</button>
                    <button onClick={testUpdateProduct}>Test Update Product</button>
                    <button onClick={testDeleteProduct}>Test Delete Product</button>
                </div>
            </div>

            {error && (
                <div className="error-section">
                    <h3>Error:</h3>
                    <pre className="error">{error}</pre>
                </div>
            )}

            {result && (
                <div className="result-section">
                    <h3>Result:</h3>
                    <pre className="result">{result}</pre>
                </div>
            )}
        </div>
    );
} 