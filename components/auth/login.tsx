import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';

// Mocking the Language Context for standalone functionality
// In your real app, this would come from your actual context file
const useLanguage = () => {
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'auth_login_welcome': 'Welcome back to CalmCare',
      'auth_login_subtitle': 'Enter your credentials to access your wellness dashboard.',
      'auth_login_email_label': 'Email Address',
      'auth_login_email_placeholder': 'name@hospital.org',
      'auth_login_password_label': 'Password',
      'auth_login_password_placeholder': '••••••••',
      'auth_login_forgot': 'Forgot password?',
      'auth_login_button': 'Sign In',
      'auth_login_or': 'OR CONTINUE WITH',
      'auth_login_google': 'Google Workspace',
      'auth_login_no_account': "Don't have an account?",
      'auth_login_signup_link': 'Request Access',
      'auth_login_error': 'Please enter both email and password.',
    };
    return translations[key] || key;
  };
  return { t };
};

interface LoginProps {
  onLoginSuccess: (userData?: { name: string; role: string }) => void;
  onNavigateToSignUp?: () => void;
  onNavigateToForgot?: () => void;
}

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 mr-3">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.449-11.303-8H6.306C9.656,39.663,16.318,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.251,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const Login: React.FC<LoginProps> = ({ 
  onLoginSuccess, 
  onNavigateToSignUp = () => {}, 
  onNavigateToForgot = () => {} 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setError('');
      setIsLoading(true);
      
      // Simulate network request
      setTimeout(() => {
        console.log('Login successful with:', { email });
        // Extract name from email for the CalmCare demo
        const extractedName = email.split('@')[0];
        const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
        
        onLoginSuccess({
            name: `Dr. ${formattedName}`,
            role: 'Physician' 
        });
      }, 800);
    } else {
      setError(t('auth_login_error'));
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
        console.log('Google login successful');
        onLoginSuccess({
            name: "Dr. Google User",
            role: "Specialist"
        });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050509] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambience similar to Remail screenshot */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md animate-fadeIn z-10">
        <div className="text-center mb-10">
            {/* Logo placeholder - using text to match clean dashboard vibe */}
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">CalmCare.</h1>
            <p className="text-gray-500 text-sm">Your Everyday Companion for Mental Balance</p>
        </div>

        <div className="bg-[#0B0D12] border border-[#1E2129] rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-center text-white mb-2">{t('auth_login_welcome')}</h2>
            <p className="text-center text-gray-500 text-sm mb-8">{t('auth_login_subtitle')}</p>
            
            {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    <p className="text-red-400 text-xs">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">
                        {t('auth_login_email_label')}
                    </label>
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                        </span>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('auth_login_email_placeholder')}
                            className="w-full py-2.5 pl-10 pr-4 text-sm bg-[#151921] text-gray-200 placeholder-gray-600 rounded-lg border border-[#2A2D36] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label htmlFor="password" className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            {t('auth_login_password_label')}
                        </label>
                        <button type="button" onClick={onNavigateToForgot} className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            {t('auth_login_forgot')}
                        </button>
                    </div>
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <Lock className="h-4 w-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                        </span>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('auth_login_password_placeholder')}
                            className="w-full py-2.5 pl-10 pr-4 text-sm bg-[#151921] text-gray-200 placeholder-gray-600 rounded-lg border border-[#2A2D36] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-lg font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            {t('auth_login_button')}
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
            
            <div className="relative my-8 flex items-center">
                <div className="flex-grow border-t border-[#2A2D36]"></div>
                <span className="flex-shrink-0 mx-4 text-gray-600 text-xs font-medium uppercase tracking-widest">{t('auth_login_or')}</span>
                <div className="flex-grow border-t border-[#2A2D36]"></div>
            </div>
            
            <button 
                type="button" 
                onClick={handleGoogleLogin} 
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm text-gray-300 bg-[#1A1D24] hover:bg-[#20242C] transition-all border border-[#2A2D36] hover:border-gray-600 group"
            >
                <div className="group-hover:scale-105 transition-transform duration-200 flex items-center">
                    <GoogleIcon />
                    <span>{t('auth_login_google')}</span>
                </div>
            </button>

            <div className="text-center mt-8">
                <p className="text-sm text-gray-500">
                    {t('auth_login_no_account')}{' '}
                    <button type="button" onClick={onNavigateToSignUp} className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors ml-1">
                        {t('auth_login_signup_link')}
                    </button>
                </p>
            </div>
        </div>
        
        {/* Footer info matching the professional dashboard look */}
        <div className="mt-8 text-center space-y-2">
            <p className="text-[10px] text-gray-700 uppercase tracking-widest font-semibold">Protected by CalmCare Enterprise Security</p>
            <div className="flex justify-center gap-4 text-xs text-gray-600">
                <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-gray-400 transition-colors">Help</a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;