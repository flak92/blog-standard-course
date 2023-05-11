export const AppLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
    
    <div className="bg-slate-800">
      <div>logo</div>
      <div>create post button</div>
      <div>tokens</div>
      </div>

      <div className="flex-1 overflow-auto bg-gradient-to-b from-orange-500 to-cyan-300">list of posts</div>
      <div className="bg-cyan-800">User Info & Logout button</div>


      </div>
      <div className="">{children}</div>
    </div>
  );
};
