import { Link, useLocation, useParams } from 'react-router-dom';
import { galleryData } from './galleryData';
import detail_styles from './Yoz_Gallery_Detail_Component.module.css';
import { useEffect } from 'react';

export default function Yoz_Gallery_Detail_Component() {
          const location = useLocation();
          const { id } = useParams();

          // Prefer getting item from location state, but fall back to finding it by id
          // This handles both navigation from the gallery and direct URL access.
          const item = location.state?.item || galleryData.find((item) => item.id === parseInt(id));

          useEffect(() => {
                    window.scrollTo(0, 0);
          }, []);

          if (!item) {
                    return (
                              <div className={detail_styles.detailContainer}>
                                        <h2>Item not found</h2>
                                        <Link to="/gallery" className={detail_styles.backLink}>
                                                  &larr; Back to Gallery
                                        </Link>
                              </div>
                    );
          }

          return (
                    <div className={detail_styles.detailContainer}>

                              <Link to="/gallery" className={detail_styles.backLink}>&larr; Back to Gallery</Link>
                              <h1 className={detail_styles.detailTitle}>{item.name}</h1>
                              <div className={detail_styles.imageContainer}>
                                        <img src={item.img} alt={item.name} className={detail_styles.detailImage} />
                              </div>
                              <p className={detail_styles.detailDescription}>
                                        {item.fullDesc}
                              </p>
                    </div>
          );
}