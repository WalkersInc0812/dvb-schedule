import React from "react";

const Page = () => {
  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-[20px] font-bold">メールを確認してください</h1>
        <p>
          ログイン用のリンクをメールアドレス宛に送信しましたので、
          <br />
          メールをご確認ください。
        </p>
      </div>
    </div>
  );
};

export default Page;
