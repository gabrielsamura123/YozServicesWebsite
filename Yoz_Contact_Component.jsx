import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import contact_styles from './Yoz_Contact_Component.module.css'
import location_icon from '../assets/location.png';
import email_icon from '../assets/email.png';
import phone_icon from '../assets/Phone.png';
import working_icon from '../assets/time.png';
import { useState } from 'react';
import { supabase } from '../supabase';
import Yoz_Footer_Component from './Yoz_Footer_Component';
import Yoz_Location_Mapped from './Yoz_Location_Mapped';

const TO_EMAIL = 'gabrielsamura9@gmail.com';

const initialFormData = {
          Fname: '',
          Lname: '',
          userEmail: '',
          company: '',
          position: '',
          phone: '',
          buyingFor: '',
          hearAboutUs: '',
          message: '',
};

const contactInfoCards = [
          {
                    icon: working_icon,
                    alt: "Office Hours",
                    title: "Office Hours",
                    lines: ["<b>Mon - Fri</b>", "9:00am - 5:00pm."],
          },
          {
                    icon: email_icon,
                    alt: "Email",
                    title: "Email Us",
                    lines: ["charles@yozservices.com"],
                    link: "mailto:charles@yozservices.com",
          },
          {
                    icon: phone_icon,
                    alt: "Phone",
                    title: "Call Us",
                    lines: ["+232 76 518 585"],
                    link: "call:+23276518585"
          },
          {
                    icon: location_icon,
                    alt: "Location",
                    title: "Location",
                    lines: ["#12 Bathurst Street, Freetown, Sierra Leone."],
          },
];

const BUYING_FOR_OPTIONS = ["Private", "My Company", "Resale"];

export default function Yoz_Contact_Component() {
          useEffect(() => {
                    Aos.init({
                              duration: 1000,
                              easing: 'ease-in-out'
                    })
          }, [])

          const [formData, setFormData] = useState(initialFormData);
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

                    const fullName = `${formData.Fname.trim()} ${formData.Lname.trim()}`;

                    try {
                              const { data, error } = await supabase.functions.invoke('contact', {
                                        body: {
                                                  subject: `New message from ${fullName}`,
                                                  to: TO_EMAIL,
                                                  html: `
                        <p><strong>Name:</strong> ${fullName}</p>
                        <p><strong>Email:</strong> ${formData.userEmail.trim()}</p>
                        <p><strong>Company:</strong> ${formData.company.trim()}</p>
                        <p><strong>Position:</strong> ${formData.position.trim()}</p>
                        <p><strong>Phone:</strong> ${formData.phone.trim()}</p>
                        <p><strong>Buying For:</strong> ${formData.buyingFor.trim()}</p>
                        <p><strong>Hear About Us:</strong> ${formData.hearAboutUs.trim()}</p>
                        <p><strong>Message:</strong> ${formData.message.trim()}</p>
                    `,
                                        },
                              });

                              if (error) {
                                        throw error;
                              }

                              if (data) {
                                        setStatus('Message sent successfully!');
                                        setFormData(initialFormData);
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

          return (
                    <>
                              <div className={contact_styles.contact_container} id='contact' data-aos="zoom-in">
                                        <div className={contact_styles.contact_form_section} data-aos="fade-down">
                                                  <div className={contact_styles.contact_header}>
                                                            <p className={contact_styles.contact_getIntoTouch}>Get in touch</p>
                                                            <h1 className={contact_styles.contact_headingHead}>Get in touch and let us know how we can help.</h1>
                                                  </div>
                                                  <div className={contact_styles.infoGrid} data-aos="fade-down">
                                                            {contactInfoCards.map((card) => (
                                                                      <div key={card.title} className={contact_styles.infoCard}>
                                                                                <a href={card.link}><img src={card.icon} alt={card.alt} className={contact_styles.infoIcon} /></a>
                                                                                <div>
                                                                                          <h3 className={contact_styles.infoTitle}>{card.title}</h3>
                                                                                          {card.lines.map((line, index) => (
                                                                                                    <p key={index} className={contact_styles.infoDescription} dangerouslySetInnerHTML={{ __html: line }} />
                                                                                          ))}
                                                                                </div>
                                                                      </div>
                                                            ))}
                                                            </div>
                                                  </div>
                                                  <div className={contact_styles.contact_info} data-aos="fade-down">
                                                            <div className={contact_styles.contact_header2}>
                                                                      <p className={contact_styles.contact_getIntoTouch2}>Send us message</p>
                                                                      <h1 className={contact_styles.contact_headingHead2}>Don't hesitate to contact us for more information.</h1>
                                                            </div>
                                                            <form className={contact_styles.contact_form} onSubmit={handleSubmit}>
                                                                      {status && <p className={contact_styles.statusMessage}>{status}</p>}
                                                                      <div className={contact_styles.form_grid}>
                                                                                <input type="text" name="Fname" placeholder="First Name" className={contact_styles.inputField} onChange={handleChange} value={formData.Fname} required />
                                                                                <input type="text" name="Lname" placeholder="Last Name" className={contact_styles.inputField} onChange={handleChange} value={formData.Lname} required />
                                                                                <input type="email" name="userEmail" placeholder="Email" className={contact_styles.inputField} onChange={handleChange} value={formData.userEmail} required />
                                                                                <input type="text" name="company" placeholder="Company" className={contact_styles.inputField} onChange={handleChange} value={formData.company} required />
                                                                                <input type="text" name="position" placeholder="Position" className={contact_styles.inputField} onChange={handleChange} value={formData.position} required />
                                                                                <input type="tel" name="phone" placeholder="Phone" className={contact_styles.inputField} onChange={handleChange} value={formData.phone} required />
                                                                      </div>

                                                                      <div className={contact_styles.radioGroup}>
                                                                                {BUYING_FOR_OPTIONS.map((option) => (
                                                                                          <label key={option} className={contact_styles.radioLabel}>
                                                                                                    <input type="radio" name="buyingFor" onChange={handleChange} value={option} checked={formData.buyingFor === option} required />
                                                                                                    {option}
                                                                                          </label>
                                                                                ))}
                                                                      </div>

                                                                      <input type="text" name="hearAboutUs" placeholder="Where did you hear from us?" className={contact_styles.inputField} onChange={handleChange} value={formData.hearAboutUs} required />
                                                                      <textarea name="message" placeholder="Message" className={contact_styles.textareaField} onChange={handleChange} value={formData.message} required></textarea>
                                                                      <button type="submit" className={contact_styles.submitButton} disabled={loading}>
                                                                                {loading ? 'Submitting...' : 'Submit'}
                                                                      </button>
                                                            </form>
                                                  </div>
                                        </div>
                              <Yoz_Location_Mapped />
                              <Yoz_Footer_Component />
                    </>
          );
}