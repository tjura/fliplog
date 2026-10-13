import Link from "next/link";
import { getSession } from "../server/auth";
import { SignOut } from "../features/auth/sign-out";

export async function Header() {
  const session = await getSession();
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        FLIPLOG
      </Link>
      {session ? <SignOut /> : <Link href="/sign-in">Sign in</Link>}
    </header>
  );
}
