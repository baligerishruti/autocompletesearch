import { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import AutocompleteSearch from "./AutocompleteSearch";

const MAX_CACHE_ENTRIES = 50;

export const App = () => {
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [cacheData, setCacheData] = useState(() => new Map());
  const [activeIndex, setActiveIndex] = useState(-1);

  const [productList, setProductList] = useState([]);
  const [productError, setProductError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const totalPages = Math.ceil(productList.length / 10);

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 1000);
    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    fetchProductList();
  }, []);

  const fetchProductList = async () => {
    setIsProductLoading(true);
    try {
      const response = await fetch(`https://dummyjson.com/products?limit=300`);
      if (!response.ok) {
        throw new Error(`Product request failed with status ${response.status}`);
      }
      const json = await response.json();
      const products = json.products;
      setProductList(products);
      setProductError("");
  } catch (error) {
      console.error("Failed to load products:", error);
      setProductError("Could not load products. Check your connection and try again.");
    } finally {
      setIsProductLoading(false);
    }
  };

  const filterData = useMemo(() => {
    const normalizedInput = input.trim().toLowerCase();
    return productList.filter((item) =>
      item.title.toLowerCase().includes(normalizedInput)
    );
  }, [productList, input]);

  const fetchData = async () => {
    const query = input.trim().toLowerCase();
    if (query && cacheData.has(query)) {
      setProductList(cacheData.get(query));
      setCurrentPage(1);
      setSearchError("");
      return;
    }
    setIsSearchLoading(true);
    setSearchError("");
    try {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=0`
      );
      if (!response.ok) {
        throw new Error(`Product search failed with status ${response.status}`);
      }
      const json = await response.json();
      const results = json.products;
      setProductList(results);
      if (query) {
        setCacheData((prev) => {
          const next = new Map(prev);
          next.set(query, results);
          if (next.size > MAX_CACHE_ENTRIES) {
            next.delete(next.keys().next().value);
          }
          return next;
        });
      }
      setCurrentPage(1);
      setSearchError("");
    } catch (error) {
      console.error("Failed to search products:", error);
      setSearchError("Search failed. Check your connection and try again.");
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev-1,1));
  };

  const handleNextPage =() =>  {
    setCurrentPage((prev) => Math.min(prev+1,totalPages));
  }

  return (
    <div>
      <h1>Product List: Auto Complete Search with Pagination</h1>

      <AutocompleteSearch input={input} setInput={setInput} filterData={filterData} showResults={showResults} setShowResults={setShowResults} activeIndex={activeIndex} setActiveIndex={setActiveIndex} searchError={searchError} isSearchLoading={isSearchLoading} />
      <div>
        <h2>Product List</h2>
        {productError && <p role="alert">{productError}</p>}
        {isProductLoading && (
          <p className="loading" role="status">
            <span className="loading-spinner" aria-hidden="true" />
            Loading products...
          </p>
        )}
        <div className="product-list">
          {productList.slice(startIndex, endIndex).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div>
          {productList.length > 0 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} startIndex={startIndex} endIndex={endIndex} onPageChange={setCurrentPage}   handlePrevPage={handlePrevPage} handleNextPage={handleNextPage}/>
          )}
        </div>
      </div>
    </div>
  );
};
