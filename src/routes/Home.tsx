import styled from "styled-components";
import PostForm from "../components/PostForm";
import TimeLine from "../components/Timeline";

const Wrapper = styled.div`
  height: 90vh;
  display: grid;
  grid-template-rows: 1fr 5fr;
  gap: 50px;
`;

const Home = () => {
  return (
    <Wrapper>
      <PostForm />
      <TimeLine />
    </Wrapper>
  );
};

export default Home;
