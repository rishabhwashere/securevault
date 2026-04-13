import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@/components/ui';
import { shakeX } from '@/lib/motion';
import {
  loginSchema,
  otpSchema,
  registerSchema,
  type LoginValues,
  type OtpValues,
  type RegisterValues
} from '@/lib/validators';
import { useLogin, useRegister, useVerifyOtp } from '@/features/auth/useAuth';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { OTPInput } from './OTPInput';

type AuthMode = 'login' | 'register' | 'otp';

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<LoginValues | null>(null);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const otpMutation = useVerifyOtp();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: '' }
  });

  async function submitLogin(values: LoginValues) {
    setPendingLogin(values);
    await loginMutation.mutateAsync(values);
  }

  async function submitRegister(values: RegisterValues) {
    await registerMutation.mutateAsync(values);
    registerForm.reset();
    setMode('login');
    loginForm.setValue('email', values.email);
  }

  async function submitOtp(values: OtpValues) {
    await otpMutation.mutateAsync(values.code);
    otpForm.reset();
    setMode('login');
    if (pendingLogin) {
      loginForm.setValue('email', pendingLogin.email);
    }
  }

  return (
    <div className="glass-panel relative overflow-hidden rounded-xl p-7 shadow-card">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/45 to-transparent" />
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.28em] text-textMuted">Secure access</p>
        <h2 className="mt-3 font-heading text-4xl leading-tight text-textPrimary">
          {mode === 'register'
            ? 'Create your vault workspace'
            : mode === 'otp'
              ? 'Check your verification code'
              : 'Welcome back to the vault'}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.24 }}
          >
            <form className="grid gap-5" onSubmit={loginForm.handleSubmit(submitLogin)}>
              <Input
                label="Email"
                type="email"
                placeholder="alex@example.com"
                error={loginForm.formState.errors.email?.message}
                {...loginForm.register('email')}
              />
              <motion.div animate={loginForm.formState.errors.password ? shakeX : undefined}>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  error={loginForm.formState.errors.password?.message}
                  rightAdornment={
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="focus-ring rounded-full p-1 text-textMuted transition hover:text-brand"
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  {...loginForm.register('password')}
                />
              </motion.div>
              <button
                type="button"
                className="justify-self-start text-sm font-medium text-brand transition hover:text-brand-deep"
                onClick={() => setMode('otp')}
              >
                Forgot password
              </button>
              <Button type="submit" className="w-full" loading={loginMutation.isPending}>
                Unlock vault
              </Button>
            </form>
          </motion.div>
        ) : null}

        {mode === 'register' ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.24 }}
          >
            <form className="grid gap-5" onSubmit={registerForm.handleSubmit(submitRegister)}>
              <Input
                label="Name"
                placeholder="Alex Morgan"
                error={registerForm.formState.errors.name?.message}
                {...registerForm.register('name')}
              />
              <Input
                label="Email"
                type="email"
                placeholder="alex@example.com"
                error={registerForm.formState.errors.email?.message}
                {...registerForm.register('email')}
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                error={registerForm.formState.errors.password?.message}
                rightAdornment={
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="focus-ring rounded-full p-1 text-textMuted transition hover:text-brand"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                {...registerForm.register('password')}
              />
              <PasswordStrengthMeter password={registerForm.watch('password') ?? ''} />
              <Input
                label="Confirm password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat password"
                error={registerForm.formState.errors.confirmPassword?.message}
                {...registerForm.register('confirmPassword')}
              />
              <Button type="submit" className="w-full" loading={registerMutation.isPending}>
                Create account
              </Button>
            </form>
          </motion.div>
        ) : null}

        {mode === 'otp' ? (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.24 }}
            className="grid gap-5"
          >
            <div className="rounded-lg border border-brand/15 bg-brand-light/60 p-4 text-sm text-textMuted">
              <div className="mb-3 flex items-center gap-2 text-brand">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-medium">Two-factor step</span>
              </div>
              <p>Enter any 6-digit code to continue this MVP flow.</p>
            </div>
            <form className="grid gap-5" onSubmit={otpForm.handleSubmit(submitOtp)}>
              <OTPInput
                value={otpForm.watch('code')}
                onChange={(value) => otpForm.setValue('code', value, { shouldValidate: true })}
                error={otpForm.formState.errors.code?.message}
              />
              <Button type="submit" className="w-full" loading={otpMutation.isPending}>
                Verify code
              </Button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-8 text-sm text-textMuted">
        {mode === 'register' ? (
          <button
            type="button"
            onClick={() => setMode('login')}
            className="font-medium text-brand transition hover:text-brand-deep"
          >
            Already have an account? Sign in →
          </button>
        ) : mode === 'otp' ? (
          <button
            type="button"
            onClick={() => setMode('login')}
            className="font-medium text-brand transition hover:text-brand-deep"
          >
            Back to login →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setMode('register')}
            className="font-medium text-brand transition hover:text-brand-deep"
          >
            New here? Create an account →
          </button>
        )}
      </div>
    </div>
  );
}
