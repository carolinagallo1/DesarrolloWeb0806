import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { Cds } from '../models/cds';
import { ApiCdsService } from '../services/api-cds.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cds',
  templateUrl: './cds.component.html',
  styleUrls: ['./cds.component.css']
})
export class CdsComponent implements OnInit {
  lstCds: any;
  dtOptions: DataTables.Settings = {};
  cds: Cds = {}as Cds;
  crearCds:boolean=false;
  submitted:boolean = false;
  btnEditar: boolean = false;
  constructor(private formBuilder:FormBuilder, private apiCds: ApiCdsService) { }
  formulario = this.formBuilder.group({
    Condicion: ['',Validators.required],
    Titulo: ['',Validators.required],
    Ubicacion: ['',Validators.required],
    Estado: ['',Validators.required],
  })
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.GetCds();
  }
  get f(){return this.formulario.controls} //esta sentencia sirve para ponerle un alias al formulario.


  resetFormulario(){
    this.formulario.reset();
  }
  mostrarCds(){
    this.btnEditar=false;
    this.crearCds=true;
    this.resetFormulario();
  }

  GetCds(){
    this.apiCds.GetCds().subscribe(response => {
      this.lstCds = response.datos;
    })
  }

  AddCds() {
    this.submitted = true;
    if (this.formulario.invalid) {
      return;
    }

    Swal.fire({
      title: 'Cd',
      text: '¿Desea guardar el Cd?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, guardar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) 
      {    
        this.cds = Object.assign(this.cds, this.formulario.value);
        console.log(this.cds);
        this.apiCds.addCds(this.cds).subscribe(response => {
          /*if(response.exito == 0){
            console.log(response.mensaje);
            return;
          }*/
          Swal.fire({
            title: 'Cd',
            text: 'El cd se guardó con exito',
            icon: 'success',
            showCancelButton: false,
          })     
           this.GetCds(); 
        })    
    
      }
  })
  
  }
  editCds(oCds: Cds){
    this.formulario.controls.Condicion.setValue(oCds.condicion)
    this.formulario.controls.Titulo.setValue(oCds.condicion)
    this.formulario.controls.Ubicacion.setValue(oCds.ubicacion)
    this.formulario.controls.Estado.setValue(oCds.estado)
    this.crearCds = true;
    this.cds.id = oCds.id;
    this.btnEditar=true;
  }
  updateCds(){
    Swal.fire({
      title: 'Cd',
      text: '¿Desea editar el Cd?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, guardar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) 
      {    
        this.cds = Object.assign(this.cds, this.formulario.value);
        this.apiCds.updateCds(this.cds).subscribe(response=>{                 
         
          Swal.fire({
            title: 'Cd',
            text: 'El cd se editó con exito',
            icon: 'success',
            showCancelButton: false,
          })     
           this.GetCds(); 
        })    
    
      }
  })
  
  }

  desactivarCds(cds: Cds){
    Swal.fire({
      title: 'Cd',
      text: '¿Desea desactivar el Cd?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, guardar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) 
      {    
        this.apiCds.desactivarCds(cds.id).subscribe(response => {               
         
          Swal.fire({
            title: 'Cd',
            text: 'El cd se desactivó con exito',
            icon: 'success',
            showCancelButton: false,
          })     
           this.GetCds(); 
        })    
    
      }
  }) 
  }

}
