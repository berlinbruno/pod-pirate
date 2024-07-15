"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { setAccessTokenCookie } from "@/utils/cookies";
import { Card, CardHeader } from "../ui/card";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        const form = e.target;
        const { token, id, status, role } = await res.json();
        setAccessTokenCookie(token, id, role);

        toast(status);
        form.reset();
        if (role == "ADMIN") {
          window.location.assign(`/admin`);
        } else {
          window.location.assign(`/user/${id}`);
        }
      } else {
        const { status, error } = await res.json();
        toast(status);
        setError("Invalid credentials");
        console.error(error);
      }
    } catch (error) {
      console.error("Error logging In:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <h1 className="title place-self-center">Login</h1>
        <form
          onSubmit={handleSubmit}
          className=" flex flex-col justify-center gap-2"
        >
          <Label htmlFor="email">UserName</Label>
          <Input
            type="text"
            name="email"
            placeholder="email"
            required
            onChange={handleChange}
          />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="password"
            required
            onChange={handleChange}
          />
          {error && (
            <div className=" text-right text-sm text-destructive">{error}*</div>
          )}
          <div className=" flex flex-col self-end">
            {error && (
              <Link
                href="/forget-password"
                className="text-right text-xs text-primary"
              >
                Forget password ?
              </Link>
            )}
            <Link href="/register" className="text-right text-xs text-primary">
              Create new account ?
            </Link>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </Button>
        </form>
      </CardHeader>
    </Card>
  );
}
