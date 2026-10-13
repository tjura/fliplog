import { redirect } from "next/navigation";
import { Header } from "../../components/header";
import { AuthForm } from "../../features/auth/auth-form";
import { returnPath } from "../../features/catalogue/catalogue";
import { getSession } from "../../server/auth";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const returnTo = returnPath(query.returnTo);
  if (await getSession()) redirect(returnTo);
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <AuthForm createAccount returnTo={returnTo} />
      </main>
    </>
  );
}
