import errorImage from './error.jpg';
import PropTypes from 'prop-types';

export const ErrorView = ({ message }) => {
  return (
    <div role="alert">
      <img src={errorImage} alt="sad cat" width="240" />
      <p>{message}</p>
    </div>
  );
};

ErrorView.propTypes = {
  message: PropTypes.string,
};
