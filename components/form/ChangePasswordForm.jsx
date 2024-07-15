"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ResetIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(formData),
        redirect: "follow",
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/changePassword`,
        requestOptions
      );
      if (res.ok) {
        const result = await res.json();
        router.refresh();
        toast(result.status);
        console.info(result);
      } else {
        const result = await res.json();
        setError(result.error);
        console.error(result);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className=" flex flex-col gap-2" onSubmit={handleSubmit}>
      <h1 className="title place-self-center">Change Password</h1>
      <Label htmlFor="email">UserName</Label>
      <Input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleInputChange}
        required
      />
      <Label htmlFor="password">Old Password</Label>
      <Input
        type="password"
        name="password"
        onChange={handleInputChange}
        placeholder="Old password"
        required
      />
      <Label htmlFor="newPassword">New Password</Label>
      <Input
        type="text"
        name="newPassword"
        onChange={handleInputChange}
        placeholder="New password"
        required
        minLength="6"
        maxLength="20"
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
              newPassword: "",
            });
            setError(null);
          }}
        >
          <ResetIcon />
        </Button>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Updating" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
