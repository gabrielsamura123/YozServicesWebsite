import React from 'react';
import skeleton_styles from './News_and_Update_Component.module.css';

const NewsCardSkeleton = () => {
          return (
                    <div className={`${skeleton_styles.newsCard} ${skeleton_styles.skeleton}`}>
                              <div className={skeleton_styles.skeletonImage}></div>
                              <div className={skeleton_styles.newsContent}>
                                        <div className={skeleton_styles.skeletonTitle}></div>
                                        <div className={skeleton_styles.skeletonDescription}></div>
                                        <div className={skeleton_styles.skeletonDescription}></div>
                              </div>
                    </div>
          );
};

export default NewsCardSkeleton;