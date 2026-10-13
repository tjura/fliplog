import Link from "next/link";
import { Header } from "../components/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <h1>Skill not found</h1>
        <p>This page is not in the catalogue.</p>
        <Link className="button" href="/">
          Browse skills
        </Link>
      </main>
    </>
  );
}
