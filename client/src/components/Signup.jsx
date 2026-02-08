import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: ''
    });
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { initiateSignup, verifySignup, login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleInitiate = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await initiateSignup(formData.username, formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            setStep(2);
        } else {
            setError(result.message);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await verifySignup(formData.username, formData.email, formData.password, formData.otp);

        if (result.success) {
            // Auto login after verification
            const loginResult = await login(formData.username, formData.password);
            if (loginResult.success) {
                navigate('/profile');
            } else {
                // If login fails but verification succeeded, send to login page
                navigate('/login');
            }
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-background transition-colors duration-300">
            <div className="bg-card border border-border p-8 rounded-xl shadow-lg w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary mb-2">Create Account</h2>
                    <p className="text-secondary text-sm">Join the community and track your progress</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 flex items-center">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleInitiate} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-background border border-border text-text placeholder-secondary text-sm rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-background border border-border text-text placeholder-secondary text-sm rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-background border border-border text-text placeholder-secondary text-sm rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-background border border-border text-text placeholder-secondary text-sm rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : (
                                <>Verify Email <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="text-center mb-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-2">
                                <Mail size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-text">Verify your Email</h3>
                            <p className="text-xs text-secondary mt-1">
                                We sent a verification code to <span className="font-medium text-text">{formData.email}</span>
                            </p>
                        </div>

                        <div className="relative">
                            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter verification code"
                                value={formData.otp}
                                onChange={handleChange}
                                className="w-full bg-background border border-border text-text placeholder-secondary text-sm rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Create Account'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-secondary hover:text-primary text-sm mt-2"
                        >
                            Back to details
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:text-primary-hover font-medium hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
