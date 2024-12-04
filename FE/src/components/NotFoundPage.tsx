import { Result } from "antd";
function NotFoundPage() {
  return (
    <div className="flex justify-center items-center  relative h-screen">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        // extra={<Button type="primary" onClick={handleBackHome}>Back Home</Button>}
      />
    </div>
  );
}
export default NotFoundPage;
