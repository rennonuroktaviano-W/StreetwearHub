import { RegisterPageBody } from "@/components/auth-pages";

type RegisterPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { next } = await searchParams;
  return <RegisterPageBody next={next} />;
}
