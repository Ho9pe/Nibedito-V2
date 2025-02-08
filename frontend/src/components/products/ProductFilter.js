export default function ProductFilter() {
    return (
        <div className="product-filters">
            <div className="filter-group">
                <h3>Price Range</h3>
                <div className="price-inputs">
                    <input 
                        type="number" 
                        placeholder="Min"
                        onChange={(e) => handlePriceChange('min', e.target.value)}
                    />
                    <input 
                        type="number" 
                        placeholder="Max"
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                    />
                </div>
            </div>
            
            <div className="filter-group">
                <h3>Sort By</h3>
                <select onChange={(e) => handleSortChange(e.target.value)}>
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                </select>
            </div>
        </div>
    );
}
