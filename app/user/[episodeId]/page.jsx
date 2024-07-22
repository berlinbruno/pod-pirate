import Loading from "@/app/loading";
import EditEpisodeForm from "@/components/form/EditEpisodeForm";
import { cookies } from "next/headers";
import { Suspense } from "react";

export const metadata = {
  title: "Edit Episode",
};

export default async function EpisodePage({ params }) {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId");

  const episode = await getEpisodeById(userId.value, params.episodeId);

  return (
    <section className=" container mx-auto">
      <Suspense fallback={<Loading />}>
        <EditEpisodeForm episode={episode} />
      </Suspense>
    </section>
  );
}

function getEpisodeById(userId, episodeId) {
  return new Promise((resolve, reject) => {
    const cookieStore = cookies();
    const jwtToken = cookieStore.get("accessToken");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwtToken.value);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get/episode/${userId}/${episodeId}`,
      requestOptions,
      { next: { revalidate: 60 } }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
