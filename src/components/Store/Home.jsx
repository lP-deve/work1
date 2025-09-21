import React, { useEffect, useState } from 'react';
import StoreHeader from '../header/StoreHeader';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(
        `https://api.redseam.redberryinternship.ge/api/products?page=${page}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) throw new Error('Failed to fetch products');

      const data = await res.json();
      setProducts(data.data);
      setTotalPages(data.meta.last_page);
      setTotalItems(data.meta.total);
    } catch (err) {
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={i === currentPage ? 'active' : ''}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <>
      <StoreHeader />
      <section className='store'>
        <div>
          <div className="filters">
            <h2>Products</h2>
            <div className="filterItems">
              <p className='pages'>
                Showing {startItem} - {endItem} of {totalItems} results
              </p>
              <div className="line"></div>
              <div className="filterPrice">
                <img src="adjustments-horizontal.svg" alt="" />
                <p>Filter</p>
              </div>
              <div className="sort">
                <p>Sort by</p>
                <img src="vec2.svg" alt="vector" />
              </div>
            </div>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className='content'>
              {products.map(product => (
                <div key={product.id} className='item'>
                  <img src={product.cover_image} alt={product.name} />
                  <p>{product.name}</p>
                  <p>{product.price} ₾</p>
                </div>
              ))}
            </div>
          )}

          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ‹ Prev
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ›
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;


