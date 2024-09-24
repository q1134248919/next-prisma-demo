import { auth } from "@/auth";
import Header from "@/components/header";

const Home = async () => {
  const session = await auth();
  const { user } = session || {};

  const { name } = user || {};
  return (
    <>
      <Header />
      <section
        style={{ backgroundImage: `url(/bg.jpg)` }}
        className=" flex flex-col h-screen font-serif bg-bottom  bg-no-repeat  font-bold  text-3xl  md:text-6xl  items-center justify-center fons bg-cover    "
      >
        Welcome Back {name}
      </section>
    </>
  );
};
export default Home;
