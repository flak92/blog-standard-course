import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";

export default function NewPost(props) {
  console.log("NEW Post PROPS:", props);
  const [postContent, setPostContent] = useState("");

  const handleClick = async () => {
    const response = await fetch('/api/generatePost', { method: 'POST', });
    const json = await response.json();
    console.log("Odpowiedz GPT:", json.post.postContent);
    setPostContent(json.post.postContent);
  };

  return (
    <div>
      <h1>TO JEST NOWY POST</h1>

      <button className="btn" onClick={handleClick}>
        Generate
      </button>
      <div className="max-w-screen-sm p-10" dangerouslySetInnerHTML={{ __html: postContent }}/>
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
