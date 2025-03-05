
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-2xl overflow-hidden relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 -z-10" />
          
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="px-6 md:px-12 py-16 md:py-20 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to transform your banking experience?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Join thousands of satisfied customers who have switched to a simpler, more intuitive way of banking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white px-8">
                Open an Account
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-lg border-2">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
