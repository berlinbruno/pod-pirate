"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ResetIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Card, CardHeader } from "../ui/card";

export default function ForgetPasswordForm() {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    securityAnswer1: "",
    securityAnswer2: "",
    securityAnswer3: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resetPassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        const { status } = await res.json();
        toast(status);
        const form = e.target;
        form.reset();
        router.push("/login");
      } else {
        const { status, error } = await res.json();
        toast(status);
        setError(status);
        console.error(error);
      }
    } catch (error) {
      console.error("Error in reseting:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <h1 className="title place-self-center">Reset Password</h1>
        <form
          onSubmit={handleSubmit}
          className=" flex flex-col justify-center gap-2 "
        >
          <div className=" flex gap-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                name="newPassword"
                placeholder="New Password"
                required
                minLength="6"
                maxLength="20"
                onChange={handleChange}
              />
            </div>
          </div>
          <Label htmlFor="securityAnswer1">Security Question 1</Label>
          <Input
            type="text"
            name="securityAnswer1"
            placeholder="Answer"
            required
            onChange={handleChange}
          />
          <Label htmlFor="securityAnswer2">Security Question 2</Label>
          <Input
            type="text"
            name="securityAnswer2"
            placeholder="Answer"
            required
            onChange={handleChange}
          />
          <Label htmlFor="securityAnswer3">Security Question 3</Label>
          <Input
            type="text"
            name="securityAnswer3"
            placeholder="Answer"
            required
            onChange={handleChange}
          />
          {error && (
            <div className=" text-right text-sm text-destructive">{error}*</div>
          )}
          <Link href="/login" className="text-right text-xs text-primary">
            Remember my password !
          </Link>
          <div className="flex justify-between gap-2">
            <Button variant="outline" size="icon" type="reset">
              <ResetIcon />
            </Button>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Reset"}
            </Button>
          </div>
        </form>
      </CardHeader>
    </Card>
  );
}
