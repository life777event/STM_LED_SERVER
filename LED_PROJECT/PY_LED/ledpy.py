import serial
import sys

#Récupération de la valeur passée en paramètre
LED_state = int(sys.argv[1],10)
if(LED_state!=0 and LED_state!=1):
    print('Mauvais format du parametre ' + str(LED_state))
    sys.exit()

try:
    ser = serial.Serial('/dev/ttyACM1')
except serial.serialutil.SerialException:
    print('Le device n\'est pas connecté')
    sys.exit()

b_value = bytearray([LED_state])
nb=ser.write(b_value)
print(str(nb)+' bytes envoyés')

