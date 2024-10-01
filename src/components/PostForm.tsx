import { addDoc, collection, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { db, auth, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  background: #000;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 20px;
  padding: 20px;
  font-size: 16px;
  width: 100%;
  height: 250px;
  resize: none;
  &::placeholder {
    opacity: 1;
    font-size: 20px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    transition: opacity 0.3s;
  }
  &:focus {
    &::placeholder {
      opacity: 0;
    }
    outline: none;
    border-color: #ff9010;
  }
`;

const AttachFileButton = styled.label`
  width: 100%;
  color: #ff9010;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #ff9010;
  border-radius: 20px;
  text-align: center;
  padding: 10px 0;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    border: 1px solid transparent;
    background: #ff9010;
    color: #fff;
  }
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background: #fff;
  color: #ff9010;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 20px;
  padding: 10px 0;
  cursor: pointer;
  transition: opacity 0.3s;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const PostForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const maxFileSize = 7 * 1024 * 1024; //  = 저장 용량을 3m까지 주겠다

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // console.log(e);
    setPost(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ChangeEvent = 값이 변할 때
    // console.log(files);
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > maxFileSize) {
        alert("The Maximum Capacity that can be uploaded is 5MB!");
        return;
      }
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // FormEvent = 값을 담을 때? 받을 때?
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || post === "" || post.length > 180) return;
    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "contents"), {
        post,
        createdAt: Date.now(),
        username: user?.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `contents/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        const fileType = file.type;
        if (fileType.startsWith("image/")) {
          await updateDoc(doc, {
            photo: url,
          });
        }

        if (fileType.startsWith("video/")) {
          await updateDoc(doc, {
            video: url,
          });
        }
        await updateDoc(doc, {
          photo: url,
          video: url,
        });
      }
      setPost("");
      setFile(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        onChange={onChange}
        value={post}
        name="contents"
        id="contents"
        placeholder="What is Happening?"
        required
      ></TextArea>
      <AttachFileButton htmlFor="file">
        {file ? "Contents Added ✔" : "Add 〰"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="video/*, image/*"
      />
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post"} />
    </Form>
  );
};

export default PostForm;
