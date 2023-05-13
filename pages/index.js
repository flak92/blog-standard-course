import Image from "next/image";
import Link from "next/link";
import { Logo } from "../components/Logo";
import HeroImage from '../public/hero.webp';

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative ">
      <Image src={HeroImage} alt="Hero" fill className="absolute" />
      <div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo />
        <p>
          Your Knowladge Store and Education Helper.
          Begin now or stay in None Productive learning styles.
        </p>
        <Link href="/post/new" className="btn" >
          Try to Help yourself !
        </Link>
      </div>
    </div>
  );
}
