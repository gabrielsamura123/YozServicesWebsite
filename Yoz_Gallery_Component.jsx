import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gallery_styles from './Yoz_Gallery_Component.module.css';
import { galleryData } from './galleryData';

export default function Yoz_Gallery_Component() {
          useEffect(() => {
                    Aos.init({
                              duration: 1000,
                              easing: 'ease-in-out',
                    });
          }, []);

          return (
                    <div className={gallery_styles.galleryMain} data-aos="fade-up">
                              <h1 className={gallery_styles.galleryHeading}>Our Gallery</h1>
                              <div className={gallery_styles.galleriesContainer}>
                                        {galleryData.map((data) => (
                                                  <Link to={`/gallery/${data.id}`} state={{ item: data }} key={data.id} className={gallery_styles.galleryCard}>
                                                            <img src={data.img} alt={data.name} className={gallery_styles.galleryImage} />
                                                            <div className={gallery_styles.galleryOverlay}>
                                                                      <h4 className={gallery_styles.galleryCardTitle}>{data.name}</h4>
                                                                      <p className={gallery_styles.galleryDesc}>{data.desc}</p>
                                                            </div>
                                                  </Link>
                                        ))}
                              </div>
                    </div>
          );
}