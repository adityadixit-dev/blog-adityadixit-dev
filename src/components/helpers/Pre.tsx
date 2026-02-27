"use client";

import { Check, Clipboard } from "lucide-react";
import { DetailedHTMLProps, HTMLAttributes, useRef, useState } from "react";
import { Button } from "../ui/button";

export default function Pre({
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleClickCopy = async () => {
    const code = preRef.current?.textContent;

    if (code) {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  return (
    <pre ref={preRef} {...props} className="relative">
      <Button
        size="icon-lg"
        disabled={isCopied}
        onClick={handleClickCopy}
        className="absolute right-4 size-8 hover:cursor-pointer"
        variant="outline"
      >
        {isCopied ? <Check /> : <Clipboard />}
      </Button>
      {children}
    </pre>
  );
}
