import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore,private afAuth: AngularFireAuth) { }
  get userId() {
    if (this.afAuth.currentUser) {
      return this.afAuth.currentUser
    }
  }
  
  createUser(value:any ){
    const userId = this.userId;
   return this.db.collection('users/${userId}').add(value)
  
  }
  getUser(userKey:any){
    return this.db.collection('users').doc(userKey).snapshotChanges();
  }

  getUsers(){
    return this.db.collection('users').snapshotChanges();
  }

  searchUsers(searchValue:any){
    return this.db.collection('users',ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges()
  }
  updateUser(userKey:any, value:any){
    value.nameToSearch = value.name.toLowerCase();
    return this.db.collection('users').doc(userKey).set(value);
  }

  deleteUser(userKey:any){
    return this.db.collection('users').doc(userKey).delete();
  }

}
