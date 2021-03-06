import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from './Icon';
import PaginationButton from './PaginationButton';

const Pagination = ({
  items,
  className,
  children,
  maxButtons = items,
  leftBtn,
  rightBtn,
  onSelect,
  activePage: activePageProp
}) => {
  const [activePage, setActivePage] = useState(
    activePageProp > 0 && activePageProp <= items ? activePageProp : 1
  );

  useEffect(() => {
    setActivePage(activePageProp);
  }, [activePageProp]);

  const onClick = useCallback(
    pageIdx => {
      if (pageIdx > 0 && pageIdx <= items) {
        if (onSelect) onSelect(pageIdx);
        setActivePage(pageIdx);
      }
    },
    [onSelect, items]
  );

  const renderButtons = useMemo(() => {
    if (children) return children;

    const buttonsCount = Math.min(maxButtons, items);

    const maxPos = items - buttonsCount;
    const halfButtons = parseInt(buttonsCount / 2, 10);

    let hiddenPagesBefore = activePage - halfButtons;
    if (hiddenPagesBefore > maxPos) {
      hiddenPagesBefore = maxPos + 1;
    }

    let from = Math.max(hiddenPagesBefore, 1);
    let to = Math.min(items, from + maxButtons - 1);

    const buttons = [
      <PaginationButton
        disabled={activePage === 1}
        key={'pagination-0'}
        onSelect={() => onClick(activePage - 1)}
      >
        {leftBtn}
      </PaginationButton>
    ];

    for (let i = from; i <= to; i++) {
      buttons.push(
        <PaginationButton
          active={i === activePage}
          key={`pagination-${i}`}
          onSelect={() => onClick(i)}
        >
          {i}
        </PaginationButton>
      );
    }

    buttons.push(
      <PaginationButton
        key={`pagination-${items + 1}`}
        disabled={activePage === items}
        onSelect={() => onClick(activePage + 1)}
      >
        {rightBtn}
      </PaginationButton>
    );

    return buttons;
  }, [children, maxButtons, items, activePage, onClick, leftBtn, rightBtn]);

  return <ul className={cx('pagination', className)}>{renderButtons}</ul>;
};

Pagination.propTypes = {
  /**
   * Number of items in the component
   */
  items: PropTypes.number.isRequired,
  /**
   * The initial activePage
   */
  activePage: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  maxButtons: PropTypes.number,
  onSelect: PropTypes.func,
  leftBtn: PropTypes.node,
  rightBtn: PropTypes.node
};

Pagination.defaultProps = {
  activePage: 1,
  items: 10,
  leftBtn: <Icon>chevron_left</Icon>,
  rightBtn: <Icon>chevron_right</Icon>
};

export default Pagination;
