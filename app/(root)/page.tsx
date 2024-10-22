import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";
import  ThreadCard  from "@/components/cards/ThreadCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Pagination from "@/components/shared/Pagination";

async function Home({
  searchparams,
}: {
  searchparams: { [key: string]: string | undefined };
}) {

  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onboarded) redirect('/onboarding');

  const result = await fetchPosts(
    searchparams?.page ? +searchparams.page : 1,
    30,
  );

  return (
      <>
        <h1 className="head-text text-left">Home</h1>

        <section className="mt-9 flex flex-col gap-10">
          {result.posts.length === 0 ? (
            <p className="no-result">No threads found</p>
          ) : (
            <>
              {result.posts.map((post) => (
                <ThreadCard
                  key={post._id}
                  id={post._id}
                  currentUserId={user.id}
                  parentId={post.parentId}
                  content={post.text}
                  author={post.author}
                  community={post.community}
                  createdAt={post.createdAt}
                  comments={post.children}
                />
              ))}
            </>
          )}
        </section>

        <Pagination
          path="/"
          pageNumber={searchparams?.page ? +searchparams.page : 1}
          isNext={result.isNext}
        />
      </>
  );
}

export default Home;
