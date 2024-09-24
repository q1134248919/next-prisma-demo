"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const nav = useRouter();
  const logoutAction = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="  h-20 font-Poppins z-10 shadow-md border-b border-blue-100 divide-solid fixed w-full bg-gray-100     ">
      <nav className="h-full flex justify-between container items-center">
        <div>
          <Link
            href="/"
            className="text-ct-dark-600 flex gap-2 text-2xl font-serif  font-bold"
          >
            <div>Blog</div>
            <div className="    bg-clip-text  text-transparent  bg-gradient-to-r    from-fuchsia-600 bg-pink-600 ">
              Lab
            </div>
          </Link>
        </div>
        <ul className="flex items-center space-x-4">
          <li>
            <Link href="/" className="text-ct-dark-600">
              Home
            </Link>
          </li>
          {!user && (
            <>
              <li>
                <Link href="/register" className="text-ct-dark-600">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-ct-dark-600">
                  Login
                </Link>
              </li>
            </>
          )}
          {user && (
            <form action={logoutAction} className="flex">
              <li>
                <Link href="/client-side" className="text-ct-dark-600">
                  Client
                </Link>
              </li>
              <li className="ml-4">
                <Link href="/profile" className="text-ct-dark-600">
                  Profile
                </Link>
              </li>
              <li className="ml-4">
                <button>Logout</button>
              </li>
            </form>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
