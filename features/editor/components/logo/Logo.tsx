import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
    return (
        <Link href="/">
            <div className="size-8 relative shrink-0">
                <Image
                    src="/logo.svg"
                    alt="logo"
                    fill
                    className="hover:opacity-50 shrink-0 transition"
                />
            </div>
        </Link>
    );
};

export default Logo;
