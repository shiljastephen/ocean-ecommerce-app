import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import "./Home.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/home/products/");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/categories/");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Load data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar search={search} setSearch={setSearch} />

      <div className="home-container">
        <div className="categories-section">

          {/* 🔹 Categories (STATIC) */}
          <div className="categories">
            <button onClick={() => setSelectedCategory("")}>
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {selectedCategory && (
            <div className="back-btn-container">
              <button onClick={() => setSelectedCategory("")}>
                ← Back to All
              </button>
            </div>
          )}
          {/* 🔥 Slider Section */}
          <div className="slider-block">
            <div className="slider-header">
              <h2>Featured Products</h2>
            </div>
            <div className="slider-section">
              <Swiper
                modules={[Autoplay, Navigation]}
                navigation={true}
                spaceBetween={20}
                loop={products.length > 8}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  600: { slidesPerView: 2 },
                  900: { slidesPerView: 3 },
                  1200: { slidesPerView: 4 },
                }}
              >
                {products.slice(0, 10).map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          {/* 🔥 Category Sections */}
          {categories.map((cat) => {
            const filteredProducts = products.filter(
              (p) =>
                p.category === cat.id &&
                p.name.toLowerCase().includes(search.toLowerCase()) &&
                (!selectedCategory || p.category === selectedCategory)
            );

            if (filteredProducts.length === 0) return null;

            return (
              <div key={cat.id} className="category-block">
                <div className="category-header">
                  <h2>{cat.name}</h2>
                  <button
                    className="view-all-btn"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    View All →
                  </button>
                </div>

                <div className="category-row">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </>
  );
}

export default Home; 