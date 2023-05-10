import { withPageAuthRequired } from '@auth0/nextjs-auth0';



export default function NewPost(props) {
  console.log("NEW Post PROPS:", props)
  return <div>


    <h1>TO JEST NOWY POST</h1>


  </div>;
}

export const getServerSideProps = withPageAuthRequired (() => {
  return {
    props: {
    },
  };
});