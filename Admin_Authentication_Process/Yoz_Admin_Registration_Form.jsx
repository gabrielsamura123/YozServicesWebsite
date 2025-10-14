import React, { useState } from 'react';
import registration_styles from './Yoz_Admin_Registration_Form.module.css';
import { supabase } from '../../supabase'; // Import the Supabase client

export default function Yoz_Admin_Registration_Form() {
          const [imageFile, setImageFile] = useState(null);
          const [imagePreview, setImagePreview] = useState('');
          const [email, setEmail] = useState('');
          const [username, setUsername] = useState('');
          const [password, setPassword] = useState('');

          // State for loading and status messages
          const [loading, setLoading] = useState(false);
          const [statusMessage, setStatusMessage] = useState('');

          const handleImageChange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                              setImageFile(file);
                              setImagePreview(URL.createObjectURL(file));
                    }
          };

          const handleSubmit = async (e) => {
                    e.preventDefault();
                    if (!imageFile || !email || !username || !password) {
                              setStatusMessage('All fields, including an image, are required.');
                              return;
                    }
                    setLoading(true);
                    setStatusMessage('Registering...');

                    try {
                              // 1. Sign up the user in Supabase Auth
                              const { data: authData, error: authError } = await supabase.auth.signUp({
                                        email: email,
                                        password: password,
                              });

                              if (authError) throw authError;
                              if (!authData.user) throw new Error('Registration successful, but no user data returned.');

                              setStatusMessage('User created. Uploading profile image...');

                              // 2. Upload the profile image to Supabase Storage
                              const fileExt = imageFile.name.split('.').pop();
                              const fileName = `${authData.user.id}.${fileExt}`;
                              const filePath = `${fileName}`;

                              const { error: uploadError } = await supabase.storage
                                        .from('Yoz_Admin_Profile')
                                        .upload(filePath, imageFile);

                              if (uploadError) throw uploadError;

                              setStatusMessage('Image uploaded. Saving profile...');

                              // 3. Get the public URL of the uploaded image
                              const { data: urlData } = supabase.storage.from('Yoz_Admin_Profile').getPublicUrl(filePath);

                              // 4. Insert the user's profile data into the yoz_admin_table
                              const { error: insertError } = await supabase.from('yoz_admin_table').insert({
                                        user_id: authData.user.id,
                                        username: username,
                                        profile_image: urlData.publicUrl,
                              });

                              if (insertError) throw insertError;

                              setStatusMessage('Registration complete! Please check your email to confirm your account.');
                    } catch (error) {
                              setStatusMessage(`Error: ${error.message}`);
                              console.error('Registration Error:', error);
                    } finally {
                              setLoading(false);
                    }
          };

          return (
                    <div className={registration_styles.pageWrapper}>
                              <div className={registration_styles.registrationContainer}>
                              <h2 className={registration_styles.registrationTitle}>Admin Registration</h2>
                              <form onSubmit={handleSubmit} className={registration_styles.registrationForm}>
                                        <div className={registration_styles.imagePreviewContainer}>
                                                  <label htmlFor="image-upload" className={registration_styles.imageUploadLabel}>
                                                            {imagePreview ? (
                                                                      <img src={imagePreview} alt="Preview" className={registration_styles.imagePreview} />
                                                            ) : (
                                                                      <span>Click to choose an image</span>
                                                            )}
                                                  </label>
                                                  <input
                                                            id="image-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className={registration_styles.imageInput}
                                                  />
                                        </div>
                                        <div className={registration_styles.formGroup}>
                                                  <label htmlFor="email">Email</label>
                                                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                        <div className={registration_styles.formGroup}>
                                                  <label htmlFor="username">Username</label>
                                                  <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                        </div>
                                        <div className={registration_styles.formGroup}>
                                                  <label htmlFor="password">Password</label>
                                                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        </div>
                                        <button type="submit" className={registration_styles.submitButton} disabled={loading}>
                                                  {loading ? 'Processing...' : 'Register'}
                                        </button>
                              </form>
                              <div className={registration_styles.loginLinkContainer}>
                                        <a href="/login" className={registration_styles.loginLink}>
                                                  Already have an account? Log in
                                        </a>
                              </div>
                              {statusMessage && <p className={registration_styles.statusMessage}>{statusMessage}</p>}
                              </div>
                    </div>
          );
}