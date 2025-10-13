import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gallery_styles from './Yoz_Gallery_Component.module.css';
import { galleryData } from './galleryData';

export default function Yoz_Gallery_Component() {
          const [currentPage, setCurrentPage] = useState(1);
          const [itemsPerPage, setItemsPerPage] = useState(6); // Default value
          const galleryContainerRef = useRef(null);

          // Dynamically calculate items per page based on container width
          useEffect(() => {
                    const calculateItems = () => {
                              if (galleryContainerRef.current) {
                                        const containerWidth = galleryContainerRef.current.offsetWidth;
                                        // Based on your CSS: grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                                        // and gap: 25px.
                                        const itemWidth = 300; // minmax width
                                        const gap = 25;
                                        const itemsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap));

                                        // Assuming you want to show 2 full rows before paginating
                                        const rows = 2;
                                        const newItemsPerPage = Math.max(1, itemsPerRow) * rows;

                                        setItemsPerPage(newItemsPerPage);
                                        // Reset to first page if current page becomes invalid
                                        if (currentPage > Math.ceil(galleryData.length / newItemsPerPage)) {
                                                  setCurrentPage(1);
                                        }
                              }
                    };

                    calculateItems(); // Initial calculation
                    window.addEventListener('resize', calculateItems);

                    return () => window.removeEventListener('resize', calculateItems);
          }, [currentPage, galleryData.length]);

          const totalPages = Math.ceil(galleryData.length / itemsPerPage);

          useEffect(() => {
                    Aos.init({
                              duration: 1000,
                              easing: 'ease-in-out',
                    });
          }, []);

          const indexOfLastItem = currentPage * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
          const currentItems = galleryData.slice(indexOfFirstItem, indexOfLastItem);

          const paginate = (pageNumber) => setCurrentPage(pageNumber);

          return (
                    <div className={gallery_styles.galleryMain} data-aos="fade-up">
                              <h1 className={gallery_styles.galleryHeading}>Our Gallery</h1>
                              <div className={gallery_styles.galleriesContainer} ref={galleryContainerRef}>
                                        {currentItems.map((data) => (
                                                  <Link to={`/gallery/${data.id}`} state={{ item: data }} key={data.id} className={gallery_styles.galleryCard}>
                                                            <img src={data.img} alt={data.name} className={gallery_styles.galleryImage} />
                                                            <div className={gallery_styles.galleryOverlay}>
                                                                      <h4 className={gallery_styles.galleryCardTitle}>{data.name}</h4>
                                                                      <p className={gallery_styles.galleryDesc}>{data.desc}</p>
                                                            </div>
                                                  </Link>
                                        ))}
                              </div>
                              {/* Only show pagination if there are more items than can fit on one page */}
                              {galleryData.length > itemsPerPage && (
                                        <nav className={gallery_styles.pagination}>
                                                  <ul>
                                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                                                      <li key={number} className={gallery_styles.pageItem}>
                                                                                <button
                                                                                          onClick={() => paginate(number)}
                                                                                          className={`${gallery_styles.pageLink} ${currentPage === number ? gallery_styles.activePage : ''}`}
                                                                                >
                                                                                          {number}
                                                                                </button>
                                                                      </li>
                                                            ))}
                                                  </ul>
                                        </nav>
                              )}
                    </div>
          );
}