import React from 'react';
import { motion } from 'framer-motion';
import './Services.css';

const servicesList = [
  {
    title: 'Social Media',
    items: ['Content Planning', 'Production', 'Publishing']
  },
  {
    title: 'Photo & Video',
    items: ['Photo Product', 'Video Product', 'Motion Graphics']
  },
  {
    title: 'Company Profile',
    items: ['Landing Pages', 'Custom Websites', 'SEO Optimized Copywriting']
  }
];

const Services = ({ setCursorVariant }) => {
  const textVariants = {
    hidden:  { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="services light-section" id="services">
      <div className="services-content">
        <motion.div 
          className="services-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div style={{ overflow: 'hidden', paddingBottom: '5px' }}>
            <motion.span variants={textVariants} className="services-meta" style={{ display: 'block' }}>LAYANAN KAMI</motion.span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2 variants={textVariants} className="services-title-main">Solusi Kreatif & <em>Digital</em></motion.h2>
          </div>
        </motion.div>
        
        <div className="services-grid">
          {servicesList.map((service, index) => (
            <motion.div 
              className="service-card" 
              key={index}
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="service-header-card">
                <span className="service-number">0{index + 1}</span>
                <h3 className="service-title">{service.title}</h3>
              </div>
              <ul className="service-details">
                {service.items.map((item, idx) => (
                  <li key={idx}>
                    <span className="bullet"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

