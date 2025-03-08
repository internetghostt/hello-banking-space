
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-10 px-6 md:px-10 bg-boa-grey">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-sm shadow-sm overflow-hidden relative">          
          <div className="px-6 md:px-12 py-10 md:py-12 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-boa-darkBlue">
              Ready to experience better banking?
            </h2>
            <p className="text-boa-darkGrey mb-6 text-balance">
              Join millions of customers who trust Bank of America for their financial needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-sm bg-boa-red hover:bg-boa-red/90 text-white px-8">
                Open an Account
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-sm border-boa-darkBlue text-boa-darkBlue hover:bg-boa-darkBlue/10">
                Schedule an Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
