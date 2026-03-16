# PRÁCTICA GUIADA NEON
## 1. Introducción
En esta práctica, se explorará el uso de Neon, una biblioteca de Rust para la creación de interfaces gráficas de usuario (GUI). Neon permite a los desarrolladores construir aplicaciones de escritorio con una experiencia de usuario moderna y atractiva. A lo largo de esta práctica, se cubrirán los conceptos básicos de Neon, cómo configurar un proyecto y crear una aplicación simple con una interfaz gráfica.

## 2. Configuración del Proyecto

### 2.1. Paso 1 - Crear cuenta
Antes de comenzar, es necesario crear una cuenta en el sitio web de Neon. Esto se puede hacer visitando [Neon](https://neon.tech/) y siguiendo el proceso de registro.
![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)

### 2.2. Paso 2 - Crear un nuevo proyecto
Una vez que hayas creado tu cuenta, inicia sesión y crea un nuevo proyecto. Esto se puede hacer desde el panel de control de Neon, donde encontrarás una opción para crear un nuevo proyecto. Sigue las instrucciones para configurar tu proyecto, eligiendo un nombre y una descripción adecuada.
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)

### 2.3. Paso 3 - Crear la Base de Datos
Después de crear tu proyecto, el siguiente paso es configurar una base de datos. Neon ofrece una opción para crear una base de datos PostgreSQL. Sigue las instrucciones para configurar tu base de datos, incluyendo la selección de un nombre y la configuración de las credenciales de acceso.

Seleccionar:
- Región
- Nombre del proyecto
- Automáticamente crea:
- Branch principal (main)
- Endpoint de conexión

### 2.4. Paso 4 - Obtener el string de conexión
Una vez que hayas configurado tu base de datos, necesitarás obtener el string de conexión para poder conectarte a ella desde tu aplicación. Esto se puede hacer desde el panel de control de Neon, donde encontrarás una sección para gestionar tu base de datos. Copia el string de conexión, ya que lo necesitarás más adelante para configurar tu aplicación.
![alt text](image-6.png)
![alt text](image-7.png)

postgresql://neondb_owner:npg_y7gns1jZrmEk@ep-patient-rice-airjnml2-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

