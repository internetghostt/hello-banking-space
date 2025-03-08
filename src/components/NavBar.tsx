
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, Menu } from "lucide-react";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-0",
        isScrolled ? "bg-white shadow-sm" : "bg-white"
      )}
    >
      {/* Top navigation - Sign in section */}
      <div className="bg-boa-darkBlue text-white py-1 px-6">
        <div className="max-w-7xl mx-auto flex justify-end items-center">
          <nav className="flex items-center text-xs">
            <a href="#" className="px-3 py-1 hover:underline">En Español</a>
            <a href="#" className="px-3 py-1 hover:underline">Locations</a>
            <a href="#" className="px-3 py-1 hover:underline">Contact Us</a>
            <a href="#" className="px-3 py-1 hover:underline">Help</a>
          </nav>
        </div>
      </div>

      {/* Main navigation */}
      <div className="py-2 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="block">
              <div className="flex items-center">
                <div className="w-10 h-10 relative flex items-center justify-center">
                  <div className="w-8 h-8 bg-boa-red flex items-center justify-center absolute">
                    <span className="text-white font-bold text-base">B</span>
                  </div>
                  <div className="w-8 h-8 bg-boa-red transform rotate-45 absolute"></div>
                </div>
                <span className="ml-3 text-boa-darkBlue font-bold text-xl">Bank of America</span>
              </div>
            </a>
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center">
            {["Personal", "Small Business", "Wealth Management", "Businesses & Institutions", "Security & Support"].map((item, i) => (
              <div key={item} className="group relative">
                <a 
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 flex items-center text-sm font-medium text-boa-textGrey hover:text-boa-darkBlue"
                >
                  {item}
                  <ChevronDown size={14} className="ml-1" />
                </a>
                <div className="absolute hidden group-hover:block bg-white shadow-lg w-48 p-2 z-50">
                  <div className="py-1 px-2 text-sm hover:bg-boa-grey">
                    <a href="#" className="block text-boa-textGrey">Checking</a>
                  </div>
                  <div className="py-1 px-2 text-sm hover:bg-boa-grey">
                    <a href="#" className="block text-boa-textGrey">Savings</a>
                  </div>
                  <div className="py-1 px-2 text-sm hover:bg-boa-grey">
                    <a href="#" className="block text-boa-textGrey">Credit Cards</a>
                  </div>
                  <div className="py-1 px-2 text-sm hover:bg-boa-grey">
                    <a href="#" className="block text-boa-textGrey">Home Loans</a>
                  </div>
                </div>
              </div>
            ))}
          </nav>
          
          {/* Search and Sign in buttons */}
          <div className="flex items-center">
            <button className="p-2 text-boa-textGrey hover:text-boa-darkBlue">
              <Search size={20} />
            </button>
            <Button className="ml-4 bg-boa-red hover:bg-boa-red/90 text-white font-medium rounded-sm">
              Sign In
            </Button>
            <button className="ml-2 block md:hidden">
              <Menu size={24} className="text-boa-darkBlue" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
