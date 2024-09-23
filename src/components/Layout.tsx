import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <h2>Layout</h2>
      {/* Layout이 최상위 요소라서 아울렛 위에 쓰는건 모든 곳에서 나옴 */}
      <Outlet />
      {/*  기본 셋팅을 하는데 있어서 아울렛에서 장을 보고 온 것처럼 해당요소 밑에 자식요소 컴포넌트를 수집해올 수 있는 중간 매개 역할을 함 */}
    </>
  );
};

export default Layout;
