import React from 'react';
import card_styles from './Dashboard_Component.module.css';

const ProductCard = ({ product, onEdit, onDelete, style }) => {
          return (
                    <div className={card_styles.productCard} style={style}>
                              <img
                                        src={product.imageUrl}
                                        alt={product.product_name}
                                        className={card_styles.productImage}
                                        loading="lazy" // Lazy load images for better performance
                              />
                              <div className={card_styles.productInfo}>
                                        <h4 className={card_styles.productName}>{product.product_name}</h4>
                                        <p className={card_styles.productCategory}>{product.product_category}</p>
                                        <div className={card_styles.productActions}>
                                                  <button className={card_styles.editButton} onClick={() => onEdit(product)}>Edit</button>
                                                  <button className={card_styles.deleteButton} onClick={() => onDelete(product)}>Delete</button>
                                        </div>
                              </div>
                    </div>
          );
};

export default React.memo(ProductCard);