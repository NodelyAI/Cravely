import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-white text-primary rounded-full p-1 mr-1">
                <span className="text-xl">🍽️</span>
              </span>
              <span className="text-xl font-extrabold">Cravely</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/auth" className="bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition duration-300">
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10"
          >
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight mb-4">
              Transform Your Restaurant Operations
            </h1>
            <p className="text-white/90 text-xl max-w-3xl mb-8">
              Streamline your restaurant management with our comprehensive platform. From orders to menus, backed by AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/auth" className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-300">
                Get Started
              </Link>
              <a href="#features" className="inline-flex justify-center py-3 px-6 border border-white/20 shadow-sm text-base font-medium rounded-md text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition duration-300">
                Learn More
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="bg-white p-2 rounded-xl shadow-xl">
              <img 
                src="https://via.placeholder.com/600x400?text=Cravely+Dashboard" 
                alt="Cravely Dashboard Preview" 
                className="rounded-lg w-full"
              />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-primary tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-4xl font-extrabold text-text-primary sm:text-5xl sm:tracking-tight">
              Everything you need to manage your restaurant
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-text-muted">
              Our platform provides comprehensive tools designed specifically for restaurant operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Menu Management",
                description: "Easily create, update, and organize your menu items with a user-friendly interface.",
                icon: "🍔"
              },
              {
                title: "Order Tracking",
                description: "Real-time order management with status updates and preparation time estimates.",
                icon: "📋"
              },
              {
                title: "Table Management",
                description: "Interactive restaurant layout with real-time table status indicators.",
                icon: "🪑"
              },
              {
                title: "AI Assistance",
                description: "Get intelligent insights and recommendations to optimize your operations.",
                icon: "🤖"
              },
              {
                title: "Customer Insights",
                description: "Understand your customers better with detailed analytics and preferences.",
                icon: "📊"
              },
              {
                title: "Payment Processing",
                description: "Secure payment processing with multiple payment options and split bill capabilities.",
                icon: "💳"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-text-muted">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-accent text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-white/80 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-1 text-4xl font-extrabold sm:text-5xl sm:tracking-tight">
              Trusted by restaurants worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Cravely has completely transformed how we manage our restaurant. The AI features are game-changing!",
                author: "Maria Rodriguez",
                role: "Owner, La Mesa Bonita"
              },
              {
                quote: "We've increased our efficiency by 40% since implementing Cravely. Our customers love the smooth ordering experience.",
                author: "John Smith",
                role: "Manager, Urban Plate"
              },
              {
                quote: "The analytics provided by Cravely have helped us make data-driven decisions that have boosted our revenue.",
                author: "Sarah Johnson",
                role: "Owner, The Green Fork"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/5 hover:bg-white/15 transition-all duration-300"
              >
                <p className="text-white mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-white/80 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Ready to transform your restaurant?
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-white/90">
                  Get started today and see the difference Cravely can make for your business.
                </p>
              </div>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <Link to="/auth" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100 transition duration-300">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-text-muted tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Features</a></li>
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Pricing</a></li>
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Integrations</a></li>
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-muted tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Documentation</a></li>
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Guides</a></li>
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Help Center</a></li>
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-muted tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">About</a></li>
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Blog</a></li>
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Careers</a></li>
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-muted tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Privacy</a></li>
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Terms</a></li>
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Cookies</a></li>
                <li><a href="#" className="text-base text-text-muted hover:text-primary transition duration-300">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block bg-primary text-white rounded-full p-1 mr-1">
                <span className="text-xl">🍽️</span>
              </span>
              <span className="text-xl font-extrabold text-text-primary">Cravely</span>
            </div>
            <p className="text-base text-text-muted text-center">
              &copy; 2025 Cravely. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}