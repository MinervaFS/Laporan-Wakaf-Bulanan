import { ToastContainer } from "react-toastify";
import InputLogin from "./component/InputLogin";

export default function Home() {
  return (
    <main>
      <ToastContainer />
      <div>
        <InputLogin />
      </div>
    </main>
  );
}
