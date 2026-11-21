import { LoginPageBody } from "@/components/auth-pages";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; reset?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, reset } = await searchParams;
  return <LoginPageBody next={next} reset={reset === "1"} />;
}
