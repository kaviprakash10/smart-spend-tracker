const About = () => {
  return (
    <div className="bg-white px-6 py-24 min-h-[90vh] flex items-center justify-center">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-sm uppercase tracking-widest text-indigo-600 font-bold mb-4">
          About Us
        </h2>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-8">
          Simplifying Financial Growth <br /> for Everyone.
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
          We built ExpenseMaster to help individuals regain control over their
          finances. By offering intuitive design and powerful tracking
          capabilities, we believe everyone can achieve financial freedom. No
          more complicated spreadsheets or confusing bank interfaces.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
          <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
            <h3 className="text-indigo-900 font-bold text-lg mb-2">
              Our Mission
            </h3>
            <p className="text-indigo-700">
              Democratize personal finance and bring enterprise-level tracking
              to regular people.
            </p>
          </div>
          <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
            <h3 className="text-indigo-900 font-bold text-lg mb-2">
              Our Vision
            </h3>
            <p className="text-indigo-700">
              A world where financial stress is minimized through clear,
              actionable data insights.
            </p>
          </div>
          <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
            <h3 className="text-indigo-900 font-bold text-lg mb-2">
              Our Values
            </h3>
            <p className="text-indigo-700">
              Transparency, security, simplicity, and putting the user's peace
              of mind first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
