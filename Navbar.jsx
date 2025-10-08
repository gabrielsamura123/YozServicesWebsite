import React from "react";
import { NavLink } from "react-router-dom";
import facebook from "../assets/icons/facebook.png";
import instagram from "../assets/icons/instagram.png";
import whatsapp from "../assets/icons/whatsapp.png";
import location from "../assets/icons/location.png";
import yozLogo from "../assets/images/yoz-logo.webp";
import mail  from "../assets/icons/mail.png";
import phone from "../assets/icons/smartphone.png";
import search from "../assets/icons/search.png";
import style from "../styles/NavBar.module.css";

export function NavBar() {
    return (
        <>
            <div className={style.container}>
                <header className={style.headerContainer}>
                    <div className={style.header}>
                        <div className={style.location}>
                            <img src={location} alt="" width="20px" height="20px" />
                            <p> Freetown</p>
                        </div>

                        <div className={style.socials}>
                            <img src={facebook} alt="FaceBook" width="17px" height="17px" />
                            <img src={instagram} alt="" width="17px" height="17px" />
                            <img src={whatsapp} alt="" width="17px" height="17px" />
                        </div>
                    </div>
                    <div className={style.logoContainer}>
                        {/* <img src={yozLogo} alt="" width="150px" height="150px" /> */}
                        <div>
                            <p className={style.logo}>Yoz </p>
                        </div>
                        <div className={style.contactInfo}>
                            <p> <img src={phone} alt=""  width="15px" height="15px"/> +232 77-000-111</p>
                            <p > <img src={mail} alt=""  width="15px" height="15px"/> Email</p>
                        </div>
                    </div>
                    <nav className={style.mainNav}>
                        <ul className={style.navList}>
                            <li className={style.navItem}>
                                <NavLink to="/" className={({ isActive }) => isActive ? `${style.navLink} ${style.activeLink}` : style.navLink}>Home</NavLink>
                            </li>
                            <li className={style.navItem}>
                                <NavLink to="/about-us" className={({ isActive }) => isActive ? `${style.navLink} ${style.activeLink}` : style.navLink}>About Us</NavLink>
                            </li>
                            <li className={style.navItem}>
                                <NavLink to="/product-line" className={({ isActive }) => isActive ? `${style.navLink} ${style.activeLink}` : style.navLink}>Product Line</NavLink>
                            </li>
                            <li className={style.navItem}>
                                <NavLink to="/news-and-updates" className={({ isActive }) => isActive ? `${style.navLink} ${style.activeLink}` : style.navLink}>News & Updates</NavLink>
                            </li>
                            <li className={style.navItem}>
                                <NavLink to="/contact-us" className={({ isActive }) => isActive ? `${style.navLink} ${style.activeLink}` : style.navLink}>Contact Us</NavLink>
                            </li>
                        </ul>
                        <div className={style.searchIcon}>
                            <img src={search} alt="Search" width="24px" height="24px" />
                        </div>
                    </nav>
                </header>
            </div>
        </>
    );
}
