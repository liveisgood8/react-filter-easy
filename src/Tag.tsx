/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import AntTag from 'antd/lib/tag';

const TagStyles = css({
  display: 'flex',
  alignItems: 'center',
});

interface ITagProps {
  className?: string;
  closable?: boolean;
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const Tag: React.FC<ITagProps> = ({
  className,
  closable,
  onClose,
  children,
}) => {
  return (
    <AntTag css={TagStyles} className={className} closable={closable} onClose={onClose}>
      {children}
    </AntTag>
  );
};
