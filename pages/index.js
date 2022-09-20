import Link from "next/link";
const Home = () => {
  return (
    <>
      <h1>CRM Playground</h1>
      <Link href="/create-user">
        <button>Create User</button>
      </Link>
      <Link href="/users-list">
        <button>Users List</button>
      </Link>
    </>
  );
};
export default Home;
