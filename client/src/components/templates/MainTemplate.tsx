import Navbar from "../organisms/Navbar";

type MainTemplateProps = {
  children: React.ReactNode;
};
export default function MainTemplate({ children }: MainTemplateProps) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
