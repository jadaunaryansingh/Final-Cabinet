import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Safety', href: '/safety' },
    { name: 'Support', href: '/support' },
    { name: 'Careers', href: '/careers' }
  ];

  const services = [
    { name: 'Cab Booking', href: '/booking' },
    { name: 'Airport Rides', href: '/airport' },
    { name: 'Corporate', href: '/corporate' },
    { name: 'Rental', href: '/rental' }
  ];

  const upcomingFeatures = [
    { name: 'Digital Wallet', icon: '💳', status: 'Coming Soon' },
    { name: 'Loyalty Rewards', icon: '🎁', status: 'Beta' },
    { name: 'Green Cabs', icon: '🌱', status: 'Q2 2024' },
    { name: 'Smart Routes', icon: '🧠', status: 'Live' }
  ];

  return (
    <footer className="relative mt-16 pt-16 pb-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-80 h-80 bg-cabinet-yellow/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 right-1/4 w-60 h-60 bg-cabinet-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upcoming Features Ribbon */}
        <div className="mb-12">
          <div className="text-center space-y-4 mb-8">
            <h3 className="text-2xl font-cabinet font-bold text-white">Upcoming Features</h3>
            <p className="text-cabinet-grey">Exciting new features coming to enhance your ride experience</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {upcomingFeatures.map((feature, index) => (
              <div
                key={feature.name}
                className="glass-morphism rounded-2xl p-4 text-center border border-cabinet-yellow/10 hover:border-cabinet-yellow/30 transition-all duration-300 group hover:scale-105"
              >
                <div className="text-3xl mb-2 group-hover:animate-bounce">{feature.icon}</div>
                <div className="text-white font-medium text-sm mb-1">{feature.name}</div>
                <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                  feature.status === 'Live' 
                    ? 'bg-green-500/20 text-green-400' 
                    : feature.status === 'Beta'
                    ? 'bg-cabinet-yellow/20 text-cabinet-yellow'
                    : 'bg-cabinet-grey/20 text-cabinet-grey'
                }`}>
                  {feature.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Divider */}
        <div className="relative mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-cabinet-yellow to-transparent"></div>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cabinet-yellow rounded-full animate-pulse"></div>
        </div>

        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          
          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 gradient-gold rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">🐝</span>
                </div>
                <span className="text-white font-bold text-xl">CAB-I-NET</span>
              </div>
              <p className="text-cabinet-grey text-sm leading-relaxed">
                Premium cab services with luxury, comfort, and reliability. Your journey, our commitment.
              </p>
            </div>

            <div className="glass-morphism rounded-2xl p-4 border border-cabinet-yellow/20 space-y-3">
              <h4 className="text-white font-cabinet font-semibold mb-3">Contact Details</h4>
              
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-cabinet-yellow" />
                <span className="text-cabinet-grey">+91 9876543210</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-cabinet-yellow" />
                <span className="text-cabinet-grey">support@cab-i-net.com</span>
              </div>
              
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-cabinet-yellow mt-0.5" />
                <span className="text-cabinet-grey">
                  123 Business Park, Tech City<br />
                  Bangalore, Karnataka 560001
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-cabinet font-semibold">Quick Links</h4>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-cabinet-grey hover:text-cabinet-light-yellow transition-colors duration-300 text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white font-cabinet font-semibold">Our Services</h4>
            <div className="space-y-2">
              {services.map((service) => (
                <a
                  key={service.name}
                  href={service.href}
                  className="block text-cabinet-grey hover:text-cabinet-light-yellow transition-colors duration-300 text-sm"
                >
                  {service.name}
                </a>
              ))}
            </div>
          </div>

          {/* Social & Newsletter */}
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-cabinet font-semibold mb-4">Stay Connected</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 glass-morphism rounded-xl border border-cabinet-yellow/20 flex items-center justify-center text-cabinet-yellow hover:bg-cabinet-yellow hover:text-black transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-morphism rounded-2xl p-4 border border-cabinet-yellow/20">
              <h5 className="text-white font-medium mb-3">Newsletter</h5>
              <p className="text-cabinet-grey text-sm mb-3">Get updates on new features and offers</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 glass-morphism rounded-xl border border-cabinet-yellow/30 text-white placeholder-cabinet-grey text-sm focus:border-cabinet-yellow focus:outline-none"
                />
                <button className="w-full bg-gradient-gold text-black py-2 rounded-xl font-medium text-sm hover:scale-105 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-cabinet-yellow/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-cabinet-grey text-sm">
              © 2024 CAB-I-NET. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-cabinet-grey hover:text-cabinet-light-yellow transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-cabinet-grey hover:text-cabinet-light-yellow transition-colors duration-300">
                Terms of Service
              </a>
              <a href="/cookies" className="text-cabinet-grey hover:text-cabinet-light-yellow transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Luxury Brand Statement */}
          <div className="text-center mt-8 pt-6 border-t border-cabinet-yellow/10">
            <p className="text-cabinet-yellow font-cabinet font-medium italic">
              "Redefining luxury transportation, one ride at a time"
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
