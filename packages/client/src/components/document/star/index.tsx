import { IconStar } from '@douyinfe/semi-icons';
import { Button, Tooltip } from '@douyinfe/semi-ui';
import { useDocumentCollectToggle } from 'data/collector';
import React from 'react';

interface IProps {
  documentId: string;
  disabled?: boolean;
  render?: (arg: {
    star: boolean;
    disabled: boolean;
    text: string;
    toggleStar: () => Promise<void>;
  }) => React.ReactNode;
}

export const DocumentStar: React.FC<IProps> = ({ documentId, disabled = false, render }) => {
  const { data, toggle: toggleStar } = useDocumentCollectToggle(documentId);
  const text = data ? '取消收藏' : '收藏文档';

  return (
    <>
      {render ? (
        render({ star: data, disabled, toggleStar, text })
      ) : (
        <Tooltip content={text} position="bottom">
          <Button
            icon={<IconStar />}
            theme="borderless"
            style={{
              color: data ? 'rgba(var(--semi-amber-4), 1)' : 'rgba(var(--semi-grey-3), 1)',
            }}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleStar();
            }}
          />
        </Tooltip>
      )}
    </>
  );
};
