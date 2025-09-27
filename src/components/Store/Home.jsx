import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import StoreHeader from '../header/StoreHeader';
import './Home.css';
import { fetchProductsFromAPI } from './FetchProducts';


const Home = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const priceFrom = searchParams.get('filter[price_from]') || '';
  const priceTo = searchParams.get('filter[price_to]') || '';
  const sortBy = searchParams.get('sort') || '';

  const [minInput, setMinInput] = useState(priceFrom);
  const [maxInput, setMaxInput] = useState(priceTo);
  const [selectedSort, setSelectedSort] = useState(sortBy);

  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await fetchProductsFromAPI({
          page: currentPage,
          priceFrom,
          priceTo,
          sortBy,
        });
        setProducts(result.products);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, priceFrom, priceTo, sortBy]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (minInput) params.set('filter[price_from]', minInput);
    if (maxInput) params.set('filter[price_to]', maxInput);
    if (selectedSort) params.set('sort', selectedSort);
    params.set('page', 1);
    setSearchParams(params);

    setShowFilters(false);
    setMinInput('');
    setMaxInput('');
  };

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page);
    setSearchParams(params);
  };

  const handleSortChange = (sortValue) => {
    setSelectedSort(sortValue);
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue) {
      params.set('sort', sortValue);
    } else {
      params.delete('sort');
    }
    params.set('page', 1);
    setSearchParams(params);
  };

  const removeAllPriceFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('filter[price_from]');
    params.delete('filter[price_to]');
    setMinInput('');
    setMaxInput('');
    params.set('page', 1);
    setSearchParams(params);
  };


  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`pagination-button ${i === currentPage ? 'active' : ''}`}
            onClick={() => goToPage(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      for (let i = 1; i <= maxPagesToShow; i++) {
        pages.push(
          <button
            key={i}
            className={`pagination-button ${i === currentPage ? 'active' : ''}`}
            onClick={() => goToPage(i)}
          >
            {i}
          </button>
        );
      }

      if (currentPage > maxPagesToShow + 2) {
        pages.push(<span key="dots-start">...</span>);
      }

      const start = Math.max(currentPage - 1, maxPagesToShow + 1);
      const end = Math.min(currentPage + 1, totalPages - maxPagesToShow);

      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            className={`pagination-button ${i === currentPage ? 'active' : ''}`}
            onClick={() => goToPage(i)}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - (maxPagesToShow + 1)) {
        pages.push(<span key="dots-end">...</span>);
      }

      for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`pagination-button ${i === currentPage ? 'active' : ''}`}
            onClick={() => goToPage(i)}
          >
            {i}
          </button>
        );
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, totalItems);

  return (
    <>
      <section className='store'>
       
        <div className="filters">
          <h2>Products</h2>
          <div className="groupFilters">
            <div className="pageCount">
              <p className='pages'>
                Showing {startItem} - {endItem} of {totalItems} results
              </p>
            </div>

            <div className="pricerange">
              <div
                className="align"
                onClick={() => setShowFilters(!showFilters)}
                style={{ cursor: 'pointer' }}
              >
                <img src="adjustments-horizontal.svg" alt="filter" />
                <p>Filter</p>
              </div>

              {showFilters && (
                <div className='priceFilter'>
                  <h3>Select price</h3>
                  <div className="priceInputs">
                    <input
                      type="number"
                      value={minInput}
                      onChange={(e) => setMinInput(e.target.value)}
                      placeholder="From *"
                      min="0"
                    />
                    <input
                      type="number"
                      value={maxInput}
                      onChange={(e) => setMaxInput(e.target.value)}
                      placeholder="To *"
                      min="0"
                    />
                  </div>
                  <div className="btn">
                    <button onClick={applyFilters}>Apply Filters</button>
                  </div>
                </div>
              )}
            </div>

            <div className="sortitem">
              <div
                className="sort-selected"
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                {selectedSort === '' && 'Sort by'}
                {selectedSort === '-created_at' && 'New products first'}
                {selectedSort === 'price' && 'Price, low to high'}
                {selectedSort === '-price' && 'Price, high to low'}
              </div>

              {showSortOptions && (
                <div className="sort-options">
                  <div
                    className={selectedSort === '' ? 'active' : ''}
                    onClick={() => {
                      handleSortChange('');
                      setShowSortOptions(false);
                    }}
                  >
                    Sort by
                  </div>
                  <div
                    className={selectedSort === '-created_at' ? 'active' : ''}
                    onClick={() => {
                      handleSortChange('-created_at');
                      setShowSortOptions(false);
                    }}
                  >
                    New products first
                  </div>
                  <div
                    className={selectedSort === 'price' ? 'active' : ''}
                    onClick={() => {
                      handleSortChange('price');
                      setShowSortOptions(false);
                    }}
                  >
                    Price, low to high
                  </div>
                  <div
                    className={selectedSort === '-price' ? 'active' : ''}
                    onClick={() => {
                      handleSortChange('-price');
                      setShowSortOptions(false);
                    }}
                  >
                    Price, high to low
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="active-filters" style={{ margin: '20px 0' }}>
          {(priceFrom || priceTo) && (
            <>
              <h4>Active Price Filters:</h4>
              <div
                className="filter-tags"

              >
                <div
                  className="filter-tag"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  {priceFrom && <>price: {priceFrom}</>}
                  {priceFrom && priceTo && <> - </>}
                  {priceTo && <> {priceTo}</>}
                  <button
                    onClick={removeAllPriceFilters}

                    aria-label="Remove price filters"
                  >
                    ×
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className='content'>
            {products.map((product) => (
              <Link to={`/products/${product.id}`} key={product.id} className="product-card"> <div className='item'>
                <img src={product.cover_image} alt={product.name} />
                <p className="productName">{product.name}</p>
                <p className='priceProduct'>{product.price} ₾</p>
              </div></Link>
            ))}

          </div>
        )}

        <div className="pagination">
          <button
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="navigBtn"
          >
            <img src="Vector 4 (Stroke).svg" alt="" />
          </button>

          {renderPageNumbers()}
          <button
            onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="navigBtn"
          >
            <img src="verctor.svg" alt="" />
          </button>
        </div>
      
      </section>
    </>
  );
};

export default Home;
