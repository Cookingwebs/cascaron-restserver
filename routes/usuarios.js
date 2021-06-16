

const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');



const router = Router();

router.get('/', usuariosGet );

router.put('/:id',[
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom( esRoleValido ),
        validarCampos
], usuariosPut );

router.post('/', [
        check('nombre', 'el nombre es obligatorio').not().isEmpty(),
        check('password', 'la contraseña debe de tener más de 6 letras').isLength({min:6}),
        check('correo', 'el correo no es válido').isEmail(),
        check('rol').custom( esRoleValido ),
        check('correo').custom( emailExiste ),
        // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        validarCampos
], usuariosPost );

router.delete('/:id',[
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos
] , usuariosDelete );

router.patch('/', usuariosPatch );




module.exports = router;