import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { Cliente } from '../models/cliente';
import { ApiClienteService } from '../services/api-cliente.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  lstCliente: any;
  dtOptions: DataTables.Settings = {};
  cliente: Cliente = {}as Cliente;
  crearCliente:boolean = false;
  submitted:boolean = false;
  btnEditar: boolean = false;
  constructor(private formBuilder:FormBuilder, private apiCliente: ApiClienteService) { }
  formulario = this.formBuilder.group({
    Nombre_Cliente: ['',Validators.required],
    Telefono: ['',Validators.required],
    Nro_DNI: ['',Validators.required],
    Direccion: ['',Validators.required],
    Email: ['',Validators.required],
    Fecha_Nacimiento: ['',Validators.required],
    Fecha_Inscripcion: ['',Validators.required],
    /*Tema_Interes: ['',Validators.required],*/

  })
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.GetCliente();
  }

  get f(){return this.formulario.controls} //esta sentencia sirve para ponerle un alias al formulario.
  resetFormulario(){
    this.formulario.reset();
  }
  mostrarClientes(){
    this.btnEditar=false;
    this.crearCliente=true;
    this.resetFormulario();
  }

  GetCliente(){
    this.apiCliente.GetCliente().subscribe(response => {
      this.lstCliente = response.datos;
      console.log(response.datos)
    })
  }

  AddCliente() {
    this.submitted = true;
    if (this.formulario.invalid) {
      return;
    }

    Swal.fire({
      title: 'Cliente',
      text: '¿Desea guardar el cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, guardar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) 
      {
    
        this.cliente = Object.assign(this.cliente, this.formulario.value);
        console.log(this.cliente);
        this.apiCliente.addCliente(this.cliente).subscribe(response => {
          /*if(response.exito == 0){
            console.log(response.mensaje);
            return;
          }*/
          Swal.fire({
            title: 'Cliente',
            text: 'El cliente se guardo con exito',
            icon: 'success',
            showCancelButton: false,
          })     
           this.GetCliente(); 
        })
     
    
      }
  })
  }
  editCliente(oCliente: Cliente){
    this.formulario.controls.Nombre_Cliente.setValue(oCliente.nombre_Cliente)
    this.formulario.controls.Telefono.setValue(oCliente.telefono)
    this.formulario.controls.Nro_DNI.setValue(oCliente.nro_DNI)
    this.formulario.controls.Direccion.setValue(oCliente.direccion)
    this.formulario.controls.Email.setValue(oCliente.email)
    this.formulario.controls.Fecha_Nacimiento.setValue(oCliente.fecha_Nacimiento)
    this.formulario.controls.Fecha_Inscripcion.setValue(oCliente.fecha_Inscripcion)
    /*this.formulario.controls.Tema_Interes.setValue(oCliente.tema_Interes )
    this.formulario.controls.Estado.setValue(oCliente.estado)*/
    this.crearCliente = true;
    this.cliente.id = oCliente.id;
    this.btnEditar=true;
  }
  updateCliente(){
    Swal.fire({
      title: 'Cliente',
      text: '¿Desea editar el cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, guardar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) 
      {
    
        this.cliente = Object.assign(this.cliente, this.formulario.value);
    this.apiCliente.updateCliente(this.cliente).subscribe(response=>{     
      
          Swal.fire({
            title: 'Cliente',
            text: 'El cliente se editó con exito',
            icon: 'success',
            showCancelButton: false,
          })     
           this.GetCliente(); 
        })
     
    
      }
  })
    
  }

  desactivarCliente(cliente: Cliente){
    Swal.fire({
      title: 'Cliente',
      text: '¿Desea deshabilitar el cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, guardar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) 
      {
        this.apiCliente.desactivarCliente(cliente.id).subscribe(response => {          
      
          Swal.fire({
            title: 'Cliente',
            text: 'El cliente se deshabilitó con exito',
            icon: 'success',
            showCancelButton: false,
          })     
           this.GetCliente(); 
        }) 
      }
  })
  }
}
