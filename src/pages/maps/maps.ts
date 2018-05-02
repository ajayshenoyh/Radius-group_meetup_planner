import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  LatLng,
  Circle
 } from '@ionic-native/google-maps';
/**
 * Generated class for the MapsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {
  @ViewChild('map') mapRef: ElementRef;
  map: any;
  options : GeolocationOptions;
  currentPos : Geoposition;
  places : Array<any>;
  imgSrc="/assets/no-image.jpg";
  constructor(public navCtrl: NavController, public geolocation: Geolocation,private launchNavigator: LaunchNavigator, public loadingCtrl: LoadingController ) {
    }
    ionViewDidEnter() {
        this.getUserPosition();

  } 

    getUserPosition(){
      
         let loading = this.loadingCtrl.create({
            content: 'Searching Location ...'
          });
          loading.present();
          setTimeout(() => {
            loading.dismiss();
          }, 5000);
        this.options = {
        enableHighAccuracy : false
        };
        this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

            loading.dismiss().then(() => {
            this.currentPos = pos;     
    
            console.log(pos);
            this.addMap(pos.coords.latitude,pos.coords.longitude);
            });
    
        },(err : PositionError)=>{
            console.log("error : " + err.message);
        });
  }

  addMap(lat,long){

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
    center: latLng,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);

    this.getRestaurants(latLng).then((results : Array<any>)=>{
        this.places = results;
        for(let i = 0 ;i < results.length ; i++)
        {
            this.createMarker(results[i]);
        }
    },(status)=>console.log(status));

    this.addMarker();
}
addMarker(){
  let marker = new google.maps.Marker({
  map: this.map,
  animation: google.maps.Animation.DROP,
  position: this.map.getCenter(),
  icon: '/assets/icon/bluedot.png'
  });

  let content = "<p>This is your current position !</p>";          
  let infoWindow = new google.maps.InfoWindow({
  content: content
  });

  google.maps.event.addListener(marker, 'click', () => {
  infoWindow.open(this.map, marker);
  });

}
   
getRestaurants(latLng)
{
    var service = new google.maps.places.PlacesService(this.map);
    let request = {
        location : latLng,
        rankBy: google.maps.places.RankBy.PROMINENCE,
        radius: '3000',
        types: ["restaurant","cafe","bar"]
    };
    return new Promise((resolve,reject)=>{
        service.nearbySearch(request,function(results,status){
            if(status === google.maps.places.PlacesServiceStatus.OK)
            {
                resolve(results);    
            }else
            {
                reject(status);
            }

        }); 
    });

}

createMarker(place) {
  var photos = place.photos;
  if (!photos) {
    return;
  }

  var marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: place.geometry.location,
    title: place.name,
    //icon: photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})
  });
}


startNavigation(lat, lng, name) {
    let dest = [
        lat,lng
    ]
    let start = [
        this.currentPos.coords.latitude,this.currentPos.coords.longitude
    ]
    let options: LaunchNavigatorOptions = {
        start: start,
        startName: "Your Location",
        transportMode: "driving",
        destinationName: name,
        app: this.launchNavigator.APP.GOOGLE_MAPS
      };
      
      this.launchNavigator.navigate(dest, options)
        .then(
          success => console.log('Launched navigator'),
          error => console.log('Error launching navigator', error)
        );
}
}