"use server";

import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { getTranslations } from "next-intl/server";

import z from "zod";

export const handleResign = async (formData: any) => {
  const t = await getTranslations("Index");

  const FormSchema = z.object({
    name: z.string({
      invalid_type_error: "Please select a customer.",
    }),
    email: z.string().email({ message: "无效的邮箱格式" }),
    password: z.string().min(8, { message: "1" }),
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

export async function createInvoice(formData: FormData) {
  const val = FormSchema.safeParse(formData);
  if (!val.success) {
    return NextResponse.json(
      {
        status: "fail",
        message: val.error?.errors[0].message,
      },
      { status: 400 }
    );
  }
  const { password, email, name } = val.data;
  const hashed_password = await hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashed_password,
    },
  });
}
export async function getUser() {
  const user = await prisma.user.findMany();
  return NextResponse.json(
    {
      status: "fail",
      message: "1",
    },
    { status: 400 }
  );
}
