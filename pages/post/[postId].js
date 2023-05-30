import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { getAppProps } from "../../utils/getAppProps";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Post(props) {
  console.log("props czyli składniowe !obiektu wyczytywanego! z dbka: ", props);
  const router = useRouter();
  const [showDelateConfirm, setShowDelateConfirm] = useState(false);

const handleDelateConfirm = async () => {
    try {
      const response = await fetch(`/api/deletePost`, {
        method: "POST",
        headers:{
          'content-type': "application/json"
        },
        body: JSON.stringify({ postId: props.id }),
      });
      const json = await response.json();
        if (json.success) {
router.replace(`/post/new`);
        }

    } catch (e) {
      console.log("Error by deleting post: ", e);
    }
}


  return (
    (
      <h1>
        THIS IS OR WILL BE ONE OF YOURS PREVIOUS QUESTIONS $MR/MRS JS-DEVELOPER
      </h1>
    ),
    (
      <div className="overflow-auto h-full">
        <div className="max-w-screen-sm mx-auto">
          <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
            SEO title and meta description
          </div>
          <div className="p-4 my-2 border border-stone-200 rounded-md">
            <div className="text-blue-600 text-2xl font-bold">
              {props.title}
            </div>
            <div className="mt-2">{props.metaDescription}</div>
          </div>
          <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
            Keywords
          </div>
          <div className="flex flex-wrap pt-2 gap-1">
            {props.keywords.split(",").map((keyword, i) => (
              <div key={i} className="p-2 rounded-full bg-slate-800 text-white">
                <FontAwesomeIcon icon={faHashtag} /> {keyword}
              </div>
            ))}
          </div>
          <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
            Blog post
          </div>
          <div dangerouslySetInnerHTML={{ __html: props.postContent || '' }} />


          <div className="my-4">
            {!showDelateConfirm &&  (
              <button
                className="btn bg-red-600 hover:bg-red-900"
                onClick={() => setShowDelateConfirm(true)}
                >DELATE THIS POST
              </button>
            )}
            {!!showDelateConfirm &&
                <div>
                  <p className="p-2 bg-red-300 text-ceter"> Are you sure you want to delete this post?! It will disappear forever! </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="btn bg-stone-600 hover:bg-stone-900"
                          onClick={() => setShowDelateConfirm(false)}
                          > Cancel
                          </button>
                          <button className="btn bg-red-600 hover:bg-red-900"
                            onClick={handleDelateConfirm}
                          > Confirm Delate
                          </button>
                        </div>
                </div>
                    }
          </div>



        </div>
      </div>
    )
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("BlogStandard");
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    });
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          parameter: false,
        },
      };
    }
    return {
      props: {
        id: ctx.params.postId,
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        postCreated: post.created.toString(),
        ...props,
      },
    };
  },
});
