"use client";
import Link from "next/link";

export default function Logo() {

    return (
        <Link href="/">
            <img src="/logo.png" alt="Logo" style={{height:90, marginBottom:10}}/>
        </Link>
    )

}