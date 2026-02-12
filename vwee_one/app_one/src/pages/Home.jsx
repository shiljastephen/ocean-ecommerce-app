import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    let url = "http://127.0.0.1:8000/api/home/products/";
    if (selectedCategory) url += `?category=${selectedCategory}`;

    const res = await axios.get(url);
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/categories/");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>

      <div className="home-container">

        {/* Categories */}
        <div className="categories-section">
          {/* <h3>Categories</h3> */}
          <div className="categories">
            <button onClick={() => setSelectedCategory("")}>All</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}>
                {cat.name}
              </button>
            ))}
          </div>
       

         {/* Products */}
         <div className="products-grid">
          {products
            .filter(p =>
              p.name.toLowerCase().includes(search.toLowerCase())
            )
            .map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
         </div>
         </div>
      </div>
    </>
  );
}

export default Home;
