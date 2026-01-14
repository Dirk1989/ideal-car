// components/home/FeaturesSection.tsx - SUBTLE GAUTENG MENTION
import { CheckCircle, Shield, TrendingUp, Users, Zap, Target } from 'lucide-react'

const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Verified Listings',
      description: 'All listings include verified contact details and vehicle information',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Free to List',
      description: 'List your car for free. Pay only when you get results',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Large Audience',
      description: 'Reach thousands of potential buyers across South Africa',
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'SEO Optimized',
      description: 'Appear in search results for Gauteng and nationwide searches',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Quick Sales',
      description: 'Average car sells in 7 days on our platform',
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: 'Easy Process',
      description: 'Simple listing process with professional support',
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">Why Use IdealCar</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We connect car sellers with serious buyers across South Africa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="inline-flex p-3 bg-blue-100 text-blue-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection