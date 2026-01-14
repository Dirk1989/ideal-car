import type { Metadata } from 'next'
import { Car, Shield, Clock, ThumbsUp, Users, Award, Heart, Zap } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About IdealCar - South Africa\'s Premier Car Marketplace | Gauteng',
  description: 'Learn about IdealCar, your trusted platform for buying and selling cars in Gauteng. Transparent pricing, personalized service, and expert guidance.',
  keywords: 'about idealcar, car marketplace gauteng, used car dealers, south africa cars, johannesburg car sales',
  openGraph: {
    title: 'About IdealCar - Trusted Car Marketplace',
    description: 'Learn about IdealCar, your trusted platform for buying and selling cars in Gauteng.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-700/30 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Car className="h-5 w-5 text-blue-300" />
              <span className="text-blue-100 font-medium">Your Trusted Car Partner</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-blue-300">IdealCar</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Where finding your perfect vehicle is simple, transparent, and stress-free. We're not just a marketplace—we're your partner in every step of the journey.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 text-blue-600 mb-4">
                  <Heart className="h-5 w-5" />
                  <span className="font-semibold uppercase tracking-wide text-sm">Our Story</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Built on Trust, Driven by Passion
                </h2>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  IdealCar was born from a simple vision: to create a car marketplace that puts <strong>you</strong> first. We understand that buying or selling a car isn't just a transaction—it's a significant life decision.
                </p>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  That's why we've built a platform that combines cutting-edge technology with genuine, personalized service. Whether you're a first-time buyer or a seasoned car enthusiast, we're here to make your experience smooth and enjoyable.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Based in <strong>Wonderboom, Pretoria</strong>, we proudly serve the greater Gauteng area with integrity, expertise, and a commitment to excellence.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl p-8 shadow-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 text-center shadow-md">
                      <Users className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                      <div className="text-sm text-gray-600">Customer Focused</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 text-center shadow-md">
                      <Shield className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-gray-900 mb-1">Safe</div>
                      <div className="text-sm text-gray-600">Verified Listings</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 text-center shadow-md">
                      <Clock className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-gray-900 mb-1">Fast</div>
                      <div className="text-sm text-gray-600">Quick Responses</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 text-center shadow-md">
                      <ThumbsUp className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-gray-900 mb-1">Easy</div>
                      <div className="text-sm text-gray-600">Simple Process</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 text-blue-600 mb-4">
                <Award className="h-5 w-5" />
                <span className="font-semibold uppercase tracking-wide text-sm">What Drives Us</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Every decision we make is guided by these principles
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity</h3>
                <p className="text-gray-600 leading-relaxed">
                  Complete transparency in every transaction. No hidden fees, no surprises—just honest, straightforward service.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every vehicle we list meets our rigorous standards. Your safety and satisfaction are non-negotiable.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Care</h3>
                <p className="text-gray-600 leading-relaxed">
                  We treat every customer like family. Your journey matters to us, and we're here to support you.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600 leading-relaxed">
                  We continuously improve our platform and processes to deliver the best experience possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 text-blue-600 mb-4">
                <ThumbsUp className="h-5 w-5" />
                <span className="font-semibold uppercase tracking-wide text-sm">The IdealCar Difference</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose IdealCar?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We go above and beyond to ensure your car buying or selling experience is exceptional
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Shield, title: 'Verified Quality', desc: 'Thorough inspection on every vehicle to ensure safety and reliability' },
                { icon: Clock, title: 'Fast & Simple', desc: 'Streamlined process that saves you time and hassle' },
                { icon: ThumbsUp, title: 'Transparent Pricing', desc: 'No hidden fees or surprises—what you see is what you get' },
                { icon: Users, title: 'Expert Support', desc: 'Knowledgeable team ready to assist at every step' },
                { icon: Car, title: 'Wide Selection', desc: 'Diverse inventory to match every need and budget' },
                { icon: Award, title: 'Best Value', desc: 'Competitive pricing and great deals on quality vehicles' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 bg-gray-50 rounded-xl p-6 hover:bg-blue-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Find Your Ideal Car?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Whether you're buying or selling, we're here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/vehicles"
                className="bg-white text-blue-900 font-semibold py-4 px-8 rounded-lg hover:bg-blue-50 transition-all shadow-lg inline-flex items-center justify-center"
              >
                <Car className="mr-2 h-5 w-5" />
                Browse Cars
              </Link>
              <Link
                href="/sell-car"
                className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-500 transition-all shadow-lg inline-flex items-center justify-center border-2 border-blue-500"
              >
                Sell Your Car
              </Link>
              <Link
                href="/contact"
                className="bg-transparent text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-800 transition-all border-2 border-white inline-flex items-center justify-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
