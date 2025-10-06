import { Link } from "react-scroll"
import footer_styles from './Yoz_Footer_Component.module.css'
import { useEffect, useState } from "react";
import Aos from 'aos';
import 'aos/dist/aos.css';
import { supabase } from "../supabase";
import linkedinIcon from '../assets/linkedin.png';
import facebookIcon from '../assets/Facebook Icon.jpeg';
import twitterIcon from '../assets/Twitter.png'
export default function Yoz_Footer_Component () {
          useEffect (() => {
                    Aos.init ({
                              duration: 1000,
                              easing: 'ease-in-out'
                    })
          }, [])

          const [formData, setFormData] = useState({
                    name: '',
                    email: 'gabrielsamura9@gmail.com',
                    ReceiverEmail: '',
                    company: '',
                    position: '',
          });

          const [status, setStatus] = useState('');
          const [loading, setLoading] = useState(false);

          const handleChange = (e) => {
                    const { name, value } = e.target;
                    setFormData((prevData) => ({
                              ...prevData,
                              [name]: value,
                    }));
          };

          const handleSubmit = async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    setStatus('Sending...');

                    try {
                              const { data, error } = await supabase.functions.invoke('contact', {
                                        body: {
                                                  subject: `New message from ${formData.name.trim()}`,
                                                  to: formData.email.trim(),
                                                  html: `
                                                                      <p><strong>Name:</strong> ${formData.name.trim()}</p>
                                                                      <p><strong>Email:</strong> ${formData.ReceiverEmail.trim()}</p>
                                                                      <p><strong>Company:</strong>${formData.company.trim()}</p>
                                                                      <p><strong>Position:</strong>${formData.position.trim()}</p>
                                                            `
                                                  ,
                                        },
                              });

                              if (error) {
                                        throw error;
                              }

                              if (data) {
                                        setStatus('Message sent successfully!');
                                        setFormData({ name: '', message: '' });
                              } else {
                                        setStatus('An unknown error occurred.');
                              }
                    } catch (error) {
                              console.error(error);
                              setStatus('Network error. Please try again.');
                    } finally {
                              setLoading(false);
                              setTimeout(() => setStatus(''), 5000); // Clear status after 5 seconds
                    }
          };
          const locateHomePage = () => {
                    window.location.href = "/"
          }
          const locateAboutPage = () => {
                    window.location.href = "/about"
          }
          const locateIndustryNewsandUpdatePage = () => {
                    window.location.href = "/news"
          }
          const locateShopLinePage = () => {
                    window.location.href = "/shop"
          }
          return (
                    <div className={footer_styles.footerContainer} data-aos="fade-up">
                              <div className={footer_styles.footerFirst}>
                                        <p className={footer_styles.subscribeDesc}>
                                                  <span>Subscribe to our Newsletter</span> <br />
                                                  Stay up to date with new product updates, special offers and items for sale.
                                        </p>
                                        <form className={footer_styles.formContainer} onSubmit={handleSubmit} data-aos="fade-up">
                                                  {status && <p className={footer_styles.statusMessage}>{status}</p>}
                                                  <input type="text" placeholder="Name" className={footer_styles.input} onChange={(e) => {setFormData({ ...formData, name: e.target.value })}} value={formData.name} required/>
                                                  <input type="email" placeholder="Email" className={footer_styles.input} onChange={(e) => {setFormData({ ...formData, ReceiverEmail: e.target.value })}} value={formData.ReceiverEmail} required/>
                                                  <input type="text" placeholder="Company" className={footer_styles.input} onChange={(e) => {setFormData({ ...formData, company: e.target.value })}} value={formData.company} required/>
                                                  <input type="text" placeholder="Position" className={footer_styles.input} onChange={(e) => {setFormData({ ...formData, position: e.target.value })}} value={formData.position}
                                                   required/>
                                                  <button type="submit" className={footer_styles.button} disabled={loading}>{loading ? 'Subscribing' : 'Subscribe'}</button>
                                        </form>
                              </div>
                              <div className={footer_styles.footerSecond}>
                                                  {/* This is for the Left side of the main footer, just for note purpose */}
                                        <div className={footer_styles.footerLeft}>
                                                  <h2 className={footer_styles.footerLogo}>Yoz Services</h2>
                                                  <div className={footer_styles.socialsContainer}>
                                                            <a href=""><img src={linkedinIcon} alt="Link to our linkedin profile" /></a>
                                                            <a href=""><img src={facebookIcon} alt="Link to our facebook profile" /></a>
                                                            <a href=""><img src={twitterIcon} alt="Link to our twitter profile" /></a>
                                                  </div>
                                        </div>
                                                  {/* This is for the Middle of the main footer, just for note purpose because of my team */}
                                        <div className={footer_styles.footerMiddle}>
                                                  <div className={footer_styles.footerColumnContainer}>
                                                            <h4>Popular Categories</h4>
                                                            <ul>
                                                                      <li>Networking</li>
                                                                      <li>Softwares</li>
                                                                      <li>Accessories & Equipments</li>
                                                                      <li>Drones</li>
                                                                      <li>CCTV Cameras</li>
                                                            </ul>
                                                  </div>
                                                  <div className={footer_styles.footerColumnContainer}>
                                                            <h4>Quick Links</h4>
                                                            <ul>
                                                                      <li>Home</li>
                                                                      <li>About Yoz Services</li>
                                                                      <li>Industry News & Updates</li>
                                                                      <li>Shop Line</li>
                                                                      <li>Contact</li>
                                                                      <li>Gallery</li>
                                                            </ul>
                                                  </div>
                                        </div>
                                        {/* This is for the Right side of the main footer, just for my team to understand my code base */}
                                        <div className={footer_styles.footerRight}>
                                                  <h4>Quick Contact Information</h4>
                                                  <ul>
                                                            <li>Location: 12 Bathurst Street, Freetown, Sierra Leone.</li>
                                                  </ul>
                                                  <p>📞 +23276518585</p>
                                                  <p>Email Us: <a href="mailto: charles@yozservices.com">Yoz Services</a></p>
                                        </div>
                              </div>
                              <div className={footer_styles.footerThird}>
                                        <p className={footer_styles.copyright}>© 2024 Yoz Services. All rights reserved.</p>
                                        <p className={footer_styles.developedBy}>Developed by <a href="https://gabrielsamura.github.io/Portfolio/" target="_blank" rel="noopener noreferrer">Gabriel Samura</a></p>
                              </div>
                    </div>
          )
}