const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { query } = require('express-validator');

const usuariosGet = async(req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { estado : true};

    const [ total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
          .skip(Number( from ))
          .limit(Number( limit ))
    ]);

    res.json({
       total,
       usuarios
    });
  }

const usuariosPut = async(req, res = response) => {

    const {id} = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar contra base de datos

    if( password ){
      // encriptar la contraseña
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );


    res.json({
        usuario
    });
  }

const usuariosPost = async(req, res = response) => {

 


    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({
      nombre, correo, password, rol
    });

    // verificar si el correo existe

   

    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );


    //Guardar en DB
    await usuario.save();

    res.json({
        usuario
    });
  }

const usuariosDelete = async(req, res = response) => {
  const {id} = req.params;
  

  //Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado : false});

    res.json({
       usuario
    });
  }

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patch API - Controlador"
    });
  }


  module.exports = {
      usuariosGet,
      usuariosPut,
      usuariosPost,
      usuariosDelete,
      usuariosPatch
  }