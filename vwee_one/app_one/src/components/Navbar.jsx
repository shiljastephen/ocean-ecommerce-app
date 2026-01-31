import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ search, setSearch, categories = [], setSelectedCategory }) {
  return (
    <nav className="navbar">
      <h2 className="logo">OCEAN 🛒</h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

       {/* 🗂 Categories */}
      <div className="categories">
        <button color="red" onClick={() => setSelectedCategory("")}>All</button>
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="subhead">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
