/* eslint-disable @typescript-eslint/no-unused-vars */

import type { NextPage } from "next";
import Head from "next/head";
import NavBar from "../partials/NavBar";

const Home: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>Diplomy</title>
      </Head>

      <main className="h-screen">
      <NavBar/>
     
      </main>
    </>
  );
};

export default Home;
