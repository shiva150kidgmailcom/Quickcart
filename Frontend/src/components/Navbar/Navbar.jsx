import { useContext, useState } from "react";
import style from "../Navbar/navbar.module.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { ThemeContext } from "../../context/ThemeContext";

const Navbar = ({ setShowLogin }) => {
  // useState used here for menu
  const [menu, setMenu] = useState("home");

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext)
  const { theme, toggleTheme, isDark } = useContext(ThemeContext)

  const navigate = useNavigate()
  const Logout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate("/")
  }

  return (
    <div className={style.Navbar}>
      <Link to="/"><img src={assets.logo} className={style.logo} /></Link>
      <ul className={style.navbarMenu}>
        {/* If menu === home , classname will be active and similarly for others */}
        <Link
          to="/"
          className={menu === "home" ? style.active : ""}
          onClick={() => setMenu("home")}
        >
          home
        </Link>
        <a
          href="#ExploreMenu"
          className={menu === "menu" ? style.active : ""}
          onClick={() => setMenu("menu")}
        >
          {" "}
          menu
        </a>
        <a
          href="#AppDownload"
          className={menu === "mobile-app" ? style.active : ""}
          onClick={() => setMenu("mobile-app")}
        >
          mobile-app
        </a>
        <a
          href="#Footer"
          className={menu === "contact-us" ? style.active : ""}
          onClick={() => setMenu("contact-us")}
        >
          contact us
        </a>
      </ul>
      <div className={style.navbarRight}>
        <button 
          className={style.themeToggle}
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
        <button 
          className={style.cartButton} 
          title="Cart"
          onClick={() => navigate('/cart')}
        >
          <img src={assets.basket_icon} alt="Cart" />
          {getTotalCartAmount() > 0 && <div className={style.dot}></div>}
        </button>
        {!token ? <button
          className={style.signInButton}
          onClick={() => {
            setShowLogin(true);
          }}
        >
          Sign in
        </button> : <div className={style.navbarProfile}>
          <button className={style.profileButton} title="Profile">
            <img src={assets.profile_icon} alt="Profile" />
          </button>
          <ul className={style.navProfileDropdown}>
            <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} /><p>Orders</p></li>
            <hr />
            <li onClick={Logout}><img src={assets.logout_icon} /><p>Logout</p></li>
          </ul>
        </div>}

      </div>
    </div>
  );
};

export default Navbar;
