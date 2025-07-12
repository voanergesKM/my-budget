"use client";

import { ToastContainer } from "react-toastify";

import { cn } from "@/app/lib/utils/utils";

import "react-toastify/dist/ReactToastify.css";

const contextClass = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-orange-400",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

export default function Toast() {
  return (
    <ToastContainer
      position="bottom-left"
      autoClose={3000}
      hideProgressBar
      closeOnClick
      closeButton={false}
      toastClassName={(context) =>
        cn(
          "relative flex p-4 min-h-10 self-start rounded-md items-center overflow-hidden cursor-pointer max-w-[250px] md:max-w-[400px]",
          {
            [contextClass[context?.type || "default"]]: context?.type,
          }
        )
      }
      className={"gap-2"}
    />
  );
}
