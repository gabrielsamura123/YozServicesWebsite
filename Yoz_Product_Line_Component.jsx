import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import product_line_styles from './Yoz_Product_Line_Component.module.css';
import { productData } from './productData.js';

export default function Yoz_Product_Line_Component() {
          useEffect(() => {
                    Aos.init({
                              duration: 500,
                              easing: 'ease-in-out',
                              once: true,
                    });
          }, []);

          const navigate = useNavigate();
          const [selectedCategory, setSelectedCategory] = useState('All');
          const [activeAccordion, setActiveAccordion] = useState(null);
          const [nameFilter, setNameFilter] = useState('');
          const [nameInput, setNameInput] = useState('');
          const [currentPage, setCurrentPage] = useState(1);
          const productsPerPage = 24; // You can adjust this number

          // Categories with their products
          const categories = useMemo(() => {
                    const orderedCategories = [];
                    const categorySet = new Set();
                    productData.forEach(p => {
                              if (!categorySet.has(p.productCategory)) {
                                        categorySet.add(p.productCategory);
                                        orderedCategories.push(p.productCategory);
                              }
                    });
                    return ['All', ...orderedCategories];
          }, []);

          const categoryImages = useMemo(() => {
                    const images = {
                              All: productData.length > 0 ? productData[0].productImage : '',
                    };
                    categories.forEach(cat => {
                              if (cat !== 'All') {
                                        const productInCategory = productData.find(p => p.productCategory === cat);
                                        if (productInCategory) images[cat] = productInCategory.productImage;
                              }
                    });
                    return images;
          }, [categories]);

          const productsByCategory = useMemo(() => {
                    const categoryMap = new Map();
                    // Use the ordered categories to ensure Map insertion order
                    const orderedCategories = categories.slice(1); // Exclude 'All'
                    orderedCategories.forEach(cat => {
                        categoryMap.set(cat, new Set());
                    });
                    productData.forEach((p) => {
                        categoryMap.get(p.productCategory)?.add(p.productName);
                    });
                    return categoryMap;
          }, [categories]);

          // Filtering logic
          const filtered = useMemo(() => {
                    return productData.filter((p) => {
                              if (nameFilter && !p.productName.toLowerCase().includes(nameFilter.toLowerCase())) return false;
                              if (selectedCategory !== 'All' && p.productCategory !== selectedCategory) return false;
                              return true;
                    });
          }, [selectedCategory, nameFilter]);

          const goToDetail = (product) => {
                    navigate(`/products/${product.id}`, { state: { product } });
          };

          const handleAccordionToggle = (category) => {
                    setActiveAccordion(activeAccordion === category ? null : category);
          };

          const handleNameInputChange = (e) => {
                    setNameInput(e.target.value);
                    if (e.target.value === '') {
                              setNameFilter('');
                    }
          };

          const handleNameFilterKeyDown = (e) => {
                    if (e.key === 'Enter') {
                              setNameFilter(nameInput);
                    }
                    setCurrentPage(1); // Reset to first page on name filter
          };

          const handleCategorySelect = (category) => {
                    setSelectedCategory(category);
                    setNameFilter('');
                    setNameInput('');
                    setCurrentPage(1); // Reset to first page on category change
                    setActiveAccordion(category === 'All' ? null : category);
          };

          // Pagination Logic
          const indexOfLastProduct = currentPage * productsPerPage;
          const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
          const currentProducts = filtered.slice(indexOfFirstProduct, indexOfLastProduct);
          const totalPages = Math.ceil(filtered.length / productsPerPage);
          const paginate = (pageNumber) => setCurrentPage(pageNumber);

          return (
                    <div className={product_line_styles.container} data-aos="fade-up">
                              <aside className={product_line_styles.left}>
                                        <div className={product_line_styles.nameFilter}>
                                                  <label htmlFor="name-filter" className={product_line_styles.sidebarTitle}>Filter by Name</label>
                                                  <input
                                                            id="name-filter"
                                                            type="text"
                                                            value={nameInput}
                                                            onChange={handleNameInputChange}
                                                            onKeyDown={handleNameFilterKeyDown}
                                                            placeholder="Enter product name..."
                                                            className={product_line_styles.input}
                                                  />
                                        </div>
                                        <h3 className={product_line_styles.sidebarTitle}>Product Categories</h3>
                                        <ul className={product_line_styles.categoryList}>
                                                  <li
                                                            className={`${product_line_styles.categoryItem} ${selectedCategory === 'All' ? product_line_styles.active : ''}`}
                                                            onClick={() => handleCategorySelect('All')}
                                                  >
                                                            <div className={product_line_styles.categoryHeader}>All Products</div>
                                                  </li>
                                                  {Array.from(productsByCategory.keys()).map((category) => (
                                                            <li
                                                                      key={category}
                                                                      className={`${product_line_styles.categoryItem} ${activeAccordion === category ? product_line_styles.active : ''}`}
                                                            >
                                                                      <div
                                                                                className={product_line_styles.categoryHeader}
                                                                                onClick={() => handleAccordionToggle(category)}
                                                                      >
                                                                                {category}
                                                                      </div>
                                                                      {activeAccordion === category && (
                                                                                <ul className={product_line_styles.productList}>
                                                                                          <li className={`${product_line_styles.productItem} ${selectedCategory === category && nameFilter === '' ? product_line_styles.activeProduct : ''}`}
                                                                                                    onClick={() => handleCategorySelect(category)}
                                                                                          >
                                                                                                    All in {category}
                                                                                          </li>
                                                                                          {Array.from(productsByCategory.get(category)).map((productName) => (
                                                                                                    <li
                                                                                                              key={productName}
                                                                                                              className={`${product_line_styles.productItem} ${nameFilter === productName ? product_line_styles.activeProduct : ''}`}
                                                                                                              onClick={() => {
                                                                                                                        setSelectedCategory(category);
                                                                                                                        setNameFilter(productName);
                                                                                                                        setNameInput(productName);
                                                                                                              }}
                                                                                                    >
                                                                                                              {productName}
                                                                                                    </li>
                                                                                          ))}
                                                                                </ul>
                                                                      )}
                                                            </li>
                                                  ))}
                                        </ul>
                              </aside>
                              <main className={product_line_styles.right}>
                                        <div className={product_line_styles.quickLinks}>
                                                  {categories.slice(0, 4).map((cat) => (
                                                            <div
                                                                      key={cat}
                                                                      className={`${product_line_styles.quickLinkItem} ${selectedCategory === cat ? product_line_styles.quickLinkActive : ''}`}
                                                                      onClick={() => handleCategorySelect(cat)}
                                                            >
                                                                      <img src={categoryImages[cat]} alt={cat} className={product_line_styles.quickLinkImage} />
                                                                      <span className={product_line_styles.quickLinkText}>{cat}</span>
                                                            </div>
                                                  ))}
                                        </div>

                                        <div className={product_line_styles.grid}>
                                                  {currentProducts.map((p) => (
                                                            <div key={p.id} className={product_line_styles.card}>
                                                                      <div className={product_line_styles.imageWrap} onClick={() => goToDetail(p)}>
                                                                                <img src={p.productImage} alt={p.productName} className={product_line_styles.image} />
                                                                      </div>
                                                                      <div className={product_line_styles.cardBody}>
                                                                                <h4 className={product_line_styles.cardTitle}>{p.productName}</h4>
                                                                                <p className={product_line_styles.cardCategory}>{p.productCategory}</p>
                                                                      </div>
                                                            </div>
                                                  ))}
                                        </div>
                                        {filtered.length === 0 && <p className={product_line_styles.empty}>No products match your criteria.</p>}

                                        {totalPages > 1 && (
                                                  <nav className={product_line_styles.paginationContainer}>
                                                            <ul className={product_line_styles.pagination}>
                                                                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                                                                <li key={number} className={product_line_styles.pageItem}>
                                                                                          <button
                                                                                                    onClick={() => paginate(number)}
                                                                                                    className={`${product_line_styles.pageLink} ${currentPage === number ? product_line_styles.pageLinkActive : ''}`}
                                                                                          >
                                                                                                    {number}
                                                                                          </button>
                                                                                </li>
                                                                      ))}
                                                            </ul>
                                                  </nav>
                                        )}
                              </main>
                    </div>
          );
}