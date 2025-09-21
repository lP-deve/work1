
export const fetchProductsFromAPI = async ({ page, priceFrom, priceTo, sortBy }) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();

  if (page) params.append('page', page);
  if (priceFrom) params.append('filter[price_from]', priceFrom);
  if (priceTo) params.append('filter[price_to]', priceTo);
  if (sortBy) params.append('sort', sortBy);

  const res = await fetch(
    `https://api.redseam.redberryinternship.ge/api/products?${params.toString()}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await res.json();
  return {
    products: data.data,
    totalPages: data.meta.last_page,
    totalItems: data.meta.total,
  };
};
