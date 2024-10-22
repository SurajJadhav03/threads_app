import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server"
import { communityTabs } from "@/constants";

import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";


const page = async ({ params }: { params : { id: string }}) => {
    const user = await currentUser();
    if(!user) return null;

    const communtityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
        <ProfileHeader
            accountId={communtityDetails.id}
            authUserId={user.id}
            name={communtityDetails.name}
            username={communtityDetails.username}
            imgUrl={communtityDetails.image}
            bio={communtityDetails.bio}
            type="Community"
        />

        <div className="mt-9">
            <Tabs defaultValue="threads" className="w-full">
                <TabsList className="tab">
                    {communityTabs.map((tab) => (
                        <TabsTrigger key={tab.label} value={tab.value} className="tab">
                            <Image
                                src={tab.icon}
                                alt={tab.label}
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                            <p className="max-sm:hidden">{tab.label}</p>
                            {tab.label === 'Threads' && (
                                <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                    {communtityDetails?.threads?.length}
                                </p>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="threads" className="w-full text-light-1">
                    {/* @ts-ignore */}
                    <ThreadsTab
                        currentUserId={user.id}
                        accountId={communtityDetails._id}
                        accountType="Community"
                    />
                </TabsContent>

                <TabsContent value="members" className="mt-9 w-full text-light-1">
                    <section className="mt-9 flex flex-col gap-10">
                        {communtityDetails.members.map((member : any) => (
                            <UserCard
                                key={member.id}
                                id={member.id}
                                name={member.name}
                                username={member.username}
                                imgUrl={member.image}
                                personType="User"
                            />
                        ))}
                    </section>
                </TabsContent>

                <TabsContent value="requests" className="w-full text-light-1">
                    {/* @ts-ignore */}
                    <ThreadsTab
                        currentUserId={user.id}
                        accountId={communtityDetails._id}
                        accountType="Community"
                    />
                </TabsContent>
            </Tabs>
        </div>
    </section>
  )
}

export default page