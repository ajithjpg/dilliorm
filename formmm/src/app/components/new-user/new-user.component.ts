import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import {FirebaseService} from 'src/app/services/firebase.service';
import { map, finalize } from "rxjs/operators";
import { NEVER, Observable } from "rxjs";
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularFireStorage } from "@angular/fire/storage";
@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  exampleForm!: FormGroup;
  submitted = false;

  selectedFile : any[] = [];
 pic:any;
 


  downloadURL!: Observable<string>;
  language = [];
  languageOptions = [
    { description: '1. tamil', value: 'Tamil', checked: false },
    { description: '2. English', value: 'English', checked: false },
    { description: '3. French', value: 'French', checked: false },
    { description: '4. Hindi', value: 'Hindi', checked: false },
  ];
  constructor( public fb: FormBuilder,

    public router: Router,
    public storage: AngularFireStorage,
    public firebaseService: FirebaseService,
    public spinner: NgxSpinnerService) {

    }

  ngOnInit(): void {
    this.createForm();
  
  }
  createForm() {
   
    this.exampleForm = this.fb.group({
      name: ['', Validators.required ],
     emailid:['', [Validators.required, Validators.email]],
         phoneno: ['', [Validators.required]],
         gender: ['', Validators.required],
        
     
         picurl: this.pic,
         likeapp: ['', Validators.required],
         password: ['', [Validators.required, Validators.minLength(6)]],
         confirmPassword: ['', Validators.required],
         textarea:['', Validators.required],
          Relatives: this.fb.array([this.addProductFormGroup()]),
         language: this.fb.array([]),
    });
    //this.languageOptions.map(x => this.language.indexOf(x.value)>= 0 ? x.checked = true : x.checked = false)
    this.language.map((x) => this.ff.push(this.fb.control(x)))
   
  }
  change(){
    console.log(this.pic)
  }
  get f() { return this.exampleForm.controls; }
  get ff(){
    return this.exampleForm.get('language') as FormArray;
  }
  onCheckChange(event:any) {
    if (event.target.checked) {
      this.ff.push(this.fb.control(event.target.value));
    }
    else {
      this.ff.removeAt(this.ff.value.findIndex((x:any) => x === event.target.value))
    }
  }

  addProductFormGroup(): FormGroup {
    return this.fb.group({
      rel_name: ["", Validators.required],
       rel_relation: ["", Validators.required],
       rel_phone: ["", Validators.required],
      
    });
  }
  addProductButtonClick(): void {
    let control = <FormArray>this.exampleForm.controls.Relatives;
    control.push(this.addProductFormGroup())
  
  }
delete(i:any){
  if(window.confirm('Are you sure, you want to delete?')){
  let control = <FormArray>this.exampleForm.controls.Relatives;
  control.removeAt(i)
  }
}





 
  resetFields(){
   
    this.exampleForm = this.fb.group({
      name: new FormControl('', Validators.required),
      emailid: new FormControl('', Validators.required ),
       ///Comments:new FormControl('', Validators.required ),
     language:new FormControl('', Validators.required),
      phoneno: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      likeapp: new FormControl('', Validators.required),
  
   
    });
  }
  onSubmit(value:any){
    this.submitted = true;
    if (this.exampleForm.invalid) {
      return;
     } 
         
 this.firebaseService.createUser(value)
     .then(
       res => {
         this.resetFields();
         this.router.navigate(['/home']);
         console.log(value);
       
       }
     )
      
 }
  
 onReset() {
  this.submitted = false;
  this.exampleForm.reset();
}


        

onSelectFile(event:any) {
  this.spinner.show();
  var n = Date.now();
  const file = event.target.files[0];
 
  const filePath = `RoomsImages/${n}`;
  const fileRef = this.storage.ref(filePath);
  const task = this.storage.upload(`RoomsImages/${n}`, file);
  task

    .snapshotChanges()
    .pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            this.pic = url;
            
          }
          console.log(this.pic);
          this.spinner.hide();
        });
      })
    )
    .subscribe(url => {
      if (url) {
       
        console.log(url);
      }
    });
  }
  
}


