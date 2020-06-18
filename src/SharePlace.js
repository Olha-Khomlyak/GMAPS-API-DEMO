import { Modal } from './UI/Modal';
import { Map } from './UI/Map';
import { getLocationByAddress, getAddressByCoords } from './Utility/Location'

class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector('form');
    const locateUserBtn = document.getElementById('locate-btn');
    this.shareBtn = document.getElementById('share-btn');


    locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
    this.shareBtn.addEventListener('click',this.shareLocationHandler);
    addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
  }

  shareLocationHandler(){
    const shareLinkInput = document.getElementById('share-link');
    if(!navigator.clipboard){
      shareLinkInput.select();
      return;
    }
    navigator.clipboard.writeText(shareLinkInput.value)
    .then(()=>{
      alert('Copied to clipboard!')
    })
    .catch(err => {
      console.log(err);
      shareLinkInput.select();
    });
  }

  selectPlace(coordinates, address) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }
    this.shareBtn.disabled = false;
    const shareLinkInput = document.getElementById('share-link');
    shareLinkInput.value = `${location.origin}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${coordinates.lng}`
  }

   locateUserHandler() {
    if (!navigator.geolocation) {
      alert(
        'Location feature is not available in your browser - please use a more modern browser or manually enter an address.'
      );
      return;
    }
    const modal = new Modal(
      'loading-modal-content',
      'Loading location - please wait!'
    );
    modal.show();
    navigator.geolocation.getCurrentPosition(
      async successResult => {
        modal.hide();
        const coordinates = {
          lat: successResult.coords.latitude,
          lng: successResult.coords.longitude
        };
        const address = await getAddressByCoords(coordinates);
        modal.hide()
        this.selectPlace(coordinates, address);
      },
      error => {
        modal.hide();
        alert(
          'Could not locate you unfortunately. Please enter an address manually!'
        );
      }
    );
  }

  async findAddressHandler(event) {
    event.preventDefault();
    const address = event.target.querySelector('input').value;
    if(!address || address.trim().length === 0){
      alert('Invalid address!');
      return;
    }
    const modal = new Modal(
      'loading-modal-content',
      'Loading location - please wait!'
    );
    modal.show();
    try{
      const coordinates = await getLocationByAddress(address);
      this.selectPlace(coordinates);
    } catch(err){
      alert(err.message);
    }
    modal.hide();

  }
}

const placeFinder = new PlaceFinder();
