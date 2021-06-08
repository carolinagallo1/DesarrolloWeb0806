import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { ApiAlquilerService } from '../services/api-alquiler.service';
import Swal from 'sweetalert2'
import { Alquiler } from '../models/alquiler';


@Component({
  selector: 'app-alquiler',
  templateUrl: './alquiler.component.html',
  styleUrls: ['./alquiler.component.css']
})
export class AlquilerComponent implements OnInit {
 
  crearAlquiler:boolean = false;  
  submitted:boolean = false;
  alquiler: Alquiler = {} as Alquiler;
  lstAlquiler:any;
  lstClientes:any;
  lstCDs:any;
  dtOptions: DataTables.Settings = {};
  detalleAlquler:any;
  mostrarDealle:boolean;
  codigoAlquiler: number;
  fechaActual:any;
  constructor(private formBuilder:FormBuilder, private apiAlquiler:ApiAlquilerService) { }
  formulario = this.formBuilder.group({
    ClienteId: ['',Validators.required],
    Fecha_Alquiler: ['',Validators.required],
    Valor_Alquiler: ['',Validators.required],
    CdIds: ['',Validators.required]

  })
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.getclientes();
    this.getcds();
    this.getAlquiler();
    this.fechaActual = new Date().toISOString();
  }
  get f(){return this.formulario.controls} //esta sentencia sirve para ponerle un alias al formulario.
  resetFormulario(){
    this.formulario.reset();
  }

  getclientes(){
    this.apiAlquiler.GetCliente().subscribe(response=>{
      if(response.exito == 1)
      {
        this.lstClientes = response.datos;   
      }
      
    })
  }
  getAlquiler(){
    this.apiAlquiler.GetAlquiler().subscribe(response=>{
      if(response.exito == 1)
      {
        this.lstAlquiler = response.datos;   
      }
      
    })
  }
  getcds(){
    this.apiAlquiler.GetCds().subscribe(response=>{
      if(response.exito == 1)
      {
        this.lstCDs = response.datos;
      }
    })
  }
  AddAlquiler() {
    this.submitted = true;
    if (this.formulario.invalid) {
      return;
    }

    Swal.fire({
      title: 'Alquiler',
      text: '¿Desea guardar el Alquiler?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, guardar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) 
      {
    
        this.alquiler = Object.assign(this.alquiler, this.formulario.value);
        console.log(this.alquiler);
        this.apiAlquiler.AddAlquiler(this.alquiler).subscribe(response => {
          /*if(response.exito == 0){
            console.log(response.mensaje);
            return;
          }*/
          Swal.fire({
            title: 'Alquiler',
            text: 'El alquiler se guardo con exito',
            icon: 'success',
            showCancelButton: false,
          })      
        }) 
      }
  })
  }
detalleAlquier(detalle, codigo){
this.detalleAlquler=detalle;
this.codigoAlquiler=codigo;
this.detalleAlquler=true;
}
sancionar(ClienteId, AlquilerId){
  //this.apiAlquiler.metodoSancionar(ClienteId, AlquilerId)
}
}
