type TProps = {
  children: React.ReactNode;
};

export const PageWrapper = ({ children }: TProps) => {
  return (
    <div className="container w-full justify-center mx-auto h-screen">
      {children}
    </div>
  ); 
};
 