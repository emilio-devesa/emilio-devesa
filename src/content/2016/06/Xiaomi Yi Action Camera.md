---
title: "Xiaomi Yi Action Camera"
date: "2016-06-20"
categories: 
  - "hardware"
---

![](images/xiaomi-yi-action-cam-white.jpg)

**Ficha Técnica:**  
Nombre: Yi Action Camera  
Fabricante: Xiaomi  
Precio: 73,99 €  
Página Web: http://www.yitechnology.com

He localizado en una oferta de Amazon esta mini-cámara deportiva muy al estilo de las GoPro en un precio más comedido. ¡Sorpresa! Xiaomi tenía lo que yo quería y no he podido resistirme. Las características de la cámara son las siguientes:  
- Sensor Sony EXMOR-R de 16 Mpx y procesador de imagen Ambarella A7LS 
- Lente Zeiss Tessar de 155 grados con apertura máxima f/2,8 
- Grabación en estándar h.264 (vídeo) y AAC (audio), con formato .mp4 
- Grabación de sonido hasta 96Khz y 92dbA SNR 
- Conexión USB 2.0, WiFi, Bluetooth 4.0 y salida micro HDMI 1.4 
- Almacenamiento en tarjeta SD (no incluída) - Peso de 72 gramos

Este hardware permite tomar fotografías de hasta 16 Mpx (4608×3456 píxeles, formato 4:3) y grabar en varios modos de video:  
- 2K (2304×1296, formato 16:9) @ 30fps 
- 1080p (1920x1080, formato 16:9) @ 60/30/48/24fps 
- 960p (1280x960, formato 4:3) @ 60/48fps 
- 720p (1280x720, formato 16:9) @ 120/60/48fps 
- 480p (848x480, formato 16:9) @ 240fps 

