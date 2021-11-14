import React from 'react';
import { Text } from '@fluentui/react';

import styles from './Header.module.less';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Text variant="smallPlus">Windows Android Store</Text>
    </header>
  );
};
