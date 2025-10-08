import { Link, useLocation, useParams } from 'react-router-dom';
import { productData } from './productData';
import { useEffect, useState } from 'react';
import detail_styles from './Yoz_Product_Detail.module.css';

export default function Yoz_Product_Detail() {
          const location = useLocation();
          const { id } = useParams();

          const parsedId = parseInt(id, 10);
          // Use location state if available, otherwise find from data (for direct URL access)
          const item = location.state?.product || productData.find((p) => p.id === parsedId);

          const [showQuote, setShowQuote] = useState(false);

          useEffect(() => {
                    window.scrollTo(0, 0);
          }, []);

          // Form state for the quote popup
          const [formState, setFormState] = useState({ name: '', email: '', message: '' });
          const handleInputChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });
          const handleFormSubmit = (e) => { e.preventDefault(); console.log("Quote Submitted:", { product: item.productName, ...formState }); setShowQuote(false); };

          if (!item) {
                    return (
                              <div className={detail_styles.detailContainer}>
                                        <h2>Product not found</h2>
                                        <Link to="/products" className={detail_styles.backLink}>&larr; Back to Products</Link>
                              </div>
                    );
          }

          // Get recommended products (excluding current)
          const recommended = productData.filter(p => p.productCategory === item.productCategory && p.id !== item.id).slice(0, 4);

          return (
                    <div className={detail_styles.detailContainer}>
                              <div className={detail_styles.breadcrumb}>
                                        <Link to="/products">Products</Link> / <Link to={`/products?category=${item.productCategory}`}>{item.productCategory}</Link> / <span>{item.productName}</span>
                              </div>

                              <div className={detail_styles.mainContent}>
                                        <div className={detail_styles.imageColumn}>
                                                  <div className={detail_styles.imageContainer}>
                                                            <img src={item.productImage} alt={item.productName} className={detail_styles.detailImage} />
                                                  </div>
                                        </div>
                                        <div className={detail_styles.infoColumn}>
                                                  <h1 className={detail_styles.detailTitle}>{item.productName}</h1>
                                                  <p className={detail_styles.shortDescription}>{item.description || "A high-quality product from YOZ Services."}</p>
                                                  <div className={detail_styles.metaInfo}>
                                                            <span className={detail_styles.category}>Category: <Link to={`/products?category=${item.productCategory}`}>{item.productCategory}</Link></span>
                                                            <span className={detail_styles.sku}>SKU: YOZ-{String(item.id).padStart(5, '0')}</span>
                                                  </div>
                                                  <button className={detail_styles.quoteButton} onClick={() => setShowQuote(true)}>Get Quote</button>

                                                  <div className={detail_styles.infoSection}>
                                                            <div className={detail_styles.infoBlock}>
                                                                      <h2 className={detail_styles.sectionTitle}>Description</h2>
                                                                      <div className={detail_styles.descriptionContent}>
                                                                                <p>{item.description || "Detailed description not available."}</p>
                                                                      </div>
                                                            </div>

                                                            {item.specifications && (
                                                                      <div className={detail_styles.infoBlock}>
                                                                                <h2 className={detail_styles.sectionTitle}>Specifications</h2>
                                                                                <div className={detail_styles.specsContent}>
                                                                                          <table className={detail_styles.specsTable}>
                                                                                                    <tbody>
                                                                                                              {Object.entries(item.specifications).map(([key, value]) => (
                                                                                                                        <tr key={key}>
                                                                                                                                  <td>{key}</td>
                                                                                                                                  <td>{value}</td>
                                                                                                                        </tr>
                                                                                                              ))}
                                                                                                    </tbody>
                                                                                          </table>
                                                                                </div>
                                                                      </div>
                                                            )}
                                                  </div>
                                        </div>
                              </div>

                              {showQuote && (
                                        <div className={detail_styles.popupOverlay}>
                                                  <div className={detail_styles.popupForm}>
                                                            <button className={detail_styles.closeButton} onClick={() => setShowQuote(false)}>&times;</button>
                                                            <h2>Get a Quote for {item.productName}</h2>
                                                            <form onSubmit={handleFormSubmit}>
                                                                      <input name="name" type="text" placeholder="Your Name" value={formState.name} onChange={handleInputChange} required />
                                                                      <input name="email" type="email" placeholder="Your Email" value={formState.email} onChange={handleInputChange} required />
                                                                      <textarea name="message" placeholder="Your Message (optional)" value={formState.message} onChange={handleInputChange} />
                                                                      <button type="submit" className={detail_styles.submitButton}>Submit Quote Request</button>
                                                            </form>
                                                  </div>
                                        </div>
                              )}

                              {recommended.length > 0 && (
                                        <div className={detail_styles.recommendations}>
                                                  <h3>Related Products</h3>
                                                  <div className={detail_styles.recommendationList}>
                                                            {recommended.map((rec) => (
                                                                      <Link key={rec.id} to={`/products/${rec.id}`} className={detail_styles.recommendationItem} state={{ product: rec }}>
                                                                                <img src={rec.productImage} alt={rec.productName} />
                                                                                <div>{rec.productName}</div>
                                                                      </Link>
                                                            ))}
                                                  </div>
                                        </div>
                              )}
                    </div>
          );
}
