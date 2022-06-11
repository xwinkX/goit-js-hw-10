import './css/styles.css';
import { fetchCountryes } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryesEl = document.querySelector('.country-info');
inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const onInputValue = event.target.value.trim();
  if (onInputValue === '') {
    countryesEl.innerHTML = '';
  } else {
    fetchCountryes(onInputValue)
      .then(r => {
        if (r.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else {
          renderCountryes(r);
        }
      })
      .catch(error =>
        Notiflix.Notify.failure('"Oops, there is no country with that name"')
      );
  }

  function renderCountryes(countries) {
    if (countries.length > 1) {
      const markup = countries
        .map(({ flags, name }) => {
          return `<h1 class='country-list'><img src='${flags.svg}' alt="flag" width='40px'>${name.official}</h1>`;
        })
        .join('');
      countryesEl.innerHTML = markup;
    } else {
      const markup = countries
        .map(({ flags, name, capital, population, languages }) => {
          return `
                <h1 class='country-list'><img src='${
                  flags.svg
                }' alt="flag" width='40px'>${name.official}</h1>
              <p class='country-info'>Capital: ${capital}</p>
              <p class='country-info'>Population: ${population}</p>
              <p class='country-info'>Languages: ${Object.values(
                languages
              )}</p>`;
        })
        .join('');
      countryesEl.innerHTML = markup;
    }
  }
}
