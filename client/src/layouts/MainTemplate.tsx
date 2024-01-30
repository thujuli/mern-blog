import Header from "../components/Header";

type MainTemplateProps = {
  children: React.ReactNode;
};
export default function MainTemplate({ children }: MainTemplateProps) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
    </div>
  );
}
