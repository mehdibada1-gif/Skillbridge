
import { getCommunityUsers, type CommunityUser } from "./actions";
import CommunityClientPage from "./components/community-client-page";

export default async function CommunityPage() {
  const users = await getCommunityUsers();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold font-headline mb-2">Community Hub</h1>
      <p className="text-muted-foreground mb-8">
        Connect with other learners and builders on the platform.
      </p>

      <CommunityClientPage initialUsers={users} />
    </div>
  );
}
