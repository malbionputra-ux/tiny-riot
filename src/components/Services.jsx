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
  return (
    <section className="services light-section" id="services">
      <div className="services-content">
        <div className="services-header">
          <span className="services-meta">LAYANAN KAMI</span>
          <h2 className="services-title-main">Solusi Kreatif & <em>Digital</em></h2>
        </div>
        
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

