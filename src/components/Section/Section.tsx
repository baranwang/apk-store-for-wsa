import React from 'react';
import { Text } from '@fluentui/react';

import classNames from 'classnames';
import styles from './Section.module.less';

export const Section: React.FC<
  {
    title?: string;
  } & React.HTMLAttributes<HTMLElement>
> = ({ title, className, children, ...otherProps }) => {
  return (
    <section {...otherProps} className={classNames(className, styles.section)}>
      {title && (
        <div className={styles['section-title']}>
          <Text variant="large">{title}</Text>
        </div>
      )}
      <div className={styles['section-content']}>{children}</div>
    </section>
  );
};
