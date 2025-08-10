import { Link } from "react-router-dom";
import { Monitor, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Github, Heart, Code, Cpu, Lightbulb, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Beranda", href: "/" },
    { name: "Artikel Terbaru", href: "/#articles" },
    { name: "Kategori", href: "/#categories" },
    { name: "Tentang Kami", href: "/about" },
  ];

  const categories = [
    { name: "Hardware", href: "/?category=hardware", icon: Cpu },
    { name: "Software", href: "/?category=software", icon: Code },
    { name: "Tips & Tricks", href: "/?category=tips", icon: Lightbulb },
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook, color: "hover:text-blue-600" },
    { name: "Twitter", href: "#", icon: Twitter, color: "hover:text-blue-400" },
    { name: "Instagram", href: "#", icon: Instagram, color: "hover:text-pink-600" },
    { name: "YouTube", href: "#", icon: Youtube, color: "hover:text-red-600" },
    { name: "GitHub", href: "#", icon: Github, color: "hover:text-gray-900 dark:hover:text-white" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3Ccircle cx="27" cy="7" r="1"/%3E%3Ccircle cx="47" cy="7" r="1"/%3E%3Ccircle cx="7" cy="27" r="1"/%3E%3Ccircle cx="27" cy="27" r="1"/%3E%3Ccircle cx="47" cy="27" r="1"/%3E%3Ccircle cx="7" cy="47" r="1"/%3E%3Ccircle cx="27" cy="47" r="1"/%3E%3Ccircle cx="47" cy="47" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-600/10 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-gray-700/50 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-12 lg:py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dapatkan Update Terbaru
              </h3>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Berlangganan newsletter kami untuk mendapatkan artikel teknologi terbaru, tips, dan insight langsung ke email Anda.
              </p>
              
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/50 rounded-xl backdrop-blur-sm"
                    required
                  />
                  <Button
                    type="submit"
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                  >
                    Berlangganan
                  </Button>
                </form>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-green-400 text-lg">
                  <Heart className="w-5 h-5 fill-current" />
                  <span>Terima kasih! Anda telah berlangganan.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
                <div className="relative">
                  <Monitor className="h-10 w-10 text-blue-400 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute -inset-2 bg-blue-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    EndieTech
                  </span>
                  <p className="text-sm text-gray-400 -mt-1">Technology Solutions</p>
                </div>
              </Link>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Platform teknologi terdepan yang menyediakan solusi inovatif, panduan lengkap, dan wawasan mendalam untuk dunia digital modern.
              </p>
              
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`w-10 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-gray-700/50 hover:scale-110 hover:shadow-lg backdrop-blur-sm`}
                      title={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Navigasi Cepat</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                    >
                      <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Kategori</h4>
              <ul className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <li key={category.name}>
                      <Link
                        to={category.href}
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-3 group"
                      >
                        <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center group-hover:bg-blue-600/20 transition-colors duration-200">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{category.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Kontak</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Email</p>
                    <a href="mailto:admin@endietech.com" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                      admin@endietech.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Telepon</p>
                    <a href="tel:+6281234567890" className="text-green-400 hover:text-green-300 transition-colors duration-200">
                      +62 812-3456-7890
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Lokasi</p>
                    <p className="text-gray-400">Jakarta, Indonesia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <p>© {currentYear} EndieTech. Semua hak dilindungi.</p>
                <span className="hidden md:inline">•</span>
                <p className="hidden md:inline">Dibuat dengan</p>
                <Heart className="w-4 h-4 text-red-500 fill-current hidden md:inline" />
                <p className="hidden md:inline">di Indonesia</p>
              </div>
              
              <div className="flex items-center space-x-6">
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Kebijakan Privasi
                </Link>
                <Link to="/terms" className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  Syarat & Ketentuan
                </Link>
                <Button
                  onClick={scrollToTop}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-blue-400 hover:bg-blue-600/10 rounded-xl transition-all duration-300"
                >
                  <ArrowUp className="w-4 h-4 mr-1" />
                  Ke Atas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}