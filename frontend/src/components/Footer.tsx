import { Link, useLocation } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin, MessageCircle, ShieldCheck, RotateCcw, Truck, PenTool } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Footer = () => {
  const user = useStore((s) => s.user);
  const year = new Date().getFullYear();
  const { pathname } = useLocation();
  // The booking band competes with checkout and duplicates the booking page and the home brand band
  const showBookingBand = !['/', '/cart', '/checkout', '/appointments', '/login', '/register'].includes(pathname);
  // Home already shows these guarantees under the hero
  const showTrust = pathname !== '/';

  return (
    <footer className="bg-bj-charcoal text-white">
      {/* Top CTA */}
      {showBookingBand && (
      <div className="border-b border-white/10 py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-bj-gold mb-4">Experience Baikunthh in Person</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
            Meet our specialists for bridal consultations, custom design commissions or a quiet look at the collection.
          </p>
          <Link to="/appointments" className="btn-outline-white inline-flex">
            Book an Appointment
          </Link>
        </div>
      </div>
      )}

      {/* Main Footer */}
      <div className="page-container pt-14 md:pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-2xl tracking-[0.1em] font-bold text-white">
              BAIKUNTHH
            </Link>
            <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-bj-champagne/50">
              Timeless Jewellery. Extraordinary Moments.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com/devanshabhushan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-bj-gold hover:text-bj-gold transition-colors"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://wa.me/917068580500"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-bj-gold hover:text-bj-gold transition-colors"
              >
                <MessageCircle size={15} />
              </a>
              <a
                href="tel:+917068580500"
                aria-label="Call +91 7068580500"
                className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-bj-gold hover:text-bj-gold transition-colors"
              >
                <Phone size={15} />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-bj-champagne/60 mb-5 font-medium">Collections</h4>
            <ul className="space-y-3">
              {['Bridal Edit', 'Daily Luxury', 'Heirloom Classics', 'Gold Jewellery', 'Silver Jewellery', 'Diamond Jewellery'].map((item) => (
                <li key={item}>
                  <Link
                    to={item.includes('Edit') || item.includes('Luxury') || item.includes('Classics') ? `/shop?collection=${encodeURIComponent(item)}` : '/shop'}
                    className="text-sm text-gray-400 hover:text-bj-gold transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-bj-champagne/60 mb-5 font-medium">Help & Info</h4>
            <ul className="space-y-3">
              {[
                { label: 'Book Appointment', to: '/appointments' },
                { label: 'Track Order', to: '/account' },
                { label: 'Lifetime Buyback', to: '/articles' },
                { label: 'Journal', to: '/articles' },
                { label: 'My Account', to: '/account' },
                ...(user?.role === 'ADMIN' ? [{ label: 'Admin Panel', to: '/admin' }] : []),
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-gray-400 hover:text-bj-gold transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs uppercase tracking-[0.25em] text-bj-champagne/60 mb-5 font-medium">Concierge</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-400">
                <MapPin size={15} className="shrink-0 mt-0.5 text-bj-gold" />
                <span>Premium Jewellery Showroom<br />Authorized Hallmark Centre</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <Phone size={15} className="shrink-0 mt-0.5 text-bj-gold" />
                <a href="tel:+917068580500" className="hover:text-bj-gold transition-colors">+91 7068580500</a>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <Mail size={15} className="shrink-0 mt-0.5 text-bj-gold" />
                <a href="mailto:care@baikunthh.com" className="hover:text-bj-gold transition-colors">care@baikunthh.com</a>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <MessageCircle size={15} className="shrink-0 mt-0.5 text-bj-gold" />
                <a href="https://wa.me/917068580500" target="_blank" rel="noopener noreferrer" className="hover:text-bj-gold transition-colors">WhatsApp us</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        {showTrust && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-t border-white/10 border-b border-white/10">
          {[
            { icon: ShieldCheck, title: 'Authorized Hallmark Centre', desc: 'Certified purity' },
            { icon: RotateCcw, title: 'Lifetime Buyback', desc: 'Guaranteed for life' },
            { icon: Truck, title: 'Insured Shipping', desc: 'Free on bridal orders' },
            { icon: PenTool, title: 'Custom Design', desc: 'Bespoke jewellery' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon size={24} className="text-bj-gold" />
              <div>
                <p className="text-xs font-medium text-white">{title}</p>
                <p className="text-[10px] text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Copyright */}
        <div className={`${showTrust ? 'mt-8' : 'pt-8 border-t border-white/10'} flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] uppercase tracking-widest text-gray-400`}>
          <p>© {year} Baikunthh Jewellers. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link to="/articles" className="hover:text-bj-gold transition-colors">Privacy</Link>
            <Link to="/articles" className="hover:text-bj-gold transition-colors">Shipping</Link>
            <Link to="/articles" className="hover:text-bj-gold transition-colors">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
