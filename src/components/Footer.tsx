
const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">AirCover</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Anti-discrimination</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Disability support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Hosting</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Wanderly your home</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">HostCover for Hosts</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Hosting resources</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Community forum</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Wanderly</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Newsroom</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">New features</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Investors</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2024 Wanderly, Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
