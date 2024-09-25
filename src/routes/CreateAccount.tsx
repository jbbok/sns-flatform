import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import {
  Form,
  Input,
  Title,
  Wrapper,
  Error,
} from "../components/auth-components";

const CreateAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e);
    // e.target.value;
    const {
      target: { name, value },
    } = e;

    if (name === "name") setName(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  // any를 쓰기보단 직접 값을 지정해주는 게 좋음!
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(name, email, password);
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      // create an account 계정 생성
      // set the name of the user 유저 네임 설정
      // redirect to the home page
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials);
      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate("/");
    } catch (e: any) {
      // setError()
      console.log(e);
      if (e instanceof FirebaseError) {
        setError(e.message);
        // console.log(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>🤍Log into🤍</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          type="text"
          placeholder="Name"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          type="email"
          placeholder="Email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          type="password"
          placeholder="Name"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
};

export default CreateAccount;
