type SlugsLayoutProps = {
  children: React.ReactNode;
};

export default function SlugsLayout({ children }: SlugsLayoutProps) {
  return <main className="h-full no-scrollbar">{children}</main>;
}
