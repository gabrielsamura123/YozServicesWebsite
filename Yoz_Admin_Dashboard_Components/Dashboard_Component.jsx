import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../../supabase';
import dashboard_styles from './Dashboard_Component.module.css';
import ProductCard from './ProductCard_Component';
import NewsCardSkeleton from './NewsCard_Skeleton';
export default function Dashboard_Compoent ({ searchTerm }) {
          const [products, setProducts] = useState([]);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState(null);

          // State for category filtering
          const [selectedCategory, setSelectedCategory] = useState('All');

          // State for the Edit Modal
          const [isEditModalOpen, setIsEditModalOpen] = useState(false);
          const [editingProduct, setEditingProduct] = useState(null);
          const [isModalClosing, setIsModalClosing] = useState(false);

          // Memoize categories and their representative images
          const categories = useMemo(() => {
                    if (products.length === 0) return [];
                    const categorySet = new Set(products.map(p => p.product_category));
                    return ['All', ...Array.from(categorySet).sort()];
          }, [products]);

          const filteredProducts = products.filter(product => {
                    if (selectedCategory !== 'All' && product.product_category !== selectedCategory) {
                              return false;
                    }
                    if (!searchTerm) return true; // Show all if search is empty
                    const lowerCaseSearchTerm = searchTerm.toLowerCase();
                    const nameMatch = product.product_name.toLowerCase().includes(lowerCaseSearchTerm);
                    const categoryMatch = product.product_category.toLowerCase().includes(lowerCaseSearchTerm);
                    const descriptionMatch = product.description.toLowerCase().includes(lowerCaseSearchTerm);

                    return nameMatch || categoryMatch || descriptionMatch;
          });

          useEffect(() => {
                    const fetchProducts = async () => {
                              try {
                                        setLoading(true);
                                        // 1. Fetch product data from the 'products' table
                                        const { data: productsData, error: productsError } = await supabase
                                                  .from('products')
                                                  .select('*')
                                                  .order('id', { ascending: true });

                                        if (productsError) {
                                                  throw productsError;
                                        }

                                        // 2. Get public URLs for each product image in parallel
                                        const productsWithImages = await Promise.all(
                                                  productsData.map(async (product) => {
                                                            const { data } = supabase
                                                                      .storage
                                                                      .from('products_image')
                                                                      .getPublicUrl(product.image_filename);
                                                            return { ...product, imageUrl: data.publicUrl };
                                                  })
                                        );

                                        setProducts(productsWithImages);
                                        setError(null);
                              } catch (error) {
                                        console.error("Error fetching products:", error.message);
                                        setError("Failed to load products. Please try again later.");
                              } finally {
                                        setLoading(false);
                              }
                    };

                    fetchProducts();

                    // --- REALTIME SUBSCRIPTION ---
                    const channel = supabase
                              .channel('products-db-changes')
                              .on(
                                        'postgres_changes',
                                        { event: '*', schema: 'public', table: 'products' },
                                        (payload) => {
                                                  console.log('Realtime change received!', payload);

                                                  if (payload.eventType === 'INSERT') {
                                                            const newProduct = payload.new;
                                                            const { data: imageUrlData } = supabase.storage
                                                                      .from('products_image')
                                                                      .getPublicUrl(newProduct.image_filename);

                                                            setProducts((currentProducts) => [
                                                                      ...currentProducts,
                                                                      { ...newProduct, imageUrl: imageUrlData.publicUrl },
                                                            ]);
                                                  }

                                                  if (payload.eventType === 'UPDATE') {
                                                            const updatedProduct = payload.new;
                                                            setProducts((currentProducts) =>
                                                                      currentProducts.map((p) =>
                                                                                p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
                                                                      )
                                                            );
                                                  }

                                                  if (payload.eventType === 'DELETE') {
                                                            setProducts((currentProducts) =>
                                                                      currentProducts.filter((p) => p.id !== payload.old.id)
                                                            );
                                                  }
                                        }
                              )
                              .subscribe();

                    // Cleanup function to remove the channel subscription when the component unmounts
                    return () => {
                              supabase.removeChannel(channel);
                    };
          }, []); // Empty dependency array ensures this runs only once on mount

          const handleDelete = useCallback(async (product) => {
                    const { id, image_filename } = product;
                    const isConfirmed = window.confirm(`Are you sure you want to delete "${product.product_name}"?`);

                    if (isConfirmed) {
                              try {
                                        // 1. Delete the image from storage
                                        const { error: storageError } = await supabase.storage.from('products_image').remove([image_filename]);
                                        if (storageError) throw storageError;

                                        // 2. Delete the product from the database
                                        const { error: dbError } = await supabase.from('products').delete().match({ id });
                                        if (dbError) throw dbError;

                                        // 3. Update the local state to reflect the deletion
                                        setProducts(products.filter(p => p.id !== id));
                                        alert('Product deleted successfully!');
                              } catch (error) {
                                        console.error('Error deleting product:', error.message);
                                        alert('Failed to delete product.');
                              }
                    }
          }, [products]); // Dependency on products to ensure it has the latest list

          const handleEdit = useCallback((product) => {
                    // Convert specifications JSON to a string for the textarea
                    const productToEdit = {
                              ...product,
                              specifications: product.specifications ? JSON.stringify(product.specifications, null, 2) : ''
                    };
                    setEditingProduct(productToEdit);
                    setIsEditModalOpen(true);
          }, []);

          const closeEditModal = useCallback(() => {
                    setIsModalClosing(true);
                    setTimeout(() => {
                              setIsEditModalOpen(false);
                              setIsModalClosing(false);
                    }, 300); // Match animation duration
          }, []);

          const handleEditFormChange = useCallback((e) => {
                    const { name, value } = e.target;
                    setEditingProduct(prev => ({ ...prev, [name]: value }));
          }, []);

          const handleEditSubmit = useCallback(async (e) => {
                    e.preventDefault();
                    try {
                              let specifications;
                              try {
                                        specifications = editingProduct.specifications ? JSON.parse(editingProduct.specifications) : null;
                              } catch (parseError) {
                                        alert('Specifications are not valid JSON. Please correct it.');
                                        return;
                              }

                              const { imageUrl, ...productToUpdate } = editingProduct;
                              productToUpdate.specifications = specifications;

                              const { data, error } = await supabase.from('products').update(productToUpdate).match({ id: productToUpdate.id }).select();
                              if (error) throw error;

                              // Update local state
                              setProducts(products.map(p => p.id === data[0].id ? { ...data[0], imageUrl: p.imageUrl } : p));
                              closeEditModal();
                              setEditingProduct(null);
                              alert('Product updated successfully!');
                    } catch (error) {
                              console.error('Error updating product:', error.message);
                              alert('Failed to update product.');
                    }
          }, [editingProduct, products]);

          if (loading) return <div className={dashboard_styles.message}><NewsCardSkeleton /></div>;
          if (error) return <div className={`${dashboard_styles.message} ${dashboard_styles.error}`}>{error}</div>;

          return (
                    <div className={dashboard_styles.dashboardMainView}>
                              <div className={dashboard_styles.filterContainer}>
                                        {categories.map(category => (
                                                  <button
                                                            key={category}
                                                            className={`${dashboard_styles.filterButton} ${selectedCategory === category ? dashboard_styles.activeFilter : ''}`}
                                                            onClick={() => setSelectedCategory(category)}
                                                  >
                                                            <span className={dashboard_styles.filterText}>{category}</span>
                                                  </button>
                                        ))}
                              </div>
                              <div className={dashboard_styles.productGrid}>
                                        {filteredProducts.map((product, index) => (
                                                  <ProductCard
                                                            key={product.id}
                                                            style={{ animationDelay: `${index * 50}ms` }}
                                                            product={product}
                                                            onEdit={handleEdit}
                                                            onDelete={handleDelete}
                                                  />
                                        ))}
                              </div>
                              {filteredProducts.length === 0 && !loading && (
                                        <div className={dashboard_styles.message}>No products match your search.</div>
                              )}
                              {isEditModalOpen && editingProduct && (
                                        <div className={`${dashboard_styles.modalOverlay} ${isModalClosing ? dashboard_styles.closing : ''}`}>
                                                  <div className={`${dashboard_styles.modalContent} ${isModalClosing ? dashboard_styles.closing : ''}`}>
                                                            <button className={dashboard_styles.closeButton} onClick={closeEditModal}>&times;</button>
                                                            <h2>Edit Product</h2>
                                                            <form onSubmit={handleEditSubmit} className={dashboard_styles.editForm}>
                                                                      <label>Product Name</label>
                                                                      <input type="text" name="product_name" value={editingProduct.product_name} onChange={handleEditFormChange} required />
                                                                      <label>Category</label>
                                                                      <input type="text" name="product_category" value={editingProduct.product_category} onChange={handleEditFormChange} required />
                                                                      <label>Price</label>
                                                                      <input type="number" name="price" value={editingProduct.price} onChange={handleEditFormChange} required />
                                                                      <label>Description</label>
                                                                      <textarea name="description" value={editingProduct.description} onChange={handleEditFormChange} rows="4"></textarea>
                                                                      <label>Specifications (JSON format)</label>
                                                                      <textarea name="specifications" value={editingProduct.specifications} onChange={handleEditFormChange} rows="6"></textarea>
                                                                      <button type="submit" className={dashboard_styles.submitButton}>Save Changes</button>
                                                            </form>
                                                  </div>
                                        </div>
                              )}
                    </div>
          )
}