Probablemente los modos más interesantes son 2K@30fps y 1080p@60fps; mientras que los modos con mayor tasa de frames por segundo pueden venir bien para hacer tomas a cámara lenta sacrificando resolución. En sí misma, la cámara no dispone de ninguna pantalla y tan solo tienes tres botones. El botón del frontal enciende la cámara, alterna entre el modo de foto o vídeo y apaga el dispositivo si lo mantienes presionado. En la parte superior está el disparador, con el que tomar una foto o iniciar/detener la grabación; mientras que en uno de los laterales está el botón para encender su enlace Wi-fi. Por lo tanto, toda la configuración y manejo se realiza a través de la app Yi Action ([App Store](https://itunes.apple.com/es/app/yi-action-yi-4k-action-camera/id963065779?mt=8), [Google Play](https://play.google.com/store/apps/details?id=com.xiaomi.xy.sportscamera&hl=es)), donde podemos además activar algunas características avanzadas como la corrección de imagen, hacer timelapses, etc. Incluso funciona como una especie de red social para los usuarios de la cámara. A veces he echado en falta una pantalla LCD en la que ver qué está captando la cámara en tiempo real, sin tener que conectarte a ella desde el teléfono.

Es importante señalar que en el paquete (salvo que compremos accesorios) solo encontraremos la cámara, un manual, la batería y un ridículo cable (micro-usb -> usb) de 10 centímetros para la recarga y la transferencia de datos. Afortunadamente, podrás usar un cargador de móvil que tenga el cable más largo e incluso grabar mientras se llena la batería, que por cierto, no dura demasiado: en torno a hora y cuarto grabando en 1080p a 60 fps. Hay a la venta un importante número de accesorios: mando a distancia, carcasa acuática, filtros para la lente, fundas de aluminio y de silicona, todo tipo de sujecciones (a vehiculos o partes del cuerpo), baterías, etc.

![](images/xiaomi-yi-action-cam-packaging.jpg)

**Modificaciones**  
Los usuarios han llevado el dispositivo aún más allá de lo que el fabricante ha previsto. Mediante scripts o firmwares modificados tenemos a nuestro alcance la posibilidad de grabar con mayor calidad y de hacer un ajuste más fino de la imagen.  
Esto requiere que la microSD cuente con buenas tasas de escritura para que no sea un cuello de botella y no se produzcan errores o saltos. Además un minuto de video 2K ocupará alrededor de 1,5 GB, por lo que también necesitas una capacidad generosa. Lo ideal sería disponer de una tarjeta de Clase 10 UHS-3. Con mi cámara y una tarjeta Sandisk de este tipo no he tenido problema en grabar video incluso a un bitrate de 40 Mbps, aunque se producían cortes a 45 Mbps. Con una microSD algo más rápida se pueden alcanzar los 50 Mbps. Sin embargo, una tarjeta de memoria lenta provocará que la cámara no pueda, entre otras cosas, escribir el video del tirón.  
La cámara está programada para que en estos casos, divida el video en trozos, donde se rebajará el bitrate hasta estar en unos niveles que la tarjeta pueda manejar, con lo que perdemos cualquier ventaja del firmware. No está muy claro el límite de la cámara a la hora de grabar; pero también implica que se calienta sensiblemente más.

Cargar un firmware personalizado es muy simple. Localizamos el firmware con el que queremos flashear nuestra cámara y lo descargamos. En particular, hay que descargar el firmware para el modelo exacto de cámara, dato que puedes ver bajo la batería (por ejemplo Z23L). Tendremos un archivo llamado "firmware.bin" que hemos de volcar en la raíz de nuestra tarjeta SD. A continuación, encendemos la cámara con la batería cargada (o enchufada a la corriente) y oiremos un pitido por segundo, aproximadamente durante un minuto. Esto nos indica que se está escribiendo el nuevo firmware en nuestro dispositivo; y la cámara se apagará al terminar. Después ya podemos borrar el archivo que hemos copiado a la tarjeta. 

Sin embargo, he preferido utilizar un firmware oficial y ajustar la calidad de grabación mediante el uso de un script que se carga al encender la cámara de forma automática. Puedes descargártelo desde [aquí](/files/2016/06/autoexec.ash). Este fichero debe estar ubicado en la raíz de la tarjeta de memoria.  
He tratado de documentarlo bien y aunque esté en inglés, creo que se entiende perfectamente cada comando. Los primeros están destinados a ajustar la resolución. En mi caso, he seleccionado 2K en la configuración de la aplicación para luego cargar el script y que se hiciese el reescalado a 2,5K. Solo funciona en formato NTSC y debes antes configurar el 2K en la aplicación.  
Los últimos comandos realizan pequeñas operaciones:  
- Aumentar el tamaño máximo de los ficheros que se escriben a 4GB
- Escribir las imagenes en formato RAW (sin compresion, útiles para edición fotográfica avanzada, aunque hay que <a href="https://youtu.be/xP_Odq_tGcs">procesar los archivos a DNG</a>)
- Eliminar los archivos de miniatura cuando se enciende la cámara (para liberar espacio)
- Bajar el volumen de los pitidos
- Emitir una señal al terminar de cargar el script

Para hacer un ajuste algo más fino del procesamiento de la imagen (saturación, gamma, nitidez, ruido, etc.) he necesitado también un archivo llamado "[coring.txt](/files/2016/06/coring.txt)" que también debe ir en la raíz de la tarjeta SD.

![](images/xiaomi-yi-action-cam-lime.jpg)

**Conclusión**  
En definitiva, la Xiaomi Yi es una buena cámara con muy buena calidad de imagen y con pocos puntos flacos. La oferta ponía a un precio muy atractivo la versión china de la cámara en color blanco y sin ningún accesorio, aunque también está disponible en un color verde-lima bastante vistoso. Incluso existe una edición internacional en negro con la que apenas hay diferencias. Eso sí, la nueva Xiaomi Yi Action 2 ya está a la venta y graba 4K, así que no confundas una con otra.

**NOTA: 8.5**

**Lo mejor de Xiaomi Yi Action:**  
Buena calidad de imagen, mejorada incluso por la comunidad con firmwares no oficiales y scripts  
Precio realmente asequible  
La app y el firmware se han actualizado bastante

**Lo peor de Xiomi Yi Action:**  
Duración de la batería  
No dispone de pantalla LCD  
Algunas han salido con problemas (solucionables) de enfoque, de batería, de micrófono, ... ¡Consulta en el grupo de facebook si crees que sufres alguno!

**ATENCIÓN:** Si tu firmware no está al día, actualízalo para poder grabar en 2K. Si necesitas ayuda visita el grupo de Facebook [Xiaomi Yi Action en Español](https://www.facebook.com/groups/Xiaomi.YiAction/) o este [foro](http://grupoxiaomiyiaction.foroactivo.com/).