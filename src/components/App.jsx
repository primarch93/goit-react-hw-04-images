import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppStyled } from "./App.styled"
import { Searchbar } from "./Searchbar/Searchbar";
import { Button } from "./Button/Button";
import { ImageGallery } from "./ImageGallery/ImageGallery"
import { fetchImages } from "../utils/service";
import { Dna } from 'react-loader-spinner'
import {Modal} from "./Modal/Modal"

export const App = () => {

  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalHits, setTotalHits] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      return
    }
    setIsLoading(isLoading => !isLoading);
    fetchImages(query, page).then(data => {
      const results = data.hits.map(image => ({ tags: image.tags, id: image.id, smallImage: image.webformatURL, largeImage: image.largeImageURL }));
      setTotalHits(data.totalHits);
      if (!data.totalHits) {
        return toast.error('There are no images for your request');
      }
      if (data.totalHits !== 0 && page === 1) {
        setImages(results);
        return toast.success(`There are ${data.totalHits} for your request`);
      } else { setImages(prevState => [...prevState, ...results]) }
       
    }
    ).catch(error => console.error(error)).finally(() => setIsLoading(isLoading => !isLoading));
  }, [query, page]);
  
const submitHandler = (query) => {
  window.scrollTo({ behavior: 'smooth', top: 0 });
  setQuery(query);
  setPage(1);
  }

 const onLoadMoreButton = () => {
   setPage(page => page + 1);
}

  const toggleModal = () => {
    setShowModal(showModal => !showModal);
  };

  const onImageClick = (event) => {
    const largeUrl = event.target.dataset.large;
    const targetAlt = event.target.alt;
    setShowModal(showModal => !showModal);
    setActiveImage({ largeUrl, targetAlt });
  };

    return (
      <AppStyled>
        <Searchbar onSubmit={submitHandler}></Searchbar>
        {isLoading && <Dna wrapperStyle={{ margin: '0 auto' }} />}
        <ImageGallery images={images} openModal={onImageClick} ></ImageGallery>
      {totalHits > images.length && <Button onLoadMoreButton={onLoadMoreButton} />}
      {showModal && <Modal image={activeImage} onClose={toggleModal}></Modal>}
      <ToastContainer></ToastContainer>
      </AppStyled>
    );
  }



  