import { Map } from './UI/Map';

class SharedPlace {
    constructor(coordinats, address){
        new Map(coordinats);
        const title = document.querySelector('header h1');
        title.textContent = address;
    }
}
const url = new URL(location.href);
const queryParam = url.searchParams;
const cord = {
    lat: +queryParam.get('lat'),
    lng: +queryParam.get('lng')  

}
console.log(cord.lat, cord.lng);

const address = queryParam.get('address');
new SharedPlace(cord, address);