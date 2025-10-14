import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import product_line_styles from './Yoz_Product_Line_Component.module.css';
import { supabase } from '../src/supabase';
// import { productData } from './productData.js'; // REMOVE: not needed anymore

export default function Yoz_Product_Line_Component() {
          useEffect(() => {
                    Aos.init({ duration: 500, easing: 'ease-in-out', once: true });
          }, []);

          const navigate = useNavigate();

          // New: data from Supabase
          const [allProducts, setAllProducts] = useState([]);
          const [loading, setLoading] = useState(true);

          // Existing UI state
          const [selectedCategory, setSelectedCategory] = useState('All');
          const [activeAccordion, setActiveAccordion] = useState(null);
          const [nameFilter, setNameFilter] = useState('');
          const [nameInput, setNameInput] = useState('');
          const [currentPage, setCurrentPage] = useState(1);
          const productsPerPage = 24;

          // Fetch from Supabase
          useEffect(() => {
                    const fetchProducts = async () => {
                              setLoading(true);
                              try {
                                        const { data, error } = await supabase
                                                  .from('products')
                                                  .select('*')
                                                  .order('id', { ascending: true });

                                        if (error) throw error;

                                        // Attach public image URL while keeping DB columns as-is (snake_case)
                                        const withUrls = (data ?? []).map((p) => {
                                                  let publicUrl = '';
                                                  if (p.image_filename) {
                                                            const { data: urlData } = supabase
                                                                      .storage
                                                                      .from('products_image') // your bucket
                                                                      .getPublicUrl(p.image_filename);
                                                            publicUrl = urlData?.publicUrl || '';
                                                  }
                                                  return { ...p, image_url: publicUrl }; // add derived URL
                                        });

                                        setAllProducts(withUrls);
                              } catch (err) {
                                        console.error('Error fetching products:', err.message);
                              } finally {
                                        setLoading(false);
                              }
                    };

                    fetchProducts();
          }, []);

          // Categories with their products (based on DB columns)
          const categories = useMemo(() => {
                    const orderedCategories = [];
                    const categorySet = new Set();
                    allProducts.forEach((p) => {
                              if (!categorySet.has(p.product_category)) {
                                        categorySet.add(p.product_category);
                                        orderedCategories.push(p.product_category);
                              }
                    });
                    return ['All', ...orderedCategories];
          }, [allProducts]);

          const categoryImages = useMemo(() => {
                    const images = {
                              All: allProducts.length > 0 ? allProducts[0].image_url : '',
                    };
                    categories.forEach((cat) => {
                              if (cat !== 'All') {
                                        const productInCategory = allProducts.find(
                                                  (p) => p.product_category === cat
                                        );
                                        if (productInCategory) images[cat] = productInCategory.image_url;
                              }
                    });
                    return images;
          }, [categories, allProducts]);

          const productsByCategory = useMemo(() => {
                    const categoryMap = new Map();
                    // Use the ordered categories to ensure Map insertion order
                    const orderedCategories = categories.slice(1); // Exclude 'All'
                    orderedCategories.forEach((cat) => {
                              categoryMap.set(cat, new Set());
                    });
                    allProducts.forEach((p) => {
                              categoryMap.get(p.product_category)?.add(p.product_name);
                    });
                    return categoryMap;
          }, [categories, allProducts]);

          // Filtering logic (using DB column names)
          const filtered = useMemo(() => {
                    return allProducts.filter((p) => {
                              if (
                                        nameFilter &&
                                        !p.product_name.toLowerCase().includes(nameFilter.toLowerCase())
                              )
                                        return false;
                              if (selectedCategory !== 'All' && p.product_category !== selectedCategory)
                                        return false;
                              return true;
                    });
          }, [selectedCategory, nameFilter, allProducts]);

          const goToDetail = (product) => {
                    // product contains DB fields (snake_case) + image_url
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

          if (loading) {
                    return (
                              <div className={product_line_styles.loadingContainer}>
                                        Loading products...
                              </div>
                    );
          }

          return (
                    <div className={product_line_styles.container} data-aos="fade-up">
                              <aside className={product_line_styles.left}>
                                        <div className={product_line_styles.nameFilter}>
                                                  <label htmlFor="name-filter" className={product_line_styles.sidebarTitle}>
                                                            Filter by Name
                                                  </label>
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
                                                            className={`${product_line_styles.categoryItem} ${selectedCategory === 'All' ? product_line_styles.active : ''
                                                                      }`}
                                                            onClick={() => handleCategorySelect('All')}
                                                  >
                                                            <div className={product_line_styles.categoryHeader}>All Products</div>
                                                  </li>
                                                  {Array.from(productsByCategory.keys()).map((category) => (
                                                            <li
                                                                      key={category}
                                                                      className={`${product_line_styles.categoryItem} ${activeAccordion === category ? product_line_styles.active : ''
                                                                                }`}
                                                            >
                                                                      <div
                                                                                className={product_line_styles.categoryHeader}
                                                                                onClick={() => handleAccordionToggle(category)}
                                                                      >
                                                                                {category}
                                                                      </div>
                                                                      {activeAccordion === category && (
                                                                                <ul className={product_line_styles.productList}>
                                                                                          <li
                                                                                                    className={`${product_line_styles.productItem} ${selectedCategory === category && nameFilter === ''
                                                                                                                        ? product_line_styles.activeProduct
                                                                                                                        : ''
                                                                                                              }`}
                                                                                                    onClick={() => handleCategorySelect(category)}
                                                                                          >
                                                                                                    All in {category}
                                                                                          </li>
                                                                                          {Array.from(productsByCategory.get(category)).map(
                                                                                                    (productName) => (
                                                                                                              <li
                                                                                                                        key={productName}
                                                                                                                        className={`${product_line_styles.productItem} ${nameFilter === productName
                                                                                                                                            ? product_line_styles.activeProduct
                                                                                                                                            : ''
                                                                                                                                  }`}
                                                                                                                        onClick={() => {
                                                                                                                                  setSelectedCategory(category);
                                                                                                                                  setNameFilter(productName);
                                                                                                                                  setNameInput(productName);
                                                                                                                        }}
                                                                                                              >
                                                                                                                        {productName}
                                                                                                              </li>
                                                                                                    )
                                                                                          )}
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
                                                                      className={`${product_line_styles.quickLinkItem} ${selectedCategory === cat ? product_line_styles.quickLinkActive : ''
                                                                                }`}
                                                                      onClick={() => handleCategorySelect(cat)}
                                                            >
                                                                      <img
                                                                                src={categoryImages[cat]}
                                                                                alt={cat}
                                                                                className={product_line_styles.quickLinkImage}
                                                                      />
                                                                      <span className={product_line_styles.quickLinkText}>{cat}</span>
                                                            </div>
                                                  ))}
                                        </div>

                                        <div className={product_line_styles.grid}>
                                                  {currentProducts.map((p) => (
                                                            <div key={p.id} className={product_line_styles.card}>
                                                                      <div
                                                                                className={product_line_styles.imageWrap}
                                                                                onClick={() => goToDetail(p)}
                                                                      >
                                                                                <img
                                                                                          src={p.image_url}
                                                                                          alt={p.product_name}
                                                                                          className={product_line_styles.image}
                                                                                />
                                                                      </div>
                                                                      <div className={product_line_styles.cardBody}>
                                                                                <h4 className={product_line_styles.cardTitle}>{p.product_name}</h4>
                                                                                <p className={product_line_styles.cardCategory}>
                                                                                          {p.product_category}
                                                                                </p>
                                                                      </div>
                                                            </div>
                                                  ))}
                                        </div>

                                        {filtered.length === 0 && (
                                                  <p className={product_line_styles.empty}>
                                                            No products match your criteria.
                                                  </p>
                                        )}

                                        {totalPages > 1 && (
                                                  <nav className={product_line_styles.paginationContainer}>
                                                            <ul className={product_line_styles.pagination}>
                                                                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                                                                <li key={number} className={product_line_styles.pageItem}>
                                                                                          <button
                                                                                                    onClick={() => paginate(number)}
                                                                                                    className={`${product_line_styles.pageLink} ${currentPage === number ? product_line_styles.pageLinkActive : ''
                                                                                                              }`}
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