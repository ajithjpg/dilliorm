import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import {FirebaseService} from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { AngularFireStorage } from "@angular/fire/storage";
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  exampleForm!: FormGroup;
  item: any;
  submitted = false;
  pic!:string;
  downloadURL!: Observable<string>;
 
  language = ['Tamil'];
  languageOptions = [
    { description: '1. tamil', value: 'Tamil', checked: false },
    { description: '2. English', value: 'English', checked: false },
    { description: '3. French', value: 'French', checked: false },
    { description: '4. Hindi', value: 'Hindi', checked: false },
  ];

 
 
  constructor( private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private storage: AngularFireStorage,
    public firebaseService: FirebaseService,
    private spinner: NgxSpinnerService,
    ) {
     
     }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.item = data.payload.data();
        this.item.id = data.payload.id;
        this.createForm();
        console.log(this.item.Relatives)
      }
    })
  }

  createForm() {
    this.exampleForm = this.fb.group({
      name: [this.item.name, Validators.required ],
      emailid: [this.item.emailid,[Validators.required, Validators.email]],
      language: this.fb.array([]),
      picurl: [this.item.picurl],
         phoneno: [this.item.phoneno, Validators.required ],
         gender: [this.item.gender, Validators.required],
         likeapp: [this.item.likeapp, Validators.required],
         password: [this.item.password, [Validators.required, Validators.minLength(6)]],
         confirmPassword: [this.item.confirmPassword, Validators.required],
         textarea:[this.item.textarea, Validators.required],
         Relatives: this.fb.array([]),
       
    });
    this.addProductFormGroup(),
  
    this.languageOptions.map(x => this.language.indexOf(x.value) >= 0 ? x.checked = true : x.checked = false)
    this.language.map((x) => this.ff.push(this.fb.control(x)))
  }
  get ff(){
    return this.exampleForm.get('language') as FormArray;
  }
  get f() { return this.exampleForm.controls; }
  onCheckChange(event:any) {
    const checkArray: FormArray = this.exampleForm.get('language') as FormArray;
    if (event.target.checked) {
      checkArray.push(this.fb.control(event.target.value));
    }
    else {
      checkArray.removeAt(this.ff.value.findIndex((x:any) => x === event.target.value))
    }
  }
  change(){
    console.log(this.pic)
  }
  
 
   
  
  
 

  
  addProductFormGroup() {
    let control = <FormArray>this.exampleForm.controls.Relatives;
    this.item.Relatives.forEach((x:any) => {
      control.push(this.fb.group({ 
        rel_name: x.rel_name, 
        rel_relation: x.rel_relation,
        rel_phone: x.rel_phone
        }))
    })
  }
  

  addProductButtonClick(): void {
    let control = <FormArray>this.exampleForm.controls.Relatives;
    control.push(
      this.fb.group({
       rel_name: [''],
       rel_relation:[''],
       rel_phone:['']
        // nested form array, you could also add a form group initially
       
      })
    )
  }
  
  deleteproduct(i:any){
    let control = <FormArray>this.exampleForm.controls.Relatives;
    control.removeAt(i)
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
  
  onSubmit(value:any){
    this.submitted = true;
    if (this.exampleForm.invalid) {
      return;
     } 
     if(window.confirm('Are you sure, you want to update?')){
    this.firebaseService.updateUser(this.item.id, value)
    .then(
      res => {
        this.router.navigate(['/home']);
      }
    )
     }
  }

  delete(){
    if(window.confirm('Are you sure, you want to Delete?')){
    this.firebaseService.deleteUser(this.item.id)
    .then(
      res => {
        this.router.navigate(['/home']);
      },
      err => {
        console.log(err);
      }
    )
    }
  }

  cancel(){
    this.router.navigate(['/home']);
  }

  }