## 3. Creación de la Aplicación con Node.js
### 3.1. Paso 1 - Configurar el entorno de desarrollo
Para crear una aplicación con Neon, primero necesitas configurar tu entorno de desarrollo. Asegúrate de tener Node.js instalado en tu máquina. En caso de no tenerlo instalado, puedes descargarlo desde [Node.js](https://nodejs.org/). o puedes usar el siguiente comando para instalarlo:
En sistemas basados en Debian/Ubuntu, puedes usar el siguiente comando para instalar Node.js:
```bash
sudo apt-get install nodejs
```
En sistemas basados en windows, puedes descargar el instalador desde el sitio web oficial de Node.js y seguir las instrucciones de instalación.

Luego, puedes crear un nuevo proyecto de Node.js utilizando el siguiente comando en tu terminal:

```bash
mkdir neon-app
cd neon-app
npm init -y
```
### 3.2. Prueba de conexión a la base de datos
Antes de continuar con la instalación de Neon, es importante verificar que puedes conectarte a tu base de datos utilizando el string de conexión. Para este caso vamos a usar el paquete `pg` de Node.js para conectarnos a la base de datos PostgreSQL. Puedes instalarlo utilizando el siguiente comando:

```bash
npm install pg
```

![alt text](image-8.png)

Luego, puedes crear un archivo `index.js` y agregar el siguiente código para probar la conexión a tu base de datos:

```javascript
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  await client.connect();
  const res = await client.query('SELECT NOW()');
  console.log(res.rows);
  await client.end();
}

test();
```

Asegúrate de reemplazar `process.env.DATABASE_URL` con el string de conexión que obtuviste en el paso anterior. Ejecuta el archivo `index.js` para verificar que la conexión a la base de datos sea exitosa.

También puedes configurar una variable de entorno para almacenar tu string de conexión de manera segura. En sistemas basados en Unix, puedes usar el siguiente comando para establecer la variable de entorno:

```bash
export DATABASE_URL="postgresql://neondb_owner:npg_y7gns1jZrmEk@ep-patient-rice-airjnml2-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```
En sistemas basados en Windows, puedes usar el siguiente comando para establecer la variable de entorno:

```cmd
setx DATABASE_URL "postgresql://neondb_owner:npg_y7gns1jZrmEk@ep-patient-rice-airjnml2-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

El comando anterior crea una variable de entorno en este caso una variable a nivel solo de usuario, lo que significa que estará disponible solo para el usuario actual. 
![alt text](image-9.png)
Si deseas crear una variable de entorno a nivel del sistema, puedes usar el siguiente comando:

```cmd
setx DATABASE_URL "postgresql://neondb_owner:npg_y7gns1jZrmEk@ep-patient-rice-airjnml2-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" /M
``` 
![alt text](image-10.png)

Una vez que hayas configurado la variable de entorno, puedes ejecutar tu aplicación utilizando el siguiente comando:

```bash
node index.js
```

Tener en cuenta si se usa por ejemplo visual studio code, que se debe reiniciar el proceso por completo, es decir cerrar todas las ventanas de visual studio code y volver a abrirlo para que la variable de entorno esté disponible en el entorno de desarrollo.

Otra forma de trabajar comunmente los proyectos de Node es usar dotenv que es una biblioteca que permite cargar variables de entorno desde un archivo `.env` en el directorio raíz de tu proyecto. Para usar dotenv, primero debes instalarlo utilizando el siguiente comando:

```bash
npm install dotenv
```
Luego, puedes crear un archivo `.env` en el directorio raíz de tu proyecto y agregar tu string de conexión de la siguiente manera:

```env
DATABASE_URL_NEON=postgresql://neondb_owner:npg_y7gns1jZrmEk@ep-patient-rice-airjnml2-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Después de configurar tu archivo `.env`, puedes cargar las variables de entorno en tu aplicación utilizando el siguiente código al inicio de tu archivo `index.js`:

```javascript
import 'dotenv/config'
import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL_NEON,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  await client.connect();
  const res = await client.query('SELECT NOW()');
  console.log(res.rows);
  await client.end();
}
test();
```
Ahora ejecuta tu aplicación nuevamente para verificar que la conexión a la base de datos sea exitosa utilizando el comando:

```bash
node index.js
```

![alt text](image-11.png)

### 3.3. Paso 2 - Creación de tablas desde cliente SQL o script
Una vez que hayas verificado que puedes conectarte a tu base de datos, el siguiente paso es crear las tablas necesarias para tu aplicación. Puedes hacer esto utilizando un cliente SQL como pgAdmin o DBeaver, o también puedes ejecutar un script SQL desde tu aplicación.

desde pgAdmin nos conectamos de la siguiente manera:

1. Crear una nueva conexión en pgAdmin.
2. Completar los campos de conexión con la información proporcionada por Neon.
   
| Campo pgAdmin        | Valor                             |
| -------------------- | --------------------------------- |
| Host name/address    | `ep-xxxx.us-east-2.aws.neon.tech` |
| Port                 | `5432`                            |
| Maintenance database | `neondb`                          |
| Username             | `neondb_owner`                    |
| Password             | tu password de Neon               |

3. Guardar la conexión y conectarse a la base de datos.
4. Una vez conectado, puedes ejecutar el siguiente script SQL para crear una tabla de ejemplo:

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre TEXT,
  pais TEXT
);

INSERT INTO usuarios (nombre, pais)
VALUES ('Ana', 'Colombia'),
       ('Luis', 'México');

