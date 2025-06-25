"use client";

import Image from "next/image";
import { TextField } from "../components/TextField";
import { useActionState, useEffect, useState } from "react";
import Button from "../components/button";
import { updateUserName } from "@/app/lib/api/user/updateUserName";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CircularProgress from "../components/CircularProgress";

export default function UserProfileForm({ currentUser }: any) {
  const session = useSession();
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
  });
  const [state, formAction, pending] = useActionState(updateUserName, formValues);

  useEffect(() => {
    if (!!state.success) {
      session.update();
      router.refresh();
    }
  }, [pending]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="mt-[20px]">
      <Image
        src={currentUser.avatarURL || ""}
        width={150}
        height={150}
        alt="avatar"
        className="mx-auto rounded-full"
      />

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
          Update Name
        </Button>
      </form>
    </div>
  );
}
