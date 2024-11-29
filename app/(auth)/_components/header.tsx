import React from "react";

const Header = () => {
  return (
    <div className="bg-primary text-primary-foreground h-[56px] text-[20px] font-medium">
      <div className="max-w-md flex justify-between items-center h-full mx-auto p-[16px]">
        {process.env.NEXT_PUBLIC_SITE_NAME}
      </div>
    </div>
  );
};

export default Header;
