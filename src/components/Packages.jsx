import React from 'react';
import { motion } from 'framer-motion';
import './Packages.css';

const packagesList = [
  {
    category: 'Social Media',
    plans: [
      { name: 'Bronze', price: 'Rp. 2,150,000.-', benefits: ['15 Instagram Feeds', '15 Instagram Stories', 'Daily posting & caption', '1 Photoshoot 3 hours'] },
      { name: 'Silver', price: 'Rp. 2,550,000.-', benefits: ['20 Instagram Feeds', '20 Instagram Stories', '1 Short Video', '1 Photoshoot 3 hours'] },
      { name: 'Gold', price: 'Rp. 3,050,000.-', benefits: ['30 Instagram Feeds', '30 Instagram Stories', '2 Short Video', '1 Photoshoot 3 hours'] }
    ]
  },
  {
    category: 'Company Profile',
    plans: [
      { name: 'Bronze', price: 'Rp. 2,500,000.-', benefits: ['5 Static pages', '.com domain 1 year', 'Mobile Friendly', 'Optimized Copy Writing'] },
      { name: 'Silver', price: 'Rp. 3,500,000.-', benefits: ['10 Static Pages', '.com domain 1 year', 'SEO Friendly Copy Writing', 'Google Maps integration'] },
      { name: 'Gold', price: 'Rp. 4,250,000.-', benefits: ['15 Static Pages', '.com domain 1 year', 'Multilingual 2 languages', '6 Month Support'] }
    ]
  }
];

const Packages = ({ setCursorVariant }) => {
  return (
    <section className="packages" id="packages">
      <div className="packages-container">
        <div className="packages-header">
          <h2>PAKET LAYANAN</h2>
        </div>
        
        {packagesList.map((category, idx) => (
          <div className="package-category" key={idx}>
            <h3 className="category-title">{category.category}</h3>
            <div className="plans-grid">
              {category.plans.map((plan, planIdx) => (
                <motion.div 
                  className="plan-card" 
                  key={planIdx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: planIdx * 0.15 }}
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  <h4 className="plan-name">{plan.name}</h4>
                  <div className="plan-price">{plan.price}</div>
                  <ul className="plan-benefits">
                    {plan.benefits.map((benefit, bIdx) => (
                      <li key={bIdx}>{benefit}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Packages;
