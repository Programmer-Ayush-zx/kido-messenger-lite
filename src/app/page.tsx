"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Importing Image from next/image

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("./login");
    }, 3000);

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen w-screen bg-slate-200">
      <div className="flex flex-col justify-center items-center h-screen max-w-md mx-auto p-4 bg-slate-200 w-screen">
        <Image src="/email.png" alt="Email Icon" className="h-28 w-28 animate-bounce delay-1000" width={112} height={112} />
        <p className="mt-4 text-center font-bold">
          <span className="text-green-600 text-7xl border-green-600 border-b-4">K</span>
          <span className="text-yellow-500 text-7xl border-yellow-600 border-b-4">i</span>
          <span className="text-orange-600 text-7xl border-orange-600 border-b-4">d</span>
          <span className="text-blue-600 text-7xl border-blue-600 border-b-4">o </span>
          <span className="font-mono font-bold text-4xl bg-purple-600 p-2 rounded-lg border-purple-900 border-b-4"> Lite</span>
        </p>
        <p className="mt-7 text-gray-500 font-mono">Loading</p>
      </div>
    </div>
  );
};

export default Page;
