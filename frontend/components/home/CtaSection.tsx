// components/home/CtaSection.tsx
import { ArrowRight, Phone } from 'lucide-react'

const CtaSection = () => {
  return (
    <section className="section-padding bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-2 text-white mb-6">
            Ready to Find Your Ideal Car?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Schedule a test drive or speak with our automotive experts today. 
            Your perfect vehicle awaits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/vehicles"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center justify-center group"
            >
              Browse Our Inventory
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/contact"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-lg transition-all duration-300 inline-flex items-center justify-center group"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact Sales
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-blue-500/30">
            {[
              { value: '500+', label: 'Vehicles Sold' },
              { value: '98%', label: 'Customer Satisfaction' },
              { value: '24/7', label: 'Support Available' },
              { value: '10+', label: 'Brand Partners' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSection