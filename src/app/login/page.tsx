import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <div className="w-full max-w-sm p-8 bg-white border border-border shadow-sm">
        <h1 className="text-2xl font-serif mb-6 text-center">Admin Login</h1>
        <LoginForm />
      </div>
    </main>
  );
}
