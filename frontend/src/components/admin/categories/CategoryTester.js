// frontend/src/components/admin/categories/CategoryTester.js
'use client';

import { useState } from 'react';
import { categoryService } from '@/services/categoryService';

export default function CategoryTester() {
    const [testResults, setTestResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const addResult = (operation, success, message) => {
        setTestResults(prev => [{
            operation,
            success,
            message,
            timestamp: new Date().toISOString()
        }, ...prev]);
    };

    const runTests = async () => {
        setIsLoading(true);
        setTestResults([]);

        try {
            // Test 1: Get All Categories
            try {
                const categoriesData = await categoryService.getAllCategories();
                addResult('Get All Categories', true, 
                    `Successfully fetched ${categoriesData.categories.length} categories`);
            } catch (error) {
                addResult('Get All Categories', false, error.message);
            }

            // Test 2: Create Category
            let newCategory;
            try {
                const formData = new FormData();
                const testName = 'Test Category ' + Date.now();
                formData.append('name', testName);
                formData.append('description', 'Test Description');
                
                const blob = await fetch('https://picsum.photos/200').then(r => r.blob());
                const testImage = new File([blob], 'test-image.jpg', { type: 'image/jpeg' });
                formData.append('image', testImage);

                const createResponse = await categoryService.createCategory(formData);
                newCategory = createResponse.payload.category;
                addResult('Create Category', true, 
                    `Created category: ${newCategory.name}`);

                // Add delay between operations
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                addResult('Create Category', false, error.message);
                return;
            }

            // Test 3: Update Category
            let updatedSlug;
            if (newCategory) {
                try {
                    const formData = new FormData();
                    const updatedName = newCategory.name + ' (Updated)';
                    formData.append('name', updatedName);
                    formData.append('description', 'Updated Description');

                    const updateResponse = await categoryService.updateCategory(
                        newCategory.slug,
                        formData
                    );
                    const updatedCategory = updateResponse.payload.category;
                    updatedSlug = updatedCategory.slug; // Store the new slug
                    addResult('Update Category', true, 
                        `Updated category: ${updatedCategory.name}`);

                    // Add delay between operations
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    addResult('Update Category', false, error.message);
                    return;
                }
            }

            // Test 4: Delete Category
            if (updatedSlug) { // Use the updated slug
                try {
                    const deleteResponse = await categoryService.deleteCategory(updatedSlug);
                    addResult('Delete Category', true, 
                        `Deleted category: ${deleteResponse.payload.category.name}`);
                } catch (error) {
                    addResult('Delete Category', false, error.message);
                }
            }

        } catch (error) {
            addResult('Test Suite', false, 'Test suite failed: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="category-tester">
            <div className="tester-header">
                <h2>Category API Tester</h2>
                <button 
                    onClick={runTests} 
                    disabled={isLoading}
                    className="btn btn-primary"
                >
                    {isLoading ? 'Running Tests...' : 'Run Tests'}
                </button>
            </div>

            <div className="test-results">
                {testResults.map((result, index) => (
                    <div 
                        key={index} 
                        className={`test-result ${result.success ? 'success' : 'error'}`}
                    >
                        <h4>{result.operation}</h4>
                        <p>{result.message}</p>
                        <small>{new Date(result.timestamp).toLocaleString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
}