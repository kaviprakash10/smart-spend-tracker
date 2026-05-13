import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully (Demo)");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-[95vh] relative flex items-center justify-center p-4 sm:p-8 bg-gray-50 overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-200/50 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-purple-200/40 blur-[120px]"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col lg:flex-row">
        {/* Contact Information Side */}
        <div className="lg:w-5/12 relative overflow-hidden bg-gray-900 text-white p-12 lg:p-16 flex flex-col shadow-inner">
          {/* Dark gradient overlap */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#1e1b4b] to-[#312e81] opacity-90"></div>

          <div className="relative z-10 flex flex-col h-full animate-slide-in-left">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full font-medium text-sm text-indigo-200 border border-white/10 w-max mb-8 backdrop-blur-md animate-float">
              <MessageSquare className="w-4 h-4" />
              <span>Contact Us</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Let's talk about tracking.
            </h2>

            <p className="text-indigo-200/80 mb-16 text-lg leading-relaxed font-light font-sans max-w-sm">
              Whether you have a question about features, pricing, or anything
              else, our team is ready to answer all your questions.
            </p>

            <div className="space-y-10 mt-auto">
              <div className="flex items-start space-x-6 group">
                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-400/20 backdrop-blur-md group-hover:bg-indigo-500/20 transition-all duration-300 shadow-sm">
                  <Phone className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-indigo-200/60 uppercase tracking-widest mb-1">
                    Phone
                  </p>
                  <p className="text-xl font-bold text-white">
                    +1 (800) 123-4567
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-400/20 backdrop-blur-md group-hover:bg-purple-500/20 transition-all duration-300 shadow-sm">
                  <Mail className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-indigo-200/60 uppercase tracking-widest mb-1">
                    Email
                  </p>
                  <p className="text-xl font-bold text-white">
                    support@expensemaster.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="p-4 bg-pink-500/10 rounded-2xl border border-pink-400/20 backdrop-blur-md group-hover:bg-pink-500/20 transition-all duration-300 shadow-sm">
                  <MapPin className="w-6 h-6 text-pink-300" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-indigo-200/60 uppercase tracking-widest mb-1">
                    Headquarters
                  </p>
                  <p className="text-xl font-bold font-sans text-white leading-snug">
                    123 Financial District <br /> New York, NY 10004
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Side */}
        <div className="lg:w-7/12 p-12 lg:p-16 flex flex-col justify-center animate-fade-in-up">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-2">
            Send us a message
          </h3>
          <p className="text-gray-500 mb-10 text-lg">
            We typically reply within a few hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 opacity-0 animate-fade-in-up animation-delay-200">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-none text-gray-900 font-medium placeholder-gray-400 shadow-sm hover:shadow-md"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-3 opacity-0 animate-fade-in-up animation-delay-300">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-none text-gray-900 font-medium placeholder-gray-400 shadow-sm hover:shadow-md"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-3 opacity-0 animate-fade-in-up animation-delay-400">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Message
              </label>
              <textarea
                rows="5"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                className="w-full px-5 py-4 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-none text-gray-900 font-medium placeholder-gray-400 resize-none shadow-sm hover:shadow-md"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>

            <div className="pt-2 opacity-0 animate-fade-in-up animation-delay-500">
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-indigo-600 focus:bg-indigo-600 text-white font-bold py-5 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 focus:ring-4 focus:ring-indigo-500/30 outline-none text-lg"
              >
                <span>Send Message directly</span>
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
