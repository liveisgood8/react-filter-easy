import React from "react";
import AntTag from "antd/lib/tag";

interface ITagProps {
  className?: string;
  closable?: boolean;
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const Tag: React.FC<ITagProps> = ({
  className,
  closable,
  onClose,
  children
}) => {
  return (
    <AntTag className={className} closable={closable} onClose={onClose}>
      {children}
    </AntTag>
  );
};
