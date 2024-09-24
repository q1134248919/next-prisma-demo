import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export const POST = async (req: any) => {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + file.name.replaceAll(" ", "_");

  try {
    await writeFile(
      path.join(process.cwd(), "public/uploads/" + filename),
      buffer
    );
    return NextResponse.json({
      msg: "Success",
      code: 200,
      data: `/uploads/${filename}`,
    });
  } catch (error) {
    return NextResponse.json({ msg: "Failed", status: 500 });
  }
};
