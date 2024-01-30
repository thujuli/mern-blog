import Header from "../components/Header";

type Props = {
  children: React.ReactNode;
};
export default function MainTemplate({ children }: Props) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
    </div>
  );
}
