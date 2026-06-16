'use client';

import { useMemo, useState } from 'react';
import styles from './MessageSearch.module.css';

type MessageSearchProps = {
  totalCount: number;
};

export function MessageSearch({ totalCount }: MessageSearchProps) {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(totalCount);

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const handleChange = (value: string) => {
    setQuery(value);

    const items = document.querySelectorAll<HTMLElement>('[data-search]');
    let nextVisibleCount = 0;

    items.forEach((item) => {
      const matches =
        value.trim().length === 0 ||
        (item.dataset.search ?? '').includes(value.trim().toLowerCase());

      item.style.display = matches ? '' : 'none';

      if (matches) {
        nextVisibleCount += 1;
      }
    });

    setVisibleCount(nextVisibleCount);
  };

  return (
    <section className={styles.searchPanel}>
      <label className={styles.label} htmlFor="message-search">
        Поиск по сообщениям
      </label>
      <input
        id="message-search"
        className={styles.input}
        type="search"
        placeholder="Текст, id или sender_id"
        value={query}
        onChange={(event) => handleChange(event.target.value)}
      />
      <p className={styles.counter}>
        {normalizedQuery
          ? `Найдено: ${visibleCount} из ${totalCount}`
          : `Всего сообщений: ${totalCount}`}
      </p>
    </section>
  );
}
