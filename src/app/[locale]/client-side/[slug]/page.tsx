"use client";

import Header from "@/components/header";
import { getPostDetail } from "@/lib/actions";
import { useRequest } from "ahooks";

export default function ProfileDetail({
  params,
}: {
  params: { slug: number };
}) {
  const { slug } = params;
  const { data } = useRequest(() => getPostDetail(Number(slug)));
  const { content } = data || {};

  return (
    <>
      <Header />
      <div className="bg-slate-100  min-h-dvh">
        <div
          className="container   pt-24"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      </div>
    </>
  );
}
