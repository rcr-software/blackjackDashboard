"""
Demonstrates reading 2 analog inputs (AINs) in a loop from a LabJack.

Relevant Documentation:
 
LJM Library:
    LJM Library Installer:
        https://labjack.com/support/software/installers/ljm
    LJM Users Guide:
        https://labjack.com/support/software/api/ljm
    Opening and Closing:
        https://labjack.com/support/software/api/ljm/function-reference/opening-and-closing
    Multiple Value Functions(such as eWriteNames):
        https://labjack.com/support/software/api/ljm/function-reference/multiple-value-functions
    Timing Functions(such as StartInterval):
        https://labjack.com/support/software/api/ljm/function-reference/timing-functions
 
T-Series and I/O:
    Modbus Map:
        https://labjack.com/support/software/api/modbus/modbus-map
    Analog Inputs:
        https://labjack.com/support/datasheets/t-series/ain

Note:
    Our Python interfaces throw exceptions when there are any issues with
    device communications that need addressed. Many of our examples will
    terminate immediately when an exception is thrown. The onus is on the API
    user to address the cause of any exceptions thrown, and add exception
    handling when appropriate. We create our own exception classes that are
    derived from the built-in Python Exception class and can be caught as such.
    For more information, see the implementation in our source code and the
    Python standard documentation.
"""
import sys
import time

from labjack import ljm

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

global counter
counter=0
@app.route("/get_update")
def update():
    global counter
    counter=counter+1;
    param_value = request.args.get('param_name', 'default_value')
    #print("param_value",param_value)
    param_value = str(int(param_value)+1)
    #data = {'update': param_value}

    #print("Server Data:", data) 
    
    # Read AIN0 and AIN1 from the LabJack with eReadNames in a loop.
    numFrames = 2
    names = ["AIN0", "AIN1"]
    
    #handle = ljm.openS("T7", "ANY", "ANY")
    #results = ljm.eReadNames(handle, numFrames, names)
    #message = "AIN0 : %f V, AIN1 : %f V" % (results[0], results[1])

    data = {'update': counter}#data = {'update': results[0]}     #data = {'update': counter}

    return jsonify(data), 200, {'Content-Type': 'application/json'}

@app.route("/a")
def hello_world():

    # loopMessage = ""
    # if len(sys.argv) > 1:
    #     # An argument was passed. The first argument specifies how many times to
    #     # loop.
    #     try:
    #         loopAmount = 10 # int(sys.argv[1])
    #     except:
    #         raise Exception("Invalid first argument \"%s\". This specifies how many"
    #                         " times to loop and needs to be a number." %
    #                         str(sys.argv[1]))
    # else:
    #     # An argument was not passed. Loop an infinite amount of times.
    #     loopAmount = "infinite"
    #     loopMessage = " Press Ctrl+C to stop."
   
    loopAmount = "infinite"
    loopMessage = " Press Ctrl+C to stop."

    # Open first found LabJack
    handle = ljm.openS("T7", "ANY", "ANY")  # T7 device, Any connection, Any identifier

    #handle = ljm.openS("ANY", "ANY", "ANY")  # Any device, Any connection, Any identifier
    #handle = ljm.openS("T4", "ANY", "ANY")  # T4 device, Any connection, Any identifier
    #handle = ljm.open(ljm.constants.dtANY, ljm.constants.ctANY, "ANY")  # Any device, Any connection, Any identifier

    info = ljm.getHandleInfo(handle)
    #deviceinfo="Opened a LabJack with Device type: %i, Connection type: %i,\n Serial number: %i, IP address: %s, Port: %i,\nMax bytes per MB: %i"%(info[0], info[1], info[2], ljm.numberToIP(info[3]), info[4], info[5])
    deviceinfo = "Opened a LabJack with Device type: %d, Connection type: %d,\n Serial number: %d, IP address: %s, Port: %d,\nMax bytes per MB: %d" % (info[0], info[1], info[2], ljm.numberToIP(info[3]), info[4], info[5])

    deviceType = info[0]

    # Setup and call eWriteNames to configure AIN0 and AIN1 on the LabJack.
    if deviceType == ljm.constants.dtT4:
        # LabJack T4 configuration

        # AIN0 and AIN1:
        #   Range: +/-10.0 V (10.0). Only AIN0-AIN3 support the +/-10 V range.
        #   Resolution index = Default (0)
        #   Settling, in microseconds = Auto (0)
        names = ["AIN0_RANGE", "AIN0_RESOLUTION_INDEX", "AIN0_SETTLING_US",
                "AIN1_RANGE", "AIN1_RESOLUTION_INDEX", "AIN1_SETTLING_US"]
        aValues = [10.0, 0, 0,
                10.0, 0, 0]
    else:
        # LabJack T7 and other devices configuration

        # AIN0 and AIN1:
        #   Negative channel = single ended (199)
        #   Range: +/-10.0 V (10.0)
        #   Resolution index = Default (0)
        #   Settling, in microseconds = Auto (0)
        names = ["AIN0_NEGATIVE_CH", "AIN0_RANGE", "AIN0_RESOLUTION_INDEX", "AIN0_SETTLING_US",
                "AIN1_NEGATIVE_CH", "AIN1_RANGE", "AIN1_RESOLUTION_INDEX", "AIN1_SETTLING_US"]
        aValues = [199, 10.0, 0, 0,
                199, 10.0, 0, 0]
    numFrames = len(names)
    ljm.eWriteNames(handle, numFrames, names, aValues)

    #print("\nSet configuration:")
    for i in range(numFrames):
        #print("    %s : %f" % (names[i], aValues[i]))
        configtex="    %s : %f" % (names[i], aValues[i])

    # Read AIN0 and AIN1 from the LabJack with eReadNames in a loop.
    numFrames = 2
    names = ["AIN0", "AIN1"]

    #print("\nStarting %s read loops.%s\n" % (str(loopAmount), loopMessage))
    loopstext="\nStarting %s read loops.%s\n" % (str(loopAmount), loopMessage)

    intervalHandle = 1
    ljm.startInterval(intervalHandle, 1000000)  # Delay between readings (in microseconds)
    i = 0
    #while True:
    try:
        results = ljm.eReadNames(handle, numFrames, names)
        message = "AIN0 : %f V, AIN1 : %f V" % (results[0], results[1])
        #print(message)

        ljm.waitForNextInterval(intervalHandle)
        if loopAmount != "infinite":
            i = i + 1
            if i >= loopAmount:
                pass
                #return render_template('main2.html',configtex_html=configtex, loopstext_html= loopstext,deviceinfo_html=deviceinfo,message_html=message ) #break   
    except KeyboardInterrupt:
        pass#return render_template('main.html',configtex_html=configtex) #break   
    except Exception:
        print(sys.exc_info()[1])
        pass#return render_template('main.html',configtex_html=configtex) #break    

    # Close handles
    ljm.cleanInterval(intervalHandle)
    ljm.close(handle)

    return render_template('main.html',configtex_html=configtex, loopstext_html= loopstext,deviceinfo_html=deviceinfo,message_html=message ) #break results[0]


@app.route('/')
def index():
    return render_template('test.html')


@socketio.on('connect', namespace='/data')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect', namespace='/data')
def handle_disconnect():
    print('Client disconnected')

def stream_data():
    while True:
        data_point = random.randint(1, 100)
        print("enviado")
        socketio.emit('update', {'data': data_point}, namespace='/data')
        time.sleep(1000)

if __name__ == '__main__':
    #socketio.run(app)
    socketio.start_background_task(target=stream_data)
    socketio.run(app, debug=True)