import css from './Button.module.css';
import PropTypes from 'prop-types';

export const LoadMoreButton = ({ onClick }) => {
  return (
    <button className={css.button} onClick={onClick}>
      Load more
    </button>
  );
};

LoadMoreButton.propTypes = { onClick: PropTypes.func };
