"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { PublicUser } from "@/app/lib/definitions";

import { updateUserName } from "@/app/lib/api/user/updateUserName";

import Button from "../components/Button";
import CircularProgress from "../components/CircularProgress";
import { TextField } from "../components/TextField";

type ProfilePropsType = {
  userData: PublicUser;
};

export default function UserProfileForm({ userData }: ProfilePropsType) {
  const session = useSession();
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
  });

  const [state, formAction, pending] = useActionState(updateUserName, formValues);

  useEffect(() => {
    if (!!state?.success && !pending) {
      session.update({ email: state.data.email });
      router.refresh();
    }
  }, [pending, state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="mt-[20px]">
      {userData.avatarURL && (
        <Image
          src={userData.avatarURL || ""}
          width={150}
          height={150}
          alt="avatar"
          className="mx-auto rounded-full"
        />
      )}

      <form action={formAction}>
        <div className="mt-4 flex flex-wrap justify-center gap-8">
          <TextField
            required
            label="First Name"
            name="firstName"
            value={formValues.firstName}
            onChange={handleChange}
            classes={{ root: "w-full xl:w-1/3" }}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
            classes={{ root: "w-full xl:w-1/3" }}
          />
        </div>

        <Button
          type="submit"
          size="large"
          color="primary"
          variant="contained"
          disabled={pending}
          startIcon={pending ? <CircularProgress size={20} /> : null}
          classes={{
            root: "mx-auto mt-4 w-[200px]",
          }}
        >
          Update User
        </Button>
      </form>
    </div>
  );
}
