import React, { useState } from 'react';
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
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="services" id="services">
      <div 
        className="services-bg" 
        style={{ 
          backgroundColor: hoveredIndex !== null ? 'var(--color-primary)' : 'var(--color-bg)',
          transition: 'background-color 0.5s ease'
        }}
      ></div>
      
      <div className="services-content">
        <div className="services-header">
          <h2>LAYANAN KAMI</h2>
        </div>
        
        <div className="services-list">
          {servicesList.map((service, index) => (
            <motion.div 
              className="service-item" 
              key={index}
              onMouseEnter={() => {
                setHoveredIndex(index);
                setCursorVariant('hover');
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
                setCursorVariant('default');
              }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="service-title">{service.title}</h3>
              <ul className="service-details">
                {service.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
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
