import { useState } from 'react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { FiRefreshCw } from 'react-icons/fi';

export default function ProductTester() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createdProduct, setCreatedProduct] = useState(null);
    // Helper function to add test results to the list
    // Handles both success and error cases with proper formatting
    const addResult = (testName, response, success = true) => {
        // If it's an error response, format it once
        if (!success) {
            const errorMessage = response.error || response.message || response;
            setResults(prev => [{
                id: `${Date.now()}-${testName}`,
                timestamp: new Date().toLocaleTimeString(),
                testName,
                success: false,
                error: errorMessage,
                response: null
            }, ...prev]);
            return;
        }
        // For successful responses
        setResults(prev => [{
            id: `${Date.now()}-${testName}`,
            timestamp: new Date().toLocaleTimeString(),
            testName,
            success: true,
            error: null,
            response: typeof response === 'object' ? JSON.stringify(response, null, 2) : response
        }, ...prev]);
    };
    // Helper function to fetch a random image from picsum
    // Returns a File object that can be used in FormData
    const getRandomImage = async () => {
        const response = await fetch('https://picsum.photos/800/600');
        const blob = await response.blob();
        return new File([blob], 'test-image.jpg', { type: 'image/jpeg' });
    };
    const runAllTests = async () => {
        setLoading(true);
        setResults([]);
        let testProduct = null;
        try {
            // Test 1: Category Selection
            // - Fetches all active categories
            // - Randomly selects one category for product creation
            // - Validates that at least one active category exists
            const categories = await categoryService.getActiveCategories();
            if (!categories.length) {
                throw new Error('No active categories found');
            }
            const randomIndex = Math.floor(Math.random() * categories.length);
            const selectedCategory = categories[randomIndex];
            addResult('Test Setup', `Found ${categories.length} active categories and selected ${selectedCategory.name}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Test 2: Product Creation
            // - Creates a new product with random data
            // - Includes thumbnail image
            // - Adds basic variant with color and size
            // - Tests FormData handling and image upload
            const createFormData = new FormData();
            const productName = `Test Product ${Date.now()}`;
            createFormData.append('name', productName);
            createFormData.append('description', 'This is a detailed test product description that meets the minimum length requirement.');
            createFormData.append('price', (Math.random() * 1000).toFixed(2));
            createFormData.append('category', selectedCategory._id);
            createFormData.append('shipping', 'true');
            
            // Add thumbnail
            const image = await getRandomImage();
            createFormData.append('thumbnail', image);
            
            // Add variant with image indices
            const variants = [{
                color: 'Black',
                size: 'M',
                quantity: 10,
                imageIndices: [0], // This tells the server which variantImages to use
                images: []
            }];
            createFormData.append('variants', JSON.stringify(variants));
            
            // Add variant image
            const variantImage = await getRandomImage();
            createFormData.append('variantImages', variantImage);
            const createdProductResponse = await productService.createProduct(createFormData);
            testProduct = createdProductResponse.payload.product;
            addResult('Create Product', createdProductResponse);
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Test 3: Product Retrieval
            // - Fetches the created product using its slug
            // - Validates that the product data is correctly stored
            // - Tests the GET endpoint functionality
            const fetchedProduct = await productService.getProduct(testProduct.slug);
            addResult('Get Single Product', fetchedProduct);
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Test 4: Product Update
            // - Updates product details including name, description, and price
            // - Tests the update endpoint with FormData
            // - Validates that the slug updates with name change
            const updateFormData = new FormData();
            updateFormData.append('name', `Updated ${testProduct.name}`);
            updateFormData.append('description', 'Updated description that meets the minimum length requirement');
            updateFormData.append('price', (parseFloat(testProduct.price) + 100).toFixed(2));
            updateFormData.append('category', selectedCategory._id);
            updateFormData.append('shipping', testProduct.shipping);
            
            // Keep existing variant images
            const updatedVariants = testProduct.variants.map(variant => ({
                ...variant,
                images: variant.images // Preserve existing images
            }));
            updateFormData.append('variants', JSON.stringify(updatedVariants));
            const updatedProduct = await productService.updateProduct(testProduct.slug, updateFormData);
            testProduct = updatedProduct.payload.product;
            addResult('Update Product Details', updatedProduct);
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Test 5: Product Deletion
            // - Deletes the test product
            // - Validates cleanup of associated images
            // - Tests cascade deletion of product data
            try {
                const deleteResponse = await productService.deleteProduct(testProduct.slug);
                addResult('Delete Product', deleteResponse);
            } catch (error) {
                addResult('Delete Product', error, false);
            }
        } catch (error) {
            addResult('Test Failed', error, false);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="api-tester">
            <div className="tester-header">
                <h2>Product API Flow Tester</h2>
                <button 
                    className="btn btn-primary"
                    onClick={runAllTests}
                    disabled={loading}
                >
                    <FiRefreshCw className={loading ? 'spin' : ''} />
                    {loading ? 'Running Tests...' : 'Run Test Flow'}
                </button>
            </div>
            <div className="test-results">
                {results.map(result => (
                    <div key={result.id} className={`result-card ${result.success ? 'success' : 'error'}`}>
                        <div className="result-header">
                            <span className="test-name">{result.testName}</span>
                            <span className="timestamp">{result.timestamp}</span>
                        </div>
                        {result.error && (
                            <div className="error-message">
                                {result.error}
                            </div>
                        )}
                        <pre className="response">{result.response}</pre>
                    </div>
                ))}
            </div>
        </div>
    );
} 