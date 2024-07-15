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
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { categories } from "@/utils/data";

export default function AdminRegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
    securityAnswer1: "",
    securityAnswer2: "",
    securityAnswer3: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setError("Password Should Match");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
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
      console.error("Error in registation", error);
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
        <h1 className="title place-self-center">Register</h1>
        <form
          onSubmit={handleSubmit}
          className=" flex flex-col justify-center gap-2 "
        >
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            placeholder="name"
            minLength="3"
            maxLength="20"
            required
            onChange={handleChange}
          />
          <Label htmlFor="email">Username</Label>
          <Input
            type="email"
            name="email"
            placeholder="email"
            required
            onChange={handleChange}
          />
          <div className="flex flex-col gap-2 md:flex-row">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="password"
                required
                minLength="6"
                maxLength="20"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Confirm password</Label>
              <Input
                type="text"
                placeholder="confirm password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <Label htmlFor="securityAnswer1">
            What is your mother&apos;s maiden name?
          </Label>
          <Input
            type="text"
            name="securityAnswer1"
            placeholder="answer 1"
            required
            onChange={handleChange}
          />
          <Label htmlFor="securityAnswer2">Where were you born?</Label>
          <Input
            type="text"
            name="securityAnswer2"
            placeholder="answer 2"
            required
            onChange={handleChange}
          />
          <Label htmlFor="securityAnswer3">
            What is your favorite car brand?
          </Label>
          <Input
            type="text"
            name="securityAnswer3"
            placeholder="answer 3"
            required
            onChange={handleChange}
          />
          {error && (
            <div className=" text-right text-sm text-destructive">{error}*</div>
          )}
          <Link
            href="/admin"
            className="text-right flex self-end text-xs text-primary"
          >
            Already have Account?
          </Link>
          <div className="flex justify-between gap-2">
            <Button variant="outline" size="icon" type="reset">
              <ResetIcon />
            </Button>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Register"}
            </Button>
          </div>
        </form>
      </CardHeader>
    </Card>
  );
}
