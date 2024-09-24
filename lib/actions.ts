"use server";

import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { getTranslations } from "next-intl/server";

import z from "zod";
import { revalidatePath } from "next/cache";

export const handleResign = async (formData: any) => {
  const t = await getTranslations("Index");

  const FormSchema = z.object({
    name: z.string({
      invalid_type_error: "Please select a customer.",
    }),
    email: z.string().email({ message: "无效的邮箱格式" }),
    password: z.string().min(8, { message: "最少8位" }),
  });
  const validatedFields = FormSchema.safeParse(formData);
  let { name, email, password } = formData;
  if (!validatedFields.success) {
    throw new Error(validatedFields.error?.errors[0].message);
  }
  const hashed_password = await hash(password, 12);
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (user) {
    throw new Error(t("test"));
  }
  await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashed_password,
    },
  });
};

// export async function createInvoice(formData: FormData) {
//   const val = FormSchema.safeParse(formData);
//   if (!val.success) {
//     return NextResponse.json(
//       {
//         status: "fail",
//         message: val.error?.errors[0].message,
//       },
//       { status: 400 }
//     );
//   }
//   const { password, email, name } = val.data;
//   const hashed_password = await hash(password, 12);
//   const user = await prisma.user.create({
//     data: {
//       name,
//       email: email.toLowerCase(),
//       password: hashed_password,
//     },
//   });
// }
export async function getTag() {
  const user = await prisma.category.findMany();
  return user;
}
export async function getPost() {
  const post = await prisma.post.findMany({
    include: {
      categories: true,
    },
  });
  return post;
}
export async function getPostDetail(id: number) {
  const post = await prisma.post.findFirst({
    where: {
      id,
    },
    include: {
      categories: true,
    },
  });
  return post;
}
export async function createPost(params: {
  title: string;
  content: string;
  url: string[];
  tag: number[];
}) {
  const { tag, ...rest } = params;
  await prisma.post.create({
    data: {
      ...rest,
      categories: {
        connect: tag.map((item) => {
          return {
            id: item,
          };
        }),
      },
    },
  });
}
