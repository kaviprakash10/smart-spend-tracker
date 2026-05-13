import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, reset } from "../store/authSlice";
import { toast } from "react-toastify";
import { Mail, Lock, User, Phone, ArrowRight, Shield, Zap, ShieldCheck, Loader2 } from "lucide-react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [otp, setOtp] = useState("");
  const [showOTPField, setShowOTPField] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  const { name, email, password, phone } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

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
    if (!isPhoneVerified) {
      toast.error("Please verify your phone number first");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const userData = { name, email, password, phone };
    dispatch(registerUser(userData));
  };

  const requestSignupOTP = async () => {
    if (!phone) {
      toast.warning("Please enter your phone number first");
      return;
    }
    setIsSendingOTP(true);
    try {
      await axios.post("http://localhost:5050/api/auth/send-signup-otp", { phone });
      toast.success("OTP Sent! Check your phone.");
      setShowOTPField(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifySignupOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    setIsVerifyingOTP(true);
    try {
      await axios.post("http://localhost:5050/api/auth/verify-signup-otp", { phone, otp });
      toast.success("Phone verified successfully!");
      setIsPhoneVerified(true);
      setShowOTPField(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:5050/api/auth/google";
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-[#0f172a] selection:bg-indigo-500 selection:text-white">
      {/* Left side content (Image/Abstract) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-[#1e1b4b] to-purple-900 justify-center items-center">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[100px]"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] rounded-full bg-pink-600/10 blur-[120px]"></div>
        </div>

        <div className="relative z-10 p-16 max-w-2xl text-white">
          <div className="mb-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full font-medium text-sm text-indigo-200 border border-white/10">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>Join ExpenseMaster</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Unlock absolute control over your finances.
          </h1>
          <p className="text-xl text-indigo-200/80 mb-12 leading-relaxed">
            Experience the most powerful, beautiful way to track expenses.
            Designed for individuals who demand both functionality and
            aesthetics.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-400/20 backdrop-blur-md">
                <Shield className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Bank-level encryption
                </h3>
                <p className="text-sm text-indigo-200/70">
                  Your data is secured with AES-256 standard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-400/20 backdrop-blur-md">
                <Zap className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Lightning fast inputs
                </h3>
                <p className="text-sm text-purple-200/70">
                  Add expenses and incomes in absolute seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Create an account
            </h2>
            <p className="mt-3 text-gray-500 text-lg">
              Start managing your wealth smarter today.
            </p>
          </div>

          <form className="mt-10 space-y-6" onSubmit={onSubmit}>
            <div className="space-y-5">
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none placeholder-gray-400 sm:text-sm shadow-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={onChange}
                />
              </div>
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
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  required
                  readOnly={isPhoneVerified}
                  className={`w-full pl-12 ${isPhoneVerified ? "pr-12 bg-green-50" : "pr-24 bg-gray-50"} py-4 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none placeholder-gray-400 sm:text-sm shadow-sm`}
                  placeholder="Phone Number"
                  value={phone}
                  onChange={onChange}
                />
                {!isPhoneVerified && !showOTPField && (
                  <button
                    type="button"
                    onClick={requestSignupOTP}
                    disabled={isSendingOTP || !phone}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    {isSendingOTP ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Verify"}
                  </button>
                )}
                {isPhoneVerified && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              {showOTPField && !isPhoneVerified && (
                <div className="group relative animate-fade-in-up">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <input
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    className="w-full pl-12 pr-24 py-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none placeholder-gray-400 sm:text-sm shadow-sm tracking-[0.3em]"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={verifySignupOTP}
                    disabled={isVerifyingOTP || otp.length < 6}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {isVerifyingOTP ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Verify Code"}
                  </button>
                </div>
              )}
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 outline-none placeholder-gray-400 sm:text-sm shadow-sm"
                  placeholder="Create a Secure Password"
                  value={password}
                  onChange={onChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-4 font-bold rounded-2xl text-white bg-gray-900 hover:bg-indigo-600 focus:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 text-[15px]"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleGoogleAuth}
                className="w-full flex justify-center items-center py-4 px-4 border border-gray-200 rounded-2xl shadow-sm bg-white text-[15px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-300 hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Sign up with Google
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-[15px] font-medium text-gray-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
            >
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
