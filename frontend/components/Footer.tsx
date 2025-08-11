import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Monitor, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ChevronUp,
  Send,
  Heart,
  Code,
  Zap,
  Globe,
  Shield,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    
    // Simulate newsletter subscription
    setTimeout(() => {
      toast({
        title: "Berhasil!",
        description: "Terima kasih telah berlangganan newsletter kami.",
      });
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Beranda", href: "/" },
    { name: "Artikel", href: "/" },
    { name: "Kategori", href: "/" },
    { name: "Tentang Kami", href: "/" },
  ];

  const categories = [
    { name: "Hardware", href: "/" },
    { name: "Software", href: "/" },
    { name: "Tips & Tricks", href: "/" },
    { name: "Review", href: "/" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-500" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-600" },
  ];

  const features = [
    { icon: Globe, text: "Konten Global" },
    { icon: Shield, text: "Terpercaya" },
    { icon: Award, text: "Berkualitas" },
    { icon: Zap, text: "Update Cepat" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Monitor className="h-10 w-10 text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                  <div className="absolute -inset-2 bg-blue-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    EndieTech
                  </span>
                  <span className="text-sm text-gray-400 -mt-1">
                    Technology Solutions
                  </span>
                </div>
              </Link>
              
              <p className="text-gray-300 leading-relaxed">
                Platform teknologi terdepan yang menyediakan artikel, tips, dan solusi teknologi terkini untuk membantu Anda mengikuti perkembangan dunia digital.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                      <div className="w-6 h-6 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-3 h-3 text-blue-400" />
                      </div>
                      <span>{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:shadow-lg`}
                      title={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                Navigasi Cepat
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <Code className="w-4 h-4 text-white" />
                </div>
                Kategori
              </h3>
              <ul className="space-y-3">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={category.href}
                      className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                    >
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Contact */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                Newsletter
              </h3>
              
              <p className="text-gray-300 text-sm">
                Dapatkan update artikel terbaru dan tips teknologi langsung di inbox Anda.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400 rounded-xl pr-12"
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {isSubscribing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Berlangganan...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Berlangganan</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Contact Info */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="font-semibold text-white">Kontak Kami</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>admin@endietech.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span>+62 123 456 789</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-red-400" />
                    <span>Jakarta, Indonesia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <span>© {currentYear} EndieTech. Dibuat dengan</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span>di Indonesia</span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <Link to="/" className="hover:text-blue-400 transition-colors duration-200">
                  Kebijakan Privasi
                </Link>
                <Link to="/" className="hover:text-blue-400 transition-colors duration-200">
                  Syarat & Ketentuan
                </Link>
                <Link to="/" className="hover:text-blue-400 transition-colors duration-200">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center group"
          title="Kembali ke atas"
        >
          <ChevronUp className="w-6 h-6 group-hover:animate-bounce" />
        </button>
      </div>
    </footer>
  );
}