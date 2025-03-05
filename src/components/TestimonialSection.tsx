
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "NeoBank has completely transformed the way I manage my finances. The interface is clean, intuitive, and makes banking feel effortless.",
    author: "Sarah Johnson",
    title: "Small Business Owner"
  },
  {
    id: 2,
    quote: "I've tried many banking apps, but NeoBank stands out with its thoughtful design and powerful features. The savings automations have helped me save more than ever.",
    author: "Michael Chen",
    title: "UX Designer"
  },
  {
    id: 3,
    quote: "The customer service team at NeoBank is exceptional. Any time I've had a question, they've been quick to respond with helpful answers.",
    author: "Alexis Rivera",
    title: "Freelance Photographer"
  }
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-secondary/50"
    >
      <div className="container px-6 md:px-10 mx-auto max-w-5xl">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            <span>What our customers say</span>
          </div>
          <h2 className={`text-3xl md:text-4xl font-display font-bold mb-6 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Trusted by thousands worldwide
          </h2>
        </div>
        
        <div className="relative">
          <div 
            className="glass rounded-2xl p-8 md:p-12 transition-all duration-500"
          >
            <div className="text-primary mb-6">
              <Quote size={40} />
            </div>
            
            <div className="min-h-[180px] flex flex-col justify-between">
              <p className="text-xl md:text-2xl font-medium mb-8 text-left text-balance">
                "{testimonials[currentIndex].quote}"
              </p>
              
              <div className="text-left">
                <p className="font-semibold text-lg">{testimonials[currentIndex].author}</p>
                <p className="text-muted-foreground">{testimonials[currentIndex].title}</p>
              </div>
            </div>
            
            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex gap-2">
              <Button 
                onClick={prevTestimonial} 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <ChevronLeft size={20} />
              </Button>
              <Button 
                onClick={nextTestimonial} 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex 
                  ? "bg-primary w-8" 
                  : "bg-primary/30"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
