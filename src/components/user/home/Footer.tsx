import COLORS from "../../../styles/theme";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }} className="border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h2 style={{ color: COLORS.accent }} className="text-xl font-bold mb-4">Travel Guide</h2>
            <p style={{ color: COLORS.secondaryText }} className="max-w-xs">
              Your companion for discovering the world's most breathtaking destinations and creating unforgettable memories.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 style={{ color: COLORS.text }} className="font-semibold mb-3">Company</h3>
              <ul style={{ color: COLORS.secondaryText }} className="space-y-2">
                <li><a href="#" className="hover:text-accent">About Us</a></li>
                <li><a href="#" className="hover:text-accent">Careers</a></li>
                <li><a href="#" className="hover:text-accent">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ color: COLORS.text }} className="font-semibold mb-3">Resources</h3>
              <ul style={{ color: COLORS.secondaryText }} className="space-y-2">
                <li><a href="#" className="hover:text-accent">Travel Guides</a></li>
                <li><a href="#" className="hover:text-accent">Blog</a></li>
                <li><a href="#" className="hover:text-accent">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ color: COLORS.text }} className="font-semibold mb-3">Legal</h3>
              <ul style={{ color: COLORS.secondaryText }} className="space-y-2">
                <li><a href="#" className="hover:text-accent">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6" style={{ borderColor: COLORS.border }}>
          <p style={{ color: COLORS.secondaryText }} className="text-center">
            © {new Date().getFullYear()} Travel Guide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}