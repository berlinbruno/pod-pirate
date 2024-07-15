"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ResetIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/utils/cookies";
import { toast } from "sonner";
import PopupMenu from "../menu/PopupMenu";

const DeleteAccountForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify(formData),
        redirect: "follow",
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signout`,
        requestOptions
      );
      if (res.ok) {
        const result = await res.json();
        deleteCookie("accessToken");
        deleteCookie("userId");
        deleteCookie("role");
        toast(result.status);
        console.info(result);
        window.location.href = `/`;
      } else {
        const result = await res.json();
        // window.location.reload();
        setError(result.error);
        console.error(result);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className=" flex flex-col gap-2">
      <h1 className="title place-self-center">Delete Account</h1>
      <Label htmlFor="email">UserName</Label>
      <Input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleInputChange}
        required
      />
      <Label htmlFor="password">Password</Label>
      <Input
        type="password"
        name="password"
        onChange={handleInputChange}
        placeholder="Password"
        required
      />
      {error && (
        <div className=" text-right text-sm text-destructive">{error}*</div>
      )}
      <div className=" flex gap-2 w-full">
        <Button
          variant="outline"
          size="icon"
          type="reset"
          onClick={() => {
            setFormData({
              email: "",
              password: "",
            });
            setError(null);
          }}
        >
          <ResetIcon />
        </Button>
        <PopupMenu
          callfunction={handleDelete}
          status={loading}
          text={"Delete Account"}
        />
      </div>
    </form>
  );
};

export default DeleteAccountForm;
