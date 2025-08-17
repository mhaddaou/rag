"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const logged = localStorage.getItem("logged");

    if (jwt && logged == "true") {
      router.push("/c");
    } else {
      router.push("/login");
    }
  },[]);
  return <section></section>;
}
