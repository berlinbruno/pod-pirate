"use client";
import { Button } from "@/components/ui/button";
import { deleteCookie } from "@/utils/cookies";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader } from "../ui/card";

export default function LogoutForm() {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    deleteCookie("accessToken");
    deleteCookie("userId");
    deleteCookie("role");
    toast("Logout Successfully");
    window.location.assign("/");
  };
  return (
    <Card>
      <CardHeader>
        <h1 className="title place-self-center">Logout</h1>
        <div className=" flex flex-col justify-center gap-2">
          <Button type="button" disabled={loading} onClick={handleLogout}>
            {loading ? "Loging Out..." : "Logout"}
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
