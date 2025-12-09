import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="layoutRoot">
      <Sidebar />

      <div className="mainArea">
        <Topbar title={title} subtitle={subtitle} />
        <div className="pageContent">{children}</div>
      </div>
    </div>
  );
}
