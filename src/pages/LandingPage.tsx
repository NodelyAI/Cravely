import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  // Animation setup handled directly in motion components
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-white"
      >{/* Hero Section */}      <header className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-light">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.5" fill="white" fillOpacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">            <div className="flex items-center gap-3 relative z-10">              <img 
                src="/logo_512.png" 
                alt="Cravely Logo" 
                className="h-16 w-auto drop-shadow-lg hover:brightness-105 transition-all duration-300" 
                loading="eager"
                onError={(e) => {
                  console.error('Logo failed to load');
                  // If image fails, show text logo
                  e.currentTarget.style.display = 'none';
                  const container = e.currentTarget.parentElement;
                  if (container) {
                    const fallbackLogo = document.createElement('span');
                    fallbackLogo.className = "inline-flex items-center justify-center bg-white text-primary rounded-full p-2.5 mr-1 shadow-lg w-12 h-12";
                    fallbackLogo.innerHTML = '<span class="text-xl font-bold">C</span>';
                    container.appendChild(fallbackLogo);
                  }
                }}
              />
            </div>
            <div className="flex space-x-4 relative z-10">
              <Link to="/auth" className="bg-white text-primary hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-10 relative z-10"
          >
            <div className="absolute -top-6 -left-3 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-3 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight mb-8 leading-tight text-white drop-shadow-sm">
              Transform Your Restaurant Operations
            </h1>              <p className="text-white/90 text-xl max-w-3xl mb-12 leading-relaxed">
                Streamline your restaurant management with our comprehensive platform. From orders to menus, backed by AI-powered insights.
              </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/auth" className="inline-flex items-center justify-center py-4 px-8 shadow-lg text-base font-medium rounded-lg text-primary bg-white hover:bg-gray-50 focus:outline-none transition-all duration-300 group">
                <span>Get Started</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a href="#features" className="inline-flex items-center justify-center py-4 px-8 border border-white/30 shadow-md text-base font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none transition-all duration-300">
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
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-orange-200 rounded-full opacity-30 blur-xl"></div>
                {/* Main Image */}              <div className="bg-white p-3 rounded-2xl shadow-xl transform hover:scale-105 rotate-1 hover:rotate-0 transition-all duration-500">                <img 
                  src="/assets/images/landing_page_hero.png" 
                  alt="Cravely Dashboard Preview" 
                  onError={(e) => {
                    // Try fallback paths first
                    if (e.currentTarget.src.includes('/assets/images/landing_page_hero.png')) {
                      e.currentTarget.src = "/landing_page_hero.png";
                      return;
                    }

                    // If all image paths fail, use a placeholder
                    e.currentTarget.src = "https://placehold.co/800x500/FF7A00/fff?text=Cravely+Dashboard";
                    console.error("Dashboard preview image failed to load");
                  }}
                  loading="lazy"
                  className="rounded-xl w-full object-cover shadow-inner"
                />
              </div>
              
              {/* Floating UI Elements for decoration */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-10 -left-10 bg-white rounded-lg shadow-xl p-3.5 w-44 transform -rotate-3 hidden md:block"
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
                className="absolute -top-10 -right-6 bg-white rounded-lg shadow-xl p-3.5 transform rotate-6 hidden md:block"
              >
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary/10 p-1.5">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Revenue: $12,589</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
          {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none" aria-hidden="true">
            <path fill="#ffffff" fillOpacity="1" d="M0,32L60,42.7C120,53,240,75,360,69.3C480,64,600,32,720,32C840,32,960,64,1080,69.3C1200,75,1320,53,1380,42.7L1440,32L1440,120L0,120Z"></path>
          </svg>
        </div>
      </header>

      {/* Features Section */}      <section id="features" className="py-24 sm:py-32 bg-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute -left-32 top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -right-32 bottom-1/4 w-96 h-96 bg-orange-300/5 rounded-full blur-3xl"></div>
        <div className="absolute opacity-5 inset-0 overflow-hidden">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="diagonalLines" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="40" stroke="#FF7A00" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonalLines)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >              <div>
                <h2 className="text-base font-semibold text-primary tracking-wide uppercase">Features</h2>
                <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight leading-tight">
                  Everything you need to manage your restaurant
                </p>
                <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
                  Our platform provides comprehensive tools designed specifically for restaurant operations.
                </p>
              </div>
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
              >                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white border border-primary/10 shadow-lg">
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
            className="mt-24 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Featured
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Real-time Analytics Dashboard</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Make data-driven decisions with our comprehensive analytics dashboard. Monitor sales trends, popular menu items, peak hours, and more—all in real-time.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Revenue forecasting', 'Inventory optimization', 'Staff scheduling insights', 'Customer behavior patterns'].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="ml-3 text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/auth?demo=analytics" className="inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-300 group shadow-sm hover:shadow-md">
                  <span>Try demo dashboard</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative bg-gradient-to-br from-orange-50 to-amber-100 p-6 flex items-center justify-center overflow-hidden">
                {/* Abstract shapes in background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                
                <div className="relative w-full h-full max-h-96 overflow-hidden rounded-xl shadow-lg border-4 border-white">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light opacity-90 flex items-center justify-center">
                    <div className="text-center p-8">
                      <h3 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h3>
                      <div className="flex justify-center mb-6">
                        <div className="h-1 w-16 bg-white/50 rounded-full"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                          <div className="text-2xl font-bold text-white">$12,589</div>
                          <div className="text-xs text-white/80">Revenue this month</div>
                        </div>
                        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                          <div className="text-2xl font-bold text-white">+25%</div>
                          <div className="text-xs text-white/80">Orders vs last month</div>
                        </div>
                      </div>
                      <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                        <div className="h-2 w-2 rounded-full bg-green-300 mr-2 animate-pulse"></div>
                        <span>Live Data</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
        {/* Testimonials Section */}      <section className="bg-primary py-16 sm:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="wavy-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0,10 Q10,5 20,10 T40,10" fill="none" stroke="white" strokeWidth="1"/>
                <path d="M0,20 Q10,15 20,20 T40,20" fill="none" stroke="white" strokeWidth="1"/>
                <path d="M0,30 Q10,25 20,30 T40,30" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wavy-pattern)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-white/80 tracking-wide uppercase">TESTIMONIALS</h2>
            <p className="mt-1 text-4xl font-extrabold sm:text-5xl sm:tracking-tight text-white">
              Trusted by restaurants worldwide
            </p>
          </div>          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
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
                className="bg-white rounded-2xl p-8 shadow-lg flex flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                  <div className="mb-6">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg mb-6 flex-grow italic">"{testimonial.quote}"</p>
                  <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl font-bold text-primary mr-3">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{testimonial.author}</p>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>                  </div>
                </motion.div>
            ))}
          </div>
        </div>        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,0 C240,60 480,120 720,120 C960,120 1200,60 1440,0 L1440,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>{/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-primary-light rounded-3xl shadow-xl overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="restaurantPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="2" fill="white" />
                    <circle cx="40" cy="60" r="2" fill="white" />
                    <circle cx="70" cy="20" r="2" fill="white" />
                    <circle cx="90" cy="80" r="2" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#restaurantPattern)" />
              </svg>
            </div>
            
            <div className="px-8 py-14 sm:px-16 sm:py-20 lg:flex lg:items-center lg:justify-between relative z-10">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Ready to transform your restaurant?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-white/90">
                  Get started today and see the difference Cravely can make for your business.
                </p>
              </div>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow-lg">
                  <Link to="/auth" className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg text-primary bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md group">
                    <span>Get Started</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Features</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Pricing</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Integrations</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Documentation</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Guides</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">About</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Privacy</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Terms</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Cookies</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-primary transition-colors duration-300">Licenses</a></li>
              </ul>
            </div>
          </div>
            <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <img 
                  src="/assets/logo/logo_128.png" 
                  alt="Cravely" 
                  className="w-10 h-10"
                  onError={(e) => {
                    // Try fallback path
                    if (e.currentTarget.src.includes('/assets/logo/logo_128.png')) {
                      e.currentTarget.src = "/logo_128.png";
                      return;
                    }
                    
                    // If fallback fails, use text logo
                    e.currentTarget.style.display = 'none';
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      const fallbackLogo = document.createElement('span');
                      fallbackLogo.className = "inline-flex items-center justify-center bg-primary text-white rounded-full p-2 mr-1.5 shadow-md w-10 h-10";
                      fallbackLogo.innerHTML = '<span class="text-xl font-bold">C</span>';
                      container.appendChild(fallbackLogo);
                    }
                  }}
                />
                <span className="text-xl font-extrabold text-gray-800">Cravely</span>
              </div>
              
              <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Cravely. All rights reserved.
              </p>
              
              <div className="flex space-x-6 mt-4 md:mt-0">                  <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </a>                  <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span className="sr-only">GitHub</span>
                  </a>                  <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.32 35.32 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                    </svg>
                    <span className="sr-only">Instagram</span>                  </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </motion.div>
    </AnimatePresence>
  );
}