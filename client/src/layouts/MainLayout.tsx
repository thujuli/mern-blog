import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

type Props = {
  children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col alig">
      <div className="grow">
        <Navbar />
        {children}
      </div>
      <div className="grow-0">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
