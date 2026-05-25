# Healtytrition - NutriApp

**NutriApp** es una aplicación móvil que permite al usuario tomar una foto de un alimento con su celular y recibir automáticamente su información nutricional completa: calorías, proteínas, carbohidratos y grasas. El sistema combina inteligencia artificial de visión computacional con una base de datos nutricional oficial del gobierno de los Estados Unidos.

## Integrantes 👨‍💻
* Yael Sanchez Alape
* Sergio David Moncada
* Fredi Orlando Millan
* Jesus David Lozano
* Nicolas Jimenez

## Tecnologías utilizadas 🖥️
* **BackEnd** 
    * Django Framework (Python)
    * FastAPI
    * Uvicorn
* **FrontEnd**
    * Framework React Native
    * Expo Go v55
* **Base de datos**
    * Postgre SQL 18
    * SQLAlchemy

## Instalacíon ⚒️

**IMPORTANTE:** Utilizar la version Expo Go v.55 AQUI --> https://expo.dev/go
Abre la terminal.
```bash
git clone https://github.com/SergioMoncada/NutriApp.git
npm install
npx expo install expo-local-authentication
npx expo install expo-sensors
npx expo install expo-notifications
npx expo install native-stack @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

> [!NOTE]
> En caso de que el npx expo install no funcione entonces utiliza el npm install


## Ejecucion local
> [!NOTE]
> Importante ejecutar los comandos anteriores para poder ejecutar el codigo sin errores.
> Asegurate de estar en la carpeta del proyecto.


```bash
npx expo start -c
```

* Deberia aparecerte un codigo QR que deberas correr con la aplicacion movil Expo Go v55.


## Despliegue 🚀

* **Despliegue FrontEnd:** Expo Application Services (EAS Build) para generar APK descargable.
* **Despliegue DB:** Supabase o Railway PostgreSQL
* **Despligue BackEnd:** Railway o Render (soporte nativo para Python/FastAPI, gratuito para proyectos escolares)
* **Alternativa FullStack:** Railway para backend + BD en un solo servicio con Docker Compose

## Evidencias 📷

<img width="573" height="1280" alt="Evidencia" src="https://github.com/user-attachments/assets/5589703c-a061-4cc9-a3ee-00ef507b627a" />



