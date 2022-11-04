import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  key: '22700544-764c96f41fa5b4534127a131f',
  image_type: 'photo',
  orientation: 'horizontal',
  per_page: 12,
};

export const controller = new AbortController();

export const fetchImage = async (searchText, page) => {
  return await axios
    .get('', {
      params: {
        q: searchText,
        page: page,
        signal: controller.signal,
      },
    })
    .then(response => response.data.hits);
};
