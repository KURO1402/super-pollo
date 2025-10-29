DROP DATABASE IF EXISTS super_pollo;
CREATE DATABASE super_pollo;

USE super_pollo;

CREATE TABLE rolUsuarios (
idRol INT PRIMARY KEY AUTO_INCREMENT,
nombreRol VARCHAR(50) NOT NULL
);

CREATE TABLE tipoDocumento (  
idTipoDocumento INT PRIMARY KEY AUTO_INCREMENT,
nombreTipoDocumento VARCHAR(50) NOT NULL
);

CREATE TABLE usuarios (
idUsuario INT PRIMARY KEY AUTO_INCREMENT,
nombresUsuario VARCHAR(50) NOT NULL,
apellidosUsuario VARCHAR(50) NOT NULL,
correoUsuario VARCHAR(50) NOT NULL UNIQUE,
clave CHAR(60) NOT NULL,
numeroDocumentoUsuario VARCHAR(12) NOT NULL,
telefonoUsuario VARCHAR(15) NOT NULL,
estadoUsuario TINYINT(1) NOT NULL DEFAULT 1,
idRol INT DEFAULT 3,
idTipoDocumento INT,
FOREIGN KEY (idRol) REFERENCES rolUsuarios(idRol),
FOREIGN KEY (idTipoDocumento) REFERENCES tipoDocumento(idTipoDocumento) 
);

CREATE TABLE tarjetas (
idTarjeta INT PRIMARY KEY AUTO_INCREMENT,
tipoTarjeta ENUM('debito','credito') NOT NULL,
numeroTarjeta CHAR(60) NOT NULL,
nombreTitular CHAR(60) NOT NULL,
cvv CHAR(60) NOT NULL,
fechaVencimiento CHAR(60) NOT NULL,
idUsuario INT,
FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

CREATE TABLE verificacionCorreos (
    idVerificacion INT AUTO_INCREMENT PRIMARY KEY,
    correoVerificacion VARCHAR(100) NOT NULL,
    codigoVerificacion VARCHAR(6) NOT NULL,
    expiracionVerificacion DATETIME NOT NULL,
    verificado TINYINT(1) DEFAULT 0,
    registroVerificacion DATETIME DEFAULT CURRENT_TIMESTAMP
);


/* INSERTAR ROLES USUARIOS */
INSERT INTO rolUsuarios (nombreRol) 
VALUES ('Superadministrador'), ('Administrador'), ('Usuario');
/* INSERTAR TIPOS DOCUMENTOS */
INSERT INTO tipoDocumento (nombreTipoDocumento) 
VALUES ('DNI'), ('Carné de extranjería'), ('RUC');


