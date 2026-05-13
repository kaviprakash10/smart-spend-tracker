import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { loginUser, loginWithOTP, setToken, reset } from "../store/authSlice";
import { toast } from "react-toastify";
import { Mail, Lock, Smartphone, ShieldCheck } from "lucide-react";
import axios from "axios";

const Signin = () => {
  const [loginMode, setLoginMode] = useState("password"); // 'password', 'sms', 'email'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
  });

  const [otp, setOtp] = useState("");
  const [showOTPField, setShowOTPField] = useState(false);
  const [otpType, setOtpType] = useState(""); // 'email' or 'phone'

  const { email, password, phone } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    const token = searchParams.get("token");
    const errorMsg = searchParams.get("error");
    if (token) {
      dispatch(setToken(token));
      toast.success("Logged in with Google!");
      navigate("/");
    }
    if (errorMsg) {
      toast.error(errorMsg);
      // Clear the query params from the URL
      navigate("/signin", { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate("/");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(loginUser(userData));
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:5050/api/auth/google";
  };

  const requestOTP = async (type) => {
    if (type === "email" && !email) {
      toast.warning("Please enter your email to request an Email OTP");
      return;
    }
    if (type === "phone" && !email && !phone) {
      toast.warning("Please enter your email or phone number to request an SMS OTP");
      return;
    }

    try {
      const data = type === "email" ? { email } : (email ? { email } : { phone });
      await axios.post(`http://localhost:5050/api/auth/${type}-otp`, data);
      toast.success("OTP Sent! Check your device.");
      setOtpType(type);
      setShowOTPField(true);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to send ${type} OTP`);
    }
  };

  const handleOTPVerify = (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the verification code");
      return;
    }
    const data = otpType === "email" ? { email, otp, type: otpType } : (email ? { email, otp, type: otpType } : { phone, otp, type: otpType });
    dispatch(loginWithOTP(data));
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-gray-50 selection:bg-indigo-500 selection:text-white">
      {/* Left side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 bg-white relative z-10 shadow-2xl">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-3 text-gray-500 text-lg">
              Log in to resume mastering your expenses.
            </p>
          </div>

          <div className="space-y-8">
            {!showOTPField && (
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setLoginMode("password")}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${loginMode === "password" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  Password
                </button>
                <button
                  onClick={() => setLoginMode("sms")}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${loginMode === "sms" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  SMS OTP
                </button>
                <button
                  onClick={() => setLoginMode("email")}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${loginMode === "email" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  Gmail OTP
                </button>
              </div>
            )}

            {/* 1. Login using Password */}
            {!showOTPField && loginMode === "password" && (
              <section className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                  <Lock className="w-5 h-5" />
                  <h3 className="font-bold">Login with Password</h3>
                </div>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none placeholder-gray-400 sm:text-sm shadow-sm"
                      placeholder="Email address"
                      value={email}
                      onChange={onChange}
                    />
                  </div>
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none placeholder-gray-400 sm:text-sm shadow-sm hover:shadow-md"
                      placeholder="Password"
                      value={password}
                      onChange={onChange}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-4 px-4 font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 shadow-lg"
                  >
                    {isLoading ? "Authenticating..." : "Log In"}
                  </button>
                </form>
              </section>
            )}

            {/* 2. Login with SMS */}
            {!showOTPField && loginMode === "sms" && (
              <section className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                  <Smartphone className="w-5 h-5" />
                  <h3 className="font-bold">Login with SMS</h3>
                </div>
                <div className="space-y-4">
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none placeholder-gray-400 sm:text-sm shadow-sm"
                      placeholder="Account Email"
                      value={email}
                      onChange={onChange}
                    />
                  </div>
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none placeholder-gray-400 sm:text-sm shadow-sm"
                      placeholder="Phone Number (+91...)"
                      value={phone}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <button
                  onClick={() => requestOTP("phone")}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-4 px-4 font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 shadow-lg"
                >
                  {isLoading ? "Sending..." : "Send SMS OTP"}
                </button>
              </section>
            )}

            {/* 3. Login with Gmail (Email OTP) */}
            {!showOTPField && loginMode === "email" && (
              <section className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                  <Mail className="w-5 h-5" />
                  <h3 className="font-bold">Login with Gmail OTP</h3>
                </div>
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none placeholder-gray-400 sm:text-sm shadow-sm"
                    placeholder="Username / Email"
                    value={email}
                    onChange={onChange}
                  />
                </div>
                <button
                  onClick={() => requestOTP("email")}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-4 px-4 font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 shadow-lg"
                >
                  {isLoading ? "Sending..." : "Send Gmail OTP"}
                </button>
              </section>
            )}

            {/* Google Auth (always visible below modes) */}
            {!showOTPField && (
              <section className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-4 bg-white text-gray-400 font-bold">Or</span>
                  </div>
                </div>
                <button
                  onClick={handleGoogleAuth}
                  className="w-full flex justify-center items-center py-4 px-4 border border-gray-200 rounded-2xl shadow-sm bg-white text-[15px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </section>
            )}

            {/* Verification Field (visible only after OTP request) */}
            {showOTPField && (
              <section className="space-y-6 animate-fade-in-up">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                    <ShieldCheck className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Verify OTP</h3>
                  <p className="text-gray-500 mt-1">
                    Sent via {otpType === "email" ? "Email" : "SMS"} to{" "}
                    <span className="font-bold text-gray-900">
                      {otpType === "email" ? email : (email ? `email: ${email}` : `phone: ${phone}`)}
                    </span>
                  </p>
                </div>
                <form className="space-y-6" onSubmit={handleOTPVerify}>
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <input
                      name="otp"
                      type="text"
                      required
                      maxLength={6}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none placeholder-gray-400 sm:text-sm shadow-sm tracking-[0.5em] text-center"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-4 px-4 font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 shadow-lg"
                  >
                    {isLoading ? "Verifying..." : "Verify & Sign In"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOTPField(false);
                      setOtp("");
                    }}
                    className="w-full text-center text-sm font-bold text-indigo-600 hover:text-indigo-500"
                  >
                    Back to login options
                  </button>
                </form>
              </section>
            )}
          </div>

          <p className="mt-8 text-center text-[15px] font-medium text-gray-600">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
            >
              Join free today
            </Link>
          </p>
        </div>
      </div>

      {/* Right side content (Abstract Art) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black justify-center items-center">
        {/* Soft elegant glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[130px] animate-pulse-slow"></div>
          <div className="absolute bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] animate-pulse-slow-delayed"></div>
        </div>

        <div className="relative z-10 p-16 max-w-lg text-white animate-slide-in-right">
          <div className="mb-10 inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 shadow-2xl animate-float">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Secure Portal
              </p>
              <p className="text-sm font-medium text-white">
                Encrypted Session
              </p>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-6 text-white leading-tight">
            "Budgeting has only one rule: do not go over budget."
          </h2>
          <p className="text-xl text-gray-400 font-light italic">
            — Let ExpenseMaster do the computing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
