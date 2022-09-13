import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
const Home = () => {
  return (
    <>
      <h1>CRM Playground</h1>
      <Link href="/create-user">
        <button>Create User</button>
      </Link>
    </>
  );
};
export default Home;
