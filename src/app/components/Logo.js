"use client";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="d-inline-block text-center">
      <img
        src="/logo.png"
        alt="Logo"
        style={{
          maxWidth: "100%",
          height: "auto",
          maxHeight: "90px",
        }}
      />
    </Link>
  );
}
