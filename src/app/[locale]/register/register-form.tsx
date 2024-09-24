"use client";
import { Button, Checkbox, Form, Input, message } from "antd";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateUserInput, createUserSchema } from "@/lib/user-schema";
import { handleResign } from "@/lib/actions";
import { useCreateBlog } from "./api";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
  const t = useTranslations("Index");
  const router = useRouter();

  const createBlogQuery = useCreateBlog();
  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const onFinish: SubmitHandler<CreateUserInput> = async (values: any) => {
    try {
      await handleResign(values);
      router.push("/login");
    } catch (error: any) {
      message.error(error.message);
    } finally {
    }
  };

  return (
    <>
      {t("welcome")}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ name: "qjh" }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="name"
          name="name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="email"
          name="email"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
  async function handleSubmit1(values: any) {
    await createBlogQuery.runAsync(values);
  }
};
