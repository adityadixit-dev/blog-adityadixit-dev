type SlugsLayoutProps = {
  children: React.ReactNode;
};

export default function SlugsLayout({ children }: SlugsLayoutProps) {
  return (
    <div className="">
      <main className="">{children}</main>
    </div>
  );
}
