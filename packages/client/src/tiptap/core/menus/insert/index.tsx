import { IconPlus } from '@douyinfe/semi-icons';
import { Button, Dropdown } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { useUser } from 'data/user';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Editor } from 'tiptap/core';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';

import { COMMANDS, insertMenuLRUCache, transformToCommands } from '../commands';

export const Insert: React.FC<{ editor: Editor }> = ({ editor }) => {
  const { user } = useUser();
  const [recentUsed, setRecentUsed] = useState([]);
  const isTitleActive = useActive(editor, Title.name);
  const [visible, toggleVisible] = useToggle(false);

  const renderedCommands = useMemo(
    () => (recentUsed.length ? [{ title: '最近使用' }, ...recentUsed, ...COMMANDS] : COMMANDS),
    [recentUsed]
  );

  const runCommand = useCallback(
    (command) => {
      return () => {
        insertMenuLRUCache.put(command.label);
        setRecentUsed(transformToCommands(insertMenuLRUCache.get() as string[]));
        command.action(editor, user);
        toggleVisible(false);
      };
    },
    [editor, toggleVisible, user]
  );

  useEffect(() => {
    if (!visible) return;
    insertMenuLRUCache.syncFromStorage();
    setRecentUsed(transformToCommands(insertMenuLRUCache.get() as string[]));
  }, [visible]);

  return (
    <Dropdown
      zIndex={10000}
      trigger="click"
      position="bottomLeft"
      visible={visible}
      onVisibleChange={toggleVisible}
      style={{
        minWidth: 132,
        maxHeight: 'calc(90vh - 120px)',
        overflowY: 'auto',
      }}
      render={
        <Dropdown.Menu>
          {renderedCommands.map((command, index) => {
            return command.title ? (
              <Dropdown.Title key={'title' + index}>{command.title}</Dropdown.Title>
            ) : command.custom ? (
              command.custom(editor, runCommand)
            ) : (
              <Dropdown.Item key={index + '-' + command.label} onClick={runCommand(command)}>
                {command.icon}
                {command.label}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      }
    >
      <div>
        <Tooltip content="插入">
          <Button type="tertiary" theme="borderless" icon={<IconPlus />} disabled={isTitleActive} />
        </Tooltip>
      </div>
    </Dropdown>
  );
};
