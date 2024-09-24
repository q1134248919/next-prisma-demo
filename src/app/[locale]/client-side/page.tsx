"use client";

import { Video } from "@/components/video";
import Header from "@/components/header";
import ReactQuill, { Quill } from "react-quill";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Col,
  Drawer,
  Flex,
  Form,
  Input,
  message,
  Row,
  Select,
  Upload,
} from "antd";
import { useMemo, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import "react-quill/dist/quill.snow.css";
import { createPost, getPost, getTag } from "@/lib/actions";
import { useRouter } from "next/navigation";

Quill.register({ "formats/video": Video }, true);

export default function Profile() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { data: tagList } = useRequest(getTag);
  const { data: postList, run } = useRequest(getPost);
  const handleVideoUpload = () => {
    const fileInput = document?.createElement("input");
    fileInput.type = "file";
    fileInput.click();

    fileInput.onchange = async () => {
      if (fileInput) {
        const file = (fileInput as any)?.files[0];
        if (qRef.current) {
          const quill = (qRef.current as any)?.getEditor();
          const editor = quill.editor;
          const range = quill.getSelection();
          console.log(URL.createObjectURL(file), "1");
          if (editor && editor?.insertEmbed) {
            editor?.insertEmbed(
              range.index,
              "video",
              URL.createObjectURL(file)
            );
          }
        }
      }
      // 这里可以添加视频文件验证逻辑
      // 获取视频文件后，你可以上传到服务器，并获取视频的URL
    };
  };
  console.log(postList, "postList");
  const qRef = useRef<any>();

  // 定义中文 title 的配置对象
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["clean"],
          ["link", "image", "video"], // 添加video按钮
        ],
        handlers: {
          video: handleVideoUpload,
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "direction",
    "link",
    "image",
    "video",
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50   ">
        <section
          style={{ backgroundImage: `url(/card.jpg)`, height: "50vh" }}
          className=" text-white    relative p-20  font-serif    bg-no-repeat  font-bold  text-3xl  md:text-6xl       bg-cover  "
        >
          <div className="client-bg" />

          <div className="z-2 mt-10 relative flex-col  h-full flex justify-center items-center">
            <div>Read Our Blog</div>
            <Button
              size="large"
              className="mt-5"
              onClick={() => {
                setVisible(true);
              }}
            >
              Create
            </Button>
          </div>
        </section>
        <div className="container mx-auto pt-5">
          <Row gutter={[20, 20]}>
            {postList &&
              postList?.map((item) => {
                const { id, url, title, createdAt, categories } = item;
                return (
                  <Col
                    onClick={() => {
                      router.push(`/client-side/${id}`);
                    }}
                    className="cursor-pointer"
                    span={8}
                    key={id}
                  >
                    <Card
                      styles={{ body: { padding: "0" } }}
                      style={{ width: "100%" }}
                    >
                      <div
                        className=" h-48 text-white  font-bold text-xl flex justify-center items-center  md:text-2xl "
                        style={{
                          backgroundImage: `url(${url[0].toString()})`,
                          backgroundSize: "cover",
                          borderRadius: 6,
                        }}
                      >
                        {title}
                      </div>
                      <Flex
                        justify="space-between"
                        className="p-5  md:text-sm text-xs"
                      >
                        <div>
                          {categories.map((item) => item.name).toString()}
                        </div>
                        <div>{dayjs(createdAt).format("YYYY/MM/DD")}</div>
                      </Flex>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </div>
      </div>
      <Drawer
        onClose={() => {
          setVisible(false);
        }}
        width="50%"
        open={visible}
      >
        <Form
          onFinish={async (value) => {
            const { url, ...rest } = value;
            try {
              await createPost({
                ...rest,
                url: url.map((item: { url: string }) => item.url),
              });
              setVisible(false);
              run();
              message.success("提交成功!");
            } catch (error: any) {
              message.error(error?.message);
            }
          }}
        >
          <Form.Item label="title" name="title">
            <Input.TextArea style={{ width: 400 }} />
          </Form.Item>
          <Form.Item label="tag" name="tag">
            <Select
              fieldNames={{ label: "name", value: "id" }}
              mode="multiple"
              style={{ width: 200 }}
              options={tagList}
            />
          </Form.Item>
          <Form.Item
            name="url"
            getValueFromEvent={(e: any) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList.map((file: any) => {
                const { status, response } = file;
                console.log(file, "1");
                if (status == "done") {
                  if (response?.code == 200) {
                    file.url = file.response.data;
                  } else {
                    file.status = "error";
                  }
                }
                return file;
              });
            }}
            valuePropName="fileList"
            label="url"
          >
            <Upload action="/api/upload" listType="picture-card">
              <button style={{ border: 0, background: "none" }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          </Form.Item>
          <Form.Item label="content" name="content">
            <ReactQuill
              ref={qRef}
              modules={modules}
              formats={formats}
              theme="snow"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <div>submit</div>
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
