export const LinkifyText = ({ text }: { text: string }) => {
  // 正規表現でURLを検出
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // テキストを分割してマッチ部分をリンクに置き換え
  const parts = text.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });

  return <>{parts}</>;
};
