import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

type Props = {
  children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
