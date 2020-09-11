const insertResponse = response => {
    const responseSection = document.getElementById('response');
    let responseContainer = responseSection.firstChild;
    responseContainer && responseContainer.remove();
    responseContainer = document.createElement('pre');
    responseContainer.insertAdjacentText('beforeend', response);
    responseSection.insertAdjacentElement('beforeend', responseContainer);
};
const queryAPI = (urlBase, urlRest, thenDo) => {
    fetch(`${urlBase}/${urlRest}`)
    .then(response => {
        thenDo(response);
    })
    .catch(error => {
        insertResponse(error);
    })
};
const urlBase = 'https://covid19api.com';
const submitHandler = event => {
    event.preventDefault();
    const urlRestContainer = document.getElementById('detail');
    const urlRest = urlRestContainer.value;
    queryAPI(urlBase, urlRest, insertResponse);
};
const form = document.getElementById('request');
form.addEventListener('submit', submitHandler);
