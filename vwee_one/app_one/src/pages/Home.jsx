import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import "./Home.css";


function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory]);

  const fetchCategories = async () => {
    const res = await API.get("categories/");
    setCategories(res.data);
  };

  const fetchProducts = async () => {
    const res = await API.get("products/", {
      params: { search, category: selectedCategory },
    });
    setProducts(res.data);
  };

  return (
    <div className="home">
      {/* ✅ Pass search state to Navbar */}
      <Navbar
       search={search}
       setSearch={setSearch}
       categories={categories}
       setSelectedCategory={setSelectedCategory}
      />

      {/* Products */}
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Home;
