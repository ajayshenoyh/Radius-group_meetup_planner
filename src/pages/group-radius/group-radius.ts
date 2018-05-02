import { IonicPage, NavController, NavParams,Events, AlertController } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { LatLng } from '@ionic-native/google-maps';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import {GroupsProvider} from '../../providers/groups/groups';
/**
 * Generated class for the GroupRadiusPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-group-radius',
  templateUrl: 'group-radius.html',
})
export class GroupRadiusPage {
  @ViewChild('map') mapRef: ElementRef;
  map: any;
  options : GeolocationOptions;
  currentPos : Geoposition;
  places : Array<any>;
  bounds;
  poly;
  polygon;
  constructor(private launchNavigator: LaunchNavigator,public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams,public groupservice: GroupsProvider, public events: Events) {

  }
  ionViewDidLoad() {

    console.log('ionViewDidLoad GroupRadiusPage');
  }
    ionViewDidEnter() {
    this.groupservice.getlocations();
    this.events.subscribe('gotlocations', () => {
    this.bounds = new google.maps.LatLngBounds();
    var i;
    console.log(this.groupservice.grouplocation);
    this.poly = this.groupservice.grouplocation;
    if(this.poly[0] !== undefined) {
    this.poly.push(this.groupservice.grouplocation[0]);
    console.log(this.poly);
    this.polygon = new google.maps.Polygon({
     paths: this.poly,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });
    for (i = 0; i < this.poly.length; i++) {
      this.bounds.extend(this.poly[i]);
    }
    console.log(this.bounds.getCenter());
    this.addMap();
  }
  else {
    let alert = this.alertCtrl.create({
      title: 'Location Preference',
      subTitle: 'Please update your location preference and notify members',
      buttons: [{
        text: 'Try again',
        handler: data => {
          this.navCtrl.pop();
        }
      }]
    });
    alert.present();
  }
  })
  }
  ionViewWillLeave() {
    this.events.unsubscribe('gotlocations');
    this.groupservice.grouplocation = [];
  }
  addMap() {
    let mapOptions = {
    center:this.bounds.getCenter(),
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);

    this.addMarker();
    this.polygon.setMap(this.map);

    this.getRestaurants(this.bounds.getCenter(),'5000').then((results : Array<any>)=>{
      this.places = results;
      console.log(results);
    for(let i = 0 ;i < this.places.length ; i++)
    {
        this.createMarker(this.places[i]);
    }     
},(status)=>console.log(status));

if(typeof this.places == 'undefined') {
  this.getRestaurants(this.bounds.getCenter(),'10000').then((results : Array<any>)=>{
    this.places = results;
    for(let i = 0 ;i < this.places.length ; i++)
    {
        this.createMarker(this.places[i]);
    }     
},(status)=>console.log(status));
}

}


addMarker(){

  let marker = new google.maps.Marker({
  map: this.map,
  animation: google.maps.Animation.DROP,
  position: this.bounds.getCenter(),
  icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  });

  let content = "<p>This is the center position !</p>";          
  let infoWindow = new google.maps.InfoWindow({
  content: content
  });

  google.maps.event.addListener(marker, 'click', () => {
  infoWindow.open(this.map, marker);
  });
  
}

   
getRestaurants(latLng, radius)
{
    var service = new google.maps.places.PlacesService(this.map);
    let request = {
        location : latLng,
        radius: radius,
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
