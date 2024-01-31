import Navbar from "../components/Navbar";

type Props = {
  children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
