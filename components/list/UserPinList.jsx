"use client";
import { getCookie } from "@/utils/cookies";
import { categories } from "@/utils/data";
import { ResetIcon } from "@radix-ui/react-icons";
import { ArrowLeft, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserCard from "../card/UserCard";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const UserPinList = () => {
  const [users, setUsers] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();

  useEffect(() => {
    getAllUsers();
  }, []);

  async function getAllUsers() {
    try {
      const jwtToken = getCookie("accessToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + jwtToken);

      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users`,
        requestOptions
      );

      if (!res.ok) {
        console.log("Error fetching users:", res.statusText);
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  }

  async function getAllUsersByQuery() {
    try {
      const jwtToken = getCookie("accessToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + jwtToken);

      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/query/${searchQuery}`,
        requestOptions
      );

      if (!res.ok) {
        console.log("Error fetching users:", res.statusText);
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  }

  async function getAllUsersByCategory() {
    try {
      const jwtToken = getCookie("accessToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + jwtToken);

      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/category/${category}`,
        requestOptions
      );

      if (!res.ok) {
        console.log("Error fetching users:", res.statusText);
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    await getAllUsersByQuery();
  };

  const handleReset = async () => {
    await getAllUsers();
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategory = async () => {
    await getAllUsersByCategory();
  };

  return (
    <section className="mt-2">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Button variant="outline" type="button" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft />
          Back
        </Button>
        <span className="flex rounded-3xl border border-border px-4 w-full">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleChange}
            className="h-10 w-full border-none bg-background focus:outline-none"
          />
          <button className="border-l pl-2" type="submit">
            <SearchIcon />
          </button>
        </span>
      </form>
      <Separator className="my-2" />
      <div className="flex-wrap justify-start w-full gap-2 hidden sm:flex">
        {categories.map((cat, index) => (
          <Button
            key={index}
            onClick={() => {
              setCategory(cat);
              handleCategory();
            }}
            variant="secondary"
          >
            {cat}
          </Button>
        ))}
        <Button type="button" onClick={handleReset} variant="outline">
          <ResetIcon />
        </Button>
      </div>
      <Separator className="my-2" />
      <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-2">
        {users?.map((user, index) => (
          <UserCard user={user} key={index} />
        ))}
      </article>
    </section>
  );
};

export default UserPinList;
