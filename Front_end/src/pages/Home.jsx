import { Link } from "react-router-dom";
import { ArrowRight, PieChart, ShieldCheck, Zap } from "lucide-react";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full px-6 py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center text-center min-h-[85vh]">
        <div className="max-w-4xl space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium text-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>Your Personal Finance Companion</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Take Control of Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Financial Future
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Track expenses effortlessly, set smart budgets, and gain deep
            insights into your spending habits. Join thousands of users managing
            their wealth smarter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-8">
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold text-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition transform flex items-center shadow-lg shadow-indigo-200"
              >
                Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold text-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition transform flex justify-center items-center shadow-lg shadow-indigo-200"
                >
                  Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-full font-semibold text-lg hover:bg-gray-50 hover:border-gray-300 transition flex justify-center items-center"
                >
                  Learn More
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why choose ExpenseMaster?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to manage your money in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <PieChart className="w-8 h-8 text-indigo-500" />,
                title: "Visual Analytics",
                description:
                  "See exactly where your money goes with beautiful, interactive charts and customizable reports.",
              },
              {
                icon: <Zap className="w-8 h-8 text-amber-500" />,
                title: "Lightning Fast",
                description:
                  "Add expenses in seconds. Our intuitive interface is designed to get out of your way.",
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
                title: "Bank-Grade Security",
                description:
                  "Your data is fully encrypted and securely stored. We never sell your personal financial data.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition"
              >
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
