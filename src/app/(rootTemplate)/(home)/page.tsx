import HomeTemplate from "@/components/templates/Site/Home";
import { getPageHome } from "@/lib/getPageHome";

export default async function HomePage() {
  const page = await getPageHome();

  return <HomeTemplate page={page} />;
}
