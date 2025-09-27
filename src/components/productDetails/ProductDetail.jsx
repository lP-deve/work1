import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './ProductDetail.css'

const API_BASE = "https://api.redseam.redberryinternship.ge/api"; 

export default function ProductDetail({ localCart, setLocalCart }) {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [colorImages, setColorImages] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();

        setProduct(data);
        setSelectedColorIndex(0);
        setSelectedSize(data.available_sizes?.[0] ?? null);

        const colorMap = {};
        data.available_colors?.forEach((color, i) => {
          colorMap[color] = data.images?.[i] ?? data.cover_image;
        });
        setColorImages(colorMap);
        setMainImage(data.images?.[0] ?? data.cover_image ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleAddToCart = async () => {
    if (!product) {
      alert("Product data is missing.");
      return;
    }


    const selectedColor = product.available_colors?.[selectedColorIndex] ?? "";
    const selectedImage = colorImages[selectedColor] ?? mainImage;

    const newItem = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
      image: selectedImage,
    };

    setLocalCart(prev => {
      const index = prev.findIndex(
        i => i.product_id === newItem.product_id && i.color === newItem.color && i.size === newItem.size
      );
      if (index > -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], quantity: updated[index].quantity + newItem.quantity };
        return updated;
      } else {
        return [...prev, newItem];
      }
    });

    try {
      await fetch(`${API_BASE}/cart/products/${product.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: newItem.quantity,
          color: newItem.color,
          size: newItem.size,
        }),
      });
      setSuccessMessage("Product added!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="detailInfo">
      <p className="listings">Listing/Products</p>
      <div className="product-detail">
        <div className="images">
          <div className="cover-img">
            <img src={mainImage} alt={product.name} className="main-image" /></div>
          {product.images?.length > 1 && (
            <div className="thumbnails">
              {product.images.map((img, idx) => {
                const colorForImage = Object.keys(colorImages).find(c => colorImages[c] === img);
                const isActive = img === mainImage;
                return (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={isActive ? "active-thumbnail" : ""}
                    onClick={() => {
                      setMainImage(img);
                      if (colorForImage) {
                        const colorIndex = product.available_colors.indexOf(colorForImage);
                        setSelectedColorIndex(colorIndex);
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="info">
          <h2>{product.name}</h2>
          <p className="cost">Price: {product.price} ₾</p>

          {product.available_colors?.length > 0 && (
            <div className="color-otions">
              <div>
                <p>Color: {product.available_colors[selectedColorIndex] || "None"}</p>
              </div>
              <div className="swatches">
                {product.available_colors.map((color, i) => (
                  <button
                    key={color + i}
                    style={{ backgroundColor: color }}
                    className={selectedColorIndex === i ? "active-color" : ""}
                    onClick={() => {
                      setSelectedColorIndex(i);
                      setMainImage(colorImages[color] ?? product.cover_image);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {product.available_sizes?.length > 0 && (
            <div>
              <div>
                <p className="size">Size: {selectedSize || "None"}</p>
              </div>
              <div className="sizebtns">
                <div className="sizes">
                  {product.available_sizes.map(s => (
                    <button
                      key={s}
                      className={selectedSize === s ? "active" : ""}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div >
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="quantity-select"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num} className="quantity-options">
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button className="addtoCartBtn" onClick={handleAddToCart}>
              <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.25 1.5H2.63568C3.14537 1.5 3.59138 1.84265 3.7227 2.33513L4.1059 3.77209M6.5 12.75C4.84315 12.75 3.5 14.0931 3.5 15.75H19.25M6.5 12.75H17.7183C18.8394 10.4494 19.8177 8.06635 20.6417 5.6125C15.88 4.39646 10.8905 3.75 5.75 3.75C5.20021 3.75 4.65214 3.7574 4.1059 3.77209M6.5 12.75L4.1059 3.77209M5 18.75C5 19.1642 4.66421 19.5 4.25 19.5C3.83579 19.5 3.5 19.1642 3.5 18.75C3.5 18.3358 3.83579 18 4.25 18C4.66421 18 5 18.3358 5 18.75ZM17.75 18.75C17.75 19.1642 17.4142 19.5 17 19.5C16.5858 19.5 16.25 19.1642 16.25 18.75C16.25 18.3358 16.5858 18 17 18C17.4142 18 17.75 18.3358 17.75 18.75Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Add to cart
            </button>
            <div className="line"></div>


            <div className="brand">
              {product.brand && (
                <div>
                  <div className="logobrand">
                    <p>Details</p>
                    <img src={product.brand.image} alt="Brand Logo" className="brand-logo" />
                  </div>
                  <div className="detailsBrand">

                    <p className="brand-name"> Brand: {product.brand.name}</p>
                  </div>
                </div>
              )}</div>


            <p className="decriptionPrdoucts">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
