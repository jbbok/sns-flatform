import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Post from "./Post";
import { Unsubscribe } from "firebase/auth";

export interface IPost {
  id: string;
  createdAt: number;
  photo?: string; // ? + 옵셔널값이 됨
  video?: string;
  post: string;
  userId: string;
  username: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  padding: 0 10px;
`;

const TimeLine = () => {
  //개수가 정해지지 않았을때, IPost[]는 배열안에 IPost의 형태의 타입이 들어올것이라고 알려주는거고, 몇개의 개수가 올지 모를때 사용하는 형태이다. 만일 개수를 안다면, 타입스크립트의 튜플 형태로 [IPost, IPost] | [] 로 타입을 지정해줄 수 있다.
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "contents"),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const { createdAt, photo, video, post, userId, username } =
            doc.data();
          return {
            id: doc.id,
            createdAt,
            photo,
            video,
            post,
            userId,
            username,
          };
        });
        setPosts(posts);
      });
    };
    fetchPosts();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </Wrapper>
  );
};

export default TimeLine;
