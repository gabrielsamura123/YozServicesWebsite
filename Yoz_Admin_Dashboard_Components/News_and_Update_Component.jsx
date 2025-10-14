import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../../supabase";
import news_and_update_styles from './News_and_Update_Component.module.css';
import NewsCardSkeleton from "./NewsCard_Skeleton";

export default function News_and_Update_Component () {
          // Component State
          const [newsItems, setNewsItems] = useState([]);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState(null);

          // Modal and Form State
          const [isModalOpen, setIsModalOpen] = useState(false);
          const [isEditing, setIsEditing] = useState(false);
          const [editingId, setEditingId] = useState(null);
          const [title, setTitle] = useState('');
          const [description, setDescription] = useState('');
          const [imageFile, setImageFile] = useState(null);
          const [imagePreview, setImagePreview] = useState('');
          const [formLoading, setFormLoading] = useState(false);
          const [status, setStatus] = useState('');

          // Carousel and Filter State
          const [filter, setFilter] = useState('latest'); // 'latest' or 'all'
          const [carouselIndex, setCarouselIndex] = useState(0);
          const carouselRef = useRef(null);
          const [isScrolled, setIsScrolled] = useState(false);

          // Fetch initial data and subscribe to realtime changes
          useEffect(() => {
                    const fetchNews = async () => {
                              try {
                                        setLoading(true);
                                        const { data, error } = await supabase.from('industry_news').select('*').order('id', { ascending: false });
                                        if (error) throw error;

                                        const itemsWithUrls = data.map(item => ({
                                                  ...item,
                                                  imageUrl: supabase.storage.from('news_image').getPublicUrl(item.image_path).data.publicUrl
                                        }));
                                        setNewsItems(itemsWithUrls);
                              } catch (err) {
                                        setError('Failed to fetch news items.');
                                        console.error(err);
                              } finally {
                                        setLoading(false);
                              }
                    };

                    fetchNews();

                    const channel = supabase.channel('industry_news_changes')
                              .on('postgres_changes', { event: '*', schema: 'public', table: 'industry_news' },
                              (payload) => {
                                        if (payload.eventType === 'INSERT') {
                                                  const newItem = payload.new;
                                                  newItem.imageUrl = supabase.storage.from('news_image').getPublicUrl(newItem.image_path).data.publicUrl;
                                                  setNewsItems(currentItems => [newItem, ...currentItems]);
                                        }

                                        if (payload.eventType === 'UPDATE') {
                                                  const updatedItem = payload.new;
                                                  setNewsItems(currentItems =>
                                                            currentItems.map(item =>
                                                                      item.id === updatedItem.id ? { ...item, ...updatedItem } : item
                                                            )
                                                  );
                                        }

                                        if (payload.eventType === 'DELETE') {
                                                  setNewsItems(currentItems =>
                                                            currentItems.filter(item => item.id !== payload.old.id)
                                                  );
                                        }
                              })
                              .subscribe();

                    return () => {
                              supabase.removeChannel(channel);
                    };
          }, []);

          const handleImageChange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                              setImageFile(file);
                              setImagePreview(URL.createObjectURL(file));
                    }
          };

          const openModalForAdd = () => {
                    setIsEditing(false);
                    setIsModalOpen(true);
          };

          const openModalForEdit = (item) => {
                    setIsEditing(true);
                    setEditingId(item.id);
                    setTitle(item.title);
                    setDescription(item.description);
                    setImagePreview(item.imageUrl);
                    setIsModalOpen(true);
          };

          const closeModal = useCallback(() => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                    setEditingId(null);
                    setTitle('');
                    setDescription('');
                    setImageFile(null);
                    setImagePreview('');
                    setStatus('');
          }, []);

          const handleSubmit = async (e) => {
                    e.preventDefault();
                    if ((!isEditing && !imageFile) || !title || !description) {
                              setStatus('Please fill all fields and select an image.');
                              return;
                    }
                    setFormLoading(true);
                    setStatus('Uploading...');

                    try {
                              if (isEditing) {
                                        // --- UPDATE LOGIC ---
                                        const { error } = await supabase.from('industry_news')
                                                  .update({ title, description })
                                                  .match({ id: editingId });
                                        if (error) throw error;
                                        setStatus('News item updated successfully!');
                              } else {
                                        const fileName = `${Date.now()}_${imageFile.name}`;
                                        const { data: uploadData, error: uploadError } = await supabase.storage
                                                  .from('news_image')
                                                  .upload(fileName, imageFile);

                                        const { error: insertError } = await supabase
                                                  .from('industry_news')
                                                  .insert([{ title, description, image_path: uploadData.path }]);
                                        if (insertError) throw insertError;
                                        setStatus('News item added successfully!');
                              }
                              // No need to manually update state here, realtime will handle it.
                              setTimeout(closeModal, 1500);

                    } catch (error) {
                              console.error('Error adding news item:', error.message);
                              setStatus(`Error: ${error.message}`);
                    } finally {
                              setFormLoading(false);
                    }
          };

          const handleDelete = async (item) => {
                    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
                              try {
                                        // 1. Delete image from storage
                                        const { error: storageError } = await supabase.storage.from('news_image').remove([item.image_path]);
                                        if (storageError) console.warn("Could not delete image from storage, but proceeding.", storageError.message);

                                        // 2. Delete record from database
                                        const { error: dbError } = await supabase.from('industry_news').delete().match({ id: item.id });
                                        if (dbError) throw dbError;
                              } catch (error) {
                                        alert(`Error deleting news item: ${error.message}`);
                                        console.error(error);
                              }
                    }
          };

          const displayedItems = filter === 'latest' ? newsItems.slice(0, 5) : newsItems;

          const handleScroll = (direction) => {
                    if (carouselRef.current) {
                              const cardWidth = 280 + 15; // card width + gap
                              const scrollAmount = direction === 'next' ? cardWidth * 2 : -cardWidth * 2;
                              carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    }
          };

          useEffect(() => {
                    const carousel = carouselRef.current;
                    const checkScroll = () => {
                              if (carousel) {
                                        setIsScrolled(carousel.scrollLeft > 0);
                              }
                    };
                    if (carousel) {
                              carousel.addEventListener('scroll', checkScroll);
                    }
                    return () => {
                              if (carousel) {
                                        carousel.removeEventListener('scroll', checkScroll);
                              }
                    };
          }, [loading]);

          return (
                    <>
                              <div className={news_and_update_styles.newsAndUpdateMainContainer}>
                                        <div className={news_and_update_styles.addButtonContainer}>
                                                  <button className={news_and_update_styles.addButton} onClick={openModalForAdd}>+ Add New</button>
                                                  <div className={news_and_update_styles.filterContainer}>
                                                            <button
                                                                      className={`${news_and_update_styles.filterButton} ${filter === 'latest' ? news_and_update_styles.activeFilter : ''}`}
                                                                      onClick={() => setFilter('latest')}
                                                            >
                                                                      Latest
                                                            </button>
                                                            <button
                                                                      className={`${news_and_update_styles.filterButton} ${filter === 'all' ? news_and_update_styles.activeFilter : ''}`}
                                                                      onClick={() => setFilter('all')}
                                                            >
                                                                      All
                                                            </button>
                                                  </div>
                                        </div>

                                        {/* News Carousel */}
                                        <div className={news_and_update_styles.carouselWrapper}>
                                                  <button className={`${news_and_update_styles.carouselNav} ${news_and_update_styles.prev} ${!isScrolled ? news_and_update_styles.hidden : ''}`} onClick={() => handleScroll('prev')}>&#8249;</button>
                                                  <div className={news_and_update_styles.carouselContainer} ref={carouselRef}>
                                                  {loading && <div className={news_and_update_styles.loadingSpinner}></div>}
                                                  {!loading && displayedItems.map(item => (
                                                            <div key={item.id} className={news_and_update_styles.newsCard} onClick={() => openModalForEdit(item)}>
                                                                      <img src={item.imageUrl} alt={item.title} className={news_and_update_styles.newsImage} />
                                                                      <div className={news_and_update_styles.newsContent}>
                                                                                <h3 className={news_and_update_styles.newsTitle}>{item.title}</h3>
                                                                                <p className={news_and_update_styles.newsDescription}>{item.description}</p>
                                                                                <div className={news_and_update_styles.newsActions}>
                                                                                          <button onClick={() => openModalForEdit(item)}>Edit</button>
                                                                                          <button className={news_and_update_styles.deleteButton} onClick={() => handleDelete(item)}>Delete</button>
                                                                                </div>
                                                                      </div>
                                                            </div>
                                                  ))}
                                                  {!loading && newsItems.length === 0 && <p>No news items found. Add one to get started!</p>}
                                        </div>
                                                  <button className={`${news_and_update_styles.carouselNav} ${news_and_update_styles.next}`} onClick={() => handleScroll('next')}>&#8250;</button>
                                        </div>
                              </div>
                              {isModalOpen && (
                                        <div className={news_and_update_styles.modalOverlay}>
                                                  <div className={news_and_update_styles.modalContent}>
                                                            <button className={news_and_update_styles.closeButton} onClick={closeModal}>&times;</button>
                                                            <h2>{isEditing ? 'Edit News Item' : 'Add News or Update'}</h2>
                                                            <form onSubmit={handleSubmit} className={news_and_update_styles.newsForm}>
                                                                      <label htmlFor="image-upload" className={news_and_update_styles.imageUploadLabel}>
                                                                                {imagePreview ? <img src={imagePreview} alt="Preview" className={news_and_update_styles.imagePreview} /> : <span>Click to choose an image</span>}
                                                                      </label>
                                                                      <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} disabled={isEditing} />
                                                                      {isEditing && <small>Image cannot be changed during edit.</small>}
                                                                      <label>Title</label>
                                                                      <input type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                                                      <label>Description</label>
                                                                      <textarea placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" required></textarea>
                                                                      <button type="submit" className={news_and_update_styles.submitButton} disabled={formLoading}>{formLoading ? 'Saving...' : 'Save News'}</button>
                                                                      {status && <p className={news_and_update_styles.statusMessage}>{status}</p>}
                                                            </form>
                                                  </div>
                                        </div>
                              )}
                    </>
          )
}