SELECT * FROM usuarios;
```
![alt text](image-12.png)

Verificamos los datos de manera gráfica

![alt text](image-13.png)

### 3.4. Paso 3 - Crear la aplicación Node que conecte con Neon

Ahora que tienes tu base de datos configurada y las tablas creadas, el siguiente paso es crear una aplicación Node.js que se conecte a tu base de datos Neon y realice operaciones básicas como insertar y consultar datos. Puedes usar el siguiente código como punto de partida para tu aplicación:
```javascript
import 'dotenv/config'
import pkg from 'pg';
const { Client } = pkg;
const client = new Client({
  connectionString: process.env.DATABASE_URL_NEON,
  ssl: { rejectUnauthorized: false }
});
async function main() {
  try {
    await client.connect();
    console.log('Conexión exitosa a la base de datos Neon');

    const insertQuery = 'INSERT INTO usuarios (nombre, pais) VALUES ($1, $2) RETURNING *';
    const insertValues = ['Carlos', 'Argentina'];
    const insertResult = await client.query(insertQuery, insertValues);
    console.log('Usuario insertado:', insertResult.rows[0]);

    const selectQuery = 'SELECT * FROM usuarios';
    const selectResult = await client.query(selectQuery);
    console.log('Usuarios en la base de datos:');
    selectResult.rows.forEach(user => {
      console.log(`ID: ${user.id}, Nombre: ${user.nombre}, País: ${user.pais}`);
    });
  } catch (error) {
    console.error('Error al conectar o ejecutar consultas:', error);
  } finally {
    await client.end();
  }
}
main();
```
Este código se conecta a tu base de datos Neon, inserta un nuevo usuario en la tabla `usuarios` y luego consulta y muestra todos los usuarios presentes en la tabla. Asegúrate de ejecutar este código para verificar que todo funcione correctamente.

Ahora ejecutamos la aplicación utilizando el siguiente comando:
```bash
node index.js
```

![alt text](image-14.png)

En el cliente SQL podemos verificar que el nuevo usuario ha sido insertado correctamente:
![alt text](image-15.png)

## 4. Creación de un Branch en NEON
Neon permite trabajar con ramas (branches) para gestionar diferentes versiones de tu base de datos. Para crear un nuevo branch, sigue estos pasos:
1. Accede al panel de control de tu proyecto en Neon.
2. Navega a la sección de "Branches" o "Ramas".
3. Haz clic en "Crear nuevo branch" o "Create new branch".

![alt text](image-16.png)

4. Asigna un nombre a tu nuevo branch y selecciona la base de datos de origen (por ejemplo, el branch principal).

![alt text](image-17.png)

5. Haz clic en "Crear" o "Create" para finalizar la creación del nuevo branch.

![alt text](image-18.png)

Una vez que hayas creado tu nuevo branch, puedes conectarte a él utilizando el string de conexión específico para ese branch. Esto te permitirá trabajar con una versión aislada de tu base de datos, lo que es útil para pruebas y desarrollo sin afectar la base de datos principal.

## 5. Conexión a la rama dev y modificación de datos
Después de crear tu nuevo branch (por ejemplo, `dev`), necesitarás obtener el string de conexión específico para ese branch. Esto se puede hacer desde el panel de control de Neon, donde encontrarás una sección para gestionar tus branches. Copia el string de conexión para el branch `dev`. Luego, actualiza tu aplicación Node.js para usar el nuevo string de conexión. Puedes hacerlo modificando tu archivo `.env` o directamente en el código de conexión.

Configuramos el nuevo server en pgadmin como se muestra en la imagen:

![alt text](image-19.png)

Ahora vamos a modificar el código de nuestra aplicación para conectarnos al branch `dev` y realizar algunas modificaciones en los datos. Por ejemplo, podemos actualizar el nombre de un usuario existente o insertar un nuevo usuario en el branch `dev`.

```javascript
import 'dotenv/config'
import pkg from 'pg';
const { Client } = pkg;
const client = new Client({
  connectionString: process.env.DATABASE_URL_DEV,
  ssl: { rejectUnauthorized: false }
});
async function main() {
  try {
    await client.connect();
    console.log('Conexión exitosa al branch dev de Neon');

    const updateQuery = 'UPDATE usuarios SET nombre = $1 WHERE id = $2 RETURNING *';
    const updateValues = ['Carlos Updated', 1]; 
    const updateResult = await client.query(updateQuery, updateValues);
    console.log('Usuario actualizado:', updateResult.rows[0]);

    const insertQuery = 'INSERT INTO usuarios (nombre, pais) VALUES ($1, $2) RETURNING *';
    const insertValues = ['Maria', 'Chile'];
    const insertResult = await client.query(insertQuery, insertValues);
    console.log('Nuevo usuario insertado en dev:', insertResult.rows[0]);
  } catch (error) {
    console.error('Error al conectar o ejecutar consultas en dev:', error);
  } finally {
    await client.end();
  }
}
main();
```
Después de ejecutar este código, puedes verificar los cambios realizados en el branch `dev` utilizando tu cliente SQL. Verás que el usuario con ID 1 ha sido actualizado y que un nuevo usuario llamado "Maria" ha sido insertado en la tabla `usuarios` del branch `dev`.

![alt text](image-20.png)

![alt text](image-21.png)

## 6. Verificamos que los cambios realizados en el branch dev no afectan al branch main
Para verificar que los cambios realizados en el branch `dev` no afectan al branch `main`, simplemente conéctate al branch `main` utilizando el string de conexión correspondiente y consulta los datos de la tabla `usuarios`. Deberías ver que el usuario con ID 1 no ha sido actualizado y que el nuevo usuario "Maria" no está presente en el branch `main`.

![alt text](image-22.png)

Listo ahora vamos a crear una nueva tabla en el branch `dev` y verificamos que esta nueva tabla no existe en el branch `main`.

```sql
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  nombre TEXT,
  precio NUMERIC
);
INSERT INTO productos (nombre, precio)
VALUES ('Producto A', 10.99),
       ('Producto B', 19.99);
SELECT * FROM productos;
```

![alt text](image-23.png)

