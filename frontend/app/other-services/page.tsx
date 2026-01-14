import Link from 'next/link'
import { Shield, Camera, Wrench, ClipboardCheck, MapPin, Clock, CheckCircle, Star, Award, FileText } from 'lucide-react'

export const metadata = {
  title: 'Professional Vehicle Inspection Services - IdealCar',
  description: 'Expert on-site vehicle inspections across Gauteng. Over 12 years experience. Detailed reports within 24-48 hours. From R499.',
}

export default function OtherServicesPage() {
  const inspectionServices = [
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "Pre-Purchase Inspection",
      description: "Full walk-around, road test and diagnostic checks where possible. Make informed decisions before you buy.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Paint & Bodywork Analysis",
      description: "Detect previous repairs, overspray, mismatched panels and poor-quality paintwork with professional tools.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Mechanical Systems",
      description: "Engine, transmission, suspension, brakes and fluid leak checks by experienced technicians.",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Mileage & Title Verification",
      description: "Odometer condition checks, consistency analysis and tampering detection for peace of mind.",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Tyres & Alignment",
      description: "Comprehensive tyre wear pattern analysis and overall condition assessment.",
      gradient: "from-red-500 to-red-600"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Detailed Report",
      description: "Photographic evidence and clear written report with recommendations and severity levels.",
      gradient: "from-indigo-500 to-indigo-600"
    }
  ]

  const locations = [
    { area: "Johannesburg", suburbs: "Sandton, Roodepoort, Randburg, Soweto" },
    { area: "Pretoria / Tshwane", suburbs: "Centurion, Hatfield, Menlyn" },
    { area: "Ekurhuleni", suburbs: "Germiston, Benoni, Boksburg" }
  ]

  const reportFeatures = [
    "Summary condition score",
    "High-quality photographs of defects",
    "Points of concern highlighted",
    "Suggested next steps",
    "Estimated repair considerations",
    "Priority recommendations"
  ]

  const whyChooseUs = [
    { icon: <Award className="w-6 h-6" />, title: "12+ Years Experience", desc: "Decades in the SA used car market" },
    { icon: <Shield className="w-6 h-6" />, title: "Impartial Advice", desc: "No conflicts of interest, just honest insights" },
    { icon: <Camera className="w-6 h-6" />, title: "Photo Documentation", desc: "Every issue captured and explained" },
    { icon: <Clock className="w-6 h-6" />, title: "Fast Turnaround", desc: "Reports delivered within 24-48 hours" }
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">Professional Vehicle Inspection Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Know Before You Buy
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              With over 12 years' experience in the South African second-hand car market, we deliver professional
              on-site vehicle inspections across Gauteng—giving you confidence and peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                <ClipboardCheck className="w-5 h-5" />
                Book an Inspection
              </Link>
              <Link 
                href="#pricing" 
                className="bg-blue-500/30 backdrop-blur-sm hover:bg-blue-500/40 text-white font-semibold py-4 px-8 rounded-lg border-2 border-white/30 transition-all inline-flex items-center justify-center gap-2"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Inspect Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Inspection Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our thorough inspection process covers every critical aspect of the vehicle
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {inspectionServices.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className={`bg-gradient-to-br ${service.gradient} p-6 text-white`}>
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Area */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">Service Coverage</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Where We Operate</h2>
              <p className="text-xl text-gray-600">
                We cover the entire Gauteng province
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {locations.map((location, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-100 hover:border-blue-300 transition-all"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{location.area}</h3>
                  <p className="text-gray-600">{location.suburbs}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Report & Turnaround */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Fast Delivery</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Detailed Reports Within 24-48 Hours
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  You'll receive a comprehensive PDF report (faster on request) that gives you complete clarity on the vehicle's condition.
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-4">Your Report Includes:</h3>
                  <ul className="space-y-3">
                    {reportFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 shadow-2xl">
                  <FileText className="w-16 h-16 text-white mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Sample Report Preview</h3>
                  <div className="space-y-4 text-sm">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <div className="font-semibold mb-2">Overall Condition Score</div>
                      <div className="flex gap-1">
                        {[1,2,3,4].map((i) => (
                          <Star key={i} className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                        ))}
                        <Star className="w-6 h-6 text-yellow-300" />
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <div className="font-semibold mb-2">Issues Found: 3</div>
                      <div className="text-gray-200">2 Minor • 1 Moderate</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <div className="font-semibold mb-2">Photos Attached</div>
                      <div className="text-gray-200">15 high-resolution images</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Transparent Pricing</h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 border-2 border-blue-100 shadow-xl">
              <div className="text-6xl font-bold text-blue-600 mb-4">From R499</div>
              <p className="text-xl text-gray-600 mb-8">
                Pricing varies based on location and vehicle accessibility
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link 
                  href="/contact" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  <ClipboardCheck className="w-5 h-5" />
                  Book Your Inspection
                </Link>
                <Link 
                  href="/sell-car" 
                  className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-8 rounded-lg border-2 border-gray-200 transition-all inline-flex items-center justify-center gap-2"
                >
                  Sell Your Car
                </Link>
              </div>
              <p className="text-gray-500 text-sm">
                Contact us for a custom quote or to request express service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose IdealCar Inspections?</h2>
              <p className="text-xl text-blue-100">
                Trusted expertise and reliable service you can count on
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, index) => (
                <div 
                  key={index}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-blue-100">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Our inspectors are practical, thorough, and committed to clear communication. 
                We help you make informed decisions with detailed photographic reports and impartial advice—
                backed by decades of experience in the South African used car market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Don't buy a car without knowing its true condition. Book your inspection today.
            </p>
            <Link 
              href="/contact" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-lg shadow-lg transition-all transform hover:scale-105 inline-flex items-center gap-2 text-lg"
            >
              <ClipboardCheck className="w-6 h-6" />
              Schedule an Inspection
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
