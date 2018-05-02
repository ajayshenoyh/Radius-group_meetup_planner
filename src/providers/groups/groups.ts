import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';

/*
  Generated class for the GroupsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GroupsProvider {
  firegroup = firebase.database().ref('/groups');
  mygroups: Array<any> = [];
  currentgroup: Array<any> = [];
  groupdetails: Array<any> = [];
  grouplocation: Array<any> = [];
  currentgroupname;
  grouppic;
  groupmsgs;
  defaultLoc: {
    lat: "",
    lng: ""
  }
  constructor(public events: Events) {

  }

  addgroup(newGroup) {
    var promise = new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(newGroup.groupName).set({
        groupimage: newGroup.groupPic,
        msgboard: '',
        place: newGroup.groupPlace,
        date: newGroup.groupDate,
        time: newGroup.groupTime,
        desc: newGroup.groupDesc,
        location: '',
        owner: firebase.auth().currentUser.uid
      }).then(() => {
        this.firegroup.child(firebase.auth().currentUser.uid).child(newGroup.groupName).child('location').set({
            lat: '',
            lng: ''
        })
        resolve(true);
        }).catch((err) => {
          reject(err);
      })
    });
    return promise;
  }



  getmygroups() {
    this.firegroup.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
      this.mygroups = [];
      if(snapshot.val() != null) {
        var temp = snapshot.val();
        for (var key in temp) {
          var newgroup = {
            groupName: key,
            groupimage: temp[key].groupimage
          }
          this.mygroups.push(newgroup);
        }
      }
      this.events.publish('newgroup');
    })
    
  }

  getintogroup(groupname) {
    if (groupname != null) {
      this.firegroup.child(firebase.auth().currentUser.uid).child(groupname).once('value', (snapshot) => {
        if (snapshot.val() != null) {
          var temp = snapshot.val().members;
          this.currentgroup = [];
          for (var key in temp) {
            this.currentgroup.push(temp[key]);
          }
          this.currentgroupname = groupname;
         this.events.publish('gotintogroup');
        }
      })
    }
  }

  getownership(groupname) {
    var promise = new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(groupname).once('value', (snapshot) => {
        var temp = snapshot.val().owner;
        if (temp == firebase.auth().currentUser.uid) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      }).catch((err) => {
          reject(err);
      })
    })
    return promise;
  }

  getgroupimage() {
    return new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).once('value', (snapshot) => {
        this.grouppic = snapshot.val().groupimage;
        resolve(true);
    })
    })
    
  }

  addmember(newmember) {
    newmember.location = "";
    this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('members').push(newmember).then(() => {

     this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('members').orderByChild('uid').equalTo(newmember.uid).once('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
          childSnapshot.ref.child('location').set({
            lat: '',
            lng: ''
          })
          return false;
          })
        })
      this.getgroupimage().then(() => {
        this.firegroup.child(newmember.uid).child(this.currentgroupname).set({
          groupimage: this.grouppic,
          owner: firebase.auth().currentUser.uid,
          msgboard: ''
        }).catch((err) => {
          console.log(err);
        })
      })
      /*
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('members').orderByChild('uid').equalTo(newmember.uid).once('value', (snapshot) => {
        var tempkey = snapshot.val();
        for (var key in tempkey) {
        console.log(key);
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('members').child(key).update({
        location: "His"
      })
    }
      })*/
      this.getintogroup(this.currentgroupname);
    })

  }

  addownerlocation(loc) {
    var promise = new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).update({
        location: loc
      }).then(() => {
        resolve(true);
        }).catch((err) => {
          reject(err);
      })
    });
    return promise;
  }

  addmemberlocation(loc) {
    var promise = new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).once('value', (snapshot) => {
        var tempdata = snapshot.val().owner;
        console.log(tempdata);
      this.firegroup.child(tempdata).child(this.currentgroupname).child('members').orderByChild('uid').equalTo(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        var tempkey = snapshot.val();
        for (var key in tempkey) {
        console.log(key);
      this.firegroup.child(tempdata).child(this.currentgroupname).child('members').child(key).update({
        location: loc
      }).then(() => {
        resolve(true);
        }).catch((err) => {
          reject(err);
      })
    }
    });
  });
});
    return promise;
  }

  getlocations() {
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).once('value', (snapshot) => {
        if(snapshot.val().location.lat !== '' && snapshot.val().location.lng !== '')
        this.grouplocation.push(snapshot.val().location);
    this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('members').once('value', (snapshot) => {
      var tempvar = snapshot.val();
      for (var key in tempvar) {
        if(tempvar[key].location.lat !== '' && tempvar[key].location.lng !== '')
        this.grouplocation.push(tempvar[key].location);
      }
      this.events.publish('gotlocations');
      })
    });
  }


    
  deletemember(member) {           
    var currentgroup = this.currentgroupname;
    var ref = firebase.database().ref('/groups');        
    ref.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('members').orderByChild('uid').equalTo(member.uid).once('value',(snapshot) => {
      snapshot.forEach((childSnapshot) => {
        //remove each child
       childSnapshot.ref.remove().then(() => {
          ref.child(member.uid).child(currentgroup).remove().then(() => {
            this.getintogroup(currentgroup);
          })
        })
        return false;
      })
        })
  }

  getgroupmembers() {
    this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).once('value', (snapshot) => {
      var tempdata = snapshot.val().owner;
      this.firegroup.child(tempdata).child(this.currentgroupname).child('members').once('value', (snapshot) => {
        var tempvar = snapshot.val();
        for (var key in tempvar) {
          this.currentgroup.push(tempvar[key]);
        }
      })
    })

    this.events.publish('gotmembers');
  }
  getgroupdetails(groupName) {
    this.firegroup.child(firebase.auth().currentUser.uid).orderByKey().equalTo(groupName).once('value', (snapshot) => {
      var tempdata=snapshot.val();

      console.log('tempdata',snapshot.ref);
      for (var key in tempdata)
      this.groupdetails.push(tempdata[key]);
      })
      console.log(this.groupdetails);
    this.events.publish('gotdetails');
  }

  leavegroup() {
    return new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).once('value', (snapshot) => {
      var tempowner = snapshot.val().owner;
      this.firegroup.child(tempowner).child(this.currentgroupname).child('members').orderByChild('uid')
        .equalTo(firebase.auth().currentUser.uid).once('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
          childSnapshot.ref.remove().then(() => {
            this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).remove().then(() => {
              resolve(true);
            }).catch((err) => {
              reject(err);
            })
          }).catch((err) => {
            reject(err);
          })
          return false;
        })
      })
    })
    }) 
  }

  deletegroup() {
    return new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('members').once('value', (snapshot) => {
        var tempmembers = snapshot.val();
  
        for (var key in tempmembers) {
          this.firegroup.child(tempmembers[key].uid).child(this.currentgroupname).remove();
        }

        this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).remove().then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
        
      })
    })
  }

  addgroupmsg(newmessage) {
    return new Promise((resolve) => {

    
    this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('owner').once('value', (snapshot) => {
      var tempowner = snapshot.val();
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentgroupname).child('msgboard').push({
        sentby: firebase.auth().currentUser.uid,
        displayName: firebase.auth().currentUser.displayName,
        photoURL: firebase.auth().currentUser.photoURL,
        message: newmessage,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        if (tempowner != firebase.auth().currentUser.uid) {
          this.firegroup.child(tempowner).child(this.currentgroupname).child('msgboard').push({
            sentby: firebase.auth().currentUser.uid,
            displayName: firebase.auth().currentUser.displayName,
            photoURL: firebase.auth().currentUser.photoURL,
            message: newmessage,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          })
        }
        var tempmembers = [];
        this.firegroup.child(tempowner).child(this.currentgroupname).child('members').once('value', (snapshot) => {
          var tempmembersobj = snapshot.val();
          for (var key in tempmembersobj)
            tempmembers.push(tempmembersobj[key]);
        }).then(() => {
          let postedmsgs = tempmembers.map((item) => {
            if (item.uid != firebase.auth().currentUser.uid) {
              return new Promise((resolve) => {
                this.postmsgs(item, newmessage, resolve);
              })
            }
          })
          Promise.all(postedmsgs).then(() => {
            this.getgroupmsgs(this.currentgroupname);
            resolve(true);
          })
        })
      })
    })
    })  
  }

  postmsgs(member, msg, cb) {
    this.firegroup.child(member.uid).child(this.currentgroupname).child('msgboard').push({
            sentby: firebase.auth().currentUser.uid,
            displayName: firebase.auth().currentUser.displayName,
            photoURL: firebase.auth().currentUser.photoURL,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
      cb();
    })
  }

  getgroupmsgs(groupname) {
    this.firegroup.child(firebase.auth().currentUser.uid).child(groupname).child('msgboard').on('value', (snapshot) => {
      var tempmsgholder = snapshot.val();
      this.groupmsgs = [];
      for (var key in tempmsgholder)
        this.groupmsgs.push(tempmsgholder[key]);
      this.events.publish('newgroupmsg');
    })
  }

}