import admin_styles from './Yoz_Admin_Dashboard.module.css';
import Dashboard_Compoent from './Yoz_Admin_Dashboard_Components/Dashboard_Component';
import Product_Line_Component from './Yoz_Admin_Dashboard_Components/Product_Line_Component';
import Gallery_View_Component from './Yoz_Admin_Dashboard_Components/Gallery_View_Component';
import News_and_Update_Component from './Yoz_Admin_Dashboard_Components/News_and_Update_Component';
import Notification_Component from './Yoz_Admin_Dashboard_Components/Notification_Component';
import Settings_Component from './Yoz_Admin_Dashboard_Components/Settings_Component';
import { useState, useEffect } from 'react';
import profileImagePic from '../assets/avatar-male-small6.png';
import yoz_image from '../assets/Yoz_Services_Logo-rs-960x463-299w.webp'

export default function Yoz_Admin () {
          const [activeTask, setActiveTask] = useState ("Dashboard");
          const [isSearchOpen, setIsSearchOpen] = useState(false);
          const [isClosing, setIsClosing] = useState(false);
          const [searchTerm, setSearchTerm] = useState("");

          const openSearch = () => {
                    setIsClosing(false);
                    setIsSearchOpen(true);
          };

          const closeSearch = () => {
                    setIsClosing(true);
                    // Wait for the animation to finish before removing from DOM
                    setTimeout(() => {
                              setIsSearchOpen(false);
                              // Optional: Clear search term when closing the overlay
                              // setSearchTerm("");
                    }, 300); // This should match the transition duration in CSS
          }

          const checkActiveTask = (active) => {
                    switch (active) {
                              case "Dashboard":
                                        return (
                                                  <Dashboard_Compoent searchTerm={searchTerm} />
                                        )

                              case "Product_Line":
                                        return (
                                                  <Product_Line_Component />
                                        )

                              case "Gallery_View":
                                        return (
                                                  <Gallery_View_Component />
                                        )

                              case "News_and_Update":
                                        return (
                                                  <News_and_Update_Component />
                                        )

                              case "Notifications":
                                        return (
                                                  <Notification_Component />
                                        )

                              case "Settings":
                                        return (
                                                  <Settings_Component />
                                        )
                    }
          }
          return (
                    <div className={admin_styles.dashboardMainContainer}>
                              {isSearchOpen && (
                                        <div className={`${admin_styles.searchOverlayContainer} ${isClosing ? admin_styles.closing : ''}`} onClick={closeSearch} >
                                                  <div className={admin_styles.searchOverlayContent} onClick={(e) => e.stopPropagation()}>
                                                            <input
                                                                      type="text"
                                                                      placeholder='Type to search for products...'
                                                                      className={admin_styles.searchInput}
                                                                      value={searchTerm}
                                                                      onChange={(e) => setSearchTerm(e.target.value)}
                                                                      autoFocus
                                                            />
                                                  </div>
                                        </div>
                              )}
                              <div className={admin_styles.dashboardMain}>
                                        <div className={admin_styles.dashboardLeft}>
                                                  <img src={yoz_image} alt="Yoz Services Logo" className={admin_styles.yozLogo}/>
                                                  <div className={`${admin_styles.navigationContainer} ${activeTask === 'Dashboard' ? admin_styles.active : ''}`} onClick={() => {setActiveTask("Dashboard")}}>
                                                            <p>Dashboard</p>
                                                  </div>
                                                  <div className={`${admin_styles.navigationContainer} ${activeTask === 'Product_Line' ? admin_styles.active : ''}`} onClick={() => {setActiveTask("Product_Line")}}>
                                                            <p>Product Line</p>
                                                  </div>
                                                  <div className={`${admin_styles.navigationContainer} ${activeTask === 'Gallery_View' ? admin_styles.active : ''}`} onClick={() => {setActiveTask("Gallery_View")}}>
                                                            <p>Gallery View</p>
                                                  </div>
                                                  <div className={`${admin_styles.navigationContainer} ${activeTask === 'News_and_Update' ? admin_styles.active : ''}`} onClick={() => {setActiveTask("News_and_Update")}}>
                                                            <p>News & Update</p>
                                                  </div>
                                                  <div className={`${admin_styles.navigationContainer} ${activeTask === 'Settings' ? admin_styles.active : ''}`} onClick={() => {setActiveTask("Settings")}}>
                                                            <p>User Settings</p>
                                                  </div>
                                        </div>
                                        <div className={admin_styles.dashboardRight}>
                                                  <div className={admin_styles.userInfo_Display}>
                                                            <p className={admin_styles.profileName} onClick={() => {setActiveTask("Dashboard")}}>Welcome Mr. Gabriel Samura</p>
                                                            <div className={admin_styles.profileRightData}>
                                                                      <button className={admin_styles.search_button} onClick={openSearch}>🔍</button>
                                                                      <img src={profileImagePic} alt="" className={admin_styles.profileImage} onClick={() => {setActiveTask("Settings")}} />
                                                                      <p className={admin_styles.profileEmail} onClick={() => {setActiveTask("Settings")}}>gabrielsamura9@gmail.com</p>
                                                            </div>
                                                  </div>
                                                  <div className={admin_styles.dataDisplay}>
                                                            {checkActiveTask(activeTask)}
                                                  </div>
                                        </div>
                              </div>
                    </div>
          )
}