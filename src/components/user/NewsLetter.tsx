import { useState } from "react";
import COLORS from "../../styles/theme";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement newsletter subscription logic here
    console.log("Subscribing email:", email);
    // Reset form after submission
    setEmail("");
    // Show success message or notification
  };

  return (
    <section className="mb-12">
      <div style={{ backgroundColor: COLORS.accent }} className="rounded-lg p-6 text-center">
        <h2 style={{ color: COLORS.cardBg }} className="text-2xl font-semibold mb-3">Get Travel Inspiration</h2>
        <p style={{ color: COLORS.inputBg }} className="mb-4">
          Subscribe to our newsletter for the latest travel guides, tips, and exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
            className="w-full rounded-lg p-3 mb-3 sm:mb-0 sm:mr-3 focus:outline-none focus:ring-2"
            required
          />
          <button
            type="submit"
            style={{ backgroundColor: COLORS.cardBg, color: COLORS.accent }}
            className="rounded-lg px-6 py-3 font-medium"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}