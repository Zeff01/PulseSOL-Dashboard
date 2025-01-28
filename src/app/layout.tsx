import "./globals.css";
import { Inter } from "next/font/google";
import * as tf from "@tensorflow/tfjs";

if (process.env.NODE_ENV === "development") {
  tf.ENV.set("DEBUG", false);
  tf.env().set("WEBGL_DELETE_TEXTURE_THRESHOLD", 0);
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-900 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
