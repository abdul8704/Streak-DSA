import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowRight, Key, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { forgotPassword, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleRequest = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        // Input can be username or email. detailed logic in backend.
        // But for step 2 we need EMAIL to match OTP.
        // The backend `forgotPassword` returns `{ message, email }` if success.
        // We should use that returned email for step 2.

        const result = await forgotPassword(email);
        setLoading(false);

        if (result.success) {
            setMessage(result.message);
            if (result.email) setEmail(result.email); // Ensure we have the email for next step
            setStep(2);
        } else {
            setError(result.message);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const result = await resetPassword(email, otp, newPassword);
        setLoading(false);

        if (result.success) {
            setMessage('Password reset successfully. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-background transition-colors duration-300">
            <div className="bg-card border border-border p-8 rounded-xl shadow-lg w-full max-w-md animate-fade-in-up">

                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                        <Key size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Reset Password</h2>
                    <p className="text-secondary text-sm">
                        {step === 1 ? "Enter your email or username to receive a reset code" : "Enter the code sent to your email"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 flex items-center">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-lg mb-6 flex items-center">
                        <span className="mr-2">✅</span> {message}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleRequest} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background border border-border text-text placeholder-secondary text-sm rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Email or Username"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Sending...' : (
                                <>Send Code <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <div>
                            <label className="text-xs text-secondary mb-1 block">Email</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full bg-background/50 border border-border text-secondary text-sm rounded-lg py-2.5 px-4 outline-none cursor-not-allowed"
                            />
                        </div>

                        <div className="relative">
                            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-background border border-border text-text placeholder-secondary text-sm rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Verification Code"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-background border border-border text-text placeholder-secondary text-sm rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="New Password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors shadow-md disabled:opacity-50"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-secondary hover:text-primary text-sm mt-2"
                        >
                            Back to request
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm text-secondary">
                    Remember your password?{' '}
                    <Link to="/login" className="text-primary hover:text-primary-hover font-medium hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
