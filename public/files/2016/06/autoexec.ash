# RESOLUTION, BITRATE AND COMPRESSION
# AVAILABLE RESOLUTIONS AND FPS:
# 1280x720 24   = 0xC05C25D2
# 1280x720 30   = 0xC05C2182
# 1280x720 48   = 0xC05C25A2
# 1280x720 60   = 0xC05C2122
# 1280x720 120  = 0xC05C2812
# 1280x960 24   = 0xC05C2572
# 1280x960 30   = 0xC05C22A2
# 1280x960 48   = 0xC05C2542
# 1280x960 60   = 0xC05C2272
# 1600x1200 24  = 0xC05C2512
# 1600x1200 30  = 0xC05C20C2
# 1600x1200 48  = 0xC05C24E2
# 1600x1200 60  = 0xC05C2092
# 1920x1080 24  = 0xC05C2482
# 1920x1080 30  = 0xC05C1F72
# 1920x1080 48  = 0xC05C2452
# 1920x1080 60  = 0xC05C1EE2
# 2304x1296 30  = 0xC05C1EB2

# AVAILABLE BITRATES:
# 20mbps = 0x41A0
# 25mbps = 0x41C8
# 30mbps = 0x41F0
# 35mbps = 0x420C
# 40mbps = 0x4220
# 45mbps = 0x4234
# 50mbps = 0x4248

# SET VIDEO QUALITY TO 1440p@30fps
writeb 0xC06CC426 0x02
writel 0xC05C2CB4 0x05A00A00

# SET BITRATE TO 40 Mbps
writew 0xC05C1EB2 0x4220

# ENABLE MAXIMUM FILE SIZE = 4 GB
writew 0xC03A8520 0x2004

# ENABLE UNCOMPRESSED RAW IMAGE PHOTOS
t app test debug_dump 14
sleep 9

# SET JPEG COMPRESSION QUALITY TO 100%
# writeb 0xC0BC205B 0x64
t cal -jqlt 100

# -----------------------------------

# IMAGE CALIBRATION

# Set photo ISO and shutter speed
# ISO possible values - 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600
# Shutter_speed from 1-2047 -> 1==7.9s 2047==1/8147 (EXIF value)
# Example ISO 1600, shutter speed 1000(1/28s)
# t ia2 -ae exp 1600 1000

# vibrance/saturation adjustments
#t ia2 -adj ev 10 0 70 0 0 150 0
t ia2 -adj ev 0 0 140 0 0 150 0

# enable portrait scene mode
# [1/13/14]: auto/landscape/portrait
# [34/38]: through_glass/car_DV
t cal -sc 1

#Ajustes de luces y sombras
t ia2 -adj l_expo 163
t ia2 -adj autoknee 200

#Ajusta nivel de gamma
t ia2 -adj gamma 160

#Ajusta reducción de ruido a 1024 (0 a 16383)
t ia2 -adj tidx -1 1024 -1

# Desactivar balance de blancos automático
t ia2 -awb off

# Ajusta la nitidez para el vídeo
t is2 -shp mode 0
#t is2 -shp fir 100 0 0 0 0 0 0
t is2 -shp max_change 5 5
t is2 -shp cor d:\coring.txt
sleep 1
#fix ae/awb/adj locks
t ia2 -3a 1 1 0 1

# -----------------------------------


# -----------------------------------

# DELETE THUMBNAILS (.thm files)
rm \DCIM\100MEDIA\*.thm

# SET BUZZER VOLUME 1-150
t pwm 1 set_level 50

# BEEP AFTER LOADING SCRIPT
t pwm 1 enable
sleep 1
t pwm 1 disable
