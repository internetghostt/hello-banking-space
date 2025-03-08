
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-boa-darkBlue text-white pt-10 pb-6 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 relative flex items-center justify-center">
                <div className="w-6 h-6 bg-boa-red flex items-center justify-center absolute">
                  <span className="text-white font-bold text-xs">B</span>
                </div>
                <div className="w-6 h-6 bg-boa-red transform rotate-45 absolute"></div>
              </div>
              <span className="font-bold text-base">
                Bank of America
              </span>
            </div>
            <p className="text-white/80 mb-6 max-w-sm text-sm">
              Bank of America, N.A. Member FDIC. Equal Housing Lender
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div className="text-left">
            <h3 className="font-semibold text-sm mb-4 uppercase">Popular Links</h3>
            <ul className="space-y-2 text-sm">
              {["Open an Account", "Mobile Banking", "ATM Locator", "Digital Wallets", "Mortgages"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-left">
            <h3 className="font-semibold text-sm mb-4 uppercase">Connect With Us</h3>
            <ul className="space-y-2 text-sm">
              {["Contact Us", "Schedule Appointment", "Locations", "Accessible Banking", "Careers"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-left">
            <h3 className="font-semibold text-sm mb-4 uppercase">Security & Support</h3>
            <ul className="space-y-2 text-sm">
              {["Security Center", "Privacy", "Online Banking Service Agreement", "Sitemap", "Commercial Disclosures"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80 text-xs">
            © {new Date().getFullYear()} Bank of America Corporation. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 text-xs">
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              Security
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
