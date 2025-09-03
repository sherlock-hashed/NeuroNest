import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 bg-gray-50">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
              card: "shadow-lg rounded-xl",
            },
          }}
        />
      </div>
    </div>
  );
}
