import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { SearchBar } from '../Searchbar/Searchbar';
import { Loader } from 'components/Loader/Loader';
import { ErrorView } from 'components/Error/Error';
import { LoadMoreButton } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';
import css from './App.module.css';
import { fetchImage, controller } from 'api';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [showModal, setShowModal] = useState(false);
  const [largeImage, setlargeImage] = useState('');

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    setStatus(Status.PENDING);

    fetchMoreImages();

    return () => {
      controller.abort();
    };
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMoreImages = () => {
    fetchImage(searchQuery, page)
      .then(images => {
        setImages(prevImages => [...prevImages, ...images]);
        setPage(prevPage => prevPage + 1);
        setStatus(Status.RESOLVED);
      })
      .catch(error => setError(error, Status.REJECTED));
  };

  const onHandleFormSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setPage(1);
    setImages([]);
    setError(null);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const onOpenModal = event => {
    if (event.target.nodeName === 'IMG') {
      toggleModal();
    }

    const targetImg = images.find(({ id }) => id === Number(event.target.id));
    setlargeImage(targetImg.largeImageURL);
  };

  if (status === Status.IDLE) {
    return (
      <div className={css.app}>
        <SearchBar onSubmit={onHandleFormSubmit} />
        <ToastContainer />
      </div>
    );
  }

  if (status === Status.PENDING) {
    return (
      <div className={css.app}>
        <SearchBar onSubmit={onHandleFormSubmit} />
        <div className={css.loader}>
          <Loader />
        </div>
      </div>
    );
  }

  if (status === Status.REJECTED) {
    return <ErrorView message={error.message}></ErrorView>;
  }

  if (status === Status.RESOLVED) {
    return (
      <div className={css.app}>
        <SearchBar onSubmit={onHandleFormSubmit} />
        <ImageGallery images={images} onClick={onOpenModal}></ImageGallery>
        {showModal && (
          <Modal
            largeImage={largeImage}
            images={images}
            onClick={toggleModal}
          />
        )}
        {images.length > 0 && <LoadMoreButton onClick={fetchMoreImages} />}
      </div>
    );
  }
};
