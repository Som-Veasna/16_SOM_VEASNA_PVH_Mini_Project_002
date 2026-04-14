export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}