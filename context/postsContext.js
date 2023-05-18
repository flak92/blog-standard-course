import React, { useCallback, useState } from "react";

const PostsContext = React.createContext({});

export default PostsContext;

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    console.log(
      "POSTY OD SSR-SERVERSIDERENDERINGU, TO POST-CONTEXT: ",
      postsFromSSR
    );
    setPosts(postsFromSSR);
  }, []);

  return (
    <PostsContext.Provider value={{ posts, setPostsFromSSR }}>
      {children}
    </PostsContext.Provider>
  );
};
