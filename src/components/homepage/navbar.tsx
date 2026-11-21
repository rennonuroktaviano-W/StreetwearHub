import { getSessionUser } from "@/lib/auth";
import { NavbarShell } from "@/components/homepage/navbar-shell";

export async function Navbar() {
  const user = await getSessionUser();
  const accountHref = user
    ? user.role === "ADMIN"
      ? "/admin"
      : user.role === "SELLER"
        ? "/seller"
        : "/akun"
    : "/login";

  return <NavbarShell accountHref={accountHref} />;
}
