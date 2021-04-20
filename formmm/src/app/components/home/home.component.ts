import { Component, OnInit } from '@angular/core';
import {FirebaseService} from 'src/app/services/firebase.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items: any[] = [];
  searchValue: string = "";
  //items: Array<any>;
 
  name_filtered_items: any[] =[]

  constructor(private router:Router,
    public firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.getData();
  }
  getData(){
    this.firebaseService.getUsers()
    .subscribe(result => {
      this.items = result;
     
      this.name_filtered_items = result;
      console.log(this.items);
    })
  }
   
    
  viewDetails(item:any){
    this.router.navigate(['/details/'+ item.payload.doc.id]);
  }
  capitalizeFirstLetter(value:any){
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  searchByName(){
    let value = this.searchValue.toLowerCase();
    this.firebaseService.searchUsers(value)
    .subscribe(result => {
      this.name_filtered_items = result;
    
    })
  }
  
}
