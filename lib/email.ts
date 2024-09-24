"use server";
import nodemailer from "nodemailer";

import prisma from "@/prisma/prisma";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcryptjs";

const transporter = nodemailer.createTransport({
  service: "qq",
  auth: {
    user: "2415474592@qq.com",
    pass: "cpuhuoyslwtudhid",
  },
});

export const sendEmail = async (email = "1134248919@qq.com") => {
  const code = generateRandomCode();

  await transporter.sendMail({
    from: "2415474592@qq.com",
    to: email,
    subject: "test E-mail Code",
    html: `<h1 style={{margin-bottom:20px}}>HI</h1><h1>Your code ${code}</h1>`,
  });
  const user = await prisma.verificationRequest.findUnique({
    where: { email },
  });
  const newCode = await hash(code, 12);
  if (user) {
    await prisma.verificationRequest.update({
      where: {
        email,
      },
      data: {
        token: uuidv4(),
        code: newCode,
        expires: new Date(new Date().getTime() + 60 * 1000 * 5),
      },
    });
  } else {
    await prisma.verificationRequest.create({
      data: {
        email: email,
        token: uuidv4(),
        code: newCode,
        expires: new Date(new Date().getTime() + 60 * 1000),
      },
    });
  }
};

export const generateRandomCode = () => {
  var code = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < 6; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};
