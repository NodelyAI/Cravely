import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-[#FF7A00] to-[#FFA149]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="small-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#small-grid)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 relative z-10">
              <span className="inline-flex items-center justify-center bg-white text-[#FF7A00] rounded-full p-1.5 mr-1 shadow-md">
                <span className="text-xl font-bold">C</span>
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-white">Cravely</span>
            </div>
            <div className="flex space-x-4 relative z-10">
              <Link to="/auth" className="bg-white text-[#FF7A00] hover:bg-opacity-95 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md">
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-10 relative z-10"
          >
            <div className="absolute -top-6 -left-3 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-3 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight text-white drop-shadow-sm">
              Transform Your Restaurant Operations
            </h1>
            <p className="text-white/90 text-xl max-w-3xl mb-10 leading-relaxed">
              Streamline your restaurant management with our comprehensive platform. From orders to menus, backed by AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/auth" className="inline-flex items-center justify-center py-3.5 px-8 shadow-lg text-base font-medium rounded-lg text-[#FF7A00] bg-white hover:bg-gray-50 focus:outline-none transition-all duration-300 group">
                <span>Get Started</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a href="#features" className="inline-flex items-center justify-center py-3.5 px-8 border border-white/30 shadow-sm text-base font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none transition-all duration-300">
                Learn More
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2 relative z-10"
          >
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-300 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-300 rounded-full opacity-20 blur-xl"></div>
              
              {/* Main Image */}
              <div className="bg-white p-2 rounded-2xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/src/assets/dashboard_preview.jpg" 
                  alt="Cravely Dashboard Preview" 
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/FFB74D/fff?text=Cravely+Dashboard";
                  }}
                  className="rounded-xl w-full object-cover shadow-inner"
                />
              </div>
              
              {/* Floating UI Elements for decoration */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-10 -left-10 bg-white rounded-lg shadow-xl p-3 w-40 transform -rotate-3 hidden md:block"
              >
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-2 mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Orders Up 25%</p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -top-8 -right-6 bg-white rounded-lg shadow-xl p-3 transform rotate-6 hidden md:block"
              >
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-[#FF7A00]/10 p-1">
                    <svg className="w-4 h-4 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium">Revenue: $12,589</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,32L60,42.7C120,53,240,75,360,69.3C480,64,600,32,720,32C840,32,960,64,1080,69.3C1200,75,1320,53,1380,42.7L1440,32L1440,120L0,120Z"></path>
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute -left-32 top-1/4 w-64 h-64 bg-[#FF7A00]/5 rounded-full blur-3xl"></div>
        <div className="absolute -right-32 bottom-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-base font-semibold text-[#FF7A00] tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                Everything you need to manage your restaurant
              </p>
              <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
                Our platform provides comprehensive tools designed specifically for restaurant operations.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {[
              {
                title: "Menu Management",
                description: "Easily create, update, and organize your menu items with a user-friendly interface. Drag-and-drop editor with real-time preview.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )
              },
              {
                title: "Order Tracking",
                description: "Real-time order management with status updates and preparation time estimates. Keep your kitchen organized and customers informed.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              {
                title: "Table Management",
                description: "Interactive restaurant layout with real-time table status indicators. Optimize seating arrangements and improve turnover rates.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "AI Assistance",
                description: "Get intelligent insights and recommendations to optimize your operations. Our AI analyzes patterns to help you make data-driven decisions.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Customer Insights",
                description: "Understand your customers better with detailed analytics and preferences tracking. Build loyalty and increase repeat business.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Payment Processing",
                description: "Secure payment processing with multiple payment options and split bill capabilities. Integrated directly with your POS system.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-white border border-gray-100 shadow-sm text-[#FF7A00]">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Feature Highlight */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-24 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FF7A00]/10 text-[#FF7A00] mb-4">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Featured
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time Analytics Dashboard</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Make data-driven decisions with our comprehensive analytics dashboard. Monitor sales trends, popular menu items, peak hours, and more—all in real-time.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Revenue forecasting', 'Inventory optimization', 'Staff scheduling insights', 'Customer behavior patterns'].map((item, i) => (
                    <li key={i} className="flex">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/auth?demo=analytics" className="text-[#FF7A00] font-medium hover:text-[#FF7A00]/80 inline-flex items-center group">
                  Try demo dashboard
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="bg-gray-100 p-6 flex items-center justify-center">
                <div className="relative w-full h-full max-h-80 overflow-hidden rounded-lg shadow-inner">
                  <img 
                    src="https://placehold.co/800x600/FFB74D/fff?text=Analytics+Dashboard" 
                    alt="Analytics Dashboard" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex flex-col justify-end p-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 inline-block w-auto self-end shadow-lg">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-xs font-semibold text-gray-800">Live Data</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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